import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const pages = [
  'closing/winterize-pool-filter.html',
  'pool-parts/identify-pump-impeller-seal-basket.html',
  'pool-parts/identify-salt-cell.html',
  'pool-parts/identify-filter-element.html',
  'verified-equipment-code-lookup.html',
  'works-alongside-pool-brain-skimmer-jobber.html',
  'es/closing/midwest-pool-closing-checklist.html',
  'es/closing/winterize-variable-speed-pump.html',
  'es/closing/winterize-pool-filter.html',
  'es/closing/winterize-pool-heater.html',
  'es/closing/winterize-salt-cell.html',
  'es/pool-parts/identify-pump-impeller-seal-basket.html',
  'es/pool-parts/identify-salt-cell.html',
  'es/pool-parts/identify-filter-element.html',
  'es/verified-equipment-code-lookup.html',
];

test('new ranking pages are indexable, titled, and free of invented ratings or prices', () => {
  const sitemap = read('sitemap.xml');
  for (const page of pages) {
    const html = read(page);
    const url = `https://splashlens.com/${page}`;
    assert.match(html, /<title>[^<]{12,}<\/title>/, page);
    assert.match(html, /<meta name="description" content="[^"]{40,}"/, page);
    assert.ok(html.includes(`rel="canonical" href="${url}"`), page);
    assert.match(html, /<p class="answer">/, page);
    assert.doesNotMatch(html, /aggregateRating|ratingValue|reviewCount/, page);
    const withoutApprovedPass = html.replace(/Closing Pro (?:is a 60-day pass at \$29, paid once, with no auto-renew|es un pase de 60 días a \$29, pago único, sin renovación automática)\./g, '');
    assert.doesNotMatch(withoutApprovedPass, /\$\d/, page);
    assert.ok(sitemap.includes(url), page);
    for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]+)"/g)) {
      const target = match[1];
      if (target === '/') continue;
      const file = target.endsWith('/') ? `${target.slice(1)}index.html` : target.slice(1);
      assert.ok(fs.existsSync(path.join(root, file)), `${page} -> ${target}`);
    }
  }
});

test('answer pages open with a short direct answer and do not invent part numbers', () => {
  for (const page of [
    'pool-parts/identify-pump-impeller-seal-basket.html',
    'pool-parts/identify-salt-cell.html',
    'pool-parts/identify-filter-element.html',
    'verified-equipment-code-lookup.html',
    'works-alongside-pool-brain-skimmer-jobber.html',
  ]) {
    const answer = read(page).match(/<p class="answer">([^<]+)<\/p>/)[1];
    const sentences = answer.split(/(?<=[.!?])\s+/).filter(Boolean);
    assert.ok(sentences.length >= 1 && sentences.length <= 2, `${page}: ${sentences.length} sentences`);
  }
  const lookup = read('verified-equipment-code-lookup.html');
  for (const code of ['LP', 'HP', 'HI', 'FLo']) assert.match(lookup, new RegExp(code));
  assert.match(lookup, /does not guess|withholds a meaning/i);
  const pump = read('pool-parts/identify-pump-impeller-seal-basket.html');
  assert.match(pump, /does not publish one/);
  assert.doesNotMatch(pump, /\b(?:SPX|GLX|R0)\d{3,}\b/);
  assert.match(read('pool-parts/identify-filter-element.html'), /does not assign a part number/);
  assert.match(read('pool-parts/identify-salt-cell.html'), /lists no part number/);
});

test('locale homes reciprocate hreflang and expose the three public schema types', () => {
  const cluster = {
    en: 'https://splashlens.com/',
    'en-ca': 'https://splashlens.com/ca/',
    'fr-ca': 'https://splashlens.com/fr-ca/',
    es: 'https://splashlens.com/es/',
    'x-default': 'https://splashlens.com/',
  };
  for (const file of ['index.html', 'es/index.html', 'fr-ca/index.html', 'ca/index.html']) {
    const html = read(file);
    for (const [lang, href] of Object.entries(cluster)) {
      assert.ok(html.includes(`hreflang="${lang}" href="${href}"`), `${file} ${lang}`);
    }
  }
  for (const file of ['index.html', 'es/index.html', 'fr-ca/index.html']) {
    const html = read(file);
    for (const type of ['Organization', 'SoftwareApplication', 'FAQPage']) {
      assert.match(html, new RegExp(`"@type":"${type}"`), file);
    }
    assert.doesNotMatch(html, /aggregateRating|ratingValue/);
  }
  assert.match(read('robots.txt'), /Sitemap: https:\/\/splashlens\.com\/sitemap-index\.xml/);
  assert.match(read('robots.txt'), /Allow: \//);
});

test('companion page is export-only and does not claim a partnership or competitor price', () => {
  const page = read('works-alongside-pool-brain-skimmer-jobber.html');
  assert.match(page, /Pool Brain/);
  assert.match(page, /Skimmer/);
  assert.match(page, /Jobber/);
  assert.match(page, /copy, share, print, or download/);
  assert.match(page, /not a partnership, endorsement, or certification/);
  assert.match(page, /no claimed direct Pool Brain, Skimmer, or Jobber integration/);
  assert.doesNotMatch(page, /\$\d|official partner|certified by/i);
  assert.match(read('crm-companion.html'), /works-alongside-pool-brain-skimmer-jobber\.html/);
  assert.match(read('splashlens-nav.js'), /works-alongside-pool-brain-skimmer-jobber\.html/);
  assert.match(read('es/index.html'), /es\/closing\/winterize-pool-filter\.html/);
});
