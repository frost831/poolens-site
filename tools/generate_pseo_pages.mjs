import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const APP_ERROR_DB = process.env.SPLASHLENS_APP_ERROR_DB
  ? path.resolve(process.env.SPLASHLENS_APP_ERROR_DB)
  : path.resolve(ROOT, '..', 'poolens', 'js', 'errors.js');
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

function cleanGeneratedText(value) {
  return String(value).replace(/[ \t]+$/gm, '').replace(/\r?\n/g, '\n');
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
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/splashlens-icon-180.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#0284c7">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="image_src" href="https://splashlens.com/splashlens-share-card.png">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://splashlens.com/splashlens-share-card.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="SplashLens field reference for pool technicians">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://splashlens.com/splashlens-share-card.png">
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
  <script src="/splashlens-nav.js" defer></script>
  <script src="/ga4.js" defer></script>
</head>
<body>
${body}
</body>
</html>
`;
}

// Only these mappings were checked against the cited model-specific OEM guide.
const HAYWARD_GUIDE = 'https://hayward.com/media/akeneo_connector/asset_files/H/e/Heat_Pump_Troubleshooting_Guide__TSG_HTPMPa__c95b.pdf';
const REVIEWED_AT = '2026-10-05';
const VERIFIED_HEAT_PUMP = {
  LP: {
    meaning: 'the low-pressure switch is open',
    answer: 'On the Hayward/Summit heat-pump models listed in the linked guide, LP indicates an open low-pressure switch. Check the exact model plate, outdoor temperature, and whether the fan runs. A refrigerant leak or electrical fault needs qualified service. Stop if LP persists; do not open the sealed circuit or order a switch from this code alone.',
    checks: ['Match the model plate to the models covered by the Hayward/Summit guide.', 'Record outdoor temperature and whether the fan starts when the heat pump runs.', 'Record whether LP appears immediately or only after a short run.'],
    stop: 'Stop if LP persists. Refrigerant, switch, fan-electrical, and internal tests belong to a qualified servicer.',
  },
  HP: {
    meaning: 'the high-pressure switch is open',
    answer: 'On the Hayward/Summit heat-pump models listed in the linked guide, HP indicates an open high-pressure switch. Check the exact model plate, filter-pump operation, and whether the filter and bypass allow water flow. Stop if HP returns after these visible checks. A qualified servicer must assess the pressure switch or sealed refrigerant system; do not bypass a safety switch.',
    checks: ['Match the model plate to the models covered by the Hayward/Summit guide.', 'Confirm the filter pump is running and record the filter condition.', 'Record the bypass-valve position and whether water flows through the heat exchanger.'],
    stop: 'Stop if HP repeats. Pressure-switch and refrigerant-system diagnosis requires qualified service; never bypass a safety switch.',
  },
  HI: {
    meaning: 'the high-pressure switch is open',
    answer: 'On the Hayward/Summit heat-pump models listed in the linked guide, HI indicates an open high-pressure switch. Check the exact model plate, filter-pump operation, and whether the filter and bypass allow water flow. Stop if HI returns after these visible checks. A qualified servicer must assess the pressure switch or sealed refrigerant system; do not bypass a safety switch.',
    checks: ['Match the model plate to the models covered by the Hayward/Summit guide.', 'Confirm the filter pump is running and record the filter condition.', 'Record the bypass-valve position and whether water flows through the heat exchanger.'],
    stop: 'Stop if HI repeats. Pressure-switch and refrigerant-system diagnosis requires qualified service; never bypass a safety switch.',
  },
  FLO: {
    meaning: 'the water-pressure switch is open',
    answer: 'On the Hayward/Summit heat-pump models listed in the linked guide, FLo indicates an open water-pressure switch; low or absent flow is common, but an external controller can also display FLo when it is not calling for heat. Check the exact model, filter-pump status, and filter or bypass position. Stop if flow is confirmed but FLo persists; request qualified service.',
    checks: ['Match the model plate to the models covered by the Hayward/Summit guide.', 'Confirm whether the filter pump is running and whether an external controller is calling for heat.', 'Record the filter condition and bypass-valve position without adjusting the pressure switch.'],
    stop: 'Stop if FLo persists with confirmed flow. A qualified servicer must check the switch and controls; do not bypass the switch.',
  },
};

function verifiedCodePage({ brand, categoryName, code, urlPath, related }) {
  const reference = VERIFIED_HEAT_PUMP[code.code];
  const title = `${brand.label} ${categoryName} error ${code.code}: what it means and what to check`;
  const description = `${brand.label} ${categoryName} ${code.code}: guide-scoped meaning, first checks, stop rule, and proof to capture before ordering parts.`;
  const canonical = `${SITE_URL}${urlPath}`;
  const modelLimit = 'This Hayward guide covers only its listed Hayward/Summit models, including HP21004T; other HeatPro revisions need their own current manual.';
  const proof = ['Photo of the complete display and when the code appeared', 'Model and serial plate, including controller revision if visible', 'Filter, pump, bypass position, and pad context'];
  const questions = [
    [`What does ${brand.label} ${code.code} mean on a guide-listed heat pump?`, `${code.code} indicates ${reference.meaning} on the models covered by the linked Hayward/Summit guide.`],
    [`What should I check first for ${code.code}?`, reference.checks.join(' ')],
    [`When should I stop checking ${code.code}?`, reference.stop],
  ];
  const breadcrumb = [
    ['SplashLens', '/'],
    [brand.label, `/brands/${slug(brand.label)}.html`],
    [title, urlPath],
  ];
  const schema = [
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: questions.map(([name, answer]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
    { '@context': 'https://schema.org', '@type': 'HowTo', name: `Checks for ${brand.label} ${code.code}`, step: reference.checks.map((text, index) => ({ '@type': 'HowToStep', position: index + 1, text })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumb.map(([name, url], index) => ({ '@type': 'ListItem', position: index + 1, name, item: `${SITE_URL}${url}` })) },
    { '@context': 'https://schema.org', '@type': 'Organization', name: 'SplashLens', url: SITE_URL },
  ];
  const body = `<header>
  <nav class="crumb" aria-label="Breadcrumb">${breadcrumb.map(([name, url]) => `<a href="${url}">${escapeHtml(name)}</a>`).join(' / ')}</nav>
  <h1>${escapeHtml(title)}</h1>
  <p class="lede">${escapeHtml(modelLimit)}</p>
</header>
<main>
  <section class="panel" aria-labelledby="answer-heading"><h2 id="answer-heading">Short answer</h2><p class="answer">${escapeHtml(reference.answer)}</p></section>
  <section><h2>Checks for ${escapeHtml(brand.label)} ${escapeHtml(code.code)}</h2><ol>${reference.checks.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol></section>
  <section><h2>Proof to capture before ordering parts</h2><ul>${proof.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>
  <section class="panel warning"><h2>Stop rule</h2><p>${escapeHtml(reference.stop)}</p><p>Not a diagnosis. Confirm the exact model and current manufacturer procedure before repair or parts ordering. Do not bypass safeties.</p></section>
  <section><h2>Common questions</h2>${questions.map(([name, answer]) => `<h3>${escapeHtml(name)}</h3><p>${escapeHtml(answer)}</p>`).join('')}</section>
  <section><h2>Related codes</h2><ul>${related.map(entry => `<li><a href="${entry.urlPath}">${escapeHtml(brand.label)} ${escapeHtml(entry.code.code)}</a></li>`).join('')}</ul></section>
  <section><h2>Manufacturer source</h2><p><a href="${HAYWARD_GUIDE}">Hayward/Summit Heat Pump Troubleshooting Guide (PDF)</a>. Last reviewed: <time datetime="${REVIEWED_AT}">${REVIEWED_AT}</time>. Consult the guide's model list before using these checks.</p></section>
  <section><h2>Open this code offline in SplashLens</h2><p>Manual code lookup works after the app has loaded once. Recheck the manufacturer guide for final service decisions.</p><a class="button" href="https://app.splashlens.com/?tab=errors">Open this code offline in SplashLens</a></section>
</main>
<footer>SplashLens is an independent field reference, not affiliated with Hayward.</footer>`;
  return pageShell({ title, description, canonical, body, schema });
}

function codePage({ brandKey, brand, categoryName, code, urlPath }) {
  const unverified = code.unverified === true;
  const title = unverified
    ? `${brand.label} ${categoryName} - Unverified Code Family`
    : `${brand.label} ${code.code} - ${code.name || 'Pool Equipment Code'}`;
  const description = unverified
    ? `${brand.label} ${categoryName} is flagged as unverified. SplashLens withholds code meanings until a current model-specific manufacturer source is confirmed.`
    : `${brand.label} ${code.code} reference for ${categoryName}: likely causes, next checks, and manual-verification reminders for pool service techs.`;
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
          acceptedAnswer: { '@type': 'Answer', text: unverified ? 'SplashLens has not verified this meaning against a current model-specific source and does not guess.' : code.name || `${brand.label} ${code.code} is a pool equipment status or fault code.` },
        },
        {
          '@type': 'Question',
          name: `Should I verify ${code.code} against the manual?`,
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. SplashLens is a field reference. Confirm the code, exact model, and procedure against the current manufacturer manual before repair or parts ordering.' },
        },
      ],
    },
    ...(!unverified ? [{
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `${brand.label} ${code.code} next checks`,
      description: `Reference checks for ${brand.label} ${code.code}.`,
      step: fixes.slice(0, 8).map((text, index) => ({ '@type': 'HowToStep', position: index + 1, text })),
    }] : []),
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
    ${unverified ? '<span class="chip warning">Unverified - meaning withheld</span>' : ''}
  </div>
</header>
<main>
  <section class="panel">
    <h2>What It Means</h2>
    <p>${escapeHtml(unverified ? 'SplashLens has not verified this code family against a current model-specific manufacturer source. The app intentionally withholds a diagnosis instead of guessing.' : code.name || `${brand.label} ${code.code} is a pool equipment code in the SplashLens reference database.`)}</p>
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
  if (process.argv.includes('--code-answers-only')) {
    const brand = db.hayward;
    const categoryName = 'HeatPro Heat Pump';
    const category = brand.categories[categoryName];
    if (!category) throw new Error('Hayward HeatPro Heat Pump category missing from app corpus');
    if (!category.models?.includes('HP21004T')) throw new Error('Manual-listed HP21004T model missing from app corpus');
    const entries = Object.keys(VERIFIED_HEAT_PUMP).map(value => {
      const code = category.codes.find(item => item.code === value && item.unverified !== true);
      if (!code) throw new Error(`Verified code ${value} missing or unverified in app corpus`);
      const fileSlug = slug(`${categoryName}-${code.code}-${code.name || 'code'}`);
      return { code, urlPath: `/error-codes/hayward/${fileSlug}.html` };
    });
    for (const entry of entries) {
      const output = path.join(ROOT, entry.urlPath.slice(1));
      if (!fs.existsSync(output)) throw new Error(`Existing code page missing: ${output}`);
      fs.writeFileSync(output, cleanGeneratedText(verifiedCodePage({
        brand, categoryName, code: entry.code, urlPath: entry.urlPath,
        related: entries.filter(other => other.code.code !== entry.code.code),
      })));
    }
    console.log(`Updated ${entries.length} source-reviewed error-code pages only.`);
    return;
  }
  const preservedBrandFiles = new Map(
    ['index.html', 'robots-expanded-field-guide.html']
      .map(file => [file, path.join(OUT_BRAND_DIR, file)])
      .filter(([, filePath]) => fs.existsSync(filePath))
      .map(([file, filePath]) => [file, fs.readFileSync(filePath)])
  );
  cleanDir(OUT_ERROR_DIR);
  cleanDir(OUT_BRAND_DIR);
  for (const [file, contents] of preservedBrandFiles) {
    fs.writeFileSync(path.join(OUT_BRAND_DIR, file), contents);
  }

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
        const related = (category.codes || [])
          .filter(item => item.code !== code.code && VERIFIED_HEAT_PUMP[item.code])
          .map(item => ({ code: item, urlPath: `/error-codes/${brandSlug}/${slug(`${categoryName}-${item.code}-${item.name || 'code'}`)}.html` }));
        const html = brandKey === 'hayward' && categoryName === 'HeatPro Heat Pump' && category.models?.includes('HP21004T') && code.unverified !== true && VERIFIED_HEAT_PUMP[code.code]
          ? verifiedCodePage({ brand, categoryName, code, urlPath, related })
          : codePage({ brandKey, brand, categoryName, code, urlPath });
        fs.writeFileSync(path.join(brandDir, `${fileSlug}.html`), cleanGeneratedText(html));
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
    fs.writeFileSync(path.join(OUT_BRAND_DIR, `${brandSlug}.html`), cleanGeneratedText(brandPage({ brandKey, brand, entries, urlPath })));
    urls.push(urlPath);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.sort().map(url => `  <url><loc>${SITE_URL}${url}</loc><lastmod>${GENERATED_AT}</lastmod></url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(OUT_SITEMAP, cleanGeneratedText(sitemap));

  console.log(`Generated ${entryCount} error-code pages, ${brandEntries.size} brand pages, and ${path.basename(OUT_SITEMAP)}.`);
}

main();
