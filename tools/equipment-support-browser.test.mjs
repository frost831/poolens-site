import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { startPreview } from './preview-field-notes.mjs';

test('support requests are editable, local, keyboard accessible and safe on desktop and mobile', async () => {
  const { server, url } = await startPreview();
  const browser = await chromium.launch();
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      const apiRequests = [];
      page.on('request', request => {
        if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url());
      });
      await page.route('**/*', route => {
        if (new URL(route.request().url()).origin === url) return route.continue();
        return route.abort();
      });
      await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: {
        writeText: async value => { window.copiedSupportText = value; },
      } }));
      await page.goto(url + '/equipment-library/?q=LIBERTY');
      assert.equal(await page.locator('.model:visible').count(), 1);
      const opener = page.getByRole('button', { name: 'Prepare support request for LIBERTY 100 / 200 / 300 / 400', exact: true });
      await opener.focus();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: 'Prepare a support request' });
      await dialog.waitFor();
      const note = page.getByRole('textbox', { name: 'Editable equipment evidence' });
      assert.match(await note.inputValue(), /Installed model and revision: unknown/);
      assert.match(await note.inputValue(), /8151995-EN\.pdf#page=5/);
      assert.match(await note.inputValue(), /Fit and replacement authorization: unconfirmed/);
      const edited = (await note.inputValue()).replace('Observation time and timezone: unknown', 'Observation time and timezone: not recorded');
      await note.fill(edited);
      await page.getByRole('button', { name: 'Copy reviewed request', exact: true }).click();
      assert.equal(await page.evaluate(() => window.copiedSupportText), edited);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await fs.mkdir('docs/qa/reference-support-20261126', { recursive: true });
      await page.screenshot({ path: `docs/qa/reference-support-20261126/request-${width}.png`, fullPage: true });
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert.equal(await opener.evaluate(node => node === document.activeElement), true);
      assert.equal(await page.locator('#support-request-text').inputValue(), '');
      // An unsafe route must never enter a copied handoff, even if a card is tampered with.
      await page.locator('.model:visible a').first().evaluate(node => node.setAttribute('href', 'javascript:alert(1)'));
      await opener.click();
      assert.ok(!(await note.inputValue()).includes('javascript:'));
      await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('denied'); }; });
      await page.getByRole('button', { name: 'Copy reviewed request', exact: true }).click();
      assert.match(await page.getByRole('status').last().textContent(), /selected for manual copying/);
      await page.keyboard.press('Escape');
      await page.goto(url + '/pool-robot-troubleshooting-app.html');
      assert.equal(await page.locator('#robot-support-proof').isVisible(), true);
      await page.locator('.sl-nav-cta').waitFor();
      assert.ok((await page.locator('.sl-nav-cta').boundingBox()).height <= 60, 'Web App stays on one line');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.screenshot({ path: `docs/qa/reference-support-20261126/robot-${width}.png`, fullPage: true });
      assert.deepEqual(apiRequests, [], 'support notes never trigger an API request');
      await context.close();
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
