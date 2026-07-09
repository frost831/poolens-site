export async function onRequest({ request, env }) {
 const url = new URL(request.url);
 if (url.pathname.endsWith('/')) {
  url.pathname = url.pathname.replace(/\/+$/, '');
  return Response.redirect(url.toString(), 301);
 }
 url.pathname = '/facility-assist-page';
 return env.ASSETS.fetch(new Request(url, request));
}
