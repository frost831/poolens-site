import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pathToFileURL } from 'node:url';
import { createFaqHandler } from '../functions/api/faq-chat.js';
import { stage } from './stage-public-assets.mjs';

const contentTypes = new Map(Object.entries({
  html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8',
  svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  webp: 'image/webp', avif: 'image/avif', woff2: 'font/woff2', ico: 'image/x-icon',
  webmanifest: 'application/manifest+json', xml: 'application/xml', txt: 'text/plain; charset=utf-8',
}));

export async function startFaqPreview({ output, port = 8797 }) {
  const faqHandler = createFaqHandler();
  let origin;
  const server = createServer(async (req, res) => {
    try {
      const raw = req.url || '';
      if (!raw.startsWith('/') || raw.startsWith('//') || /[\\\r\n]/u.test(raw)) {
        res.writeHead(400).end();
        return;
      }
      const url = new URL(origin + raw);
      if (url.pathname === '/api/faq-chat') {
        const headers = new Headers(req.headers);
        headers.set('CF-Connecting-IP', req.socket.remoteAddress);
        const request = new Request(url, {
          method: req.method, headers,
          ...(!['GET', 'HEAD'].includes(req.method) && { body: Readable.toWeb(req), duplex: 'half' }),
        });
        const reply = await faqHandler({ request });
        res.writeHead(reply.status, Object.fromEntries(reply.headers));
        res.end(Buffer.from(await reply.arrayBuffer()));
        return;
      }
      if (!['GET', 'HEAD'].includes(req.method) || url.pathname.startsWith('/api/') ||
          !/^\/(?:[a-z0-9][a-z0-9_-]*\/)*[a-z0-9_-]*(?:\.[a-z0-9]+)?$/iu.test(url.pathname) ||
          url.pathname.split('/').some(segment => segment.startsWith('_'))) {
        res.writeHead(404).end('Not found');
        return;
      }
      let filename = url.pathname.slice(1);
      if (!filename || filename.endsWith('/')) filename += 'index.html';
      else if (!filename.includes('.')) filename += '.html';
      const type = contentTypes.get(path.extname(filename).slice(1));
      if (!type) { res.writeHead(404).end('Not found'); return; }
      try {
        const body = await readFile(path.join(output, filename));
        res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
        res.end(req.method === 'HEAD' ? undefined : body);
      } catch {
        res.writeHead(404).end('Not found');
      }
    } catch {
      if (!res.headersSent) res.writeHead(400);
      res.end();
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  origin = 'http://127.0.0.1:' + server.address().port;
  return { origin, server, close: () => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())) };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const port = Number(process.argv[2] || 8797);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Use a loopback port from 1024 through 65535');
  const { output } = await stage({ publish: true });
  const { origin } = await startFaqPreview({ output, port });
  console.log('SplashLens FAQ preview: ' + origin + '/ (FAQ: ' + origin + '/faq.html)');
}
