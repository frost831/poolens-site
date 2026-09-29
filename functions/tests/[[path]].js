export function onRequest() {
  return new Response('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store' } });
}
