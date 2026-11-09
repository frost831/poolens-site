import assert from 'node:assert/strict';
import { mkdir, realpath, rm } from 'node:fs/promises';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright';
import articles from '../functions/_shared/faq-articles.json' with { type: 'json' };
import { stage } from './stage-public-assets.mjs';
import { startFaqPreview } from './preview-splashlens-faq.mjs';
import { repoRoot } from './compile-splashlens-faq.mjs';

let browser, preview, output;
const screenshotDir = process.env.SPLASHLENS_FAQ_QA_DIR;
before(async () => {
  ({ output } = await stage());
  preview = await startFaqPreview({ output, port: 0 });
  browser = await chromium.launch({ executablePath: process.env.SPLASHLENS_CHROMIUM_PATH || undefined });
  if (screenshotDir) await mkdir(screenshotDir, { recursive: true });
});
after(async () => {
  try { await browser?.close(); } finally {
    try { await preview?.close(); } finally {
      if (output) {
        const resolved = await realpath(output);
        assert.equal(path.dirname(resolved), await realpath(path.join(repoRoot, '_deploy')));
        assert.match(path.basename(resolved), /^public-/u);
        await rm(resolved, { recursive: true, force: true });
      }
    }
  }
});

async function open(t, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options });
  t.after(() => context.close());
  await context.route('**/*', route => new URL(route.request().url()).origin === preview.origin ? route.continue() : route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  await page.goto(preview.origin + '/');
  return { page, context };
}

const launcher = page => page.getByRole('button', { name: 'Ask SplashLens FAQ' });
const dialog = page => page.getByRole('dialog', { name: 'Ask SplashLens' });
const log = page => page.getByRole('log');
const question = page => page.getByRole('textbox', { name: 'Your question' });
const ask = async (page, value) => {
  await question(page).fill(value);
  await question(page).press('Enter');
};
const snapshot = async (page, name) => {
  if (screenshotDir) await page.screenshot({ path: path.join(screenshotDir, name + '.png') });
};
async function withinViewport(page, locator) {
  await page.waitForFunction(id => {
    const box = document.getElementById(id)?.getBoundingClientRect();
    return box && box.width > 0 && box.height > 0 && box.left >= -0.5 && box.top >= -0.5 &&
      box.right <= window.innerWidth + 0.5 && box.bottom <= window.innerHeight + 0.5;
  }, await locator.getAttribute('id'));
  const box = await locator.boundingBox();
  const view = page.viewportSize();
  assert.ok(box && box.x >= -0.5 && box.y >= -0.5 && box.x + box.width <= view.width + 0.5 && box.y + box.height <= view.height + 0.5,
    'Expected the control within the viewport: ' + JSON.stringify({ box, view }));
}

test('desktop mouse drag does not open; tap returns exact answer, and citation opens the visible FAQ passage', async t => {
  const { page, context } = await open(t);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await context.addCookies([{ name: 'qa_fixture', value: 'synthetic', url: preview.origin }]);
  const button = launcher(page);
  await button.waitFor({ state: 'visible' });
  const before = await button.boundingBox();
  await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2);
  await page.mouse.down();
  await page.mouse.move(before.x + before.width / 2 - 130, before.y + before.height / 2 - 90, { steps: 6 });
  await page.mouse.up();
  const after = await button.boundingBox();
  assert.ok(after.x < before.x - 80 && after.y < before.y - 40);
  assert.equal(await dialog(page).count(), 0);
  await button.click();
  await dialog(page).waitFor();
  assert.equal(await button.getAttribute('aria-expanded'), 'true');
  const response = page.waitForResponse(res => res.url().endsWith('/api/faq-chat'));
  await page.getByRole('button', { name: 'What works offline?', exact: true }).click();
  const received = await response;
  assert.equal(received.status(), 200);
  assert.deepEqual(received.request().postDataJSON(), { question: 'What works offline?' });
  assert.equal(await received.request().headerValue('cookie'), null);
  const reply = await received.json();
  assert.equal(reply.articleId, 'offline-tools');
  await log(page).getByText(reply.answer, { exact: true }).waitFor();
  await withinViewport(page, dialog(page));
  await snapshot(page, 'desktop-answer');
  await log(page).getByRole('link', { name: 'Source: Offline tools' }).click();
  await page.waitForURL('**/faq.html#offline-tools');
  assert.equal(await page.locator('#offline-tools').innerText(), reply.answer);
  assert.equal(await launcher(page).count(), 1);
  assert.deepEqual(errors, []);
});

test('keyboard movement, Enter, Escape, focus restoration, resize, scroll and Clear work', async t => {
  const { page } = await open(t);
  const button = launcher(page);
  await button.focus();
  const before = await button.boundingBox();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowUp');
  const after = await button.boundingBox();
  assert.ok(after.x < before.x && after.y < before.y);
  await page.keyboard.press('Enter');
  await dialog(page).waitFor();
  await page.setViewportSize({ width: 300, height: 530 });
  await withinViewport(page, dialog(page));
  const transcript = log(page);
  for (let i = 0; i < 7; i++) {
    const response = page.waitForResponse(res => res.url().endsWith('/api/faq-chat'));
    await ask(page, 'What works offline?');
    await response;
    await page.getByRole('button', { name: 'Send', exact: true }).waitFor();
    await page.waitForFunction(() => !document.getElementById('sl-faq-submit').disabled);
  }
  const metrics = await transcript.evaluate(node => ({ children: node.children.length, scroll: node.scrollHeight, visible: node.clientHeight, top: node.scrollTop }));
  assert.ok(metrics.children <= 13 && metrics.scroll > metrics.visible && metrics.top > 0);
  await page.getByRole('button', { name: 'Clear chat' }).click();
  assert.equal(await transcript.locator('.sl-faq-chat__bubble').count(), 1);
  await page.keyboard.press('Escape');
  await dialog(page).waitFor({ state: 'hidden' });
  await page.waitForFunction(() => document.activeElement?.id === 'sl-faq-launcher' &&
    document.activeElement.getAttribute('aria-expanded') === 'false');
  assert.equal(await button.getAttribute('aria-expanded'), 'false');
  await withinViewport(page, button);
  await page.keyboard.press('Enter');
  await page.getByRole('link', { name: 'Browse FAQ', exact: true }).click();
  await page.waitForURL('**/faq.html');
  assert.equal(await log(page).count(), 0);
});

test('touch drag, tap, sensitive-input refusal, and official support fallback on a phone viewport', async t => {
  const { page, context } = await open(t, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const button = launcher(page);
  await button.waitFor({ state: 'visible' });
  const before = await button.boundingBox();
  const cdp = await context.newCDPSession(page);
  const start = { x: before.x + before.width / 2, y: before.y + before.height / 2 };
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x - 118, y: start.y - 125 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  const after = await button.boundingBox();
  assert.ok(after.x < before.x - 70 && after.y < before.y - 70);
  assert.equal(await dialog(page).count(), 0);
  await button.tap();
  await dialog(page).waitFor();
  await withinViewport(page, dialog(page));
  const sent = [];
  page.on('request', req => { if (req.url().endsWith('/api/faq-chat')) sent.push(req.postDataJSON()); });
  await ask(page, 'Delete my account user@example.test');
  await log(page).getByRole('link', { name: 'Contact support' }).waitFor();
  assert.equal(sent.length, 0);
  assert.doesNotMatch(await log(page).innerText(), /user@example\.test/);
  await page.getByRole('button', { name: 'Clear chat' }).click();
  const response = page.waitForResponse(res => res.url().endsWith('/api/faq-chat'));
  await ask(page, 'What is the weather?');
  assert.equal((await (await response).json()).articleId, null);
  assert.deepEqual(sent, [{ question: 'What is the weather?' }]);
  await log(page).getByRole('link', { name: 'Contact support' }).waitFor();
  await withinViewport(page, dialog(page));
  await snapshot(page, 'mobile-support-fallback');
  await log(page).getByRole('link', { name: 'Contact support' }).click();
  await page.waitForURL('**/support.html');
  assert.equal(await page.getByRole('link', { name: 'hello@splashlens.com' }).getAttribute('href'), 'mailto:hello@splashlens.com');
});

test('busy state, late responses after Clear, network errors and unsafe replies fail safely', async t => {
  const { page } = await open(t);
  await launcher(page).click();
  const endpoint = '**/api/faq-chat';
  let unblock;
  let seen;
  const intercepted = new Promise(resolve => { seen = resolve; });
  await page.route(endpoint, async route => {
    seen();
    await new Promise(resolve => { unblock = resolve; });
    await route.fulfill({ json: { articleId: 'offline-tools', answer: 'Late answer', title: 'Late', source: '/faq.html#offline-tools' } }).catch(() => {});
  });
  await ask(page, 'What works offline?');
  await intercepted;
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('status').textContent(), 'Finding a source…');
  await page.getByRole('button', { name: 'Clear chat' }).click();
  unblock();
  await page.unroute(endpoint);
  assert.equal(await log(page).locator('.sl-faq-chat__bubble').count(), 1);
  await page.route(endpoint, route => route.fulfill({ json: { articleId: 'bad', answer: 'Do not show this', title: 'Unsafe', source: 'javascript:alert(1)' } }));
  await ask(page, 'What works offline?');
  await log(page).getByRole('link', { name: 'Contact support' }).waitFor();
  assert.doesNotMatch(await log(page).innerText(), /Do not show this|Late answer/);
  assert.equal(await page.locator('a[href^="javascript:"]').count(), 0);
  await page.getByRole('button', { name: 'Clear chat' }).click();
  await page.unroute(endpoint);
  await page.route(endpoint, route => route.abort());
  await ask(page, 'What works offline?');
  await log(page).getByRole('link', { name: 'Contact support' }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Send', exact: true }).isDisabled(), false);
});

test('every citation remains visible in the staged pages and the static FAQ works with scripts disabled', async t => {
  const { page } = await open(t, { javaScriptEnabled: false });
  const targets = new Map();
  for (const article of articles) {
    const [route, id] = article.source.split('#');
    const items = targets.get(route) || [];
    items.push({ id, answer: article.answer });
    targets.set(route, items);
  }
  for (const [route, items] of targets) {
    assert.equal((await page.goto(preview.origin + route)).status(), 200);
    for (const { id, answer } of items) {
      const source = page.locator('[id="' + id + '"]');
      assert.equal(await source.count(), 1, route + '#' + id);
      assert.equal(await source.innerText().then(value => value.replace(/\s+/g, ' ').trim()), answer);
      assert.equal(await source.evaluate(node => {
        if (node.getBoundingClientRect().width <= 4 || node.getBoundingClientRect().height <= 4) return false;
        for (let current = node; current; current = current.parentElement) {
          const css = getComputedStyle(current);
          if (css.display === 'none' || css.visibility !== 'visible' || Number(css.opacity) <= 0.01 ||
              css.clipPath !== 'none' || css.contentVisibility === 'hidden') return false;
        }
        return true;
      }), true, route + '#' + id);
    }
  }
  await page.goto(preview.origin + '/faq');
  assert.equal(await launcher(page).count(), 0, 'launcher remains hidden without JS');
  assert.ok(await page.getByRole('link', { name: 'Contact SplashLens support' }).isVisible());
  for (const endpoint of ['/api/subscribe', '/api/checkout', '/api/privacy-deletion', '/functions/_shared/faq-articles.json', '/content/faq/intents.json']) {
    assert.equal((await fetch(preview.origin + endpoint)).status, 404, endpoint);
  }
});
