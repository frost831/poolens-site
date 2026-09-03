import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const SITE = 'https://splashlens.com';
const TODAY = '2026-06-22';

const hubs = [
  {
    slug: 'pool-service-app',
    title: 'Pool Service App for Faster Field Work',
    description: 'SplashLens is a free pool service app for techs who need PartSnap pool parts ID, equipment-code lookup, dosing math, service notes, checklists, and route tools in the field.',
    h1: 'A pool service app built for the stop, not the office.',
    terms: ['pool service app', 'pool maintenance app', 'pool route app', 'pool service software', 'pool tech software'],
  },
  {
    slug: 'pool-tech-app',
    title: 'Pool Tech App for Field Troubleshooting',
    description: 'A pool tech app for error-code lookup, PartSnap part identification assistance, dosing calculators, voice-friendly notes, checklists, and offline manual references.',
    h1: 'Give pool techs time back at the equipment pad.',
    terms: ['pool tech app', 'pool technician app', 'pool field app', 'pool service technician tools', 'pool tech reference'],
  },
  {
    slug: 'pool-parts-identification',
    title: 'Pool Parts Identification with PartSnap',
    description: 'PartSnap helps pool service techs turn a mystery part photo into possible manufacturer clues, model proof prompts, search terms, and cleaner escalation notes.',
    h1: 'Pool parts identification without pretending certainty.',
    terms: ['pool parts identification', 'pool part finder', 'pool pump part identification', 'pool equipment part lookup', 'PartSnap'],
  },
  {
    slug: 'pool-hardware-reference',
    title: 'Pool Hardware Reference for Service Techs',
    description: 'Pool hardware reference for pumps, filters, valves, heaters, heat pumps, salt systems, automation, lights, robots, covers, feeders, and water features.',
    h1: 'Pool hardware lookup for the parts that slow routes down.',
    terms: ['pool hardware', 'pool equipment hardware', 'pool pump parts', 'pool filter parts', 'pool valve parts'],
  },
  {
    slug: 'pool-equipment-troubleshooting',
    title: 'Pool Equipment Troubleshooting Reference',
    description: 'SplashLens covers pool equipment troubleshooting references for major brands, current codes, likely causes, next checks, and verification reminders.',
    h1: 'Pool equipment troubleshooting that starts with proof.',
    terms: ['pool equipment troubleshooting', 'pool error codes', 'pool equipment error codes', 'pool equipment repair reference', 'pool service troubleshooting'],
  },
  {
    slug: 'pool-pump-heater-salt-cell-troubleshooting',
    title: 'Pool Pump, Heater, Heat Pump, and Salt Cell Troubleshooting',
    description: 'Reference hub for pool pumps, heaters, heat pumps, salt cells, chlorinators, flow errors, low-salt warnings, ignition faults, pressure switch issues, and pump-pad symptoms.',
    h1: 'Pump, heater, heat pump, and salt-cell reference in one place.',
    terms: ['pool pump troubleshooting', 'pool heater codes', 'pool heat pump troubleshooting', 'salt cell troubleshooting', 'chlorinator error codes'],
  },
  {
    slug: 'pool-automation-lighting-robot-troubleshooting',
    title: 'Pool Automation, Lighting, and Robot Troubleshooting',
    description: 'Reference hub for pool automation, controllers, lighting, GFCI trips, robot cleaners, robotic pool cleaner alerts, smart pool hardware, and app-connected equipment symptoms.',
    h1: 'Automation, lighting, and robot problems need cleaner context.',
    terms: ['pool automation troubleshooting', 'pool lighting troubleshooting', 'pool robot troubleshooting', 'robotic pool cleaner codes', 'smart pool equipment'],
  },
  {
    slug: 'pool-tech-training-field-reference',
    title: 'Pool Tech Training Field Reference',
    description: 'SplashLens supports pool tech training with practical field-reference workflows, route-ready checklists, verification habits, dosing math, service notes, and partner-ready training ideas.',
    h1: 'A training-friendly reference layer for new and working pool techs.',
    terms: ['pool tech training', 'pool service training', 'CPO field reference', 'pool operator training tools', 'pool route training'],
  },
];

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function page(hub) {
  const url = `${SITE}/${hub.slug}.html`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: hub.title,
      description: hub.description,
      url,
      dateModified: TODAY,
      isPartOf: { '@type': 'WebSite', name: 'SplashLens', url: SITE },
      about: hub.terms.map(name => ({ '@type': 'Thing', name })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `What is SplashLens for ${hub.terms[0]}?`,
          acceptedAnswer: { '@type': 'Answer', text: 'SplashLens is a free-to-start field reference app for pool service professionals. Manual lookup, notes, dosing, and guides can start without an account. AI scanner workflows require a free field profile so usage and field misses are tied to a real contact.' },
        },
        {
          '@type': 'Question',
          name: 'Does SplashLens identify pool parts automatically?',
          acceptedAnswer: { '@type': 'Answer', text: 'PartSnap provides possible pool-part matches, search terms, and missing-proof prompts from photos. It is reference assistance only; technicians should verify model, markings, dimensions, diagrams, and manufacturer documentation before ordering.' },
        },
        {
          '@type': 'Question',
          name: 'Does SplashLens replace pool service CRMs?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. SplashLens is the field reference layer for the stop. Existing CRMs can still run scheduling, billing, and customer operations.' },
        },
      ],
    },
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(hub.title)} - SplashLens</title>
<meta name="description" content="${esc(hub.description)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="keywords" content="${esc(hub.terms.join(', '))}">
<link rel="canonical" href="${url}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="${esc(hub.title)} - SplashLens">
<meta property="og:description" content="${esc(hub.description)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">
<script type="application/ld+json">${json(schema)}</script>
<style>
*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;background:#f8fafc;color:#0f172a;line-height:1.6}a{color:#0369a1}.nav{position:sticky;top:0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid #dbeafe}.nav-inner,main,footer{max-width:1080px;margin:auto;padding:0 20px}.nav-inner{height:60px;display:flex;align-items:center;justify-content:space-between}.brand{text-decoration:none;font-weight:950;color:#0f172a}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 16px;background:#0284c7;color:#fff;text-decoration:none;border-radius:7px;font-weight:900}.hero{background:#0f172a;color:#fff;padding:70px 20px 46px}.hero-inner{max-width:1080px;margin:auto}.eyebrow{color:#7dd3fc;font-size:12px;text-transform:uppercase;letter-spacing:.13em;font-weight:950}.hero h1{font-size:clamp(2.35rem,5vw,4.6rem);line-height:.98;margin:12px 0 16px;letter-spacing:0}.hero p{font-size:1.08rem;max-width:760px;color:#cbd5e1}.chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.chip{background:#e0f2fe;color:#075985;border-radius:999px;padding:5px 10px;font-size:12px;font-weight:900}.section{padding:42px 0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.card{background:#fff;border:1px solid #dbeafe;border-radius:8px;padding:18px;box-shadow:0 8px 24px rgba(15,23,42,.05)}h2{font-size:clamp(1.55rem,3vw,2.4rem);line-height:1.05;margin:0 0 12px}.muted{color:#475569}.notice{background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;color:#92400e}.links{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.links a{background:#fff;border:1px solid #dbeafe;border-radius:8px;padding:12px;text-decoration:none;font-weight:800}.cta{background:#0369a1;color:#fff;border-radius:10px;padding:24px;display:flex;justify-content:space-between;gap:18px;align-items:center}.cta p{color:#dff6ff}.cta .btn{background:#fff;color:#0369a1}footer{padding-bottom:34px;color:#64748b;font-size:.86rem}@media(max-width:760px){.grid,.links,.cta{grid-template-columns:1fr;display:grid}.hero{padding-top:46px}.nav-inner{gap:10px}.nav-inner .btn{display:none}}
</style>
</head>
<body>
<nav class="nav"><div class="nav-inner"><a class="brand" href="/">SplashLens</a><a class="btn" href="https://app.splashlens.com">Open Free App</a></div></nav>
<header class="hero"><div class="hero-inner"><div class="eyebrow">Pool tech search hub</div><h1>${esc(hub.h1)}</h1><p>${esc(hub.description)}</p><div class="chips">${hub.terms.map(term => `<span class="chip">${esc(term)}</span>`).join('')}</div></div></header>
<main>
<section class="section"><h2>Why this exists</h2><div class="grid">
<article class="card"><h3>Speed at the stop</h3><p class="muted">Technicians need clean next checks while the customer is waiting, not a ten-tab search session.</p></article>
<article class="card"><h3>Proof before parts</h3><p class="muted">PartSnap pushes model plates, visible markings, dimensions, and confidence language before ordering.</p></article>
<article class="card"><h3>Training-friendly</h3><p class="muted">The app can support new-tech training, instructor feedback, and repeatable field habits without claiming to certify repairs.</p></article>
</div></section>
<section class="section"><h2>Covered equipment and workflows</h2><p class="muted">SplashLens is being built around pumps, filters, heaters, heat pumps, salt systems, automation, lights, robots, valves, covers, feeders, water features, test-strip triage, dosing math, service notes, and route-ready checklists.</p><div class="links">
<a href="/partsnap.html">PartSnap pool parts ID</a>
<a href="/brands/pentair.html">Pentair code reference</a>
<a href="/brands/hayward.html">Hayward code reference</a>
<a href="/brands/jandy-zodiac.html">Jandy / Zodiac code reference</a>
<a href="/brands/maytronics-dolphin.html">Maytronics / Dolphin robot reference</a>
<a href="/pool-automation/">Automation reference</a>
<a href="/pool-robots/">Robot reference</a>
<a href="/salt-cells/">Salt cell reference</a>
</div></section>
<section class="section"><div class="notice"><strong>Reference only.</strong> SplashLens is independent and should be used as a field starting point. Verify exact model, code, safety procedure, and parts fitment against current manufacturer documentation and qualified judgment.</div></section>
<section class="section"><div class="cta"><div><h2>Open SplashLens in the field.</h2><p>Manual lookup, dosing, checklists, service notes, and route tools stay free. Online scanner workflows require internet.</p></div><a class="btn" href="https://app.splashlens.com">Open Free App</a></div></section>
</main>
<footer>Copyright 2026 SplashLens. Independent field reference for pool service professionals.</footer>
</body>
</html>
`;
}

for (const hub of hubs) {
  fs.writeFileSync(path.join(ROOT, `${hub.slug}.html`), page(hub));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${hubs.map(hub => `  <url><loc>${SITE}/${hub.slug}.html</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>0.92</priority></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'seo-hub-sitemap.xml'), sitemap);

console.log(`Generated ${hubs.length} SEO hub pages and seo-hub-sitemap.xml`);
