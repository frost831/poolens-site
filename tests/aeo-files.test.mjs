import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { stage } from '../tools/stage-public-assets.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const files = ['llms.txt', 'llms-full.txt', 'ai.txt'];
const source = 'https://hayward.com/media/akeneo_connector/asset_files/H/e/Heat_Pump_Troubleshooting_Guide__TSG_HTPMPa__c95b.pdf';
const answers = [
  'heatpro-heat-pump-lp-low-pressure-switch-tripped.html',
  'heatpro-heat-pump-hp-high-pressure-switch-tripped.html',
  'heatpro-heat-pump-hi-high-discharge-pressure.html',
  'heatpro-heat-pump-flo-flow-error-no-water-flow.html',
];
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const urls = text => [...text.matchAll(/https:\/\/[^\s)<]+/g)].map(match => match[0].replace(/[.,;:]$/, ''));

test('AEO links target existing canonical public files', () => {
  for (const file of files) {
    const text = read(file);
    assert.doesNotMatch(text, /\$\d|\b(?:price|pricing)\s*:/i, `${file}: avoid stale price facts`);
    for (const url of urls(text)) {
      const parsed = new URL(url);
      if (parsed.hostname !== 'splashlens.com') {
        assert.equal(url, source, `${file}: unexpected external URL`);
        continue;
      }
      assert.equal(parsed.search, '', `${file}: no tracking links`);
      if (['/blog/field-notes/', '/blog/editorial/'].includes(parsed.pathname)) {
        const renderer = read('editorial/render.mjs');
        assert.ok(renderer.includes(`'${parsed.pathname}'`), `${file}: missing dynamic route ${url}`);
        continue;
      }
      const local = parsed.pathname === '/' ? 'index.html'
        : parsed.pathname.endsWith('/') ? `${parsed.pathname.slice(1)}index.html`
          : parsed.pathname.slice(1);
      const absolute = path.join(root, local);
      assert.ok(fs.existsSync(absolute), `${file}: missing ${url}`);
      if (local.endsWith('.html')) {
        const html = fs.readFileSync(absolute, 'utf8');
        const canonical = parsed.pathname === '/' ? 'https://splashlens.com' : url;
        assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `${file}: noncanonical ${url}`);
      }
    }
  }
});

test('source inventory lists only four source-backed HeatPro answers', () => {
  const brief = read('llms.txt');
  const full = read('llms-full.txt');
  assert.ok(full.includes(source));
  const listed = [...full.matchAll(/https:\/\/splashlens\.com\/error-codes\/[^\s)]+/g)].map(match => match[0]);
  assert.equal(listed.length, answers.length);
  for (const answer of answers) {
    const url = `https://splashlens.com/error-codes/hayward/${answer}`;
    assert.ok(brief.includes(url), `llms.txt missing ${answer}`);
    assert.ok(listed.includes(url), `llms-full.txt missing ${answer}`);
    const html = read(`error-codes/hayward/${answer}`);
    assert.ok(html.includes(`href="${source}"`), `${answer}: manufacturer source missing`);
    assert.match(html, /Not a diagnosis/);
    assert.match(html, /other HeatPro revisions need their own current manual/);
  }
});

test('all three AEO files are included in public staging', async () => {
  const { output } = await stage();
  for (const file of files) {
    assert.equal(fs.readFileSync(path.join(output, file), 'utf8'), read(file));
  }
});
