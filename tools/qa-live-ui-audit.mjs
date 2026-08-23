import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('docs', 'qa', 'live-ui-2026-08-23');

const surfaces = [
  { name: 'site-home', url: 'https://splashlens.com/' },
  { name: 'site-closing-season', url: 'https://splashlens.com/closing-season.html' },
  { name: 'site-campaign', url: 'https://splashlens.com/campaign.html' },
  { name: 'site-partsnap', url: 'https://splashlens.com/partsnap.html' },
  { name: 'site-spa-hot-tub', url: 'https://splashlens.com/spa-hot-tub-troubleshooting-app.html' },
  { name: 'site-spa-parts', url: 'https://splashlens.com/spa-swim-spa-parts-identification-app.html' },
  { name: 'site-service-proof', url: 'https://splashlens.com/service-proof-passport.html' },
  { name: 'site-facilities', url: 'https://splashlens.com/facilities.html' },
  { name: 'app-home', url: 'https://app.splashlens.com/' },
  {
    name: 'app-spa-search',
    url: 'https://app.splashlens.com/?tab=errors&search=spa&utm_source=qa&utm_medium=playwright',
  },
  {
    name: 'app-closing-report',
    url: 'https://app.splashlens.com/?tab=report&utm_source=qa&utm_medium=playwright&workflow=closing',
  },
  {
    name: 'app-closing-guide',
    url: 'https://app.splashlens.com/?tab=guide&utm_source=qa&utm_medium=playwright&checklist=closing',
  },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 1050 },
  { name: 'mobile', width: 390, height: 844 },
];

function cleanName(value) {
  return value.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}

function isIgnorableNetworkUrl(url = '') {
  return (
    url.includes('google-analytics.com') ||
    url.includes('googletagmanager.com') ||
    url.includes('google.com/g/collect') ||
    url.includes('analytics.google.com')
  );
}

async function auditRenderedPage(page) {
  return page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const doc = document.documentElement;
    const body = document.body;

    const visible = (el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return (
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        Number(style.opacity || '1') > 0.01 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    const labelFor = (el) => {
      const raw =
        el.getAttribute('aria-label') ||
        el.getAttribute('title') ||
        el.textContent ||
        el.getAttribute('href') ||
        el.tagName;
      return raw.replace(/\s+/g, ' ').trim().slice(0, 120);
    };

    const horizontalOverflow = [];
    for (const el of document.querySelectorAll('body *')) {
      if (!visible(el)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.right > viewportWidth + 2 || rect.left < -2) {
        horizontalOverflow.push({
          tag: el.tagName.toLowerCase(),
          label: labelFor(el),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        });
      }
    }

    const smallTapTargets = [];
    for (const el of document.querySelectorAll('a, button, input, select, textarea, [role="button"]')) {
      if (!visible(el)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top > viewportHeight || rect.bottom < 0) continue;
      if (rect.width < 36 || rect.height < 36) {
        smallTapTargets.push({
          tag: el.tagName.toLowerCase(),
          label: labelFor(el),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    }

    const tinyText = [];
    for (const el of document.querySelectorAll('p, li, a, button, span, label, input, textarea, h1, h2, h3')) {
      if (!visible(el)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top > viewportHeight || rect.bottom < 0) continue;
      const fontSize = Number.parseFloat(window.getComputedStyle(el).fontSize || '16');
      if (fontSize < 11 && (el.textContent || '').trim()) {
        tinyText.push({
          tag: el.tagName.toLowerCase(),
          label: labelFor(el),
          fontSize: Math.round(fontSize * 10) / 10,
        });
      }
    }

    const blankRevealCandidates = [];
    for (const el of document.querySelectorAll('section, article, main > div, [class*="reveal"], [class*="fade"]')) {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (rect.height > 120 && Number(style.opacity || '1') === 0) {
        blankRevealCandidates.push({
          tag: el.tagName.toLowerCase(),
          label: labelFor(el),
          height: Math.round(rect.height),
        });
      }
    }

    const brokenImages = Array.from(document.images)
      .filter((img) => visible(img) && !img.complete)
      .map((img) => img.currentSrc || img.src)
      .slice(0, 20);

    const h1s = Array.from(document.querySelectorAll('h1')).map((h) => labelFor(h));
    const navText = Array.from(document.querySelectorAll('nav a, nav button'))
      .filter(visible)
      .map(labelFor)
      .slice(0, 20);
    const primaryCtas = Array.from(document.querySelectorAll('a, button'))
      .filter(visible)
      .map(labelFor)
      .filter(Boolean)
      .slice(0, 30);

    return {
      title: document.title,
      url: location.href,
      viewportWidth,
      viewportHeight,
      documentWidth: Math.max(doc.scrollWidth, body?.scrollWidth || 0),
      horizontalScroll: Math.max(doc.scrollWidth, body?.scrollWidth || 0) > viewportWidth + 2,
      h1s,
      navText,
      primaryCtas,
      horizontalOverflow: horizontalOverflow.slice(0, 25),
      smallTapTargets: smallTapTargets.slice(0, 25),
      tinyText: tinyText.slice(0, 25),
      blankRevealCandidates: blankRevealCandidates.slice(0, 25),
      brokenImages,
    };
  });
}

async function clickIfVisible(page, selector, timeout = 3000) {
  const locator = page.locator(selector).first();
  try {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.click();
    return true;
  } catch {
    return false;
  }
}

async function textIsVisible(page, textPattern, timeout = 4000) {
  const locator = page.locator(textPattern).first();
  try {
    await locator.waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

async function runFlowChecks(page) {
  const checks = [];

  await page.goto('https://splashlens.com/closing-season.html', { waitUntil: 'networkidle', timeout: 45000 });
  const openClosing = page.locator('a', { hasText: 'Open Closing Mode' }).first();
  checks.push({
    name: 'closing-season page exposes Open Closing Mode CTA',
    pass: await openClosing.count().then((count) => count > 0),
  });

  const href = await openClosing.getAttribute('href').catch(() => null);
  checks.push({
    name: 'Open Closing Mode CTA routes into app report workflow',
    pass: typeof href === 'string' && href.includes('app.splashlens.com') && href.includes('workflow=closing'),
    evidence: href,
  });

  await page.goto('https://app.splashlens.com/?tab=report&utm_source=qa&utm_medium=playwright&workflow=closing', {
    waitUntil: 'networkidle',
    timeout: 45000,
  });

  const reportVisible = await page.locator('#tab-report.active').first().waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false);
  checks.push({ name: 'app report/proof surface renders after closing deep link', pass: reportVisible });

  let packetVisible = await page.locator('#rpt-proof-os-output').getByText('Closing Season Proof Packet').first().waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false);
  let clickedClosing = packetVisible;
  if (!packetVisible) {
    clickedClosing = await clickIfVisible(page, 'section[aria-label="Service Proof workflow"] button:has-text("Closing")');
    if (clickedClosing) {
      packetVisible = await page.locator('#rpt-proof-os-output').getByText('Closing Season Proof Packet').first().waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false);
    }
  }
  checks.push({ name: 'app Closing workflow button is tappable', pass: clickedClosing });

  checks.push({ name: 'app exposes closing proof packet/result language', pass: packetVisible });

  await page.goto('https://app.splashlens.com/?tab=guide&utm_source=qa&utm_medium=playwright&checklist=closing', {
    waitUntil: 'networkidle',
    timeout: 45000,
  });
  const guideVisible = await page.locator('#tab-guide.active').first().waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false)
    && await page.locator('#cl-btn-closing.active').first().waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false)
    && await page.locator('#tab-guide.active').getByText('Closing Checklist').first().waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false);
  checks.push({ name: 'app closing checklist/guide surface renders', pass: guideVisible });

  return checks;
}

await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = {
  generatedAt: new Date().toISOString(),
  screenshotsDir: outDir,
  surfaces: [],
  flowChecks: [],
};

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.name === 'mobile' ? 2 : 1,
    isMobile: viewport.name === 'mobile',
  });

  for (const surface of surfaces) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    const badResponses = [];

    page.on('console', (msg) => {
      if (['error', 'warning'].includes(msg.type())) {
        const text = msg.text();
        if (!/Failed to load resource: the server responded with a status of 404/.test(text)) {
          consoleErrors.push({ type: msg.type(), text: text.slice(0, 300) });
        }
      }
    });
    page.on('pageerror', (err) => pageErrors.push(err.message.slice(0, 300)));
    page.on('requestfailed', (req) => {
      if (!isIgnorableNetworkUrl(req.url())) {
        failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
      }
    });
    page.on('response', (res) => {
      const status = res.status();
      const url = res.url();
      if (status >= 400 && !isIgnorableNetworkUrl(url)) {
        badResponses.push({ status, url });
      }
    });

    try {
      await page.goto(surface.url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.screenshot({
        path: path.join(outDir, `${cleanName(surface.name)}-${viewport.name}.png`),
        fullPage: true,
      });
      const audit = await auditRenderedPage(page);
      results.surfaces.push({
        surface: surface.name,
        viewport: viewport.name,
        url: surface.url,
        pass:
          !audit.horizontalScroll &&
          audit.horizontalOverflow.length === 0 &&
          audit.blankRevealCandidates.length === 0 &&
          pageErrors.length === 0 &&
          failedRequests.length === 0 &&
          badResponses.length === 0,
        audit,
        consoleErrors: consoleErrors.slice(0, 15),
        pageErrors,
        failedRequests: failedRequests.slice(0, 15),
        badResponses: badResponses.slice(0, 15),
      });
    } catch (err) {
      results.surfaces.push({
        surface: surface.name,
        viewport: viewport.name,
        url: surface.url,
        pass: false,
        error: err.message,
        consoleErrors,
        pageErrors,
        failedRequests,
        badResponses,
      });
    } finally {
      await page.close();
    }
  }

  await context.close();
}

const flowContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
const flowPage = await flowContext.newPage();
results.flowChecks = await runFlowChecks(flowPage);
await flowPage.screenshot({ path: path.join(outDir, 'flow-closing-app-mobile.png'), fullPage: true });
await flowContext.close();

await browser.close();

const summary = {
  generatedAt: results.generatedAt,
  screenshotsDir: results.screenshotsDir,
  totalSurfaceChecks: results.surfaces.length,
  failedSurfaceChecks: results.surfaces.filter((item) => !item.pass).length,
  failedFlowChecks: results.flowChecks.filter((item) => !item.pass).length,
  failures: results.surfaces
    .filter((item) => !item.pass)
    .map((item) => ({
      surface: item.surface,
      viewport: item.viewport,
      url: item.url,
      error: item.error,
      horizontalScroll: item.audit?.horizontalScroll,
      horizontalOverflow: item.audit?.horizontalOverflow?.slice(0, 5),
      pageErrors: item.pageErrors,
      failedRequests: item.failedRequests,
      badResponses: item.badResponses,
    })),
  flowChecks: results.flowChecks,
};

await fs.writeFile(path.join(outDir, 'live-ui-audit-results.json'), JSON.stringify(results, null, 2));
await fs.writeFile(path.join(outDir, 'live-ui-audit-summary.json'), JSON.stringify(summary, null, 2));

console.log(JSON.stringify(summary, null, 2));
