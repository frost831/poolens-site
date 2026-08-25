import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const page = fs.readFileSync(new URL('../field-proof-pilot.html', import.meta.url), 'utf8');
const nav = fs.readFileSync(new URL('../splashlens-nav.js', import.meta.url), 'utf8');
const home = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('field proof pilot page captures business pilot requests through partner intake', () => {
  assert.match(page, /Field Proof Pilot/);
  assert.match(page, /\/api\/partner-intake/);
  assert.match(page, /pilot_request_submit/);
  assert.match(page, /pilot_request_success/);
  assert.match(page, /followUpPermission:true/);
});

test('pilot path is moved out of the homepage CTA path and kept in global navigation', () => {
  assert.doesNotMatch(home, /Book Field Pilot/);
  assert.match(nav, /Field Proof Pilot/);
  assert.match(nav, /\/field-proof-pilot\.html/);
});
