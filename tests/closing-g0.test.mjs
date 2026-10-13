import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { stage } from '../tools/stage-public-assets.mjs';

const root = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const hubPath = 'closing-season.html';
const leafPaths = [
  'closing/midwest-pool-closing-checklist.html',
  'closing/winterize-variable-speed-pump.html',
  'closing/winterize-salt-cell.html',
  'closing/winterize-pool-heater.html',
  'closing/blow-out-pool-lines.html',
  'closing/declined-work-closing-note.html',
  'closing/late-pool-closing-freeze.html',
  'closing/winterize-pool-filter.html',
];
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const textOnly = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, ' ').replace(/&(?:amp|#38);/g, '&').replace(/\s+/g, ' ');

test('closing hub links every substantive topic and the working app route', () => {
  const hub = read(hubPath);
  assert.match(hub, /Close it once\. Prove it in April\./);
  for (const page of leafPaths) assert.ok(hub.includes(`href="/${page}"`), page);
  for (const page of leafPaths) {
    assert.ok(read('sitemap.xml').includes(`https://splashlens.com/${page}`), `${page} sitemap`);
    assert.ok(read('llms.txt').includes(`https://splashlens.com/${page}`), `${page} AI inventory`);
  }
  assert.match(hub, /Closing Pro is a 60-day pass at \$29, paid once, with no auto-renew/);
  assert.match(hub, /role="status">coming this week/);
  assert.doesNotMatch(hub, /upgrade=closing|checkout\.stripe|buy\.stripe/i);
  const closingOffers = [...hub.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]))
    .find((item) => item['@type'] === 'SoftwareApplication').offers;
  assert.deepEqual(closingOffers[0], { '@type': 'Offer', price: '0', priceCurrency: 'USD' });
  assert.equal(closingOffers.find((offer) => offer.name === 'Closing Pro').price, '29');
  assert.match(hub, /tab=report&amp;workflow=closing&amp;mode=closing/);
  assert.match(hub, /utm_source=site&amp;utm_medium=internal&amp;utm_campaign=closing_2026/);
  assert.match(hub, /not insurance and does not guarantee coverage/);
});

test('Spanish closing pages state Closing Pro without a checkout link', () => {
  for (const page of [
    'es/closing/midwest-pool-closing-checklist.html',
    'es/closing/winterize-variable-speed-pump.html',
    'es/closing/winterize-pool-filter.html',
    'es/closing/winterize-pool-heater.html',
    'es/closing/winterize-salt-cell.html',
  ]) {
    const html = read(page);
    assert.match(html, /Closing Pro es un pase de 60 días a \$29, pago único, sin renovación automática/, page);
    assert.match(html, /role="status">coming this week/, page);
    assert.doesNotMatch(html, /upgrade=closing|checkout\.stripe|buy\.stripe/i, page);
  }
});

test('each topic has distinct answer, source, visible matching FAQ and HowTo, and bidirectional links', () => {
  const answers = new Set();
  for (const page of leafPaths) {
    const html = read(page);
    const visible = textOnly(html);
    assert.match(html, /<meta name="robots" content="index,follow">/);
    assert.ok(html.includes(`href="https://splashlens.com/${page}"`), `${page} canonical`);
    const reviewed = page.endsWith('winterize-pool-filter.html')
      ? 'Last reviewed October 12, 2026'
      : 'Last reviewed October 5, 2026';
    assert.ok(html.includes(reviewed), `${page} review date`);
    assert.match(html, /Closing Pro is a 60-day pass at \$29, paid once, with no auto-renew/);
    assert.match(html, /role="status">coming this week/);
    assert.doesNotMatch(html, /upgrade=closing|checkout\.stripe|buy\.stripe/i);
    assert.match(html, /href="\/closing-season\.html"/);
    assert.match(html, /tab=report&amp;workflow=closing&amp;mode=closing&amp;utm_source=site&amp;utm_medium=internal&amp;utm_campaign=closing_2026/);
    assert.match(html, /href="https:\/\/(?:www\.)?(?:weather\.gov|pentair\.com|raypak\.com)/);
    const answer = html.match(/<p class="answer">([^<]+)<\/p>/)?.[1];
    assert.ok(answer, `${page} answer`);
    const words = answer.split(/\s+/).length;
    assert.ok(words >= 40 && words <= 65, `${page}: ${words} answer words`);
    assert.ok(!answers.has(answer), `${page} duplicate answer`);
    answers.add(answer);
    const schema = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].map(match => JSON.parse(match[1]));
    const faq = schema.find(item => item['@type'] === 'FAQPage');
    const howto = schema.find(item => item['@type'] === 'HowTo');
    assert.ok(faq && howto, `${page} schema types`);
    assert.equal(faq.mainEntity.length, 2);
    for (const item of faq.mainEntity) {
      assert.ok(visible.includes(item.name), `${page} FAQ question: ${item.name}`);
      assert.ok(visible.includes(item.acceptedAnswer.text), `${page} FAQ answer: ${item.name}`);
    }
    assert.ok(howto.step.length >= 4);
    for (const step of howto.step) assert.ok(visible.includes(step.text), `${page} step: ${step.text}`);
  }
});

test('every local closing-page href and stylesheet resolves to a repository file', () => {
  for (const page of [hubPath, ...leafPaths]) {
    const html = read(page);
    for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]+)"/g)) {
      const target = match[1];
      if (target === '/') continue;
      const file = target.endsWith('/') ? `${target.slice(1)}index.html` : target.slice(1);
      assert.ok(fs.existsSync(path.join(root, file)), `${page} -> ${target}`);
    }
  }
});

test('public deployment bundle includes every closing page and its stylesheet', async () => {
  const { output } = await stage();
  for (const file of [...leafPaths, 'closing/closing.css']) {
    assert.ok(fs.existsSync(path.join(output, file)), `${file} absent from upload`);
  }
});
