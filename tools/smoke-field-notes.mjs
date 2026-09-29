import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { articles } from '../editorial/articles.mjs';
import { visible } from '../editorial/render.mjs';

const base = process.argv[2] || 'https://splashlens.com';
const current = visible();
const checks = [
  ['/blog/field-notes/', 200], ['/blog/editorial/', 200], ['/blog-sitemap.xml', 200],
  ['/blog/feed.xml', 200], ['/blog/field-notes.txt', 200], ['/sitemap-index.xml', 200],
  ['/blog/', 200], ['/source-pages/', 200], ['/robots.txt', 200], ['/ai.txt', 200], ['/llms.txt', 200],
  ['/blog/field-notes.css', 200], ['/blog/field-notes.js', 200],
  ['/editorial/articles.mjs', 404], ['/editorial/sources.mjs', 404],
  ['/docs/qa/field-notes/sl-field-120-1440.png', 404], ['/docs/field-notes-operations.md', 404],
  ['/tools/preview-field-notes.mjs', 404], ['/tests/blog-seo-regression.test.mjs', 404],
  ['/.git', 404],
  ['/blog/pool-opening-closing/nonexistent-article/', 404]
];
const next = articles.find(a => !current.includes(a));
if (next) checks.push([next.path, 404], [`/blog/checklists/${next.id}.txt`, 404]);
if (current.length) checks.push([current.at(-1).path, 200], [`/blog/checklists/${current.at(-1).id}.txt`, 200]);
const results = [];
for (const [path, expected] of checks) {
  const response = await fetch(base + path, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
  const body = await response.text();
  assert.equal(response.status, expected, `${path}: ${response.status}`);
  if (path === '/blog/field-notes/') {
    assert.match(body, /Pool and spa field notes/);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.ok(!body.includes('ga4.js'));
    assert.ok(body.includes('href="https://splashlens.com/blog/field-notes/"'));
    if (base.includes('.pages.dev')) assert.equal(response.headers.get('x-robots-tag'), 'noindex');
    else assert.equal(response.headers.get('x-robots-tag'), null);
  }
  if (path === '/blog-sitemap.xml') {
    for (const a of current) assert.ok(body.includes(a.path));
    if (next) assert.ok(!body.includes(next.path));
  }
  if (expected === 404) assert.ok(!body.includes('const rows ='));
  results.push({ path, status: response.status, expected, cache: response.headers.get('cache-control') });
}
const output = { status: 'PASS', checkedAt: new Date().toISOString(), base, publishedCount: current.length, scheduledCount: articles.length - current.length, checks: results };
await fs.mkdir(new URL('../docs/qa/field-notes/', import.meta.url), { recursive: true });
await fs.writeFile(new URL(`../docs/qa/field-notes/${base.includes('.pages.dev') ? 'preview' : 'production'}-smoke.json`, import.meta.url), JSON.stringify(output, null, 2));
console.log(JSON.stringify(output));
