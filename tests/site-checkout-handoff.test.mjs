import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { onRequestGet } from '../functions/api/checkout.js';
import { onRequestPost as recordSiteEvent } from '../functions/api/event.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const ga4 = fs.readFileSync(path.join(root, 'ga4.js'), 'utf8');

function htmlFiles(directory = root) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (['node_modules', '.git', '.wrangler', '_deploy', 'docs', 'tests'].includes(entry.name)) return [];
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(filename) : entry.name.endsWith('.html') ? [filename] : [];
  });
}

test('every live site paid CTA uses the app handoff and a distinct tracked placement', () => {
  const placements = new Set();
  let count = 0;
  for (const filename of htmlFiles()) {
    const html = fs.readFileSync(filename, 'utf8');
    assert.doesNotMatch(html, /href\s*=\s*["'][^"']*\/api\/checkout\?plan=/i, filename);
    for (const match of html.matchAll(/<a\b[^>]*data-track="checkout_click"[^>]*>/gi)) {
      const tag = match[0];
      const href = tag.match(/\bhref="([^"]+)"/)?.[1]?.replaceAll('&amp;', '&');
      const plan = tag.match(/\bdata-plan="([^"]+)"/)?.[1];
      const placement = tag.match(/\bdata-checkout-placement="([^"]+)"/)?.[1];
      assert.ok(href && plan && placement, `${filename}: incomplete paid CTA`);
      const url = new URL(href);
      assert.equal(url.origin, 'https://app.splashlens.com', filename);
      assert.equal(url.pathname, '/', filename);
      assert.equal(url.searchParams.get('upgrade'), plan, filename);
      assert.equal(url.searchParams.get('placement'), placement, filename);
      assert.ok(url.searchParams.get('utm_source'), filename);
      assert.match(placement, /^site_[a-z0-9_]+$/, filename);
      assert.ok(!placements.has(placement), `${filename}: duplicate placement`);
      placements.add(placement);
      assert.match(html, /<script src="\/ga4\.js" defer><\/script>/, filename);
      count++;
    }
  }
  assert.equal(count, 6);
});

test('site checkout GET is only an app handoff, never a Stripe redirect', async () => {
  for (const [requested, expected] of [['monthly', 'monthly'], ['yearly', 'yearly'], ['annual', 'yearly']]) {
    const response = await onRequestGet({ request: new Request(`https://splashlens.com/api/checkout?plan=${requested}`) });
    assert.equal(response.status, 302);
    const destination = new URL(response.headers.get('Location'));
    assert.equal(destination.origin, 'https://app.splashlens.com');
    assert.equal(destination.pathname, '/');
    assert.equal(destination.searchParams.get('upgrade'), expected);
    assert.equal(destination.searchParams.get('placement'), 'site_legacy_checkout');
    assert.ok(!destination.href.includes('stripe'));
  }
});

test('shared click helper beacons reference, plan, placement and web store before navigation', async () => {
  const listeners = new Map();
  const beacons = [];
  const storage = () => {
    const values = new Map();
    return { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
  };
  const document = {
    body: { hasAttribute: () => false },
    head: { appendChild: () => {} },
    createElement: () => ({}),
    querySelectorAll: () => [],
    addEventListener: (name, callback) => listeners.set(name, callback),
  };
  const window = {
    location: { href: 'https://splashlens.com/partsnap.html', pathname: '/partsnap.html', search: '' },
    crypto: webcrypto,
    dataLayer: [],
  };
  const navigator = { sendBeacon: (endpoint, body) => { beacons.push({ endpoint, body }); return true; } };
  vm.runInNewContext(ga4, {
    window, document, navigator, localStorage: storage(), sessionStorage: storage(),
    URL, URLSearchParams, Uint8Array, Blob, Date, Math,
  });
  const attributes = {
    'data-track': 'checkout_click', 'data-plan': 'monthly',
    'data-checkout-placement': 'site_partsnap_pricing',
  };
  const link = {
    href: 'https://app.splashlens.com/?upgrade=monthly&placement=site_partsnap_pricing&utm_source=site',
    getAttribute: (key) => attributes[key] || null,
  };
  listeners.get('click')({ target: { closest: () => link } });
  assert.equal(beacons.length, 1);
  assert.equal(beacons[0].endpoint, '/api/event');
  const event = JSON.parse(await beacons[0].body.text());
  const destination = new URL(link.href);
  assert.equal(event.event, 'checkout_click');
  assert.equal(event.props.plan, 'monthly');
  assert.equal(event.props.placement, 'site_partsnap_pricing');
  assert.equal(event.props.store, 'web');
  assert.match(event.props.client_reference_id, /^sl_checkout_[a-f0-9-]{36}$/);
  assert.equal(destination.searchParams.get('client_reference_id'), event.props.client_reference_id);
  assert.equal(destination.pathname, '/');
});

test('site checkout click forwards analytics without sending a server email', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(String(url));
    return Response.json({ ok: true });
  });
  const db = { prepare() { return { bind() { return this; }, async run() {} }; } };
  const response = await recordSiteEvent({
    request: new Request('https://splashlens.com/api/event', { method: 'POST',
      headers: { 'Content-Type': 'text/plain', 'User-Agent': 'Mozilla/5.0 Safari/605.1' },
      body: JSON.stringify({ event: 'checkout_click', source: 'site', path: '/partsnap.html',
        props: { plan: 'monthly', placement: 'site_partsnap_pricing', store: 'web',
          client_reference_id: 'sl_checkout_5d46a1e0-a882-4c96-9c93-6558d2e34149' } }),
    }),
    env: { SUBSCRIBERS_DB: db, SENDGRID_API_KEY: 'configured-test-key', SPLASHLENS_NOTIFY_TO: 'owner@example.com' },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(calls, ['https://app.splashlens.com/api/events']);
});
