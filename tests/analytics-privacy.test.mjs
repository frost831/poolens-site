import assert from 'node:assert/strict';
import test from 'node:test';

import { safeAnalyticsPath, safeAnalyticsProps, safeAnalyticsReferrer } from '../functions/_shared/analytics-privacy.mjs';

test('site analytics keeps anonymous checkout attribution but drops personal details', () => {
  const props = safeAnalyticsProps({
    client_reference_id: 'sl_checkout_01234567-89ab-4cde-8f01-23456789abcd',
    plan: 'monthly', placement: 'site_pricing', store: 'web',
    email: 'private@example.com', known_name: 'Private Person', company: 'Private Pool Co',
    phone: '555-123-4567', lead_id: 'person-123',
    href: 'https://app.splashlens.com/api/checkout?email=private@example.com',
    destination_path: '/api/checkout?email=private@example.com',
  });
  assert.equal(props.client_reference_id, 'sl_checkout_01234567-89ab-4cde-8f01-23456789abcd');
  assert.equal(props.placement, 'site_pricing');
  assert.equal(props.destination_path, '/api/checkout');
  assert.doesNotMatch(JSON.stringify(props), /private|555|person-123|email=/i);
});

test('site paths and referrers cannot carry query or address identity', () => {
  assert.equal(safeAnalyticsPath('/pricing?email=private@example.com'), '/pricing');
  assert.equal(safeAnalyticsPath('/private@example.com'), '/');
  assert.equal(safeAnalyticsReferrer('https://search.example.com/result?email=private@example.com'), 'https://search.example.com/result');
  assert.equal(safeAnalyticsReferrer('mailto:private@example.com'), '');
});
