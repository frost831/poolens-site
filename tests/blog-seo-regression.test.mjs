import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { articles } from '../editorial/articles.mjs';
import { clusters, sources } from '../editorial/sources.mjs';
import { route, visible, sitemap, feed, renderArticle, json } from '../editorial/render.mjs';
import { stage } from '../tools/stage-public-assets.mjs';

const allTime = new Date('2027-01-27T00:00:00Z');
const request = (path, options) => new Request('https://splashlens.com' + path, options);
const call = (path, time = allTime, inventory) => route(request(path), time, inventory);

test('120 unique daily articles cover the requested Chicago calendar', () => {
  assert.equal(articles.length, 120);
  assert.equal(new Set(articles.map(a => a.path)).size, 120);
  assert.equal(new Set(articles.map(a => a.title)).size, 120);
  assert.equal(new Set(articles.map(a => a.answer)).size, 120);
  for (const [i, a] of articles.entries()) {
    assert.equal(a.date, new Date(Date.UTC(2026, 8, 29 + i)).toISOString().slice(0, 10));
    const time = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(a.published));
    assert.equal(time, '08:00');
    assert.ok(clusters[a.cluster]);
    assert.equal(a.fields.length, 4);
    assert.ok(Date.parse(a.modified) >= Date.parse(a.published));
    assert.match(a.path, /^\/blog\/[a-z-]+\/[a-z0-9-]+\/$/);
  }
  assert.equal(articles.at(-1).date, '2027-01-26');
  assert.equal(articles.filter(a => a.published.endsWith('-05:00')).length, 33);
  assert.equal(articles.filter(a => a.published.endsWith('-06:00')).length, 87);
});

test('every release boundary is atomic across page, sitemap, feed, hub, and AI inventory', async () => {
  for (const a of articles) {
    const before = new Date(Date.parse(a.published) - 1);
    const after = new Date(a.published);
    assert.equal(call(a.path, before).status, 404);
    assert.equal(call(a.path, after).status, 200);
    assert.equal(visible(after).length - visible(before).length, 1);
    for (const path of ['/blog-sitemap.xml', '/blog/feed.xml', '/blog/field-notes/', '/blog/field-notes.txt']) {
      assert.ok(!(await call(path, before).text()).includes(a.path), `${a.id} leaked in ${path}`);
      assert.ok((await call(path, after).text()).includes(a.path), `${a.id} missing in ${path}`);
    }
  }
});

test('drafts and withdrawals are hidden regardless of time', async () => {
  for (const status of ['draft', 'in_review', 'withdrawn']) {
    const inventory = articles.map((a, i) => i === 0 ? { ...a, status } : a);
    assert.equal(call(articles[0].path, allTime, inventory).status, 404);
    assert.ok(!sitemap(visible(allTime, inventory)).includes(articles[0].path));
    assert.ok(!(await call('/blog/checklists/sl-field-001.txt', allTime, inventory).text()).includes(articles[0].title));
  }
});

test('each article has matching schema, metadata, sources, and clean URLs', () => {
  for (const a of articles) {
    const html = renderArticle(a, articles);
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(html.includes(`href="https://splashlens.com${a.path}"`));
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const post = schema['@graph'].find(n => n['@type'] === 'BlogPosting');
    assert.equal(post.headline, a.title);
    assert.equal(post.datePublished, a.published);
    assert.equal(post.mainEntityOfPage['@id'], 'https://splashlens.com' + a.path);
    assert.ok(!Object.hasOwn(post, 'reviewedBy'));
    assert.ok(post.citation.every(url => html.includes(url.replaceAll('&', '&amp;'))));
    assert.ok(post.image.every(url => url.startsWith('https://')));
    assert.match(html, /Reference only/);
    assert.doesNotMatch(html, /FAQPage|HowTo|hreflang|example-manufacturer|TODO|TBD/);
    for (const match of html.matchAll(/href="(\/blog\/[^"?#]*)"/g)) {
      const target = match[1];
      if (target === '/blog/' || target === '/blog/field-notes.css') continue;
      assert.equal(call(target)?.status, 200, `${a.id} -> ${target}`);
    }
  }
});

test('sitemap article set equals published inventory and RSS is limited to 40 stable IDs', () => {
  const map = sitemap(articles);
  const articleLocations = [...map.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]).filter(url => articles.some(a => url.endsWith(a.path)));
  assert.equal(articleLocations.length, 120);
  const rss = feed(articles);
  assert.equal((rss.match(/<item>/g) || []).length, 40);
  assert.equal((rss.match(/<guid isPermaLink="true">/g) || []).length, 40);
  assert.doesNotMatch(rss, /utm_|<author>|<updated>/);
});

test('query parameters cannot time travel or enter metadata', async () => {
  const before = new Date('2026-09-29T12:59:59Z');
  assert.equal(call(articles[0].path + '?now=2027-01-27&preview=true', before).status, 404);
  const html = await call(articles[0].path + '?email=private@example.com&utm_source=test').text();
  assert.ok(!html.includes('private@example.com'));
  assert.ok(!html.includes('utm_source=test'));
});

test('canonical redirects, unknown routes, cache boundaries, and HEAD work', async () => {
  const a = articles[0];
  const redirect = call(a.path.slice(0, -1) + '?utm_source=test');
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get('Location'), a.path + '?utm_source=test');
  assert.equal(call('/blog/pumps-motors/does-not-exist/').status, 404);
  assert.equal(call('/blog/legacy-article.html'), null);
  assert.equal(call(a.path).headers.get('Cache-Control'), 'no-store');
  assert.equal(call(a.path, new Date('2020-01-01')).headers.get('X-Robots-Tag'), 'noindex');
  assert.equal(await route(request(a.path, { method: 'HEAD' }), allTime).text(), '');
  assert.equal(route(request(a.path, { method: 'POST' }), allTime).status, 405);
});

test('downloaded card includes article-specific fields and excludes unreleased entries', async () => {
  const a = articles[0];
  const result = call(`/blog/checklists/${a.id}.txt`);
  assert.match(result.headers.get('Content-Disposition'), /attachment/);
  const body = await result.text();
  assert.ok(a.fields.every(field => body.includes(field)));
  assert.ok(body.includes(a.question));
  assert.equal(call('/blog/checklists/sl-field-999.txt').status, 404);
  assert.equal(call('/blog/checklists/sl-field-002.txt', new Date(articles[0].published)).status, 404);
});

test('escaping protects HTML, XML and JSON script content', () => {
  const a = { ...articles[0], title: '</script><img src=x onerror=alert(1)> & "', answer: 'A & B < C' };
  const html = renderArticle(a, [a]);
  assert.ok(!html.includes('<img src=x'));
  assert.ok(html.includes('&lt;img'));
  assert.ok(!json({ x: '</script>' }).includes('</script>'));
  assert.ok(feed([a]).includes('A &amp; B &lt; C'));
});

test('source records are real HTTPS routes and private editorial content is excluded from uploads', () => {
  for (const source of Object.values(sources)) {
    assert.equal(new URL(source.url).protocol, 'https:');
    assert.match(source.checked, /^\d{4}-\d{2}-\d{2}$/);
  }
  const ignore = fs.readFileSync(new URL('../.assetsignore', import.meta.url), 'utf8');
  assert.match(ignore, /editorial\//);
});

test('the actual Pages asset bundle contains no internal documents, scripts or future corpus', async () => {
  const { output, count } = await stage();
  assert.ok(count > 700);
  for (const directory of ['editorial', 'tools', 'tests', 'docs', '.git', 'node_modules', 'functions']) {
    assert.equal(fs.existsSync(`${output}/${directory}`), false, directory);
  }
  for (const asset of ['index.html', '404.html', 'blog/index.html', 'blog/field-notes.css', 'blog/field-notes.js', 'sitemap-index.xml', 'product-screenshots/service-proof-live-mobile.png']) {
    assert.equal(fs.existsSync(`${output}/${asset}`), true, asset);
  }
});
