import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pages = [
  'chemical-supplier-comparison', 'intelliflo-e11-priming',
  'pentair-mastertemp-e05', 'phosphate-controversy-pools',
  'pool-app-for-homeowners', 'pool-equipment-annual-service',
  'pool-industry-labor-shortage', 'pool-route-software-comparison',
  'pool-service-industry-2026', 'pool-service-insurance-guide',
  'pool-service-scheduling-software', 'pool-service-software-skimmer',
  'pool-tech-apps-compared', 'pool-tech-certifications',
  'pool-tech-tools-you-need', 'pool-tech-upselling-repairs',
  'poolens-app-update-log', 'poolens-complete-feature-guide',
  'skimmer-raised-74-million', 'starting-pool-service-business',
];

test('corrected indexed pages do not reinstate obsolete price or offline guarantees', () => {
  for (const page of pages) {
    const html = readFileSync(resolve(root, 'blog', `${page}.html`), 'utf8');
    assert.doesNotMatch(html, /free, offline, no subscription|fully offline|Skimmer starts at \$99|Pool Brain starts at \$69|all data is stored on-device and syncs/i, page);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      assert.doesNotThrow(() => JSON.parse(match[1]), `${page} JSON-LD`);
    }
  }
});

test('updated app workflow links use supported tabs', () => {
  const allowed = new Set(['counter', 'errors', 'dosing', 'report', 'guide', 'pools', 'scan', 'volume', 'sand', 'route']);
  for (const page of pages) {
    const html = readFileSync(resolve(root, 'blog', `${page}.html`), 'utf8');
    for (const match of html.matchAll(/href="(https:\/\/app\.splashlens\.com\/\?[^" ]+)"/g)) {
      const tab = new URL(match[1].replaceAll('&amp;', '&')).searchParams.get('tab');
      if (tab) assert.ok(allowed.has(tab), `${page}: ${tab}`);
    }
  }
});

test('corrected feature guide does not advertise unverified features', () => {
  const html = readFileSync(resolve(root, 'blog/poolens-complete-feature-guide.html'), 'utf8');
  assert.doesNotMatch(html, /Feature 1: Account Management|Feature 5: SLAM Tracker|Chemistry Trend Alerts|equivalent to what commercial facility operators/i);
  assert.match(html, /AI scans require internet access/i);
  assert.match(html, /before ordering/i);
});
