import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const BRANDS = path.join(ROOT, 'brands');
const SITE = 'https://splashlens.com';
const TODAY = '2026-06-22';

function titleFromSlug(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

const files = fs.readdirSync(BRANDS)
  .filter(file => file.endsWith('.html') && file !== 'index.html')
  .sort();

const cards = files.map(file => {
  const label = titleFromSlug(file.replace(/\.html$/, ''));
  return `<a class="card" href="/brands/${file}"><strong>${label}</strong><span>Pool equipment codes, symptoms, and next checks</span></a>`;
}).join('');

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Pool Equipment Brands and Error Codes',
  description: 'Brand index for SplashLens pool equipment code reference pages.',
  url: `${SITE}/brands/`,
  dateModified: TODAY,
};

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pool Equipment Brands and Error Codes - SplashLens</title>
<meta name="description" content="Browse SplashLens pool equipment brand pages for pumps, heaters, heat pumps, automation, lighting, robots, salt systems, covers, and controller troubleshooting.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${SITE}/brands/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
<style>
*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;background:#f8fafc;color:#0f172a;line-height:1.55}.wrap{max-width:1080px;margin:auto;padding:0 20px}a{color:#0369a1}.nav{border-bottom:1px solid #dbeafe;background:#fff}.nav .wrap{height:58px;display:flex;align-items:center;justify-content:space-between}.brand{font-weight:950;text-decoration:none;color:#0f172a}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 14px;border-radius:7px;background:#0284c7;color:white;text-decoration:none;font-weight:900}.hero{background:#0f172a;color:white;padding:64px 0 42px}.hero h1{font-size:clamp(2.1rem,5vw,4.2rem);line-height:1;margin:8px 0 14px}.hero p{max-width:780px;color:#cbd5e1}.section{padding:38px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}.card{background:white;border:1px solid #dbeafe;border-radius:8px;padding:14px;text-decoration:none;color:#0f172a}.card strong{display:block}.card span{display:block;color:#64748b;font-size:13px;margin-top:4px}.links{display:flex;gap:10px;flex-wrap:wrap}.links a{background:#fff;border:1px solid #dbeafe;border-radius:8px;padding:10px 12px;text-decoration:none;font-weight:800}footer{padding:28px 0;color:#64748b;font-size:.86rem}
</style>
</head>
<body>
<nav class="nav"><div class="wrap"><a class="brand" href="/">SplashLens</a><a class="btn" href="https://app.splashlens.com">Open Free App</a></div></nav>
<header class="hero"><div class="wrap"><p>Pool equipment brand index</p><h1>Pool equipment brands, codes, and field checks.</h1><p>Browse the current SplashLens brand reference pages for pool pumps, heaters, heat pumps, automation, lights, robots, salt systems, covers, water features, controllers, and more.</p></div></header>
<main class="wrap">
<section class="section"><div class="links"><a href="/pool-parts/">Pool parts</a><a href="/pool-robots/">Robots</a><a href="/pool-automation/">Automation</a><a href="/pool-lighting/">Lighting</a><a href="/pool-hardware/">Hardware</a><a href="/partsnap.html">PartSnap</a></div></section>
<section class="section"><h2>Brands</h2><div class="grid">${cards}</div></section>
</main>
<footer class="wrap">SplashLens is independent and not affiliated with listed equipment manufacturers. Verify against current manuals.</footer>
</body>
</html>`;

fs.writeFileSync(path.join(BRANDS, 'index.html'), html);
console.log(`Generated brands/index.html with ${files.length} brand pages`);
