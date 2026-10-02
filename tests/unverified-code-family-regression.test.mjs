import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const redirects = fs.readFileSync(path.join(root, '_redirects'), 'utf8');
const generator = fs.readFileSync(path.join(root, 'tools', 'generate_pseo_pages.mjs'), 'utf8');

const unverifiedPages = [
  'error-codes/jandy-zodiac/lxi-lrz-gas-heater-unverified-code-meaning-withheld-pending-official-manual-verification.html',
  'error-codes/raypak/raypak-gas-heater-unverified-code-meaning-withheld-pending-official-manual-verification.html',
  'error-codes/beatbot/beatbot-robot-cleaners-unverified-indicator-meaning-withheld-pending-official-support-veri.html',
  'error-codes/aquacal/aquacal-heat-pump-unverified-code-meaning-withheld-pending-official-manual-verification.html',
  'error-codes/sta-rite/sta-rite-dura-glas-max-e-glas-pump-unverified-symptom-meaning-withheld-pending-official-se.html',
  'error-codes/sta-rite/sta-rite-max-e-therm-master-temp-gas-heater-unverified-code-meaning-withheld-pending-offic.html',
];

test('unsupported equipment families publish explicit no-guess references', () => {
  for (const relativePath of unverifiedPages) {
    const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
    assert.match(source, /Unverified - meaning withheld/);
    assert.match(source, /does not guess/);
    assert.doesNotMatch(source, /"@type":"HowTo"/);
  }
});

test('retired guessed-code URLs redirect and the generator uses the canonical app database', () => {
  assert.equal((redirects.match(/Unsupported legacy code claims/g) || []).length, 1);
  assert.ok((redirects.match(/ 301/g) || []).length >= 50);
  assert.match(redirects, /lxi-lrz-gas-heater-e01-ignition-failure\.html .*unverified.* 301/);
  assert.match(redirects, /raypak-gas-heater-e1-ignition-failure-lockout\.html .*unverified.* 301/);
  assert.match(redirects, /beatbot-robot-cleaners-e01-brush-motor-overload\.html .*unverified.* 301/);
  assert.match(redirects, /aquacal-heat-pump-e1-lo-low-refrigerant-pressure-low-ambient\.html .*unverified.* 301/);
  assert.match(redirects, /sta-rite-max-e-therm-master-temp-gas-heater-e05-ignition-failure-lockout\.html .*unverified.* 301/);
  assert.match(redirects, /robots-expanded-field-guide\/.*robot-no-power-robot-\.html \/error-codes\/robot-cleaners-smart-robots\/.*robot-no-power-robot-\.html 301/);
  assert.match(generator, /process\.env\.SPLASHLENS_APP_ERROR_DB/);
  assert.match(generator, /robots-expanded-field-guide\.html/);
  assert.match(generator, /cleanGeneratedText/);
});
