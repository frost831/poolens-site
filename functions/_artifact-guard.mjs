const privateNames = new Set([
  'package.json', 'package-lock.json', 'composer.json', 'composer.lock',
  'wrangler.toml', 'wrangler.json', 'wrangler.jsonc',
]);

export async function onRequest(context) {
  const url = new URL(context.request.url);
  let pathname = url.pathname;
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
  if (url.hostname === 'www.splashlens.com' && ['GET', 'HEAD'].includes(context.request.method)) {
    url.hostname = 'splashlens.com';
    return Response.redirect(url, 301);
  }
  return context.next();
}
