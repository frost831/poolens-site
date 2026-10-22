import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/_artifact-guard.mjs';

for (const name of ['/package.json', '/package-lock.json', '/PACKAGE.JSON', '/package%2ejson', '/package%252ejson', '/.env', '/.git/config', '/wrangler.toml']) {
  for (const method of ['GET', 'HEAD', 'POST']) test(`${method} denies ${name}`, async () => {
    const r = await onRequest({ request: new Request(`https://splashlens.com${name}`, { method }), next: () => { throw new Error('unexpected fallback'); } });
    assert.equal(r.status, 404);
    assert.equal(r.headers.get('Cache-Control'), 'no-store');
    assert.equal(await r.text(), method === 'HEAD' ? '' : 'Not found');
  });
}
for (const name of ['/', '/blog/pool-pumps', '/api/event', '/api/checkout', '/api/amplitude-config', '/llms.txt', '/.well-known/security.txt']) {
  test(`preserves ${name}`, async () => {
    const expected = new Response('existing route');
    const r = await onRequest({ request: new Request(`https://splashlens.com${name}`), next: () => expected });
    assert.equal(r, expected);
  });
}
