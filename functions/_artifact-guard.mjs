const privateNames = new Set([
  'package.json', 'package-lock.json', 'composer.json', 'composer.lock',
  'wrangler.toml', 'wrangler.json', 'wrangler.jsonc',
]);

export async function onRequest(context) {
  let pathname = new URL(context.request.url).pathname;
  let invalid = false;
  for (let i = 0; i < 4 && /%[0-9a-f]{2}/i.test(pathname); i++) {
    try { pathname = decodeURIComponent(pathname); } catch { invalid = true; break; }
  }
  const segments = pathname.replaceAll('\\', '/').toLowerCase().split('/').filter(Boolean);
  if (invalid || /%[0-9a-f]{2}/i.test(pathname) || segments.some(name => privateNames.has(name) || (name.startsWith('.') && name !== '.well-known'))) {
    return new Response(context.request.method === 'HEAD' ? null : 'Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
    });
  }
  return context.next();
}
