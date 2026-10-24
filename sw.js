/**
 * Calm service worker
 *
 * - Precaches the app shell (HTML, CSS, JS, font, icons, bowl sounds)
 * - HTML/CSS/JS: network first (new deploys show up immediately), cache as offline fallback
 * - Images, fonts, short sounds: cache first (filled as they are used)
 * - Large background sounds (assets/bg-sounds) are NOT cached: they are streamed from the network
 *
 * Bump VERSION whenever a cached, non-versioned file (images, sounds, font) changes.
 */
const VERSION = 'calm-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const PRECACHE = [
    './',
    'index.html',
    'manifest.webmanifest',
    'assets/css/style.css',
    'assets/js/script.js',
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
                keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))
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

    // Large looping sounds: stream from the network
    if (url.pathname.includes('/assets/bg-sounds/')) return;

    if (/\/assets\/(images|fonts|sounds|icons)\//.test(url.pathname)) {
        event.respondWith(cacheFirst(req));
        return;
    }

    event.respondWith(networkFirst(req));
});

async function networkFirst(req) {
    try {
        const res = await fetch(req);
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
    const res = await fetch(req);
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
    const buf = await res.clone().arrayBuffer();
    const match = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
    if (!match) return res;

    const size = buf.byteLength;
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

    return new Response(buf.slice(start, end + 1), {
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
