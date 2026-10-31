#!/usr/bin/env node
/**
 * Blog cover generator (1200x630 JPG, also used as og:image).
 *
 *   node _blog/make-cover.mjs <slug> [--source <src>] [--time <seconds>] [--force]
 *
 * <src> is one of the app backgrounds:
 *   0-4                     photo (assets/images/0N.webp), cropped to 1200x630
 *   kaleidoscope | kaleidoscope-soft | galaxy | ocean | merger | candle
 *                           live canvas rendered from the app itself
 * Default source: the post's session `img=` (or `bg=`) param in _blog/posts/fa/<slug>.md.
 * --time: how many seconds of animation to run before the shot (default 6). Different
 * values give different frames, so two posts with the same mode still get distinct covers.
 * For merger, --time picks the collision moment instead (sim time 6 + time % 25).
 *
 * Output: assets/images/blog/<slug>.jpg (refuses to overwrite without --force).
 * Then add to BOTH fa and en front matter:
 *   cover: /assets/images/blog/<slug>.jpg
 *   coverAlt: <description of the image, in the post's language>
 *
 * Needs Google Chrome (headless) and macOS `sips`. No npm dependencies.
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { join, extname, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CANVAS = { kaleidoscope: 'kaleidoscopeCanvas', 'kaleidoscope-soft': 'kaleidoscopeCanvas',
    galaxy: 'galaxyCanvas', ocean: 'oceanCanvas', merger: 'mergerCanvas', candle: 'candleCanvas' };
const W = 1200, H = 630;

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1]?.startsWith('--') !== true);
const opt = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const die = (msg) => { console.error(`make-cover: ${msg}`); process.exit(1); };
if (!slug) die('usage: node _blog/make-cover.mjs <slug> [--source 0-4|mode] [--time s] [--force]');

let source = opt('source');
if (source === undefined) {
    const md = join(ROOT, '_blog/posts/fa', `${slug}.md`);
    if (!existsSync(md)) die(`no post ${md}; pass --source`);
    const session = (readFileSync(md, 'utf8').match(/^session:\s*(.+)$/m) || [])[1] || '';
    const p = new URLSearchParams(session.trim());
    source = p.get('img') ?? p.get('bg');
    if (source === null || !(/^[0-4]$/.test(source) || CANVAS[source.toLowerCase()])) {
        die(`post session has no usable img=/bg= (${session || 'none'}); pass --source 0-4|${Object.keys(CANVAS).join('|')}`);
    }
}
source = String(source).toLowerCase();
const isPhoto = /^[0-4]$/.test(source);
if (!isPhoto && !CANVAS[source]) die(`unknown source "${source}"`);
const seconds = Number(opt('time') ?? 6);
if (!(seconds > 0 && seconds <= 120)) die('--time must be 1-120');

const out = join(ROOT, 'assets/images/blog', `${slug}.jpg`);
if (existsSync(out) && !args.includes('--force')) die(`${out} exists (use --force)`);
if (!existsSync(CHROME)) die('Google Chrome not found');

// Harness pages: a photo crop, or the real app in an iframe with everything but the canvas hidden.
const photoHtml = `<!doctype html><html><body style="margin:0;background:#000">
<img src="/assets/images/0${source}.webp" style="display:block;width:${W}px;height:${H}px;object-fit:cover"></body></html>`;
const appHtml = `<!doctype html><html><body style="margin:0;overflow:hidden;background:#0b1226">
<iframe id="f" src="/?bg=${source}&lang=fa" style="border:0;width:${W}px;height:${H}px"></iframe>
<script>
f.onload = () => {
  const d = f.contentDocument, s = d.createElement('style');
  s.textContent = 'body *{visibility:hidden!important;animation:none!important;transition:none!important}' +
    '#${CANVAS[source]}{visibility:visible!important}';
  d.head.appendChild(s);
  // merger: the simulation fades in and evolves over ~14 min, far beyond the shot budget,
  // so jump straight to a moment of the collision (sim time 6-30, picked by --time).
  if (${source === 'merger'}) setTimeout(() => f.contentWindow.mergerSeek(${6 + (seconds % 25)}), 500);
};
</script></body></html>`;

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp',
    '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json',
    '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json' };
const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path === '/__cover.html') { res.writeHead(200, { 'content-type': TYPES['.html'] }); return res.end(isPhoto ? photoHtml : appHtml); }
    if (path === '/sw.js') { res.writeHead(404); return res.end(); } // no service worker in the harness
    let file = join(ROOT, path);
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/__cover.html`;

const tmp = mkdtempSync(join(tmpdir(), 'calm-cover-'));
const png = join(tmp, 'cover.png');
try {
    await new Promise((resolveRun, reject) => {
        // execFileSync would block the event loop and starve the HTTP server, so run Chrome async.
        import('node:child_process').then(({ execFile }) => execFile(CHROME, [
            '--headless=new', '--disable-gpu-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
            '--hide-scrollbars', '--mute-audio', '--no-first-run', '--no-default-browser-check',
            `--user-data-dir=${join(tmp, 'profile')}`, `--window-size=${W},${H}`,
            `--virtual-time-budget=${Math.round((isPhoto ? 2 : seconds) * 1000)}`, `--screenshot=${png}`, url,
        ], { timeout: 180000 }, (err) => (err && !existsSync(png) ? reject(err) : resolveRun())));
    });
    if (!existsSync(png)) die('Chrome produced no screenshot');
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', png, '--out', out], { stdio: 'ignore' });
    const dims = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', out]).toString();
    const w = +dims.match(/pixelWidth: (\d+)/)[1], h = +dims.match(/pixelHeight: (\d+)/)[1];
    if (w !== W || h !== H) die(`unexpected size ${w}x${h} (expected ${W}x${H})`);
    console.log(`cover: ${out.slice(ROOT.length + 1)} (${source}${isPhoto ? '' : `, t=${seconds}s`}, ${Math.round(statSync(out).size / 1024)} KB)`);
} finally {
    server.close();
    rmSync(tmp, { recursive: true, force: true });
}
