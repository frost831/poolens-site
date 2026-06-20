const INTERNAL_DOC_PREFIXES = ['/docs/outreach/', '/docs/design/'];

export async function onRequest(context) {
 const url = new URL(context.request.url);
 if (INTERNAL_DOC_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
 return new Response('Not found', {
 status: 404,
 headers: {
 'content-type': 'text/plain; charset=utf-8',
 'cache-control': 'no-store',
 },
 });
 }

 return context.env.ASSETS.fetch(context.request);
}
