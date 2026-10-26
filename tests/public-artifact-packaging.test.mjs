import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { stage } from '../tools/stage-public-assets.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

async function fixture(t, names) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'splashlens-site-package-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  for (const name of names) {
    const target = path.join(directory, name);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, 'packaging fixture');
  }
  return directory;
}

async function inventory(directory) {
  return (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => path.relative(directory, path.join(entry.parentPath, entry.name)).replaceAll('\\', '/'))
    .sort();
}

test('Pages uses the dedicated CLI staging output without changing Functions bindings', async () => {
  const config = await fs.readFile(path.join(root, 'wrangler.toml'), 'utf8');
  assert.match(config, /^pages_build_output_dir = "_deploy\/public"$/m);
  assert.match(config, /\[\[d1_databases\]\]/);
  assert.match(config, /binding = "SUBSCRIBERS_DB"/);
  const script = await fs.readFile(path.join(root, 'tools/stage-public-assets.mjs'), 'utf8');
  assert.match(script, /stage\(\{ publish: true \}\)/);
});

test('CI requires artifact tests and staging at the event SHA without upload bypasses', async () => {
  const workflowRoot = path.join(root, '.github/workflows');
  const workflow = await fs.readFile(path.join(workflowRoot, 'ci.yml'), 'utf8');
  assert.match(workflow, /ref: \$\{\{ github\.sha \}\}/);
  assert.match(workflow, /runs-on: \[self-hosted, pc, ci\]/);
  const gate = '      - name: Run public artifact packaging gate\n        run: node --test tests/public-artifact-packaging.test.mjs tests/artifact-runtime-guard.test.mjs';
  const staging = '      - name: Stage public site assets without deployment\n        run: node tools/stage-public-assets.mjs';
  const source = workflow.replaceAll('\r\n', '\n');
  assert.ok(source.includes(gate), 'artifact gate must not be conditional or continue-on-error');
  assert.ok(source.includes(staging), 'the existing stager must run unconditionally');
  assert.ok(source.indexOf(gate) < source.indexOf(staging));
  assert.ok(source.indexOf(staging) < source.indexOf('- name: Run site regression suite'));
  assert.doesNotMatch(source, /^\s*(?:if|continue-on-error):/m);
  for (const name of await fs.readdir(workflowRoot)) {
    if (!/\.ya?ml$/.test(name)) continue;
    const action = await fs.readFile(path.join(workflowRoot, name), 'utf8');
    assert.doesNotMatch(action, /\bpages\s+(?:deploy|publish)\b|cloudflare\/(?:pages|wrangler)-action/i, `${name}: CI must not upload outside the packaging gate`);
  }
});

test('the site stages public files but rejects root and nested private artifacts', async t => {
  const keep = ['index.html', '_headers', '_redirects', '_routes.json', 'site.webmanifest', 'splashlens-nav.js',
    'blog/index.html', 'blog/field-notes.js', 'brands/reference.json', 'service-proof-passport'];
  const omit = ['package.json', 'package-lock.json', 'composer.json', 'composer.lock', 'wrangler.toml',
    '.env', '.env.example', '.dev.vars', 'debug.html', 'config.json', 'notes.txt', 'qa.png',
    'request.php', 'backup.sql', 'bundle.js.map', 'docs/index.html', 'tools/run.js',
    'tests/test.js', 'editorial/articles.json', 'functions/api/event.js', 'ios/private.json',
    'blog/.env', 'blog/package.json', 'blog/composer.json', 'blog/config.json',
    'blog/request.php', 'blog/backup.db', 'blog/bundle.js.map', 'blog/src/server.js',
    'blog/tests/private.json', 'blog/node_modules/module.js'];
  const sourceRoot = await fixture(t, [...keep, ...omit]);
  const { output, count } = await stage({ sourceRoot });
  assert.deepEqual(await inventory(output), keep.sort());
  assert.equal(count, keep.length);
  for (const name of omit) assert.equal(await fs.stat(path.join(output, name)).then(() => true, () => false), false, name);
});

test('publishing replaces only the dedicated output and removes stale leaked files', async t => {
  const sourceRoot = await fixture(t, ['index.html', '_deploy/public/package.json', '_deploy/other/keep.txt']);
  const { output } = await stage({ sourceRoot, publish: true });
  assert.equal(output, path.join(sourceRoot, '_deploy/public'));
  assert.deepEqual(await inventory(output), ['index.html']);
  assert.equal(await fs.readFile(path.join(sourceRoot, '_deploy/other/keep.txt'), 'utf8'), 'packaging fixture');
});

test('independent staging calls keep unique outputs for parallel regression tests', async t => {
  const sourceRoot = await fixture(t, ['index.html']);
  const [first, second] = await Promise.all([stage({ sourceRoot }), stage({ sourceRoot })]);
  assert.notEqual(first.output, second.output);
  assert.deepEqual(await inventory(first.output), ['index.html']);
  assert.deepEqual(await inventory(second.output), ['index.html']);
});

test('staging refuses a linked output parent without touching its target', async t => {
  const sourceRoot = await fixture(t, ['index.html', 'outside/keep.txt']);
  const outside = path.join(sourceRoot, 'outside');
  await fs.symlink(outside, path.join(sourceRoot, '_deploy'), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(stage({ sourceRoot, publish: true }), /Unsafe staging directory/);
  assert.equal(await fs.readFile(path.join(outside, 'keep.txt'), 'utf8'), 'packaging fixture');
});

test('the actual site retains public routes and leaves Functions outside the asset bundle', async t => {
  const handler = path.join(root, 'functions/blog/[[path]].js');
  const before = await fs.readFile(handler);
  const { output, count } = await stage();
  t.after(() => fs.rm(output, { recursive: true, force: true }));
  assert.ok(count > 700);
  for (const name of ['index.html', '404.html', '_headers', '_redirects', 'blog/index.html',
    'blog/field-notes.css', 'blog/field-notes.js', 'site.webmanifest', 'sitemap-index.xml',
    'splashlens-nav.js', 'product-screenshots/service-proof-live-mobile.png']) {
    assert.ok((await fs.stat(path.join(output, name))).isFile(), name);
  }
  const files = await inventory(output);
  assert.ok(!files.some(name => /(^|\/)(?:package(?:-lock)?\.json|composer\.(?:json|lock)|wrangler\.toml)$|\.(?:php|sql|db|map)$/.test(name)));
  assert.ok(!files.some(name => /^(?:functions|editorial|docs|tools|tests)\//.test(name)));
  assert.deepEqual(await fs.readFile(handler), before);
});
