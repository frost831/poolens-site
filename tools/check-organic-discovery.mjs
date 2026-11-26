import { pathToFileURL } from 'node:url';
import { articles } from '../editorial/articles.mjs';
import { visible } from '../editorial/render.mjs';

// This checks public delivery, not search-engine indexing or AI recommendations.
export async function checkDiscovery({ base = 'https://splashlens.com', now = new Date(), fetcher = fetch } = {}) {
  const current = visible(now);
  const next = articles.find(a => Date.parse(a.published) > now.getTime());
  const latest = current.at(-1);
  const checks = [];
  async function read(path, expected = 200) {
    const response = await fetcher(base + path, { signal: AbortSignal.timeout(20000) });
    const body = await response.text();
    const errors = [];
    if (response.status !== expected) errors.push(`Expected HTTP ${expected}; received ${response.status}`);
    if (expected === 200 && !new URL(base).hostname.endsWith('.pages.dev') && /noindex/i.test(response.headers.get('x-robots-tag') || '')) errors.push('Public response is noindex');
    checks.push({ path, status: response.status, errors });
    return { body, errors };
  }
  const sitemap = await read('/blog-sitemap.xml');
  const feed = await read('/blog/feed.xml');
  const inventory = await read('/blog/field-notes.txt');
  const hub = await read('/blog/field-notes/');
  const robots = await read('/robots.txt');
  const sitemapIndex = await read('/sitemap-index.xml');
  for (const a of current) {
    if (!sitemap.body.includes(`https://splashlens.com${a.path}</loc>`)) sitemap.errors.push(`Missing published article ${a.id}`);
  }
  for (const a of articles.filter(a => !current.includes(a))) {
    for (const surface of [sitemap, feed, inventory, hub]) {
      if (surface.body.includes(a.path)) surface.errors.push(`Unpublished article exposed: ${a.id}`);
    }
  }
  for (const a of current.slice(-40)) {
    if (!feed.body.includes(`https://splashlens.com${a.path}</link>`)) feed.errors.push(`Missing current feed item ${a.id}`);
    if (!inventory.body.includes(a.path)) inventory.errors.push(`Missing current inventory item ${a.id}`);
  }
  if ((feed.body.match(/<item>/g) || []).length !== Math.min(40, current.length)) feed.errors.push('Incorrect feed item count');
  if (!sitemapIndex.body.includes('https://splashlens.com/blog-sitemap.xml')) sitemapIndex.errors.push('Field Notes sitemap missing from sitemap index');
  if (!robots.body.includes('https://splashlens.com/sitemap-index.xml')) robots.errors.push('Sitemap index missing from robots.txt');
  if (latest) {
    const page = await read(latest.path);
    if (!page.body.includes(`href="https://splashlens.com${latest.path}"`)) page.errors.push('Latest article canonical missing');
    if (!page.body.includes(latest.published)) page.errors.push('Latest article publication timestamp missing');
    if (!feed.body.includes(new Date(latest.published).toUTCString())) feed.errors.push('Latest feed publication date missing');
  }
  if (next) await read(next.path, 404);
  const failures = checks.filter(c => c.errors.length);
  return { status: failures.length ? 'FAIL' : 'PASS', checkedAt: new Date().toISOString(), releaseClock: now.toISOString(), base,
    published: current.length, scheduled: articles.filter(a => Date.parse(a.published) > now.getTime()).length,
    latest: latest?.path || null, nextRelease: next?.published || null, checks,
    scope: 'Public delivery only. Search indexing, genuine crawler identity, AI citations, installs and purchases are not established.' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await checkDiscovery({ base: process.argv[2] || undefined });
  console.log(JSON.stringify(result, null, 2));
  if (result.status !== 'PASS') process.exitCode = 1;
}
