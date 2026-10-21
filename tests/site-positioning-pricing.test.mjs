import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), 'utf8');

const closingProPrice = 'Closing Pro is a 60-day pass at $29, paid once, with no auto-renew';

test('root marketing pages do not advertise obsolete SplashLens prices', () => {
  for (const name of fs.readdirSync(root).filter((file) => path.extname(file) === '.html')) {
    const html = read(name);
    assert.doesNotMatch(html, /\$99(?!\d)|\$4\.99|\$249(?!\d)|\$9-\$19|\$19 target/i, name);
    assert.doesNotMatch(html, /\$29\s*\/\s*mo|\$29 per month|\$29\/month/i, name);
    if (/\$29(?!\d)/.test(html)) {
      assert.match(html, /Closing Pro is a 60-day pass at \$29, paid once, with no auto-renew/, name);
    }
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

test('approved Closing Pro and Crew plans are listed without a dead checkout link', () => {
  const home = read('index.html');
  const pricing = home.slice(home.indexOf('id="pricing"'), home.indexOf('id="teams"'));
  assert.match(pricing, /\$19/);
  assert.match(pricing, /\$149/);
  assert.match(pricing, /\$49-79/);
  assert.ok(pricing.includes(closingProPrice));
  assert.match(pricing, /Crew is \$39 per month for one lead plus up to 3 techs/);
  assert.match(pricing, /Get Closing Pro — \$29 for 60 days, no auto-renew/);
  assert.match(pricing, /upgrade=closing_pass_60d&amp;placement=site_home_closing_pro/);
  assert.match(pricing, /upgrade=crew_monthly&amp;placement=site_home_crew/);
  assert.match(pricing, /Get Crew — \$39\/mo/);
  assert.doesNotMatch(pricing, /coming this week/);
  assert.doesNotMatch(pricing, /checkout\.stripe|buy\.stripe|api\/checkout\?plan=(?:closing|crew)/i);
  const offers = [...home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]))
    .find((item) => item['@type'] === 'SoftwareApplication').offers;
  assert.deepEqual(offers[0], { '@type': 'Offer', price: '0', priceCurrency: 'USD' });
  assert.equal(offers.find((offer) => offer.name === 'Closing Pro').price, '29');
  assert.equal(offers.find((offer) => offer.name === 'Crew').price, '39');
  assert.equal(offers.find((offer) => offer.name === 'Closing Pro').availability, 'https://schema.org/InStock');
  assert.equal(offers.find((offer) => offer.name === 'Crew').availability, 'https://schema.org/InStock');
  assert.equal(offers.find((offer) => offer.name === 'Closing Pro').url, 'https://app.splashlens.com/?upgrade=closing_pass_60d');
  assert.equal(offers.find((offer) => offer.name === 'Crew').url, 'https://app.splashlens.com/?upgrade=crew_monthly');
});

test('localized pricing pages include both plans only where a pricing section exists', () => {
  for (const name of ['es/index.html', 'es/pricing.html', 'fr-ca/index.html', 'fr-ca/pricing.html']) {
    const file = new URL(`../${name}`, root);
    if (!fs.existsSync(file)) continue;
    const html = read(name);
    if (!/id="pricing"|class="price-grid"|Simple Pricing|Precios|Tarifs/.test(html)) continue;
    assert.match(html, /Closing Pro is a 60-day pass at \$29, paid once, with no auto-renew/, name);
    assert.match(html, /Crew is \$39 per month for one lead plus up to 3 techs/, name);
    assert.match(html, /coming this week/, name);
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
