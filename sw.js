/**
 * Calm service worker
 *
 * - Precaches only the app shell (HTML, CSS, JS, Persian font, icons, the two short bowl sounds).
 *   Installation starts after the page's load event, so it never delays the first paint.
 * - Pages (HTML): network first, falling back to the cached copy after NAV_TIMEOUT_MS on a slow
 *   network (new deploys still show up on the next visit) and when offline.
 * - Versioned CSS/JS (?v=N): cache first. The URL changes on every edit, so a cached copy is never stale.
 * - Other same-origin files: network first, cache as offline fallback.
 * - Images, fonts, icons: stale-while-revalidate in ASSET_CACHE, which survives VERSION bumps
 *   (no re-download after each deploy; a changed file is picked up in the background).
 * - Short sounds: cache first (media elements send Range requests; answered from the cached file).
 * - Large background sounds (assets/bg-sounds) are streamed from the network, unless the user saved
 *   them for offline use (stored by the page in OFFLINE_CACHE, which survives VERSION bumps)
 *
 * Bump VERSION whenever a precached file changes (the ?v= values below, index.html, bowl sounds).
 */
const VERSION = 'calm-v54';
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const ASSET_CACHE = 'calm-assets';            // images, fonts, icons: kept across versions
const OFFLINE_CACHE = 'calm-offline-sounds'; // keep in sync with script.js
const NAV_TIMEOUT_MS = 3500;

const PRECACHE = [
    './',
    'index.html',
    'manifest.webmanifest',
    'assets/css/style.css?v=38',
    'assets/js/script.js?v=45',
    'assets/js/analytics.js?v=10',
    'assets/js/bale.js?v=10',
    'assets/fonts/Estedad-VF.woff2', // already in the HTTP cache from the page's preload
    'assets/icons/icon-192.png',
    'assets/icons/icon-512.png',
    'assets/icons/apple-touch-icon.png',
    'assets/sounds/singing-bowl-gong.mp3',
    'assets/sounds/chimes-bronze-singing-bowl-ding.mp3'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(SHELL_CACHE)
            .then((cache) => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                // only delete old versioned caches; keep ASSET_CACHE and the user's offline sounds
                keys.filter((k) => /^calm-v\d+-/.test(k) && !k.startsWith(VERSION)).map((k) => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return; // e.g. the Formspree POST

    const url = new URL(req.url);
    const sameOrigin = url.origin === self.location.origin;
    const isGoogleFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

    if (isGoogleFont) {
        event.respondWith(staleWhileRevalidate(req));
        return;
    }
    if (!sameOrigin) return; // analytics etc.: leave to the network

    // Large looping sounds: from the offline cache if saved, otherwise from the network
    if (url.pathname.includes('/assets/bg-sounds/')) {
        event.respondWith(offlineSound(req));
        return;
    }

    if (/\/assets\/sounds\//.test(url.pathname)) {
        event.respondWith(cacheFirst(req));
        return;
    }

    if (/\/assets\/(images|fonts|icons)\//.test(url.pathname)) {
        event.respondWith(staleWhileRevalidate(req, ASSET_CACHE));
        return;
    }

    // Versioned CSS/JS: the ?v= changes with every edit
    if (/[?&]v=/.test(url.search) && /\.(css|js)$/.test(url.pathname)) {
        event.respondWith(cacheFirst(req, SHELL_CACHE));
        return;
    }

    event.respondWith(networkFirst(req, req.mode === 'navigate' ? NAV_TIMEOUT_MS : 0));
});

async function offlineSound(req) {
    const hit = await caches.match(req.url, { cacheName: OFFLINE_CACHE });
    if (hit) {
        return req.headers.has('range') ? rangeResponse(req, hit) : hit;
    }
    return fetch(req);
}

async function cachedFallback(req) {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === 'navigate') return caches.match('index.html');
    return undefined;
}

// timeoutMs > 0: if the network is slower than that and a cached copy exists, answer from the cache
// (the network response still refreshes the cache for the next visit)
async function networkFirst(req, timeoutMs) {
    const network = fetch(req, { cache: 'no-cache' }) // skip the HTTP cache so new deploys show up at once
        .then(async (res) => {
            if (res.ok) {
                const cache = await caches.open(SHELL_CACHE);
                await cache.put(req, res.clone());
            }
            return res;
        });

    if (timeoutMs > 0) {
        const fallback = await cachedFallback(req);
        if (fallback) {
            const timer = new Promise((resolve) => setTimeout(() => resolve(fallback), timeoutMs));
            return Promise.race([network.catch(() => fallback), timer]);
        }
    }

    try {
        return await network;
    } catch (err) {
        const hit = await cachedFallback(req);
        if (hit) return hit;
        throw err;
    }
}

async function cacheFirst(req, cacheName = RUNTIME_CACHE) {
    const hit = await caches.match(req.url);
    if (hit) {
        return req.headers.has('range') ? rangeResponse(req, hit) : hit;
    }
    const res = await fetch(req, { cache: 'no-cache' }); // skip the HTTP cache so new deploys show up at once
    // Only full responses can be cached (media elements send Range requests)
    if (res.status === 200 && !req.headers.has('range')) {
        const cache = await caches.open(cacheName);
        cache.put(req.url, res.clone());
    }
    return res;
}

async function staleWhileRevalidate(req, cacheName = RUNTIME_CACHE) {
    const cache = await caches.open(cacheName);
    const hit = await cache.match(req.url) || await caches.match(req.url); // e.g. the precached font
    const network = fetch(req)
        .then((res) => {
            if (res.ok || res.type === 'opaque') cache.put(req.url, res.clone());
            return res;
        });
    if (hit) {
        network.catch(() => {}); // offline: the cached copy is enough
        return hit;
    }
    return network;
}

// Safari/Chrome request audio with Range headers; answer from the cached full file
async function rangeResponse(req, res) {
    const blob = await res.clone().blob();
    const match = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
    if (!match) return res;

    const size = blob.size;
    let start;
    let end;
    if (match[1] === '') {
        // suffix range: last N bytes
        start = Math.max(0, size - parseInt(match[2], 10));
        end = size - 1;
    } else {
        start = parseInt(match[1], 10);
        end = match[2] === '' ? size - 1 : Math.min(parseInt(match[2], 10), size - 1);
    }
    if (start >= size || start > end) {
        return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    }

    return new Response(blob.slice(start, end + 1), {
        status: 206,
        statusText: 'Partial Content',
        headers: {
            'Content-Type': res.headers.get('Content-Type') || 'audio/mpeg',
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Content-Length': String(end - start + 1),
            'Accept-Ranges': 'bytes'
        }
    });
}
