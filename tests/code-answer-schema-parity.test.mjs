import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const pages = [
  'heatpro-heat-pump-lp-low-pressure-switch-tripped.html',
  'heatpro-heat-pump-hp-high-pressure-switch-tripped.html',
  'heatpro-heat-pump-hi-high-discharge-pressure.html',
  'heatpro-heat-pump-flo-flow-error-no-water-flow.html',
];
const source = 'https://hayward.com/media/akeneo_connector/asset_files/H/e/Heat_Pump_Troubleshooting_Guide__TSG_HTPMPa__c95b.pdf';

function decode(html) {
  return html.replace(/&(?:amp|lt|gt|quot|#39);/g, entity => ({
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
  })[entity]);
}

function visibleText(html) {
  return decode(html.replace(/<head>[\s\S]*?<\/head>/, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

for (const page of pages) {
  test(`${page} has a source-scoped answer and schema-visible parity`, () => {
    const html = fs.readFileSync(path.join(root, 'error-codes', 'hayward', page), 'utf8');
    const visible = visibleText(html);
    const answer = decode(html.match(/<p class="answer">([^<]+)<\/p>/)?.[1] || '');
    const words = answer.trim().split(/\s+/);
    assert.ok(words.length >= 40 && words.length <= 60, `${page}: ${words.length} answer words`);
    assert.match(answer, /Stop if/);
    assert.match(visible, /Proof to capture before ordering parts/);
    assert.match(visible, /Not a diagnosis/);
    assert.match(visible, /other HeatPro revisions need their own current manual/);
    assert.match(html, /<time datetime="2026-10-05">2026-10-05<\/time>/);
    assert.ok(html.includes(`href="${source}"`));
    assert.match(html, /<ol><li>[^<]+<\/li><li>[^<]+<\/li><li>[^<]+<\/li><\/ol>/);

    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1] || 'null');
    assert.deepEqual(schema.map(item => item['@type']), ['FAQPage', 'HowTo', 'BreadcrumbList', 'Organization']);
    const [faq, howTo, breadcrumbs, organization] = schema;
    assert.equal(faq.mainEntity.length, 3);
    assert.equal(howTo.step.length, 3);
    for (const question of faq.mainEntity) {
      assert.ok(visible.includes(question.name), `Question not visible: ${question.name}`);
      assert.ok(visible.includes(question.acceptedAnswer.text), `Answer not visible: ${question.name}`);
    }
    assert.ok(visible.includes(howTo.name));
    for (const step of howTo.step) assert.ok(visible.includes(step.text));
    for (const crumb of breadcrumbs.itemListElement) {
      assert.ok(visible.includes(crumb.name));
      assert.ok(html.includes(`href="${new URL(crumb.item).pathname}"`));
    }
    assert.ok(visible.includes(organization.name));
  });
}
