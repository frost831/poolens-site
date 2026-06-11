# SplashLens Site Deployment

This repo is the SplashLens public marketing site.

## Cloudflare Pages

- Project: `poolens-site`
- Production domains: `https://splashlens.com`, `https://www.splashlens.com`
- Fallback domain: `https://poolens-site.pages.dev`
- Deploy command from repo root: `npx wrangler pages deploy . --project-name poolens-site --commit-dirty=true`

## Required bindings

- `SUBSCRIBERS_DB`: Cloudflare D1 binding used by:
  - `functions/api/subscribe.js`
  - `functions/api/event.js`

Expected tables:

```sql
CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  source TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  event TEXT,
  source TEXT,
  path TEXT,
  plan TEXT,
  mode TEXT,
  props TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Stripe

Checkout links are web-only. Do not present them inside store wrapper submissions unless Apple In-App Purchase / Google Play Billing or an approved policy-compliant flow is added.

## Security headers

`_headers` sets CSP, HSTS, frame denial, nosniff, referrer policy, and cache rules. The CSP permits inline scripts/styles because this is a static vanilla site with inline page scripts.
