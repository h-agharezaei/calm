/**
 * Calm service worker
 *
 * - Precaches the app shell (HTML, CSS, JS, font, icons, bowl sounds)
 * - HTML/CSS/JS: network first (new deploys show up immediately), cache as offline fallback
 * - Images, fonts, short sounds: cache first (filled as they are used)
 * - Large background sounds (assets/bg-sounds) are streamed from the network, unless the user saved
 *   them for offline use (stored by the page in OFFLINE_CACHE, which survives VERSION bumps)
 *
 * Bump VERSION whenever a cached, non-versioned file (images, sounds, font) changes.
 */
const VERSION = 'calm-v30';
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const OFFLINE_CACHE = 'calm-offline-sounds'; // keep in sync with script.js

const PRECACHE = [
    './',
    'index.html',
    'manifest.webmanifest',
    'assets/css/style.css?v=22',
    'assets/js/script.js?v=27',
    'assets/js/analytics.js?v=9',
    'assets/js/bale.js?v=9',
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
                // only delete old versioned caches; keep the user's offline sounds
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

    if (/\/assets\/(images|fonts|sounds|icons)\//.test(url.pathname)) {
        event.respondWith(cacheFirst(req));
        return;
    }

    event.respondWith(networkFirst(req));
});

async function offlineSound(req) {
    const hit = await caches.match(req.url, { cacheName: OFFLINE_CACHE });
    if (hit) {
        return req.headers.has('range') ? rangeResponse(req, hit) : hit;
    }
    return fetch(req);
}

async function networkFirst(req) {
    try {
        const res = await fetch(req, { cache: 'no-cache' }); // skip the HTTP cache so new deploys show up at once
        if (res.ok) {
            const cache = await caches.open(SHELL_CACHE);
            cache.put(req, res.clone());
        }
        return res;
    } catch (err) {
        const hit = await caches.match(req, { ignoreSearch: true });
        if (hit) return hit;
        if (req.mode === 'navigate') {
            const page = await caches.match('index.html');
            if (page) return page;
        }
        throw err;
    }
}

async function cacheFirst(req) {
    const hit = await caches.match(req.url);
    if (hit) {
        return req.headers.has('range') ? rangeResponse(req, hit) : hit;
    }
    const res = await fetch(req, { cache: 'no-cache' }); // skip the HTTP cache so new deploys show up at once
    // Only full responses can be cached (media elements send Range requests)
    if (res.status === 200 && !req.headers.has('range')) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(req.url, res.clone());
    }
    return res;
}

async function staleWhileRevalidate(req) {
    const cache = await caches.open(RUNTIME_CACHE);
    const hit = await cache.match(req);
    const network = fetch(req)
        .then((res) => {
            if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
            return res;
        })
        .catch(() => hit);
    return hit || network;
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
