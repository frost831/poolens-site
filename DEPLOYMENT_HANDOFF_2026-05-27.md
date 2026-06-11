# SplashLens Site Deployment Handoff - 2026-05-27

## Done

- Branch pushed: `splashlens-site-claims-authority-2026-05-27`.
- Public language now uses SplashLens as the brand and PoolLens as internal/source context.
- Subscribe endpoint now has exact-origin CORS, D1-backed rate limiting, and optional Turnstile.
- Checkout links can be supplied by env vars.

## Cloudflare Requirements

- `SUBSCRIBERS_DB`
- `SPLASHLENS_ALLOWED_ORIGINS`
- Optional: `TURNSTILE_SECRET_KEY`
- Recommended: `STRIPE_MONTHLY_LINK`, `STRIPE_YEARLY_LINK`

## Deployment Steps

1. Pull the branch.
2. Configure Cloudflare Pages bindings/env vars.
3. Deploy preview.
4. Test `/api/subscribe`, `/api/checkout?plan=monthly`, privacy, terms, route-ready, and `llms.txt`.
5. Confirm no separate PoolLens public brand path is being marketed.

## Blockers

- Add affiliate disclosure before real affiliate traffic.
- Route Ready remains planned/pilot language, not a completed certification product.
