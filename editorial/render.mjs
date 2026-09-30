import { articles } from './articles.mjs';
import { clusters, sources, sourceIds } from './sources.mjs';

export const origin = 'https://splashlens.com';
export const hub = '/blog/field-notes/';
export const policy = '/blog/editorial/';
const image = '/product-screenshots/service-proof-live-mobile.png';
const disclaimer = 'Reference only. These are editorial documentation prompts, not repair instructions, operating limits, legal advice, or confirmation of fit. Use the exact manufacturer instructions, applicable local requirements, and qualified judgment.';
export const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
export const visible = (now = new Date(), inventory = articles) => inventory.filter(a => ['scheduled', 'published'].includes(a.status) && Date.parse(a.published) <= now.getTime());
const dateLabel = value => new Date(value).toLocaleDateString('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'long', day: 'numeric' });
const aLink = a => `<a href="${a.path}">${escape(a.title)}</a>`;
const crumbs = entries => `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${entries.map(([name, url]) => `<li>${url ? `<a href="${escape(url)}">${escape(name)}</a>` : escape(name)}</li>`).join('')}</ol></nav>`;

const workflowByCluster = {
  'pool-opening-closing': { label: 'Open closing workflow', params: { tab: 'report', workflow: 'closing', challenge: 'field60', challenge_path: 'closing' } },
  'spa-hot-tubs': { label: 'Open spa lookup', params: { tab: 'errors', mode: 'search', search: 'spa' } },
  'robots-cleaners': { label: 'Open cleaner lookup', params: { tab: 'errors', mode: 'search', search: 'robot cleaner' } },
  'automation-controls': { label: 'Open automation workflow', params: { tab: 'route' } },
  'pumps-motors': { label: 'Open pump lookup', params: { tab: 'errors', mode: 'search', search: 'pump motor' } },
  'heaters-heat-pumps': { label: 'Open heater lookup', params: { tab: 'errors', mode: 'search', search: 'heater' } },
  'salt-chemistry-controllers': { label: 'Open salt controller lookup', params: { tab: 'errors', mode: 'search', search: 'salt controller' } },
  'filters-valves-plumbing': { label: 'Open PartSnap', params: { tab: 'scan', mode: 'parts' } },
  'covers-safety-equipment': { label: 'Open service report', params: { tab: 'report' } },
  'facility-cpo': { label: 'Open Facility Assist', params: { tab: 'facility', mode: 'facility' } },
  'field-documentation': { label: 'Open service report', params: { tab: 'report' } },
  'troubleshooting-reference': { label: 'Open equipment lookup', params: { tab: 'errors', mode: 'search', search: 'equipment' } },
  'manuals-sources': { label: 'Open equipment lookup', params: { tab: 'errors', mode: 'search', search: 'manual' } },
  'buyer-proof': { label: 'Open PartSnap', params: { tab: 'scan', mode: 'parts' } },
  partsnap: { label: 'Open PartSnap', params: { tab: 'scan', mode: 'parts' } },
};

export function workflowForArticle(article) {
  const workflow = workflowByCluster[article.cluster] || workflowByCluster['field-documentation'];
  const url = new URL('https://app.splashlens.com/');
  url.search = new URLSearchParams({
    ...workflow.params,
    article: article.id,
    utm_source: 'splashlens_blog',
    utm_medium: 'referral',
    utm_campaign: 'blog_120d_2026q4',
    utm_content: `${article.slug}_workflow_cta`,
  }).toString();
  return { label: workflow.label, href: url.href };
}

function shell({ title, description, path, body, graph, article, noindex = false }) {
  const canonical = origin + path;
  const social = origin + (article ? image : '/splashlens-share-card.png');
  return `<!doctype html><html lang="en-US"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)} | SplashLens</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${canonical}">
<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}"><meta property="og:type" content="${article ? 'article' : 'website'}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="SplashLens"><meta property="og:image" content="${social}"><meta property="og:image:alt" content="${article ? 'SplashLens visit report screen' : 'SplashLens field reference'}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${social}"><meta name="twitter:image:alt" content="SplashLens field reference">
${article ? `<meta property="article:published_time" content="${article.published}"><meta property="article:modified_time" content="${article.modified}"><meta property="article:section" content="${escape(clusters[article.cluster][0])}">` : ''}
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/blog/field-notes.css"><link rel="alternate" type="application/rss+xml" title="SplashLens Field Notes" href="${origin}/blog/feed.xml">
${graph ? `<script type="application/ld+json">${json(graph)}</script>` : ''}<script src="/blog/field-notes.js" defer></script></head>
<body><a class="skip" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="/"><img src="/icon-192.png" width="32" height="32" alt="">SplashLens</a><nav aria-label="Primary"><a href="/blog/">All articles</a><a href="${hub}">Field notes</a><a href="/source-pages/">Sources</a></nav></header>
<main id="main">${body}</main><footer><p><a href="${policy}">Editorial policy</a> · <a href="/privacy.html">Privacy</a> · <a href="/blog/feed.xml">RSS feed</a></p><p>Optional analytics: <button type="button" id="analytics-choice" aria-pressed="false">Off</button></p><p>Reference-only pool and spa documentation. No manufacturer or agency endorsement.</p></footer></body></html>`;
}

function graphFor(a) {
  const canonical = origin + a.path;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': origin + '/#organization', name: 'SplashLens', url: origin + '/' },
    { '@type': 'Organization', '@id': origin + policy + '#editorial', name: 'SplashLens Editorial', url: origin + policy },
    { '@type': 'WebPage', '@id': canonical, url: canonical, name: a.title, mainEntity: { '@id': canonical + '#blogposting' } },
    { '@type': 'BlogPosting', '@id': canonical + '#blogposting', url: canonical, mainEntityOfPage: { '@id': canonical }, headline: a.title,
      description: a.answer, datePublished: a.published, dateModified: a.modified, inLanguage: 'en-US', isAccessibleForFree: true,
      author: { '@id': origin + policy + '#editorial' }, publisher: { '@id': origin + '/#organization' },
      image: [origin + image], articleSection: clusters[a.cluster][0], citation: sourceIds(a).map(id => sources[id].url) },
    { '@type': 'BreadcrumbList', itemListElement: [['Home', '/'], ['Blog', '/blog/'], [clusters[a.cluster][0], `/blog/${a.cluster}/`], [a.title, a.path]].map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: origin + path })) }
  ] };
}

export function renderArticle(a, inventory) {
  const related = [...inventory.filter(b => b.id !== a.id && b.cluster === a.cluster).reverse(), ...inventory.filter(b => b.id !== a.id && b.cluster !== a.cluster).reverse()].slice(0, 4);
  const refs = sourceIds(a).map(id => sources[id]);
  const cta = workflowForArticle(a);
  const body = `${crumbs([['Home', '/'], ['Blog', '/blog/'], [clusters[a.cluster][0], `/blog/${a.cluster}/`]])}
<article data-article-id="${a.id}" data-cluster="${a.cluster}"><header class="article-heading"><p class="eyebrow">Field notes / ${escape(clusters[a.cluster][0])}</p><h1>${escape(a.title)}</h1><p class="answer">${escape(a.answer)}</p><p class="byline">By <a href="${policy}#editorial">SplashLens Editorial</a> · Published <time datetime="${a.published}">${dateLabel(a.published)}</time>${a.modified !== a.published ? ` · Updated <time datetime="${a.modified}">${dateLabel(a.modified)}</time>` : ''}</p><p class="scope">Editorial reference; no independent technical review claimed.</p></header>
<div class="article-layout"><div class="article-body"><section><h2>The record to assemble</h2><ul class="checklist">${a.fields.map((field, i) => `<li><label><input type="checkbox" name="field-${i}"><span>${escape(field)}</span></label></li>`).join('')}</ul><p>Keep each item with its date and origin. Distinguish an observation you made from information supplied by someone else. An unknown detail should remain explicitly unknown until it is verified.</p><p><a href="/blog/checklists/${a.id}.txt" download>Download this field card</a></p></section>
<section><h2>What the record cannot establish</h2><p>${escape(a.boundary)}</p></section><section><h2>The handoff question</h2><p class="question">${escape(a.question)}</p><p>Record the answer with the person or official source that supplied it. Keep an unresolved question open and assign the next contact; a completed form is not the same as a resolved equipment issue.</p></section>
<section id="sources"><h2>Sources and verification routes</h2><p>These official routes provide background and access to applicable guidance. The checklist above is an original editorial documentation aid; these links do not verify a particular installation or part.</p><ul class="sources">${refs.map(s => `<li><a href="${escape(s.url)}" rel="noopener">${escape(s.name)}</a><p>${escape(s.scope)}</p><small>Route checked <time datetime="${s.checked}">${s.checked}</time>. Check for changes before relying on the guidance.</small></li>`).join('')}</ul></section><p class="boundary">${disclaimer}</p>
${related.length ? `<section><h2>Related field notes</h2><ul>${related.map(b => `<li>${aLink(b)}</li>`).join('')}</ul></section>` : `<p><a href="/closing-season.html">Closing-season documentation</a> · <a href="/partsnap.html">PartSnap reference</a></p>`}</div>
<aside><h2>Use the related field tool</h2><figure><img src="${image}" width="390" height="844" loading="lazy" alt="SplashLens visit report screen with draft and service proof controls"><figcaption>SplashLens field workflow. First-party reference screenshot; interface may change. Image: SplashLens.</figcaption></figure><a class="app-link" data-blog-cta="workflow_cta" href="${escape(cta.href)}">${escape(cta.label)}</a><p class="scope">Reference support, not diagnosis or confirmation of fit.</p><a href="/service-proof-passport.html">About service documentation</a></aside></div></article>`;
  return shell({ title: a.title, description: a.answer, path: a.path, body, graph: graphFor(a), article: a });
}

export function renderHub(inventory, cluster) {
  const items = inventory.filter(a => !cluster || a.cluster === cluster).slice().reverse();
  const title = cluster ? clusters[cluster][0] : 'Pool and spa field notes';
  const description = cluster ? clusters[cluster][1] : 'Daily reference notes for equipment records, seasonal handoffs, and source verification.';
  const body = `${crumbs([['Home', '/'], ['Blog', '/blog/'], ...(cluster ? [['Field notes', hub]] : [])])}<header class="article-heading"><p class="eyebrow">SplashLens / Field reference</p><h1>${title}</h1><p class="answer">${description}</p><p>Keep observations, source references, and unresolved questions distinct. Start with the equipment identity and the actual record, then ask the right qualified person.</p></header>
<div class="hub-layout"><section aria-label="Published notes"><label class="search-label" for="note-search">Find a field note</label><input type="search" id="note-search" placeholder="Search published notes" autocomplete="off"><p id="note-count" aria-live="polite">${items.length} published ${items.length === 1 ? 'note' : 'notes'}</p><ol class="notes">${items.map(a => `<li data-note><time datetime="${a.published}">${dateLabel(a.published)}</time><h2>${aLink(a)}</h2><p>${escape(a.answer)}</p><a class="cluster-label" href="/blog/${a.cluster}/">${escape(clusters[a.cluster][0])}</a></li>`).join('')}</ol>${items.length ? '' : '<p>The first note is scheduled for September 29 at 8:00 a.m. Central.</p>'}<p id="no-notes" hidden>No matching field notes.</p></section><aside><h2>Browse topics</h2><ul>${Object.entries(clusters).filter(([key]) => inventory.some(a => a.cluster === key)).map(([key, [name]]) => `<li><a href="/blog/${key}/">${name}</a></li>`).join('')}</ul><h2>Start with a source</h2><p><a href="/source-pages/">Equipment source library</a></p><p><a href="/closing-season.html">Closing-season records</a></p><p><a href="/service-proof-passport.html">Service documentation</a></p><p class="scope">Reference only. Verify the exact equipment instructions and applicable requirements before action.</p><p><a href="${policy}">Authors, sources and corrections</a></p></aside></div>`;
  return shell({ title, description, path: cluster ? `/blog/${cluster}/` : hub, body, graph: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, url: origin + (cluster ? `/blog/${cluster}/` : hub), mainEntity: { '@type': 'ItemList', itemListElement: items.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: origin + a.path, name: a.title })) } } });
}

export function renderPolicy() {
  return shell({ title: 'Field notes editorial policy', description: 'How SplashLens field notes use sources, attribution, corrections, and reference-only boundaries.', path: policy, body: `${crumbs([['Home', '/'], ['Field notes', hub]])}<article class="policy"><h1>Field notes editorial policy</h1><h2 id="editorial">SplashLens Editorial</h2><p>SplashLens publishes these short reference notes to help readers assemble equipment records and ask clearer questions. The organization is the author; no individual qualification, certification, field visit, or independent technical review is implied.</p><h2>Scope and source use</h2><p>The notes contain original documentation prompts, not model-specific operating procedures. Official source routes are labeled by scope and actual access date. A support homepage is a route to a manual, not evidence of compatibility. Current local requirements and the exact applicable manufacturer documents govern decisions.</p><h2>Production and review</h2><p>This series was prepared with AI-assisted drafting and automated publishing checks. It has not received independent pool/spa technical review. Notes do not provide chemical doses, electrical or gas procedures, safety certification, warranty interpretation, or confirmed part matching. If a future article needs technical review, it will name the actual reviewer and scope only after that review occurs.</p><h2>Dates and corrections</h2><p>Publication follows the displayed date, with new scheduled notes available at 8:00 a.m. America/Chicago. Material corrections receive an updated date and correction notice. Source access dates describe a completed source check, not the publication date. A broken link or unsupported statement can cause a note to be corrected or withdrawn.</p><h2>Report a concern</h2><p>Use the contact route on the <a href="/privacy.html">SplashLens contact and privacy page</a>. Include the article URL, statement at issue, and the official reference that supports the correction. Do not send customer records, account credentials, or private photographs through public feedback channels.</p><h2>Images and commercial relationship</h2><p>The report screenshot is a first-party SplashLens asset showing its documentation interface. It is not a photo of the equipment discussed, an inspection result, or evidence of a completed field visit. SplashLens owns and promotes the linked app. No manufacturer or government endorsement is implied, and this series adds no affiliate links.</p><h2>Privacy and optional measurement</h2><p>Field-card checkboxes stay in the current page and are not collected. Optional analytics is off until enabled using the control below. When enabled, it records the clean page path and CTA placement, not checklist answers, customer details, or incoming URL parameters. App links use campaign tags to identify the article referral.</p><p>${disclaimer}</p></article>` });
}

export function sitemap(inventory) {
  const paths = [hub, policy, ...new Set(inventory.map(a => `/blog/${a.cluster}/`))];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p => `<url><loc>${origin}${p}</loc></url>`).join('')}${inventory.map(a => `<url><loc>${origin}${a.path}</loc><lastmod>${a.modified}</lastmod></url>`).join('')}</urlset>`;
}

export function feed(inventory) {
  const items = inventory.slice().reverse().slice(0, 40);
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>SplashLens Field Notes</title><link>${origin}${hub}</link><description>Reference-only pool and spa documentation notes.</description><language>en-us</language><atom:link href="${origin}/blog/feed.xml" rel="self" type="application/rss+xml"/>${items.map(a => `<item><title>${escape(a.title)}</title><link>${origin}${a.path}</link><guid isPermaLink="true">${origin}${a.path}</guid><pubDate>${new Date(a.published).toUTCString()}</pubDate><dc:creator>SplashLens Editorial</dc:creator><category>${escape(clusters[a.cluster][0])}</category><description>${escape(a.answer)}</description></item>`).join('')}</channel></rss>`;
}

export function checklist(a) {
  return `${a.title}\n${origin}${a.path}\n\n${a.answer}\n\nRecord fields\n${a.fields.map(f => `[ ] ${f}`).join('\n')}\n\nBoundary\n${a.boundary}\n\nHandoff question\n${a.question}\n\nDate of observation: ____________________\nSource of information: ____________________\nUnresolved items and next contact: ____________________\n\n${disclaimer}\n`;
}

export function response(body, type = 'text/html', status = 200, request) {
  const preview = request && new URL(request.url).hostname.endsWith('.pages.dev');
  return new Response(request?.method === 'HEAD' ? null : body, { status, headers: {
    'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' https://www.googletagmanager.com; style-src 'self'; img-src 'self' data: https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com; form-action 'self'",
    ...(status === 404 || preview ? { 'X-Robots-Tag': 'noindex' } : {})
  } });
}

export function route(request, now = new Date(), inventory = articles) {
  const url = new URL(request.url);
  const path = url.pathname;
  const published = visible(now, inventory);
  if (!['GET', 'HEAD'].includes(request.method)) return response('Method not allowed', 'text/plain', 405, request);
  if (path === '/blog-sitemap.xml') return response(sitemap(published), 'application/xml', 200, request);
  if (path === '/blog/feed.xml') return response(feed(published), 'application/rss+xml', 200, request);
  if (path === '/blog/field-notes.txt') return response(`# SplashLens Field Notes\n\nReference only; verify exact manuals and applicable requirements.\n\n${published.slice(-40).reverse().map(a => `- [${a.title}](${origin}${a.path})`).join('\n')}\n`, 'text/plain', 200, request);
  const cardId = /^\/blog\/checklists\/(sl-field-\d{3})\.txt$/.exec(path)?.[1];
  if (path.startsWith('/blog/checklists/')) {
    const a = published.find(a => a.id === cardId);
    const result = a ? response(checklist(a), 'text/plain', 200, request) : response('Not found', 'text/plain', 404, request);
    if (a) result.headers.set('Content-Disposition', `attachment; filename="${a.id}.txt"`);
    result.headers.set('X-Robots-Tag', 'noindex');
    return result;
  }
  const normalized = path.endsWith('/') ? path : path + '/';
  let body;
  if (normalized === hub) body = renderHub(published);
  else if (normalized === policy) body = renderPolicy();
  else {
    const cluster = normalized.split('/')[2];
    if (!Object.hasOwn(clusters, cluster)) return null;
    if (normalized === `/blog/${cluster}/` && published.some(a => a.cluster === cluster)) body = renderHub(published, cluster);
    else {
      const a = published.find(a => a.path === normalized);
      if (a) body = renderArticle(a, published);
    }
  }
  if (!body) return response('Not found', 'text/plain', 404, request);
  if (path !== normalized) return new Response(null, { status: 308, headers: { Location: normalized + url.search, 'Cache-Control': 'no-store' } });
  return response(body, 'text/html', 200, request);
}
