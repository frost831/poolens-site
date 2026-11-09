import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { compileFaq, mountFaqWidgets } from '../tools/compile-splashlens-faq.mjs';
import { stage } from '../tools/stage-public-assets.mjs';

const canonical = '<link rel="canonical" href="https://splashlens.com/faq.html">';
const answer = '<p id="offline-tools" data-faq-answer>Manual reference tools can work offline.</p>';
const page = content => '<!doctype html><html><head>' + canonical + '</head><body><main>' + content + '</main><!-- splashlens-faq-widget --></body></html>';
const entry = { id: 'offline-tools', title: 'Offline tools', source: '/faq.html#offline-tools', lastReviewed: '2026-11-09', queries: ['what works offline'] };
const fixture = async t => {
  const parent = await realpath(os.tmpdir());
  const root = await mkdtemp(path.join(parent, 'splashlens-faq-test-'));
  t.after(async () => {
    const resolved = await realpath(root);
    assert.equal(path.dirname(resolved), parent);
    assert.match(path.basename(resolved), /^splashlens-faq-test-/u);
    await rm(resolved, { recursive: true, force: true });
  });
  const put = async (file, data) => {
    const target = path.join(root, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, data);
  };
  await put('content/faq/intents.json', JSON.stringify([entry]));
  await put('functions/_shared/keep.txt', 'server only');
  await put('faq.html', page(answer));
  await put('index.html', '<body><!-- splashlens-faq-widget --></body>');
  await put('tools/faq-widget.html', '<button id="sl-faq-launcher">FAQ</button><dialog id="sl-faq-dialog"><button id="sl-faq-close">Close</button><section id="ask-splashlens"></section></dialog>');
  return { root, put };
};

test('public passage edits stop the release until the index and FAQ alias are regenerated', async t => {
  const { root, put } = await fixture(t);
  await compileFaq({ sourceRoot: root, write: true });
  await compileFaq({ sourceRoot: root });
  const changed = answer.replace('can work offline', 'are available after the app is cached');
  await put('faq.html', page(changed));
  await assert.rejects(compileFaq({ sourceRoot: root }), /FAQ index is stale/);
  const articles = await compileFaq({ sourceRoot: root, write: true });
  assert.equal(articles[0].answer, 'Manual reference tools are available after the app is cached.');
  const { output } = await stage({ sourceRoot: root });
  await mountFaqWidgets(output, root);
  assert.deepEqual(await compileFaq({ sourceRoot: root, pages: output }), articles);
  assert.equal(await readFile(path.join(output, 'faq'), 'utf8'), await readFile(path.join(output, 'faq.html'), 'utf8'));
  await assert.rejects(readFile(path.join(output, 'functions/_shared/faq-articles.json')));
  await assert.rejects(readFile(path.join(output, 'content/faq/intents.json')));
  await assert.rejects(readFile(path.join(output, 'tools/faq-widget.html')));
  await writeFile(path.join(output, 'faq.html'), page(answer));
  await assert.rejects(compileFaq({ sourceRoot: root, pages: output }), /FAQ index is stale/);
});

for (const [label, make, expected] of [
  ['removed', () => page(''), /missing or duplicate/],
  ['duplicated', () => page(answer + answer), /missing or duplicate/],
  ['hidden attribute', () => page(answer.replace('<p ', '<p hidden ')), /hidden/],
  ['hidden ancestor', () => page('<div aria-hidden="true">' + answer + '</div>'), /hidden/],
  ['inline hidden style', () => page(answer.replace('<p ', '<p style="display: none !important" ')), /hidden/],
  ['hidden class', () => page(answer.replace('<p ', '<p class="sr-only" ')), /hidden/],
  ['hidden nested markup', () => page(answer.replace('</p>', '<span hidden>private</span></p>')), /only visible text/],
  ['unmarked', () => page(answer.replace(' data-faq-answer', '')), /marked public/],
  ['wrong canonical', () => page(answer).replace('https://splashlens.com', 'https://other.test'), /wrong canonical/],
  ['outside main', () => page(answer).replaceAll('main>', 'div>'), /outside main/],
]) {
  test('rejects ' + label + ' public passage', async t => {
    const { root, put } = await fixture(t);
    await put('faq.html', make());
    await assert.rejects(compileFaq({ sourceRoot: root, write: true }), expected);
  });
}

test('rejects ambiguous phrases, cross-origin sources and sensitive approved text', async t => {
  const { root, put } = await fixture(t);
  await put('faq.html', page(answer + '<p id="second" data-faq-answer>Another passage.</p>'));
  await put('content/faq/intents.json', JSON.stringify([entry, { ...entry, id:'second', source:'/faq.html#second' }]));
  await assert.rejects(compileFaq({ sourceRoot: root, write: true }), /ambiguous phrase/);
  await put('content/faq/intents.json', JSON.stringify([{ ...entry, source:'https://other.test/faq.html#offline-tools' }]));
  await assert.rejects(compileFaq({ sourceRoot: root, write: true }), /unapproved source/);
  await put('content/faq/intents.json', JSON.stringify([entry]));
  await put('faq.html', page(answer.replace('Manual reference tools can work offline.', 'passcode: synthetic')));
  await assert.rejects(compileFaq({ sourceRoot: root, write: true }), /privacy checks/);
});
