# SplashLens Link Logo Audit - 2026-07-09

## Scope

Audited every static HTML route in `C:\Users\sales\Dropbox\Projects\poolens-site` for the canonical SplashLens link/logo metadata contract:

- `/favicon.svg`
- `/favicon-32.png`
- `/splashlens-icon-180.png`
- `/site.webmanifest`
- `og:image`
- `og:image:secure_url`
- `og:image:width`
- `og:image:height`
- `og:image:type`
- `og:image:alt`
- `twitter:card`
- `twitter:image`

Canonical share image:

`https://splashlens.com/splashlens-share-card.png`

## Before Fix

HTML files audited: `631`

Pages missing at least one link/logo preview tag: `631`

Missing tag counts:

- `og:image:secure_url`: `631`
- `faviconPng`: `1`
- `manifest`: `1`
- `twitterCard`: `1`
- `twitterImage`: `1`

Example pages/links that were not fully wired:

- `https://splashlens.com/facilities.html` was missing `favicon-32.png`, `site.webmanifest`, `og:image:secure_url`, `twitter:card`, and `twitter:image`.
- `https://splashlens.com/404.html` was missing `og:image:secure_url`.
- `https://splashlens.com/blog/above-ground-pool-brands.html` was missing `og:image:secure_url`.
- `https://splashlens.com/blog/above-ground-pool-pump-setup.html` was missing `og:image:secure_url`.
- `https://splashlens.com/blog/ai-in-pool-service.html` was missing `og:image:secure_url`.
- `https://splashlens.com/blog/aiper-seagull-troubleshooting.html` was missing `og:image:secure_url`.

## Fix Applied

Applied a bulk metadata normalization across all generated/static HTML pages:

- Added `og:image:secure_url` everywhere.
- Normalized the social share image to `https://splashlens.com/splashlens-share-card.png`.
- Fixed the outlier `facilities.html` page so it now includes the PNG favicon, manifest, Twitter card, and Twitter image tags.

## After Fix

HTML files audited: `631`

Pages missing any required link/logo preview tag: `0`

## Local Verification Command

Run from `C:\Users\sales\Dropbox\Projects\poolens-site`:

```powershell
@'
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.wrangler') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && full.toLowerCase().endsWith('.html')) files.push(full);
  }
}
function attrs(tag) {
  const out = {};
  const re = /([a-zA-Z_:.-]+)\s*=\s*(["'])(.*?)\2/g;
  let m;
  while ((m = re.exec(tag))) out[m[1].toLowerCase()] = m[3];
  return out;
}
function relHas(rel, token) {
  return (rel || '').toLowerCase().split(/\s+/).includes(token);
}
walk(root);
const canonical = 'https://splashlens.com/splashlens-share-card.png';
const allMisses = [];
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const linkTags = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => attrs(m[0]));
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => attrs(m[0]));
  const metaByProp = Object.fromEntries(metaTags.filter(a => a.property).map(a => [a.property.toLowerCase(), a.content || '']));
  const metaByName = Object.fromEntries(metaTags.filter(a => a.name).map(a => [a.name.toLowerCase(), a.content || '']));
  const checks = {
    faviconSvg: linkTags.some(a => relHas(a.rel, 'icon') && a.href === '/favicon.svg'),
    faviconPng: linkTags.some(a => relHas(a.rel, 'icon') && a.href === '/favicon-32.png'),
    appleTouchIcon: linkTags.some(a => relHas(a.rel, 'apple-touch-icon') && a.href === '/splashlens-icon-180.png'),
    manifest: linkTags.some(a => relHas(a.rel, 'manifest') && a.href === '/site.webmanifest'),
    ogImage: metaByProp['og:image'] === canonical,
    ogImageSecureUrl: metaByProp['og:image:secure_url'] === canonical,
    ogImageWidth: metaByProp['og:image:width'] === '1200',
    ogImageHeight: metaByProp['og:image:height'] === '630',
    ogImageType: metaByProp['og:image:type'] === 'image/png',
    ogImageAlt: !!metaByProp['og:image:alt'],
    twitterCard: metaByName['twitter:card'] === 'summary_large_image',
    twitterImage: metaByName['twitter:image'] === canonical,
  };
  const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
  if (missing.length) allMisses.push({ file: path.relative(root, file).replace(/\\/g, '/'), missing });
}
console.log(JSON.stringify({ htmlFiles: files.length, missingPages: allMisses.length, examples: allMisses.slice(0, 20) }, null, 2));
'@ | node -
```

