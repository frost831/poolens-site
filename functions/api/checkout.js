export async function onRequestGet({ request }) {
 const url = new URL(request.url);
 const requestedPlan = (url.searchParams.get('plan') || 'monthly').toLowerCase();
 const plan = requestedPlan === 'yearly' || requestedPlan === 'annual' ? 'yearly' : 'monthly';
 const destination = new URL('https://app.splashlens.com/');
 destination.searchParams.set('upgrade', plan);
 destination.searchParams.set('placement', 'site_legacy_checkout');
 destination.searchParams.set('utm_source', 'site');
 return Response.redirect(destination, 302);
}
