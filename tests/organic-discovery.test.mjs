import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { articles } from '../editorial/articles.mjs';
import { route } from '../editorial/render.mjs';
import { checkDiscovery } from '../tools/check-organic-discovery.mjs';

const now = new Date('2026-11-20T15:00:00Z');
function localFetch(change = (path, body) => body) {
  return async url => {
    const path = new URL(url).pathname;
    const response = route(new Request(url), now);
    const body = response ? await response.text() : fs.readFileSync(new URL('..' + path, import.meta.url), 'utf8');
    return new Response(change(path, body), { status: response?.status || 200, headers: response?.headers });
  };
}
test('discovery delivery audit accepts the actual release clock', async () => {
  const result = await checkDiscovery({ now, fetcher: localFetch() });
  assert.equal(result.status, 'PASS', JSON.stringify(result.checks));
  assert.equal(result.published, 53);
  assert.equal(result.scheduled, 67);
});
test('discovery audit blocks a stale feed despite HTTP 200', async () => {
  const result = await checkDiscovery({ now, fetcher: localFetch((path, body) => path === '/blog/feed.xml' ? body.replace(/<item>[\s\S]*?<\/item>/, '') : body) });
  assert.equal(result.status, 'FAIL');
  assert.match(JSON.stringify(result.checks), /Missing current feed item|Incorrect feed item count/);
});
test('discovery audit blocks future content leaking into an inventory', async () => {
  const future = articles.find(a => Date.parse(a.published) > now.getTime());
  const result = await checkDiscovery({ now, fetcher: localFetch((path, body) => path === '/blog/field-notes.txt' ? body + future.path : body) });
  assert.equal(result.status, 'FAIL');
  assert.match(JSON.stringify(result.checks), /Unpublished article exposed/);
});
test('discovery audit blocks public noindex headers', async () => {
  const fetcher = localFetch();
  const result = await checkDiscovery({ now, fetcher: async url => {
    const response = await fetcher(url);
    response.headers.set('x-robots-tag', 'noindex');
    return response;
  } });
  assert.equal(result.status, 'FAIL');
});
