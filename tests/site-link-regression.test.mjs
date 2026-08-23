import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

const repairedPaths = [
  'error-codes/aiper/aiper-robot-cleaners-ai-mapping-miss-ai-vision-or-mapping-misses-debris-coverage.html',
  'error-codes/aiper/aiper-robot-cleaners-app-hydrocomm-offline-aiper-app-hydrocomm-or-underwater-control-not-r.html',
  'error-codes/aiper/aiper-robot-cleaners-demo-display-unit-check-dealer-demo-unit-intake-check.html',
  'error-codes/connected-pool-network/automation-smart-backyard-ccei-vigi-alert-vigipool-remote-alert-or-chemistry-mismatch.html',
  'error-codes/hot-tubs-spas/spa-heat-swim-spa-covers-plunge-allin-proof-connected-cold-plunge-cooling-flow-or-app-aler.html',
  'error-codes/hot-tubs-spas/spa-packs-controllers-spa-gfci-immediate-breaker-trips-immediately-on-reset.html',
  'error-codes/pool-safety-monitoring/pool-cameras-smart-alarms-safety-cam-offline-safety-camera-alert-path-offline.html',
];

const generatedHrefSourceFiles = [
  'pool-automation/index.html',
  'pool-hardware/index.html',
  'pool-heaters/index.html',
  'pool-lighting/index.html',
  'pool-parts/index.html',
  'pool-pumps/index.html',
  'pool-robots/index.html',
  'salt-cells/index.html',
  'source-pages/index.html',
];

test('every previously broken generated page exists', () => {
  for (const relativePath of repairedPaths) {
    const absolutePath = path.join(root, relativePath);
    assert.equal(fs.existsSync(absolutePath), true, relativePath);
    assert.match(fs.readFileSync(absolutePath, 'utf8'), /<h1>/, relativePath);
  }
});

test('all repaired pool automation href targets exist', () => {
  const hub = fs.readFileSync(path.join(root, 'pool-automation', 'index.html'), 'utf8');
  for (const relativePath of repairedPaths.slice(3)) {
    assert.match(hub, new RegExp(relativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('key generated error-code hrefs resolve to deployed files', () => {
  const missing = [];
  for (const relativePath of generatedHrefSourceFiles) {
    const sourceFile = path.join(root, relativePath);
    if (!fs.existsSync(sourceFile)) continue;
    const html = fs.readFileSync(sourceFile, 'utf8');
    if (!html.includes('/error-codes/')) continue;
    for (const match of html.matchAll(/href=["'](\/error-codes\/[^"'?#]+\.html)["']/g)) {
      const target = path.join(root, ...match[1].slice(1).split('/'));
      if (!fs.existsSync(target)) missing.push(`${relativePath} -> ${match[1]}`);
    }
  }
  assert.deepEqual(missing, []);
});

test('SendGrid alert payloads expose product routing metadata', () => {
  for (const relativePath of ['functions/api/subscribe.js', 'functions/api/event.js']) {
    const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
    assert.match(source, /product:\s*'splashlens'/);
    assert.match(source, /template_id:/);
    assert.match(source, /correlation_id:/);
  }
});

test('internal archive and outreach docs stay behind the docs blocker', () => {
  const source = fs.readFileSync(path.join(root, 'functions', 'docs', '[[path]].js'), 'utf8');
  assert.match(source, /\/docs\/archive\//);
  assert.match(source, /\/docs\/outreach\//);
});

test('closing season launch page is crawlable, linked, and claim-safe', () => {
  const page = fs.readFileSync(path.join(root, 'closing-season.html'), 'utf8');
  const nav = fs.readFileSync(path.join(root, 'splashlens-nav.js'), 'utf8');
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const ai = fs.readFileSync(path.join(root, 'ai.txt'), 'utf8');

  assert.match(page, /Closing Season Mode/);
  assert.match(page, /Document the close before the freeze/);
  assert.match(page, /not insurance and does not guarantee coverage/);
  assert.match(page, /exact equipment manual, product label, local code, company policy, and qualified judgment/);
  assert.match(nav, /\/closing-season\.html/);
  assert.match(sitemap, /https:\/\/splashlens\.com\/closing-season\.html/);
  assert.match(ai, /SplashLens Closing Season Mode/);
});

test('spa and swim spa lane is crawlable, promoted, and safely framed', () => {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const ai = fs.readFileSync(path.join(root, 'ai.txt'), 'utf8');
  const nav = fs.readFileSync(path.join(root, 'splashlens-nav.js'), 'utf8');
  const brief = fs.readFileSync(path.join(root, 'docs', 'outreach', 'spa-swim-spa-push-brief-2026-08-23.md'), 'utf8');

  const requiredPages = [
    'spa-hot-tub-troubleshooting-app.html',
    'spa-swim-spa-parts-identification-app.html',
    'source-pages/balboa-spa-pack-troubleshooting.html',
    'source-pages/gecko-spa-pack-troubleshooting.html',
    'source-pages/waterway-neo-spa-pack-troubleshooting.html',
    'source-pages/master-spas-h2x-swim-spa-troubleshooting.html',
    'source-pages/swim-spa-current-pump-troubleshooting.html',
    'source-pages/spa-gfci-breaker-troubleshooting.html',
  ];

  for (const relativePath of requiredPages) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), true, relativePath);
    assert.match(sitemap, new RegExp(`https://splashlens\\.com/${relativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  }

  assert.match(home, /Hot tub and swim-spa stops/);
  assert.match(home, /Pool company that also touches spas/);
  assert.match(home, /Does SplashLens have hot tub, spa, and swim spa support/);
  assert.match(home, /It is a field reference, not a replacement for current manuals or qualified electrical\/heater service/);
  assert.match(nav, /Spa \/ Swim Spa/);
  assert.match(ai, /Spa, hot tub, and swim spa troubleshooting app/);
  assert.match(brief, /Try the free spa lane with one real hot tub or swim-spa issue/);
  assert.match(brief, /Electrical, heater, GFCI, pack, board, and line-voltage work still requires qualified service/);
});

test('remote diagnostics article uses the responsive official Pentair newsroom', () => {
  const article = fs.readFileSync(
    path.join(root, 'blog', 'pool-service-remote-diagnostics-2026.html'),
    'utf8',
  );
  assert.match(
    article,
    /https:\/\/www\.pentair\.com\/en-us\/about-pentair\/newsroom\/news-releases\.html/,
  );
  assert.doesNotMatch(article, /investors\.pentair\.com\/news-releases\/news-release-details/);
});
