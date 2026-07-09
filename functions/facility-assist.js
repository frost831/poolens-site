export async function onRequest({ request, env }) {
 const url = new URL(request.url);
 url.pathname = '/facility-assist-page';
 return env.ASSETS.fetch(new Request(url, request));
}
