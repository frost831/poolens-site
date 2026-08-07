import assert from 'node:assert/strict';
import test from 'node:test';

import { amplitudeConfigPayload, forwardEventToAmplitude } from '../functions/_shared/amplitude.mjs';

test('Amplitude site config is disabled without a Cloudflare secret', () => {
  const config = amplitudeConfigPayload({});
  assert.equal(config.enabled, false);
  assert.equal(config.apiKey, '');
  assert.equal(config.status, 'missing_api_key');
  assert.equal(config.ingestion, 'server_side_http_v2');
});

test('Amplitude site forwarding preserves campaign identity', async () => {
  let captured;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    captured = { url, body: JSON.parse(options.body) };
    return new Response(JSON.stringify({ code: 200, events_ingested: 1 }), { status: 200 });
  };

  try {
    const result = await forwardEventToAmplitude({
      AMPLITUDE_API_KEY: 'amp_test_key',
    }, {
      correlationId: 'site-event-test-12345',
      event: 'open_app_click',
      source: 'site',
      path: '/?utm_campaign=test',
      plan: '',
      mode: '',
      createdAt: '2026-08-06T10:00:00.000Z',
    }, {
      client_id: 'site-client-12345',
      lead_id: 'lead-test-12345',
      attribution_campaign: 'poolpro_followup',
      known_company: 'Demo Pool Co',
      publication: 'poolpro',
    });

    assert.equal(result.sent, true);
    assert.equal(captured.url, 'https://api2.amplitude.com/2/httpapi');
    assert.equal(captured.body.events[0].event_type, 'open_app_click');
    assert.equal(captured.body.events[0].user_id, 'lead-test-12345');
    assert.equal(captured.body.events[0].device_id, 'site-client-12345');
    assert.equal(captured.body.events[0].event_properties.attribution_campaign, 'poolpro_followup');
    assert.equal(captured.body.events[0].user_properties.company, 'Demo Pool Co');
    assert.equal(captured.body.events[0].groups.company, 'Demo Pool Co');
    assert.equal(captured.body.events[0].groups.publisher, 'poolpro');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
