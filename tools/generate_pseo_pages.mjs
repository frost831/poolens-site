import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const APP_ERROR_DB = path.resolve(ROOT, '..', 'poolens', 'js', 'errors.js');
const SITE_URL = 'https://splashlens.com';
const OUT_ERROR_DIR = path.join(ROOT, 'error-codes');
const OUT_BRAND_DIR = path.join(ROOT, 'brands');
const OUT_SITEMAP = path.join(ROOT, 'pseo-sitemap.xml');
const GENERATED_AT = new Date().toISOString().slice(0, 10);

function loadErrorDb() {
  const source = fs.readFileSync(APP_ERROR_DB, 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: APP_ERROR_DB });
  if (!context.window.ERROR_DB) throw new Error('window.ERROR_DB was not found');
  return context.window.ERROR_DB;
}

function slug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'unknown';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function cleanDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function pageShell({ title, description, canonical, body, schema }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <script type="application/ld+json">${jsonLd(schema)}</script>
  <style>
    :root { --ink:#0f172a; --muted:#64748b; --line:#dbe4ee; --sky:#0284c7; --bg:#f8fafc; --panel:#fff; --amber:#d97706; }
    * { box-sizing: border-box; }
    body { margin:0; font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:var(--bg); color:var(--ink); line-height:1.55; }
    header, main, footer { max-width:980px; margin:0 auto; padding:0 18px; }
    header { padding-top:28px; padding-bottom:20px; }
    a { color:var(--sky); }
    .crumb { font-size:.82rem; color:var(--muted); margin-bottom:18px; }
    h1 { margin:0; font-size:clamp(2rem, 5vw, 3.5rem); line-height:1.02; letter-spacing:0; }
    .lede { margin-top:14px; max-width:760px; color:#334155; font-size:1.08rem; }
    .panel { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:18px; margin:16px 0; box-shadow:0 12px 28px rgba(15,23,42,.05); }
    h2 { margin:0 0 10px; font-size:1.25rem; }
    h3 { margin:18px 0 8px; font-size:1rem; }
    ul, ol { margin:0; padding-left:22px; }
    li { margin:6px 0; }
    .meta { display:flex; flex-wrap:wrap; gap:8px; margin-top:18px; }
    .chip { border:1px solid var(--line); background:#fff; border-radius:999px; padding:5px 10px; color:#334155; font-size:.82rem; font-weight:800; }
    .warning { border-color:#fde68a; background:#fffbeb; color:#92400e; }
    .cta { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-top:16px; }
    .button { display:inline-flex; align-items:center; justify-content:center; min-height:42px; padding:0 14px; background:var(--sky); color:white; text-decoration:none; border-radius:6px; font-weight:900; }
    .secondary { background:#0f172a; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; }
    .small { color:var(--muted); font-size:.88rem; }
    footer { padding-top:20px; padding-bottom:38px; color:var(--muted); font-size:.86rem; }
  </style>
</head>
<body>
${body}
</body>
</html>
`;
}

function codePage({ brandKey, brand, categoryName, code, urlPath }) {
  const title = `${brand.label} ${code.code} - ${code.name || 'Pool Equipment Code'}`;
  const description = `${brand.label} ${code.code} reference for ${categoryName}: likely causes, next checks, and manual-verification reminders for pool service techs.`;
  const canonical = `${SITE_URL}${urlPath}`;
  const causes = code.causes || [];
  const fixes = code.fix || [];
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      dateModified: GENERATED_AT,
      author: { '@type': 'Organization', name: 'SplashLens' },
      publisher: { '@type': 'Organization', name: 'SplashLens', url: SITE_URL },
      mainEntityOfPage: canonical,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `What does ${brand.label} ${code.code} mean?`,
          acceptedAnswer: { '@type': 'Answer', text: code.name || `${brand.label} ${code.code} is a pool equipment status or fault code.` },
        },
        {
          '@type': 'Question',
          name: `Should I verify ${code.code} against the manual?`,
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. SplashLens is a field reference. Confirm the code, exact model, and procedure against the current manufacturer manual before repair or parts ordering.' },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `${brand.label} ${code.code} next checks`,
      description: `Reference checks for ${brand.label} ${code.code}.`,
      step: fixes.slice(0, 8).map((text, index) => ({ '@type': 'HowToStep', position: index + 1, text })),
    },
  ];

  const body = `
<header>
  <div class="crumb"><a href="/">SplashLens</a> / <a href="/brands/${slug(brand.label)}.html">${escapeHtml(brand.label)}</a> / ${escapeHtml(categoryName)}</div>
  <h1>${escapeHtml(brand.label)} ${escapeHtml(code.code)}: ${escapeHtml(code.name || 'Code Reference')}</h1>
  <p class="lede">${escapeHtml(description)}</p>
  <div class="meta">
    <span class="chip">${escapeHtml(brand.label)}</span>
    <span class="chip">${escapeHtml(categoryName)}</span>
    <span class="chip">${escapeHtml((code.severity || 'reference').toUpperCase())}</span>
    ${code.callpro ? '<span class="chip warning">Certified tech recommended</span>' : ''}
  </div>
</header>
<main>
  <section class="panel">
    <h2>What It Means</h2>
    <p>${escapeHtml(code.name || `${brand.label} ${code.code} is a pool equipment code in the SplashLens reference database.`)}</p>
  </section>
  ${causes.length ? `<section class="panel"><h2>Likely Causes</h2><ul>${causes.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>` : ''}
  ${fixes.length ? `<section class="panel"><h2>Next Checks</h2><ol>${fixes.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol></section>` : ''}
  <section class="panel">
    <h2>Verify Before Repair</h2>
    <p>SplashLens is a field reference, not a repair guarantee. Confirm the visible code, exact model, and current manufacturer procedure before replacing parts, bypassing safeties, or quoting a customer.</p>
    <p class="small">SplashLens is independent and is not affiliated with ${escapeHtml(brand.label)} or other equipment manufacturers.</p>
  </section>
  <section class="panel">
    <h2>Use SplashLens At The Pad</h2>
    <p>Manual error-code lookup works after the app has loaded once. AI scan features require internet and should be treated as a second set of eyes.</p>
    <div class="cta">
      <a class="button" href="https://app.splashlens.com/?tab=errors">Open the free app</a>
      <a class="button secondary" href="/brands/${slug(brand.label)}.html">More ${escapeHtml(brand.label)} codes</a>
    </div>
  </section>
</main>
<footer>Affiliate links may appear on SplashLens where clearly disclosed. Troubleshooting guidance stays brand-neutral.</footer>`;

  return pageShell({ title, description, canonical, body, schema });
}

function brandPage({ brandKey, brand, entries, urlPath }) {
  const title = `${brand.label} Pool Equipment Error Codes`;
  const description = `${brand.label} pool equipment code reference pages generated from the current SplashLens field database.`;
  const canonical = `${SITE_URL}${urlPath}`;
  const byCategory = new Map();
  for (const entry of entries) {
    if (!byCategory.has(entry.categoryName)) byCategory.set(entry.categoryName, []);
    byCategory.get(entry.categoryName).push(entry);
  }
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'SplashLens', url: SITE_URL },
  };

  const body = `
<header>
  <div class="crumb"><a href="/">SplashLens</a> / Brands</div>
  <h1>${escapeHtml(title)}</h1>
  <p class="lede">${escapeHtml(description)} Use these as field-reference starting points and verify final repair procedures against the current manufacturer manual.</p>
  <div class="meta">
    <span class="chip">${entries.length} current entries</span>
    <span class="chip">${byCategory.size} equipment groups</span>
    <span class="chip warning">Independent reference</span>
  </div>
</header>
<main>
  ${Array.from(byCategory.entries()).map(([category, rows]) => `
    <section class="panel">
      <h2>${escapeHtml(category)}</h2>
      <div class="grid">
        ${rows.map(row => `
          <a href="${row.urlPath}" style="text-decoration:none;color:inherit;border:1px solid var(--line);border-radius:8px;padding:12px;background:#fff;">
            <strong>${escapeHtml(row.code.code)}</strong>
            <div class="small">${escapeHtml(row.code.name || 'Code reference')}</div>
          </a>
        `).join('')}
      </div>
    </section>
  `).join('')}
  <section class="panel">
    <h2>Brand Neutrality</h2>
    <p>SplashLens is independent and is not affiliated with ${escapeHtml(brand.label)}. Content is written as original field-reference guidance and should be checked against current manufacturer documentation.</p>
  </section>
</main>
<footer>Generated from the current SplashLens app database on ${GENERATED_AT}.</footer>`;

  return pageShell({ title, description, canonical, body, schema });
}

function main() {
  const db = loadErrorDb();
  cleanDir(OUT_ERROR_DIR);
  cleanDir(OUT_BRAND_DIR);

  const urls = [];
  const brandEntries = new Map();
  let entryCount = 0;

  for (const [brandKey, brand] of Object.entries(db)) {
    const brandSlug = slug(brand.label || brandKey);
    brandEntries.set(brandKey, []);
    for (const [categoryName, category] of Object.entries(brand.categories || {})) {
      for (const code of category.codes || []) {
        const fileSlug = slug(`${categoryName}-${code.code}-${code.name || 'code'}`);
        const brandDir = path.join(OUT_ERROR_DIR, brandSlug);
        fs.mkdirSync(brandDir, { recursive: true });
        const urlPath = `/error-codes/${brandSlug}/${fileSlug}.html`;
        const html = codePage({ brandKey, brand, categoryName, code, urlPath });
        fs.writeFileSync(path.join(brandDir, `${fileSlug}.html`), html);
        urls.push(urlPath);
        brandEntries.get(brandKey).push({ brandKey, brand, categoryName, code, urlPath });
        entryCount += 1;
      }
    }
  }

  for (const [brandKey, entries] of brandEntries.entries()) {
    const brand = db[brandKey];
    const brandSlug = slug(brand.label || brandKey);
    const urlPath = `/brands/${brandSlug}.html`;
    fs.writeFileSync(path.join(OUT_BRAND_DIR, `${brandSlug}.html`), brandPage({ brandKey, brand, entries, urlPath }));
    urls.push(urlPath);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.sort().map(url => `  <url><loc>${SITE_URL}${url}</loc><lastmod>${GENERATED_AT}</lastmod></url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(OUT_SITEMAP, sitemap);

  console.log(`Generated ${entryCount} error-code pages, ${brandEntries.size} brand pages, and ${path.basename(OUT_SITEMAP)}.`);
}

main();
