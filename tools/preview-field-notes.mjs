import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { route } from '../editorial/render.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain' };
export async function startPreview({ now, port = 0 } = {}) {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      const request = new Request(url, { method: req.method });
      const result = route(request, now || new Date());
      if (result) {
        res.writeHead(result.status, Object.fromEntries(result.headers));
        res.end(Buffer.from(await result.arrayBuffer()));
        return;
      }
      const pathname = decodeURIComponent(url.pathname);
      if (/(^|\/)\.|^\/(editorial|functions|tools|tests|docs)(\/|$)/.test(pathname)) throw new Error('Private path');
      const target = path.resolve(root, '.' + pathname);
      if (!target.startsWith(root + path.sep)) throw new Error('Outside root');
      let file = target;
      const stat = await fs.stat(file).catch(() => null);
      if (stat?.isDirectory()) file = path.join(file, 'index.html');
      else if (!stat && !path.extname(file)) file += '.html';
      const ext = path.extname(file);
      if (!mime[ext]) throw new Error('Unsupported asset');
      const data = await fs.readFile(file);
      res.writeHead(200, { 'Content-Type': mime[ext], 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain', 'X-Robots-Tag': 'noindex' });
      res.end('Not found');
    }
  });
  await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
  return { server, url: `http://127.0.0.1:${server.address().port}` };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const now = process.env.FIELD_NOTES_NOW ? new Date(process.env.FIELD_NOTES_NOW) : undefined;
  if (now && !Number.isFinite(now.getTime())) throw new Error('Invalid FIELD_NOTES_NOW');
  const { url } = await startPreview({ now, port: Number(process.env.PORT || 4173) });
  console.log(`Field notes preview: ${url}/blog/field-notes/`);
}
