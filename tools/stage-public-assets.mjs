import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const publicDirs = new Set(['blog', 'brands', 'ca', 'closing', 'error-codes', 'es', 'field-challenge', 'fr-ca', 'ht', 'languages', 'lp', 'pool-automation', 'pool-hardware', 'pool-heaters', 'pool-lighting', 'pool-parts', 'pool-pumps', 'pool-robots', 'pool-tech-training', 'product-screenshots', 'pt-br', 'salt-cells', 'source-pages', 'service-proof-passport']);
const extensions = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.ico', '.webmanifest', '.woff', '.woff2']);
const rootFiles = new Set([
  '404.html', '_headers', '_redirects', '_routes.json', 'faq', 'service-proof-passport',
  '7480a549532eec74705e8f33ed2c168a.txt', 'ai.txt', 'llms.txt', 'llms-full.txt', 'robots.txt',
  'apple-touch-icon.png', 'favicon-32.png', 'favicon.ico', 'favicon.svg',
  'icon-192.png', 'icon-512.png', 'icon.png', 'site.webmanifest',
  'splashlens-icon-180.png', 'splashlens-icon-512.png', 'splashlens-share-card.png',
  'ga4.js', 'paid-search.css', 'paid-search.js', 'splashlens-nav.js',
  'category-hub-sitemap.xml', 'pseo-sitemap.xml', 'seo-hub-sitemap.xml',
  'sitemap-index.xml', 'sitemap.xml', 'source-pages-sitemap.xml',
  ...[
    'campaign', 'closing-season', 'connected-pool-brain', 'crm-companion', 'facilities',
    'facility-assist-page', 'facility-assist', 'faq', 'field-intelligence-layer',
    'field-learning-os', 'field-proof-pilot', 'field-testers', 'google-play-testers', 'index',
    'mystery-part-lab', 'new-tech-radar', 'paid-media', 'partner-field-card-packet', 'partners',
    'partsnap-pool-part-identification-app', 'partsnap-proof-library', 'partsnap',
    'pool-automation-lighting-robot-troubleshooting', 'pool-automation-troubleshooting-app',
    'pool-brain-skimmer-companion', 'pool-equipment-troubleshooting', 'pool-hardware-reference',
    'pool-light-troubleshooting-app', 'pool-manufacturers-distributors-chemicals',
    'pool-parts-identification', 'pool-pump-heater-salt-cell-troubleshooting',
    'pool-robot-troubleshooting-app', 'pool-service-app', 'pool-tech-app',
    'pool-tech-field-reference-app', 'pool-tech-training-field-reference', 'privacy',
    'route-ready', 'salt-cell-troubleshooting-app', 'service-proof-passport',
    'spa-hot-tub-troubleshooting-app', 'spa-swim-spa-parts-identification-app', 'stats',
    'teams', 'terms', 'verified-equipment-code-lookup', 'verified-field-network',
    'what-app-identifies-pool-parts', 'whats-new', 'works-alongside-pool-brain-skimmer-jobber',
  ].map(name => `${name}.html`),
]);
const privateDirs = new Set(['editorial', 'docs', 'tools', 'tests', 'functions', 'src', 'server', 'node_modules', 'ios', 'android', '_deploy']);
const privateFile = /^(?:package(?:-lock)?\.json|npm-shrinkwrap\.json|composer\.(?:json|lock)|wrangler\.(?:toml|jsonc?)|config\.json|credentials\.json)$/i;

export async function stage({ sourceRoot = root, publish = false } = {}) {
  sourceRoot = path.resolve(sourceRoot);
  const staging = path.join(sourceRoot, '_deploy');
  const existing = await fs.lstat(staging).catch(error => {
    if (error.code !== 'ENOENT') throw error;
  });
  if (existing && (!existing.isDirectory() || existing.isSymbolicLink())) throw new Error('Unsafe staging directory.');
  await fs.mkdir(staging, { recursive: true });
  let output = await fs.mkdtemp(path.join(staging, 'public-'));
  let count = 0;
  async function copy(directory, relative = '') {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      if (entry.isSymbolicLink() || entry.name.startsWith('.') || privateFile.test(entry.name)) continue;
      const name = path.join(relative, entry.name);
      if (entry.isDirectory()) {
        if (privateDirs.has(entry.name)) continue;
        if (!relative && !publicDirs.has(entry.name)) continue;
        await copy(path.join(directory, entry.name), name);
      } else if (entry.isFile() && (relative ? extensions.has(path.extname(entry.name).toLowerCase()) : rootFiles.has(entry.name))) {
        const target = path.join(output, name);
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.copyFile(path.join(directory, entry.name), target);
        count++;
      }
    }
  }
  await copy(sourceRoot);
  for (const forbidden of ['editorial', 'docs', 'tools', 'tests', 'functions', '.git', 'node_modules', '.wrangler', '_deploy']) {
    if (await fs.stat(path.join(output, forbidden)).catch(() => null)) throw new Error(`Private asset staged: ${forbidden}`);
  }
  if (publish) {
    const destination = path.join(staging, 'public');
    const previous = await fs.lstat(destination).catch(error => {
      if (error.code !== 'ENOENT') throw error;
    });
    if (previous && (!previous.isDirectory() || previous.isSymbolicLink())) throw new Error('Unsafe public output directory.');
    await fs.rm(destination, { recursive: true, force: true });
    await fs.rename(output, destination);
    output = destination;
  }
  return { output, count };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await stage({ publish: true })));
