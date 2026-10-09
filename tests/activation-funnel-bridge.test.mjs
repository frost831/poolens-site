import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { onRequestPost } from '../functions/api/event.js';

const source = fs.readFileSync(new URL('../functions/api/event.js', import.meta.url), 'utf8');
const challenge = fs.readFileSync(new URL('../field-challenge/field-challenge.js', import.meta.url), 'utf8');
const homepage = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const ga4 = fs.readFileSync(new URL('../ga4.js', import.meta.url), 'utf8');
const paidSearch = fs.readFileSync(new URL('../paid-search.js', import.meta.url), 'utf8');

test('marketing events forward anonymous activation signals to the app funnel', () => {
  for (const event of [
    'campaign_landing_view',
    'field_challenge_started',
    'field_challenge_feedback',
    'app_store_download_click',
    'open_app_click',
  ]) {
    assert.match(source, new RegExp(`['\"]${event}['\"]`));
  }
  assert.match(source, /https:\/\/app\.splashlens\.com\/api\/events/);
  assert.match(source, /funnelForwarded/);
});

test('the funnel bridge forwards only bounded anonymous attribution fields', () => {
  assert.match(source, /const safeProps =/);
  assert.doesNotMatch(source, /safeProps\s*=\s*props/);
  assert.doesNotMatch(source, /email:\s*clean\(props/);
});

test('site pricing clicks carry one anonymous reference through the funnel bridge', () => {
  assert.match(ga4, /function prepareCheckoutLink\(link\)/);
  assert.match(ga4, /url\.searchParams\.set\("client_reference_id", reference\)/);
  assert.match(ga4, /function trackCheckoutHandoff\(link\)/);
  assert.match(ga4, /var reference = prepareCheckoutLink\(link\)/);
  assert.match(ga4, /client_reference_id: reference/);
  assert.match(homepage, /if \(link\.getAttribute\('data-track'\) === 'checkout_click'\) return/);
  assert.doesNotMatch(paidSearch, /addEventListener\("click"/);
  assert.match(source, /client_reference_id: clean\(props\.client_reference_id/);
  assert.match(source, /safeAnalyticsProps\(body\.props\)/);
  assert.match(source, /placement: \/\^site_\[a-z0-9_\]/);
  assert.match(source, /plan: \['monthly', 'yearly'\]\.includes\(props\.plan\)/);
});

test('checkout click forwarding preserves the reference and drops personal fields', async (t) => {
  let forwarded;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://app.splashlens.com/api/events');
    forwarded = JSON.parse(options.body);
    return Response.json({ ok: true });
  });
  const response = await onRequestPost({
    request: new Request('https://splashlens.com/api/event', {
      method: 'POST',
      body: JSON.stringify({
        event: 'checkout_click', source: 'site', path: '/',
        props: {
          client_reference_id: 'sl_checkout_01234567-89ab-4cde-8f01-23456789abcd',
          plan: 'monthly', placement: 'site_partsnap_pricing', store: 'web',
          email: 'private@example.com', href: 'https://app.splashlens.com/api/checkout',
        },
      }),
    }),
    env: { SUBSCRIBERS_DB: { prepare: () => ({ bind: () => ({ run: async () => ({}) }) }) } },
  });
  assert.equal(response.status, 200);
  assert.equal(forwarded.source, 'site');
  assert.equal(forwarded.props.client_reference_id, 'sl_checkout_01234567-89ab-4cde-8f01-23456789abcd');
  assert.equal(forwarded.props.placement, 'site_partsnap_pricing');
  assert.equal(forwarded.props.plan, 'monthly');
  assert.doesNotMatch(JSON.stringify(forwarded), /private@example\.com/);
});

test('the public site event route cannot forge paid proof', async () => {
  for (const event of ['checkout_session_created', 'checkout_completed', 'subscription_created', 'entitlement_granted']) {
    const response = await onRequestPost({
      request: new Request('https://splashlens.com/api/event', {
        method: 'POST', body: JSON.stringify({ event, source: 'site' }),
      }),
      env: {},
    });
    assert.equal(response.status, 403);
  }
});

test('pilot and participant tags use canonical ids across the field challenge', () => {
  assert.match(challenge, /params\.get\("pilot_id"\)/);
  assert.match(challenge, /params\.get\("participant_id"\)/);
  assert.match(challenge, /url\.searchParams\.set\("pilot_id"/);
  assert.match(challenge, /url\.searchParams\.set\("participant_id"/);
});

test('homepage app CTAs route visitors into measurable field challenges', () => {
  assert.match(homepage, /challenge=field60/);
  assert.match(homepage, /challenge_path=partsnap/);
  assert.match(homepage, /challenge_path=service_proof/);
  assert.match(homepage, /data-challenge-id="site_hero_partsnap"/);
  assert.match(homepage, /destination_path/);
  assert.match(homepage, /challenge_id: destination\.challenge_id/);
});

test('homepage events carry durable anonymous client and session ids', () => {
  assert.match(homepage, /splashlens-site-client-id/);
  assert.match(homepage, /splashlens-site-session-id/);
  assert.match(homepage, /client_id:\s*clientId\(\)/);
  assert.match(homepage, /session_id:\s*sessionId\(\)/);
});

test('campaign field challenge includes proof path and current proof strip', () => {
  const campaign = fs.readFileSync(new URL('../campaign.html', import.meta.url), 'utf8');
  assert.match(campaign, /Run one ugly stop through SplashLens/);
  assert.match(campaign, /value="proof"/);
  assert.match(campaign, /AQUA Closing Season/);
  assert.match(challenge, /service_proof/);
});

test('campaign pricing matches the current SplashLens paid ladder', () => {
  const campaign = fs.readFileSync(new URL('../campaign.html', import.meta.url), 'utf8');
  assert.match(campaign, /Free Field Profile/);
  assert.match(campaign, /\$0 to start/);
  assert.match(campaign, /SplashLens Pro/);
  assert.match(campaign, /\$19\/mo or \$149\/yr/);
  assert.match(campaign, /Teams/);
  assert.match(campaign, /\$49-79\/owner\/mo; techs free/);
  assert.match(campaign, /utm_content=partsnap_pro/);
  assert.doesNotMatch(campaign, /\$4\.99\/mo or \$39\/yr/);
  assert.doesNotMatch(campaign, /\$29\/mo|\$249\/yr/);
  assert.doesNotMatch(campaign, /\$99\/mo/);
});

test('homepage pricing avoids unstable pilot target language', () => {
  assert.doesNotMatch(homepage, /pilot target/i);
  assert.doesNotMatch(homepage, /Coming soon: Route Ready/i);
  assert.match(homepage, /Free to Start/);
  assert.match(homepage, /Profile required for AI scans/);
  assert.doesNotMatch(homepage, /No Account Required/);
  assert.match(homepage, /SplashLens Pro/);
  assert.match(homepage, /\$19<\/div>[\s\S]*per month \/ \$149 per year/);
  assert.match(homepage, /Teams/);
  assert.match(homepage, /\$49-79<\/div>[\s\S]*per owner \/ month; techs free/);
  assert.doesNotMatch(homepage, /Saved Job Pro/);
});
