import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), 'utf8');

test('CRM companion page is crawlable and describes only the manual handoff', () => {
  const page = read('pool-brain-skimmer-companion.html');
  assert.match(page, /<link rel="canonical" href="https:\/\/splashlens\.com\/pool-brain-skimmer-companion\.html">/);
  assert.match(page, /We don't do billing, routes, or invoices/);
  assert.match(page, /no claimed direct Pool Brain or Skimmer integration/i);
  assert.match(page, /SMS availability depends on the device/);
  assert.match(page, /PartSnap and AI scans need a connection/);
  assert.match(read('crm-companion.html'), /href="\/pool-brain-skimmer-companion\.html"/);
  assert.match(read('sitemap.xml'), /https:\/\/splashlens\.com\/pool-brain-skimmer-companion\.html/);
  assert.ok(fs.existsSync(new URL('product-screenshots/service-proof-live-mobile.png', root)));
});
