export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  url.pathname = '/service-proof-passport.html';
  return env.ASSETS.fetch(url.toString(), request);
}

