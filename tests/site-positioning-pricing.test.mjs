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

test('Teams structured data uses the owner-paid range', () => {
  const html = read('teams.html');
  assert.match(html, /"lowPrice":"49"/);
  assert.match(html, /"highPrice":"79"/);
  assert.match(html, /\$19\/month or \$149\/year/);
  assert.doesNotMatch(html, /"price":"99"/);
});

test('mobile navigation keeps primary pages reachable without replacing localized navs', () => {
  const nav = read('splashlens-nav.js');
  assert.match(nav, /class="sl-nav-menu sl-nav-mobile"/);
  assert.match(nav, /Closing Season/);
  assert.match(nav, /data-preserve-nav/);
  for (const name of ['es/index.html', 'es/partsnap.html', 'fr-ca/index.html', 'ca/index.html', 'languages/index.html']) {
    assert.match(read(name), /data-preserve-nav/, name);
  }
});

test('public marketing copy does not invent a partnership or a no-account guarantee', () => {
  assert.doesNotMatch(read('partners.html'), /Aquatic Council aligned/);
  assert.doesNotMatch(read('field-learning-os.html'), /Tim\/Aquatic Council/);
  assert.doesNotMatch(read('index.html'), /No signup\. No install/);
  assert.doesNotMatch(read('es/index.html'), /no requiere cuenta/);
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
