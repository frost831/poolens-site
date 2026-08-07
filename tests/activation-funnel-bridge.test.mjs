import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync(new URL('../functions/api/event.js', import.meta.url), 'utf8');
const challenge = fs.readFileSync(new URL('../field-challenge/field-challenge.js', import.meta.url), 'utf8');
const homepage = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

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
