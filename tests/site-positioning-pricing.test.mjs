import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), 'utf8');

test('root marketing pages do not advertise obsolete SplashLens prices', () => {
  for (const name of fs.readdirSync(root).filter((file) => path.extname(file) === '.html')) {
    const html = read(name);
    assert.doesNotMatch(html, /\$99(?!\d)|\$4\.99|\$29(?!\d)|\$249(?!\d)|\$9-\$19|\$19 target/i, name);
  }
});

test('Teams and Pro offers use the canonical site prices', () => {
  for (const name of ['index.html', 'campaign.html', 'teams.html', 'field-learning-os.html', 'verified-field-network.html', 'partners.html']) {
    assert.match(read(name), /\$49-79/, name);
  }
  for (const name of ['index.html', 'campaign.html', 'field-learning-os.html', 'verified-field-network.html', 'partners.html', 'paid-media.html', 'partsnap.html']) {
    const html = read(name);
    assert.match(html, /\$19/, name);
    assert.match(html, /\$149/, name);
  }
});

test('home hero and CRM companion state the product boundary', () => {
  const home = read('index.html');
  const hero = home.slice(home.indexOf('<div class="hero-copy premium-reveal">'), home.indexOf('<div class="hero-actions">'));
  assert.match(hero, /Route apps run the company\. OEM apps run one brand\. SplashLens makes the stuck stop proveable/);
  assert.match(hero, /We don't do billing, routes, or invoices/);
  assert.match(hero, /After a first online load/);
  assert.match(hero, /PartSnap and AI scans need internet/);
  assert.match(read('crm-companion.html'), /We don't do billing, routes, or invoices/);
  assert.doesNotMatch(home, /caches everything to your device/i);
});

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
