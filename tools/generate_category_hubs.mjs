import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const APP_ERROR_DB = path.resolve(ROOT, '..', 'poolens', 'js', 'errors.js');
const SITE = 'https://splashlens.com';
const TODAY = '2026-06-22';

const hubs = [
  { dir: 'pool-parts', title: 'Pool Parts Reference and PartSnap ID', include: /part|impeller|seal|o-ring|oring|grid|manifold|basket|valve|cell|fitting|gauge|label|motor|board|cable|union/i },
  { dir: 'pool-robots', title: 'Pool Robot Cleaner Troubleshooting', include: /robot|cleaner|dolphin|maytronics|polaris|aiper|beatbot|betta|track|brush|cordless|skimmer/i },
  { dir: 'pool-automation', title: 'Pool Automation Troubleshooting', include: /automation|controller|panel|relay|actuator|valve|app|wifi|communication|intellicenter|easytouch|intellitouch|iaqualink|omnilogic/i },
  { dir: 'pool-lighting', title: 'Pool Lighting Troubleshooting', include: /light|lighting|gfci|breaker|transformer|niche|led|color|voltage/i },
  { dir: 'pool-pumps', title: 'Pool Pump Troubleshooting', include: /pump|priming|prime|flow|pressure|motor|seal|impeller|basket|variable speed|intelliflo|superflo|tristar/i },
  { dir: 'pool-heaters', title: 'Pool Heater and Heat Pump Troubleshooting', include: /heater|heat pump|ignition|flame|gas|pressure switch|refrigerant|compressor|raypak|mastertemp|jxi|aquacal/i },
  { dir: 'salt-cells', title: 'Salt Cell and Chlorinator Troubleshooting', include: /salt|chlorinator|cell|aquarite|turbocell|swg|chlorine output|salinity/i },
  { dir: 'pool-tech-training', title: 'Pool Tech Training Field Reference', include: /check|verify|service|safety|manual|test|calibrate|proof|route|training|filter|chemical|dosing/i },
  { dir: 'pool-hardware', title: 'Pool Hardware Field Reference', include: /pump|filter|heater|automation|robot|light|salt|cover|valve|feeder|controller|water feature|uv|ozone|hardware/i },
];

function loadDb() {
  const source = fs.readFileSync(APP_ERROR_DB, 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: APP_ERROR_DB });
  return context.window.ERROR_DB;
}

function slug(value) {
  return String(value || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90) || 'unknown';
}

function esc(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function collectEntries(db, hub) {
  const entries = [];
  for (const [brandKey, brand] of Object.entries(db)) {
    const brandSlug = slug(brand.label || brandKey);
    for (const [categoryName, category] of Object.entries(brand.categories || {})) {
      for (const code of category.codes || []) {
        const haystack = [brand.label, categoryName, code.code, code.name, ...(code.causes || []), ...(code.fix || [])].join(' ');
        if (!hub.include.test(haystack)) continue;
        const fileSlug = slug(`${categoryName}-${code.code}-${code.name || 'code'}`);
        entries.push({
          brand: brand.label,
          categoryName,
          code: code.code,
          name: code.name || 'Code reference',
          url: `/error-codes/${brandSlug}/${fileSlug}.html`,
        });
      }
    }
  }
  return entries.sort((a, b) => `${a.brand} ${a.code}`.localeCompare(`${b.brand} ${b.code}`));
}

function page(hub, entries) {
  const url = `${SITE}/${hub.dir}/`;
  const desc = `${hub.title} for pool service technicians. Browse current SplashLens field-reference entries, PartSnap prompts, verification reminders, and brand-neutral next checks.`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hub.title,
    description: desc,
    url,
    dateModified: TODAY,
    isPartOf: { '@type': 'WebSite', name: 'SplashLens', url: SITE },
    hasPart: entries.slice(0, 60).map(entry => ({ '@type': 'WebPage', name: `${entry.brand} ${entry.code} ${entry.name}`, url: `${SITE}${entry.url}` })),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(hub.title)} - SplashLens</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="${esc(hub.title)} - SplashLens">
<meta property="og:description" content="${esc(desc)}">
<script type="application/ld+json">${json(schema)}</script>
<style>
*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;background:#f8fafc;color:#0f172a;line-height:1.55}.wrap{max-width:1080px;margin:auto;padding:0 20px}a{color:#0369a1}.nav{border-bottom:1px solid #dbeafe;background:#fff}.nav .wrap{height:58px;display:flex;align-items:center;justify-content:space-between}.brand{font-weight:950;text-decoration:none;color:#0f172a}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 14px;border-radius:7px;background:#0284c7;color:white;text-decoration:none;font-weight:900}.hero{background:#0f172a;color:white;padding:64px 0 42px}.hero p{max-width:760px;color:#cbd5e1}.hero h1{font-size:clamp(2.1rem,5vw,4.2rem);line-height:1;margin:8px 0 14px}.meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.chip{background:#e0f2fe;color:#075985;border-radius:999px;padding:5px 10px;font-size:12px;font-weight:900}.section{padding:38px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}.card{background:white;border:1px solid #dbeafe;border-radius:8px;padding:12px;text-decoration:none;color:#0f172a}.card strong{display:block}.card span{display:block;color:#64748b;font-size:13px;margin-top:4px}.notice{background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;color:#92400e}.links{display:flex;gap:10px;flex-wrap:wrap}.links a{background:#fff;border:1px solid #dbeafe;border-radius:8px;padding:10px 12px;text-decoration:none;font-weight:800}footer{padding:28px 0;color:#64748b;font-size:.86rem}
</style>
</head>
<body>
<nav class="nav"><div class="wrap"><a class="brand" href="/">SplashLens</a><a class="btn" href="https://app.splashlens.com">Open Free App</a></div></nav>
<header class="hero"><div class="wrap"><p>Pool service field reference</p><h1>${esc(hub.title)}</h1><p>${esc(desc)}</p><div class="meta"><span class="chip">${entries.length} matching entries</span><span class="chip">PartSnap + proof workflow</span><span class="chip">Reference only</span></div></div></header>
<main class="wrap">
<section class="section"><h2>Start Here</h2><p>Use this hub as a crawlable index into SplashLens field-reference coverage. Open the app at the pad for offline manual lookup, dosing calculators, notes, checklists, Route Brain, and online scanner workflows.</p><div class="links"><a href="/partsnap.html">PartSnap parts ID</a><a href="/brands/">Manufacturers</a><a href="/pool-parts/">Parts</a><a href="/pool-automation/">Automation</a><a href="/pool-robots/">Robots</a><a href="/salt-cells/">Salt cells</a></div></section>
<section class="section"><h2>Reference Entries</h2><div class="grid">${entries.map(entry => `<a class="card" href="${entry.url}"><strong>${esc(entry.brand)} ${esc(entry.code)}</strong><span>${esc(entry.categoryName)} - ${esc(entry.name)}</span></a>`).join('')}</div></section>
<section class="section"><div class="notice"><strong>Verify before repair or ordering.</strong> SplashLens is independent. Confirm exact model, visible markings, parts diagrams, manuals, and qualified safety procedures before quoting, repairing, or ordering parts.</div></section>
</main>
<footer class="wrap">Copyright 2026 SplashLens. Independent field reference for pool service professionals.</footer>
</body>
</html>`;
}

const db = loadDb();
const urls = [];
for (const hub of hubs) {
  const entries = collectEntries(db, hub);
  const outDir = path.join(ROOT, hub.dir);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), page(hub, entries));
  urls.push(`/${hub.dir}/`);
}

fs.writeFileSync(path.join(ROOT, 'category-hub-sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${SITE}${url}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>0.94</priority></url>`).join('\n')}
</urlset>
`);

console.log(`Generated ${urls.length} category hubs and category-hub-sitemap.xml`);
