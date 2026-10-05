import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

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
];
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const textOnly = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, ' ').replace(/&(?:amp|#38);/g, '&').replace(/\s+/g, ' ');

test('closing hub links all seven substantive topics and the working app route', () => {
  const hub = read(hubPath);
  assert.match(hub, /Close it once\. Prove it in April\./);
  for (const page of leafPaths) assert.ok(hub.includes(`href="/${page}"`), page);
  for (const page of leafPaths) {
    assert.ok(read('sitemap.xml').includes(`https://splashlens.com/${page}`), `${page} sitemap`);
    assert.ok(read('llms.txt').includes(`https://splashlens.com/${page}`), `${page} AI inventory`);
  }
  assert.doesNotMatch(hub, /Closing Pro 60-day pass/);
  assert.match(hub, /tab=report&amp;workflow=closing&amp;mode=closing/);
  assert.match(hub, /utm_source=site&amp;utm_medium=internal&amp;utm_campaign=closing_2026/);
  assert.match(hub, /not insurance and does not guarantee coverage/);
});

test('each topic has distinct answer, source, visible matching FAQ and HowTo, and bidirectional links', () => {
  const answers = new Set();
  for (const page of leafPaths) {
    const html = read(page);
    const visible = textOnly(html);
    assert.match(html, /<meta name="robots" content="index,follow">/);
    assert.ok(html.includes(`href="https://splashlens.com/${page}"`), `${page} canonical`);
    assert.match(html, /Last reviewed October 5, 2026/);
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
