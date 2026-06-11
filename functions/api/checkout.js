function links(env) {
  return {
    monthly: env.STRIPE_MONTHLY_LINK || 'https://buy.stripe.com/7sY7sE2aIaq31cE5EF8AE0O',
    yearly: env.STRIPE_YEARLY_LINK || 'https://buy.stripe.com/aFa28k9Da69NdZq3wx8AE0P',
    annual: env.STRIPE_YEARLY_LINK || 'https://buy.stripe.com/aFa28k9Da69NdZq3wx8AE0P',
  };
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const plan = (url.searchParams.get('plan') || 'monthly').toLowerCase();
  const planLinks = links(env);
  const target = planLinks[plan] || planLinks.monthly;
  return Response.redirect(target, 302);
}
