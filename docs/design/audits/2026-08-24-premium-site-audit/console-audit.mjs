import { chromium } from 'playwright';

const urls = [
  'https://splashlens.com',
  'https://splashlens.com/closing-season.html',
  'https://splashlens.com/partsnap.html',
  'https://splashlens.com/service-proof-passport.html',
  'https://app.splashlens.com'
];

const browser = await chromium.launch();
const rows = [];

for (const url of urls) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });

  const consoleErrors = [];
  const requestFailures = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text().slice(0, 240));
    }
  });

  page.on('requestfailed', (request) => {
    const reason = request.failure()?.errorText || 'failed';
    requestFailures.push(`${reason} ${request.url()}`.slice(0, 240));
  });

  const response = await page.goto(url, {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  const metrics = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    const controls = document.querySelectorAll(
      'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
    );
    const ctas = Array.from(document.querySelectorAll('a,button')).filter((el) =>
      /app|identify|proof|closing|download|pilot|scan|open/i.test(
        el.textContent || el.getAttribute('aria-label') || ''
      )
    );

    return {
      title: document.title,
      scrollHeight: Math.max(body.scrollHeight, html.scrollHeight),
      viewportWidth: window.innerWidth,
      overflowX: html.scrollWidth > window.innerWidth + 2,
      focusable: controls.length,
      ctas: ctas.length,
      h1:
        document
          .querySelector('h1')
          ?.textContent?.trim()
          .replace(/\s+/g, ' ')
          .slice(0, 120) || ''
    };
  });

  rows.push({
    url,
    status: response?.status(),
    consoleErrorCount: consoleErrors.length,
    requestFailureCount: requestFailures.length,
    consoleErrors,
    requestFailures,
    ...metrics
  });

  await page.close();
}

await browser.close();
console.log(JSON.stringify(rows, null, 2));
