export async function onRequest({ request }) {
 const url = new URL(request.url);
 url.pathname = '/facility-assist';
 return Response.redirect(url.toString(), 301);
}
