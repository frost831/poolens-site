import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const publicDirs = new Set(['blog', 'brands', 'ca', 'error-codes', 'es', 'field-challenge', 'fr-ca', 'ht', 'languages', 'lp', 'pool-automation', 'pool-hardware', 'pool-heaters', 'pool-lighting', 'pool-parts', 'pool-pumps', 'pool-robots', 'pool-tech-training', 'product-screenshots', 'pt-br', 'salt-cells', 'source-pages', 'service-proof-passport']);
const extensions = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.ico', '.webmanifest', '.woff', '.woff2']);
const specialFiles = new Set(['_headers', '_redirects', 'faq']);

export async function stage() {
  await fs.mkdir(path.join(root, '_deploy'), { recursive: true });
  const output = await fs.mkdtemp(path.join(root, '_deploy', 'public-'));
  let count = 0;
  async function copy(directory, relative = '') {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      if (entry.isSymbolicLink() || entry.name.startsWith('.')) continue;
      const name = path.join(relative, entry.name);
      if (entry.isDirectory()) {
        if (!relative && !publicDirs.has(entry.name)) continue;
        await copy(path.join(directory, entry.name), name);
      } else if (entry.isFile() && (extensions.has(path.extname(entry.name)) || (!relative && specialFiles.has(entry.name)))) {
        const target = path.join(output, name);
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.copyFile(path.join(directory, entry.name), target);
        count++;
      }
    }
  }
  await copy(root);
  for (const forbidden of ['editorial', 'docs', 'tools', 'tests', 'functions', '.git', 'node_modules', '.wrangler', '_deploy']) {
    if (await fs.stat(path.join(output, forbidden)).catch(() => null)) throw new Error(`Private asset staged: ${forbidden}`);
  }
  return { output, count };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await stage()));
