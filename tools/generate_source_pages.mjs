import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = 'source-pages';
const today = '2026-07-07';

const pages = [
  {
    slug: 'balboa-spa-pack-troubleshooting',
    title: 'Balboa Spa Pack Troubleshooting Proof Checklist',
    description: 'Field-safe Balboa spa pack proof checklist for pool and spa techs using SplashLens.',
    h1: 'Balboa spa pack troubleshooting checklist',
    lane: 'Spa / Hot Tub',
    summary: 'Use this as a field reference when a Balboa spa pack, topside, heater tube, or flow-related code needs a cleaner proof packet before a tech calls a board, sensor, heater, or pump.',
    proof: ['pack model and serial label', 'topside code or display photo', 'water level and filter condition', 'circ or jet pump movement', 'heater tube and sensor context', 'GFCI trip timing if present'],
    checks: ['Confirm the current manual for the pack family.', 'Verify water movement before suspecting a sensor.', 'Treat board and line-voltage work as qualified-tech territory.'],
    keywords: 'Balboa spa pack troubleshooting, spa pack flow code, hot tub topside error code',
  },
  {
    slug: 'gecko-spa-pack-troubleshooting',
    title: 'Gecko Spa Pack Troubleshooting Proof Checklist',
    description: 'Gecko spa pack and topside verification checklist for hot tub service techs.',
    h1: 'Gecko spa pack troubleshooting checklist',
    lane: 'Spa / Hot Tub',
    summary: 'Gecko packs and topsides need proof from the pack label, display, water movement, filters, and electrical boundary before a replacement path is trusted.',
    proof: ['pack label', 'topside display code', 'filter condition', 'circ pump or jet pump proof', 'heater/sensor area photo', 'breaker or GFCI behavior'],
    checks: ['Separate low-flow symptoms from sensor/board assumptions.', 'Check service mode and current owner settings.', 'Escalate internal pack testing to a qualified tech.'],
    keywords: 'Gecko spa pack troubleshooting, Gecko topside error code, hot tub flow fault',
  },
  {
    slug: 'waterway-neo-spa-pack-troubleshooting',
    title: 'Waterway NEO Spa Pack Troubleshooting Proof Checklist',
    description: 'Waterway NEO spa pack field checklist for flow, topside, and heater proof.',
    h1: 'Waterway NEO spa pack troubleshooting checklist',
    lane: 'Spa / Hot Tub',
    summary: 'Waterway NEO systems should be handled with model-specific confirmation, visible proof, and a senior/vendor packet when the stop crosses electrical or board work.',
    proof: ['NEO pack label', 'topside code screen', 'filter and water level', 'pump run state', 'heater tube/sensor context', 'visible wiring boundary photo for senior review'],
    checks: ['Confirm pack generation before ordering topsides or boards.', 'Rule out low-flow and filter restriction first.', 'Do not treat a single code as a final diagnosis.'],
    keywords: 'Waterway NEO troubleshooting, Waterway spa pack error, hot tub NEO flow code',
  },
  {
    slug: 'raypak-pool-heater-troubleshooting',
    title: 'Raypak Pool Heater Troubleshooting Proof Checklist',
    description: 'Raypak heater proof checklist for cautious field troubleshooting and escalation.',
    h1: 'Raypak pool heater troubleshooting checklist',
    lane: 'Heaters',
    summary: 'Raypak heater calls can cross gas, electrical, water flow, pressure, ignition, and sensor issues. SplashLens keeps this as a reference workflow, not a repair guarantee.',
    proof: ['heater model and serial', 'display fault or status', 'filter PSI and flow evidence', 'gas/electrical boundary notes', 'water chemistry context', 'prior lockout or reset history'],
    checks: ['Confirm flow before chasing sensor parts.', 'Use the current Raypak manual and qualified gas/electrical procedure.', 'Package unclear faults for senior tech or vendor review.'],
    keywords: 'Raypak heater troubleshooting, Raypak pool heater error codes, pool heater proof checklist',
  },
  {
    slug: 'cmp-del-ozone-aop-troubleshooting',
    title: 'CMP DEL Ozone and AOP Troubleshooting Proof Checklist',
    description: 'Ozone and AOP proof checklist for CMP DEL-style pool sanitation equipment.',
    h1: 'CMP DEL ozone and AOP troubleshooting checklist',
    lane: 'AOP / Ozone / UV',
    summary: 'Ozone and AOP systems need source proof around module status, lamp age, air draw, injector condition, check valves, and water-intrusion risk.',
    proof: ['module label', 'status light or app alert', 'lamp or cartridge age', 'injector air draw', 'check-valve and tubing condition', 'water intrusion evidence'],
    checks: ['Stop if water intrusion reaches electronics.', 'Verify flow and injector behavior before replacing modules.', 'Use manufacturer service instructions for energized tests.'],
    keywords: 'DEL ozone troubleshooting, CMP AOP troubleshooting, pool ozone system checklist',
  },
  {
    slug: 'clear-comfort-aop-troubleshooting',
    title: 'Clear Comfort AOP Troubleshooting Proof Checklist',
    description: 'Clear Comfort AOP field verification checklist for pool service techs.',
    h1: 'Clear Comfort AOP troubleshooting checklist',
    lane: 'AOP / Ozone / UV',
    summary: 'For AOP systems, the useful field packet is proof-first: system label, status, flow, maintenance age, chemistry context, and manufacturer-directed service steps.',
    proof: ['system label', 'controller/status screen', 'flow proof', 'maintenance/lamp/cartridge age', 'manual water test context', 'plumbing and injection point photo'],
    checks: ['Verify water balance and flow before hardware assumptions.', 'Avoid treating AOP as the only sanitizer proof.', 'Escalate internal equipment testing when required.'],
    keywords: 'Clear Comfort AOP troubleshooting, AOP pool system service, pool hydroxyl system checklist',
  },
  {
    slug: 'hayward-cat-controller-troubleshooting',
    title: 'Hayward CAT Controller Troubleshooting Proof Checklist',
    description: 'Hayward CAT chemical controller proof checklist for ORP, pH, probes, and feed systems.',
    h1: 'Hayward CAT controller troubleshooting checklist',
    lane: 'Chemical Controllers',
    summary: 'Chemical controllers are high callback risk when the screen reading, manual test, probe age, calibration state, and feed equipment do not agree.',
    proof: ['controller screen', 'manual water test', 'probe age and calibration date', 'flow cell condition', 'feed pump/tank/tablet level', 'injection fitting and tube condition'],
    checks: ['Do not dose from a controller reading that disagrees with manual testing.', 'Confirm calibration standards and probe age.', 'Verify flow through the sample cell.'],
    keywords: 'Hayward CAT controller troubleshooting, pool ORP controller, chemical controller pH ORP checklist',
  },
  {
    slug: 'intellichem-controller-troubleshooting',
    title: 'IntelliChem Controller Troubleshooting Proof Checklist',
    description: 'Pentair IntelliChem verification checklist for pH, ORP, flow, and feeder proof.',
    h1: 'IntelliChem troubleshooting checklist',
    lane: 'Chemical Controllers',
    summary: 'IntelliChem calls need a proof packet that compares manual testing, probe behavior, calibration, flow cell condition, feeder status, and automation communication.',
    proof: ['IntelliChem screen', 'manual water test', 'probe age and calibration', 'flow cell photo', 'acid or chlorine feed status', 'automation communication status'],
    checks: ['Verify manual test before trusting automated readings.', 'Confirm feed pump and tank status.', 'Use current Pentair documentation for service procedures.'],
    keywords: 'IntelliChem troubleshooting, Pentair chemical controller, pool pH ORP controller checklist',
  },
  {
    slug: 'rola-chem-controller-troubleshooting',
    title: 'Rola-Chem Controller Troubleshooting Proof Checklist',
    description: 'Rola-Chem chemical feed and controller proof checklist for pool service techs.',
    h1: 'Rola-Chem controller troubleshooting checklist',
    lane: 'Chemical Controllers',
    summary: 'Rola-Chem work often depends on feed proof, tubing condition, calibration, controller status, manual testing, and pump/tank visibility.',
    proof: ['controller face/status', 'manual water test', 'feed pump model', 'tube and roller condition', 'tank level and chemical type', 'injection fitting status'],
    checks: ['Do not assume a controller fault when the feed tube or tank is the issue.', 'Verify manual test and calibration first.', 'Watch for chemical compatibility and safety boundaries.'],
    keywords: 'Rola-Chem troubleshooting, pool chemical feeder checklist, pool pH feeder troubleshooting',
  },
  {
    slug: 'chemtrol-controller-troubleshooting',
    title: 'CHEMTROL Controller Troubleshooting Proof Checklist',
    description: 'CHEMTROL controller and chemical automation proof checklist for commercial pool service.',
    h1: 'CHEMTROL controller troubleshooting checklist',
    lane: 'Chemical Controllers',
    summary: 'Commercial controllers need careful proof: manual test, controller reading, probe age, sample flow, feed equipment, and local code/operator requirements.',
    proof: ['controller model and screen', 'manual water test', 'probe age/calibration', 'sample flow proof', 'feed pump/tank status', 'operator notes and code requirements'],
    checks: ['Document manual readings before changes.', 'Treat commercial dosing and code compliance as qualified-operator work.', 'Escalate uncertain probe/controller issues.'],
    keywords: 'CHEMTROL troubleshooting, commercial pool chemical controller, ORP pH proof checklist',
  },
];

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function pageHtml(page) {
  const url = `https://splashlens.com/source-pages/${page.slug}.html`;
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Does SplashLens diagnose ${page.h1.replace(' checklist', '')}?`,
        acceptedAnswer: { '@type': 'Answer', text: 'No. SplashLens is a field reference and proof workflow. Techs still verify with the current manual, model data, and qualified service judgment.' },
      },
      {
        '@type': 'Question',
        name: 'What should a tech capture before ordering parts?',
        acceptedAnswer: { '@type': 'Answer', text: page.proof.join(', ') },
      },
    ],
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="keywords" content="${esc(page.keywords)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(faq)}</script>
<style>
body{margin:0;background:#f8fafc;color:#0f172a;font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.55}
main{width:min(920px,calc(100% - 32px));margin:0 auto;padding:34px 0 54px}
a{color:#0369a1;font-weight:800}header{margin-bottom:18px}.kicker{color:#0f766e;font-size:12px;font-weight:950;letter-spacing:.1em;text-transform:uppercase}
h1{font-size:clamp(32px,6vw,54px);line-height:1;margin:8px 0 14px;letter-spacing:0}.summary{font-size:18px;color:#475569;max-width:760px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:22px}.card{background:white;border:1px solid #d8e3ea;border-radius:8px;padding:18px;box-shadow:0 1px 2px rgba(15,23,42,.06)}
h2{font-size:18px;margin:0 0 10px;color:#075985}.chips{display:flex;flex-wrap:wrap;gap:8px}.chip{display:inline-flex;gap:7px;align-items:center;background:#ecfeff;border:1px solid #99f6e4;border-radius:999px;padding:7px 10px;color:#0f766e;font-size:13px;font-weight:900}
ol{padding-left:22px}li{margin:7px 0}.note{background:#fff7ed;border:1px solid #fed7aa;color:#92400e;border-radius:8px;padding:14px;margin-top:14px;font-weight:750}
.cta{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}.button{display:inline-flex;text-decoration:none;background:#0284c7;color:white;border-radius:999px;padding:12px 18px}.button.secondary{background:white;color:#0369a1;border:1px solid #bae6fd}
footer{color:#64748b;font-size:13px;margin-top:28px}@media(max-width:720px){.grid{grid-template-columns:1fr}main{width:min(100% - 22px,920px)}}
</style>
</head>
<body>
<main>
<header>
<div class="kicker">${esc(page.lane)} source checklist</div>
<h1>${esc(page.h1)}</h1>
<p class="summary">${esc(page.summary)}</p>
</header>
<section class="grid">
<div class="card">
<h2>Proof to capture</h2>
<div class="chips">${page.proof.map((item, index) => `<span class="chip">${index + 1}. ${esc(item)}</span>`).join('')}</div>
</div>
<div class="card">
<h2>Field checks</h2>
<ol>${page.checks.map((item) => `<li>${esc(item)}</li>`).join('')}</ol>
<div class="note">Reference only. Verify current manuals, model numbers, dimensions, and qualified service boundaries before ordering parts or making repair decisions.</div>
</div>
</section>
<div class="cta">
<a class="button" href="https://app.splashlens.com?source=source-page&utm_source=source-page&utm_medium=seo&utm_campaign=${esc(page.slug)}">Open SplashLens free</a>
<a class="button secondary" href="/source-pages/">More source checklists</a>
<a class="button secondary" href="/partsnap.html">PartSnap overview</a>
</div>
<footer>SplashLens is independent and is not an official manufacturer service manual, warranty tool, diagnosis guarantee, or endorsement claim.</footer>
</main>
</body>
</html>
`;
}

function indexHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SplashLens Source Checklists for Pool and Spa Techs</title>
<meta name="description" content="Conservative source and proof checklists for pool and spa equipment troubleshooting in SplashLens.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="https://splashlens.com/source-pages/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>body{margin:0;background:#f8fafc;color:#0f172a;font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.5}main{width:min(960px,calc(100% - 32px));margin:0 auto;padding:38px 0 60px}h1{font-size:clamp(34px,6vw,58px);line-height:1;margin:0 0 10px}.sub{color:#475569;font-size:18px;max-width:760px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px;margin-top:24px}.card{background:white;border:1px solid #d8e3ea;border-radius:8px;padding:16px;text-decoration:none;color:#0f172a;box-shadow:0 1px 2px rgba(15,23,42,.06)}.card b{display:block;color:#0369a1;margin-bottom:5px}.card span{color:#64748b;font-size:14px}</style>
</head>
<body>
<main>
<h1>Source checklists for pool and spa field work</h1>
<p class="sub">These pages are built for fast verification: what to photograph, what to check, and when to hold before ordering parts. SplashLens is a field reference, not a diagnosis replacement.</p>
<div class="grid">${pages.map((page) => `<a class="card" href="/source-pages/${page.slug}.html"><b>${esc(page.h1)}</b><span>${esc(page.lane)} - ${esc(page.description)}</span></a>`).join('')}</div>
</main>
</body>
</html>`;
}

function sourceSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://splashlens.com/source-pages/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.88</priority></url>
${pages.map((page) => `  <url><loc>https://splashlens.com/source-pages/${page.slug}.html</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.84</priority></url>`).join('\n')}
</urlset>
`;
}

function patchMainSitemap() {
  const path = 'sitemap.xml';
  let xml = readFileSync(path, 'utf8');
  const urls = [
    'https://splashlens.com/source-pages/',
    ...pages.map((page) => `https://splashlens.com/source-pages/${page.slug}.html`),
  ];
  for (const url of urls) {
    if (xml.includes(`<loc>${url}</loc>`)) continue;
    xml = xml.replace('</urlset>', ` <url><loc>${url}</loc><changefreq>weekly</changefreq><priority>0.84</priority><lastmod>${today}</lastmod></url>\n</urlset>`);
  }
  writeFileSync(path, xml);
}

mkdirSync(outDir, { recursive: true });
for (const page of pages) {
  writeFileSync(join(outDir, `${page.slug}.html`), pageHtml(page));
}
writeFileSync(join(outDir, 'index.html'), indexHtml());
writeFileSync('source-pages-sitemap.xml', sourceSitemap());
patchMainSitemap();

console.log(`Generated ${pages.length + 1} source pages and source-pages-sitemap.xml`);
