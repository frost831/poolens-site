import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { startPreview } from './preview-field-notes.mjs';
import { articles } from '../editorial/articles.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { server, url } = await startPreview({ now: new Date('2027-01-27T00:00:00Z') });
const out = new URL('../docs/qa/field-notes/', import.meta.url);
await fs.mkdir(out, { recursive: true });
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://www.googletagmanager.com/**', r => r.fulfill({ status: 200, body: '' }));
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const [index, article] of articles.entries()) {
      await page.goto(url + article.path);
      await page.locator('figure img').waitFor();
      await page.locator('figure img').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
      await page.evaluate(() => window.scrollTo(0, 0));
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        h1: document.querySelector('h1')?.textContent,
        image: [...document.images].every(i => i.complete && i.naturalWidth > 0),
        canonical: document.querySelector('link[rel="canonical"]')?.href
      }));
      assert.equal(layout.overflow, false, `${article.id} ${viewport.width} overflow`);
      assert.equal(layout.h1, article.title);
      assert.equal(layout.image, true, `${article.id} images`);
      assert.equal(layout.canonical, 'https://splashlens.com' + article.path);
      if ([0, 68, 119].includes(index)) await page.screenshot({ path: new URL(`${article.id}-${viewport.width}.png`, out).pathname.replace(/^\/([A-Za-z]:)/, '$1'), fullPage: true });
    }
    await page.goto(url + '/blog/field-notes/');
    assert.equal(await page.locator('[data-note]').count(), 120);
    await page.locator('#note-search').fill('cordless-cleaner');
    assert.equal(await page.locator('[data-note]:visible').count(), 1);
    await page.locator('#note-search').fill('no-such-article-xyz');
    assert.equal(await page.locator('#no-notes').isVisible(), true);
    await page.locator('#note-search').fill('');
    await page.screenshot({ path: new URL(`hub-${viewport.width}.png`, out).pathname.replace(/^\/([A-Za-z]:)/, '$1') });
  }
  await page.goto(url + articles[0].path + '?email=private@example.com');
  await page.locator('.checklist input').first().check();
  assert.equal(await page.locator('.checklist input').first().isChecked(), true);
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0);
  await page.locator('#analytics-choice').click();
  assert.equal(await page.locator('#analytics-choice').getAttribute('aria-pressed'), 'true');
  await page.evaluate(() => {
    document.querySelector('[data-blog-cta]').addEventListener('click', event => event.preventDefault(), { once: true });
    document.querySelector('[data-blog-cta]').click();
  });
  const events = await page.evaluate(() => (window.dataLayer || []).map(item => [...item]));
  assert.equal(events.filter(e => e[0] === 'event' && e[1] === 'blog_cta_click').length, 1);
  assert.ok(!JSON.stringify(events).includes('private@example.com'));
  await page.locator('#analytics-choice').click();
  await page.evaluate(() => {
    document.querySelector('[data-blog-cta]').addEventListener('click', event => event.preventDefault(), { once: true });
    document.querySelector('[data-blog-cta]').click();
  });
  assert.equal(await page.evaluate(() => window.dataLayer.filter(e => e[0] === 'event').length), 1);
  for (const endpoint of ['/blog/feed.xml', '/blog-sitemap.xml', '/sitemap-index.xml']) {
    const xml = await (await fetch(url + endpoint)).text();
    assert.equal(await page.evaluate(xml => new DOMParser().parseFromString(xml, 'text/xml').querySelectorAll('parsererror').length, xml), 0, endpoint);
  }
  assert.deepEqual(errors, []);
  const result = { status: 'PASS', articleRenders: 240, viewports: [1440, 390], search: 'PASS', checklist: 'PASS', analyticsOptInAndWithdrawal: 'PASS', xml: 'PASS', browserErrors: errors };
  await fs.writeFile(new URL('result.json', out), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
