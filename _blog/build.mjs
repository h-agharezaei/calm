#!/usr/bin/env node
/**
 * Calm blog builder (no dependencies, Node 18+)
 *
 *   node _blog/build.mjs
 *
 * Reads _blog/posts/*.md and writes:
 *   blog/index.html              list of posts
 *   blog/<slug>/index.html       one page per post
 *   sitemap.xml, robots.txt      at the site root
 *
 * The _blog folder starts with "_" so GitHub Pages (Jekyll) does not publish it.
 * The generated HTML is committed; the site stays fully static.
 *
 * Front matter (between --- lines, one "key: value" per line):
 *   title        page title / h1 (required)
 *   description  meta description, ~150 chars (required)
 *   date         YYYY-MM-DD (required)   updated  YYYY-MM-DD (optional)
 *   category     meditation | learn
 *   cover        /assets/images/blog/<slug>.jpg (1200x630; also the share image)
 *   coverAlt     alt text of the cover
 *   session      query string for the app, e.g. min=10&sound=Sea&img=ocean (optional)
 *   sessionLabel button text            sessionMeta  short line in the box; separate parts with |
 *   order        optional number; lower comes first on the list page (default: newest first)
 *
 * Markdown supported: ## / ### headings, paragraphs, - and 1. lists, > quotes,
 * **bold**, *italic*, [links](url), and a line "[[session]]" to repeat the start box.
 * A "## سؤال‌های متداول" section with "### question" entries also becomes FAQPage data.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://tpis.ir';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = join(ROOT, '_blog', 'posts');
const OUT_DIR = join(ROOT, 'blog');
const CSS = '/assets/css/blog.css?v=1';
const FAQ_HEADING = 'سؤال‌های متداول';

const CATEGORIES = {
    meditation: { label: 'مدیتیشن‌ها', single: 'مدیتیشن' },
    learn: { label: 'آموزش', single: 'آموزش' }
};

// ---------- helpers ----------
const esc = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const faDigits = (s) => String(s).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
const faDate = (iso) => new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tehran'
}).format(new Date(iso + 'T12:00:00Z'));
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const appUrl = (query) => '/?' + query;
// «·» looks like the Persian zero in Estedad, so separators are drawn with CSS
const SEP = '<span class="sep" aria-hidden="true"></span>';
const metaLine = (text) => text.split('|').map((t) => esc(t.trim())).join(SEP);

function parseFrontMatter(text, file) {
    const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
    if (!m) throw new Error(`${file}: missing front matter`);
    const data = {};
    for (const line of m[1].split(/\r?\n/)) {
        if (!line.trim() || line.trim().startsWith('#')) continue;
        const i = line.indexOf(':');
        if (i < 0) throw new Error(`${file}: bad front matter line "${line}"`);
        data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    for (const key of ['title', 'description', 'date']) {
        if (!data[key]) throw new Error(`${file}: "${key}" is required`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error(`${file}: date must be YYYY-MM-DD`);
    if (data.category && !CATEGORIES[data.category]) throw new Error(`${file}: unknown category "${data.category}"`);
    return { data, body: m[2] };
}

// inline markdown: escape first, then links / bold / italic
function inline(text) {
    let s = esc(text);
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
        const external = /^https?:\/\//.test(href) && !href.startsWith(SITE);
        return `<a href="${href}"${external ? ' rel="noopener" target="_blank"' : ''}>${label}</a>`;
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    return s;
}

// block markdown -> { html, faq: [{q, a}], words }
function renderMarkdown(md, sessionBox) {
    const lines = md.replace(/\r/g, '').split('\n');
    const out = [];
    const faq = [];
    let inFaq = false;
    let para = [];
    let list = null; // { tag, items }
    let quote = [];

    const flushPara = () => {
        if (!para.length) return;
        const html = inline(para.join(' '));
        out.push(`<p>${html}</p>`);
        if (inFaq && faq.length) faq[faq.length - 1].a.push(para.join(' '));
        para = [];
    };
    const flushList = () => {
        if (!list) return;
        out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`);
        if (inFaq && faq.length) faq[faq.length - 1].a.push(list.items.join('، '));
        list = null;
    };
    const flushQuote = () => {
        if (!quote.length) return;
        out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`);
        quote = [];
    };
    const flushAll = () => { flushPara(); flushList(); flushQuote(); };

    for (const raw of lines) {
        const line = raw.trim();
        let m;
        if (!line) { flushAll(); continue; }
        if (line === '[[session]]') { flushAll(); if (sessionBox) out.push(sessionBox); continue; }
        if ((m = /^(#{2,3})\s+(.+)$/.exec(line))) {
            flushAll();
            const level = m[1].length;
            const text = m[2];
            if (level === 2) inFaq = text.startsWith(FAQ_HEADING);
            if (level === 3 && inFaq) faq.push({ q: text, a: [] });
            out.push(`<h${level}>${inline(text)}</h${level}>`);
            continue;
        }
        if ((m = /^>\s?(.*)$/.exec(line))) { flushPara(); flushList(); quote.push(m[1]); continue; }
        if ((m = /^[-*]\s+(.+)$/.exec(line)) || (m = /^\d+[.)]\s+(.+)$/.exec(line))) {
            flushPara(); flushQuote();
            const tag = /^\d/.test(line) ? 'ol' : 'ul';
            if (list && list.tag !== tag) flushList();
            if (!list) list = { tag, items: [] };
            list.items.push(m[1]);
            continue;
        }
        flushList(); flushQuote();
        para.push(line);
    }
    flushAll();

    const plain = md.replace(/[#>*\[\]()\-]/g, ' ');
    const words = plain.split(/\s+/).filter(Boolean).length;
    return {
        html: out.join('\n'),
        faq: faq.filter((f) => f.a.length).map((f) => ({ q: f.q, a: f.a.join(' ') })),
        words
    };
}

// ---------- templates ----------
function layout({ title, description, canonical, image, imageAlt, ogType, head = '', body }) {
    return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${canonical}">
    <meta name="robots" content="index, follow, max-image-preview:large">

    <meta property="og:type" content="${ogType}">
    <meta property="og:site_name" content="Calm">
    <meta property="og:locale" content="fa_IR">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${esc(imageAlt)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(description)}">
    <meta name="twitter:image" content="${image}">

    <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg">
    <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
    <meta name="theme-color" content="#0f1830">
    <link rel="alternate" type="application/rss+xml" title="Calm بلاگ" href="${SITE}/blog/feed.xml">
    <link rel="preload" href="/assets/fonts/Estedad-VF.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${CSS}">
${head}
    <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "54a5c1f34bde403fb376d604168b982e"}'></script><!-- End Cloudflare Web Analytics -->
</head>
<body>
    <header class="site-header">
        <div class="wrap header-inner">
            <a class="brand" href="/" aria-label="Calm، صفحه‌ی اصلی">
                <img src="/assets/images/favicon.svg" alt="" width="28" height="28">
                <span>Calm</span>
            </a>
            <nav class="nav" aria-label="منوی اصلی">
                <a href="/blog/">بلاگ</a>
                <a class="nav-cta" href="/">باز کردن Calm</a>
            </nav>
        </div>
    </header>
${body}
    <footer class="site-footer">
        <div class="wrap">
            <p><a href="/">Calm</a>: یک ابزار ساده و رایگان برای مدیتیشن، تمرین تنفس و صداهای آرام طبیعت، بدون ثبت‌نام.</p>
            <p class="muted">مطالب این بلاگ جنبه‌ی آموزشی و عمومی دارند و جایگزین مشورت با پزشک یا متخصص نیستند.</p>
        </div>
    </footer>
</body>
</html>
`;
}

function sessionBoxHtml(post) {
    if (!post.session) return '';
    return `<aside class="session-box" aria-label="شروع تمرین">
    <div class="session-box-text">
        <p class="session-box-kicker">همین حالا امتحان کنید</p>
        ${post.sessionMeta ? `<p class="session-box-meta">${metaLine(post.sessionMeta)}</p>` : ''}
    </div>
    <a class="session-btn" href="${esc(appUrl(post.session))}">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>
        <span>${esc(post.sessionLabel || 'شروع تمرین')}</span>
    </a>
</aside>`;
}

function card(post) {
    const cat = CATEGORIES[post.category];
    return `<article class="card">
    <a class="card-link" href="${post.path}">
        ${post.cover ? `<img class="card-img" src="${post.cover}" alt="${esc(post.coverAlt || '')}" width="1200" height="630" loading="lazy" decoding="async">` : ''}
        <div class="card-body">
            ${cat ? `<span class="tag">${cat.single}</span>` : ''}
            <h3>${esc(post.title)}</h3>
            <p>${esc(post.description)}</p>
            <span class="card-meta">${faDigits(post.minutes)} دقیقه مطالعه</span>
        </div>
    </a>
</article>`;
}

function postPage(post, related) {
    const cat = CATEGORIES[post.category];
    const image = SITE + (post.cover || '/assets/images/og.jpg');
    const box = sessionBoxHtml(post);
    const { html, faq } = renderMarkdown(post.body, box);

    const ld = [
        {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            image: [image],
            datePublished: post.date,
            dateModified: post.updated || post.date,
            inLanguage: 'fa-IR',
            mainEntityOfPage: post.url,
            author: { '@type': 'Organization', name: 'Calm', url: SITE + '/' },
            publisher: {
                '@type': 'Organization', name: 'Calm', url: SITE + '/',
                logo: { '@type': 'ImageObject', url: SITE + '/assets/icons/icon-512.png' }
            },
            ...(cat ? { articleSection: cat.single } : {}),
            wordCount: post.words
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Calm', item: SITE + '/' },
                { '@type': 'ListItem', position: 2, name: 'بلاگ', item: SITE + '/blog/' },
                { '@type': 'ListItem', position: 3, name: post.title, item: post.url }
            ]
        }
    ];
    if (faq.length) {
        ld.push({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({
                '@type': 'Question', name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
        });
    }

    const head = `    <meta property="article:published_time" content="${post.date}">
    <meta property="article:modified_time" content="${post.updated || post.date}">
    ${ld.map(jsonLd).join('\n    ')}`;

    const updated = post.updated && post.updated !== post.date
        ? `${SEP}به‌روزرسانی ${faDate(post.updated)}` : '';

    const body = `    <main class="wrap post">
        <nav class="breadcrumb" aria-label="مسیر صفحه">
            <a href="/">Calm</a><span aria-hidden="true">›</span><a href="/blog/">بلاگ</a>${cat ? `<span aria-hidden="true">›</span><a href="/blog/#${post.category}">${cat.label}</a>` : ''}
        </nav>
        <article>
            <header class="post-header">
                <h1>${esc(post.title)}</h1>
                <p class="lead">${esc(post.description)}</p>
                <p class="post-meta"><time datetime="${post.date}">${faDate(post.date)}</time>${updated}${SEP}${faDigits(post.minutes)} دقیقه مطالعه</p>
            </header>
            ${post.cover ? `<img class="post-cover" src="${post.cover}" alt="${esc(post.coverAlt || '')}" width="1200" height="630" fetchpriority="high">` : ''}
            ${box}
            <div class="prose">
${html}
            </div>
        </article>
        ${related.length ? `<section class="related" aria-labelledby="related-title">
            <h2 id="related-title">مطالب مرتبط</h2>
            <div class="grid">
${related.map(card).join('\n')}
            </div>
        </section>` : ''}
    </main>`;

    return layout({
        title: `${post.title} | Calm`,
        description: post.description,
        canonical: post.url,
        image,
        imageAlt: post.coverAlt || post.title,
        ogType: 'article',
        head,
        body
    });
}

function indexPage(posts) {
    const sections = Object.entries(CATEGORIES).map(([key, cat]) => {
        const list = posts.filter((p) => p.category === key);
        if (!list.length) return '';
        return `        <section class="cat" id="${key}" aria-labelledby="cat-${key}">
            <h2 id="cat-${key}">${cat.label}</h2>
            <div class="grid">
${list.map(card).join('\n')}
            </div>
        </section>`;
    }).join('\n');
    const other = posts.filter((p) => !p.category);

    const url = SITE + '/blog/';
    const title = 'بلاگ Calm: مدیتیشن، تمرین تنفس و آرامش';
    const description = 'مدیتیشن‌های آماده با صدای طبیعت و راهنماهای ساده درباره‌ی مدیتیشن، تمرین تنفس، مراقبه، یوگا و آرامش. رایگان و بدون ثبت‌نام.';
    const ld = [
        {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'بلاگ Calm',
            description,
            url,
            inLanguage: 'fa-IR',
            blogPost: posts.map((p) => ({
                '@type': 'BlogPosting', headline: p.title, url: p.url, datePublished: p.date
            }))
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Calm', item: SITE + '/' },
                { '@type': 'ListItem', position: 2, name: 'بلاگ', item: url }
            ]
        }
    ];

    const body = `    <main class="wrap">
        <header class="blog-hero">
            <h1>بلاگ Calm</h1>
            <p class="lead">مدیتیشن‌های آماده که با یک کلیک شروع می‌شوند، و راهنماهای کوتاه درباره‌ی مدیتیشن، تنفس، مراقبه و آرامش.</p>
            <nav class="chips" aria-label="دسته‌ها">
${Object.entries(CATEGORIES).filter(([k]) => posts.some((p) => p.category === k)).map(([k, c]) => `                <a class="chip" href="#${k}">${c.label}</a>`).join('\n')}
            </nav>
        </header>
${sections}
${other.length ? `        <section class="cat"><div class="grid">${other.map(card).join('\n')}</div></section>` : ''}
    </main>`;

    return layout({
        title,
        description,
        canonical: url,
        image: SITE + (posts.find((p) => p.cover)?.cover || '/assets/images/og.jpg'),
        imageAlt: 'بلاگ Calm',
        ogType: 'website',
        head: `    ${ld.map(jsonLd).join('\n    ')}`,
        body
    });
}

function feed(posts) {
    const items = posts.slice().sort((a, b) => b.date.localeCompare(a.date)).map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${p.url}</link>
      <guid>${p.url}</guid>
      <pubDate>${new Date(p.date + 'T08:00:00Z').toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
    </item>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>بلاگ Calm</title>
    <link>${SITE}/blog/</link>
    <description>مدیتیشن، تمرین تنفس و آرامش</description>
    <language>fa</language>
${items}
  </channel>
</rss>
`;
}

function sitemap(posts) {
    const latest = posts.reduce((d, p) => ((p.updated || p.date) > d ? (p.updated || p.date) : d), '0000-00-00');
    const urls = [
        { loc: SITE + '/', priority: '1.0' },
        { loc: SITE + '/blog/', lastmod: latest, priority: '0.8' },
        ...posts.map((p) => ({ loc: p.url, lastmod: p.updated || p.date, priority: '0.7' }))
    ];
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;
}

// ---------- build ----------
const posts = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md')).map((file) => {
    const { data, body } = parseFrontMatter(readFileSync(join(POSTS_DIR, file), 'utf8'), file);
    const slug = file.replace(/\.md$/, '');
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`${file}: file name must be lowercase latin, digits and "-"`);
    if (data.cover && !existsSync(join(ROOT, data.cover))) throw new Error(`${file}: cover not found: ${data.cover}`);
    const { words } = renderMarkdown(body, '');
    return {
        ...data,
        slug,
        body,
        words,
        minutes: Math.max(1, Math.round(words / 200)),
        path: `/blog/${slug}/`,
        url: `${SITE}/blog/${slug}/`
    };
}).sort((a, b) => (Number(a.order ?? 1e9) - Number(b.order ?? 1e9)) || b.date.localeCompare(a.date));

// clean old generated post folders (keeps anything that is not a generated post page)
if (existsSync(OUT_DIR)) {
    for (const name of readdirSync(OUT_DIR)) {
        const p = join(OUT_DIR, name);
        if (statSync(p).isDirectory() && existsSync(join(p, 'index.html'))
            && readFileSync(join(p, 'index.html'), 'utf8').includes('<!-- generated by _blog/build.mjs -->')) {
            rmSync(p, { recursive: true });
        }
    }
}
mkdirSync(OUT_DIR, { recursive: true });

const MARK = '<!-- generated by _blog/build.mjs -->\n';
for (const post of posts) {
    const sameCat = posts.filter((p) => p !== post && p.category === post.category);
    const others = posts.filter((p) => p !== post && p.category !== post.category);
    const related = sameCat.concat(others).slice(0, 3);
    mkdirSync(join(OUT_DIR, post.slug), { recursive: true });
    writeFileSync(join(OUT_DIR, post.slug, 'index.html'), postPage(post, related).replace('<html', MARK + '<html'));
}
writeFileSync(join(OUT_DIR, 'index.html'), indexPage(posts).replace('<html', MARK + '<html'));
writeFileSync(join(OUT_DIR, 'feed.xml'), feed(posts));
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap(posts));
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`built ${posts.length} posts → blog/, sitemap.xml, robots.txt, blog/feed.xml`);
