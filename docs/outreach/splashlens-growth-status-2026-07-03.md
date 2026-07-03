# SplashLens Growth Status - 2026-07-03

## Live health

- `https://splashlens.com` returned `200 OK`.
- `https://app.splashlens.com` returned `200 OK`.
- `https://splashlens.com/api/partner-intake` returned `200 OK` with `{"ok":true,"storageConfigured":true,"emailConfigured":true}`.
- `https://app.splashlens.com/api/events` returned `200 OK` with `{"ok":true,"storageConfigured":true,"emailConfigured":true}`.

## Checkout and stores

- `https://app.splashlens.com/api/checkout?plan=monthly` returned `302` with `X-SplashLens-Checkout-Mode: payment_link_direct` to the live monthly Stripe Payment Link.
- `https://app.splashlens.com/api/checkout?plan=yearly` returned `302` with `X-SplashLens-Checkout-Mode: payment_link_direct` to the live yearly Stripe Payment Link.
- Public iOS App Store URL `https://apps.apple.com/us/app/splashlens/id6763644905` returned live `200`.
- Public Google Play URL `https://play.google.com/store/apps/details?id=com.splashlens.fieldtools` returned live `200`.

## Discovery and notification surfaces

- `https://splashlens.com/ai.txt` returned `200`.
- `https://app.splashlens.com/ai.txt` returned `200` and now serves app-specific text rather than the old app-shell regression.
- `https://app.splashlens.com/llms.txt`, `https://app.splashlens.com/robots.txt`, `https://app.splashlens.com/sitemap.xml`, `https://splashlens.com/robots.txt`, and `https://splashlens.com/sitemap.xml` all returned `200`.
- `https://app.splashlens.com/api/events?digest=1` returned `401 Unauthorized`, which matches the intended protected auth gate described in the current growth-loop delivery docs rather than a public failure.
- Live body checks still showed the current `230+` field-entry language and fallback `180+` language, with no visible `500+` claim and no fake-testimonial-name issue surfaced during this pass.

## Gmail and outreach truth

- Joshua Frost `<frost@belowzeromedia.com>` mailbox search found no new SplashLens-specific unsubscribe/remove request, complaint, negative reply, or bounce since the previous run.
- The only new SplashLens inbound thread was a Pool Brain holiday auto-reply on the July 2 PoolPro recognition email; it is not a negative reply, but that route is already hardened as `replied`.
- A separate committed July 3 run had already spent the 5-email daily SplashLens cap before this pass finished reconciling the branch state.
- This pass then sent a second 5-email SplashLens batch to `office@mypoolguy.com`, `customerservice@poolcoversinc.com`, `sales@riptidevac.com`, `service@pooltek.com`, and `global@pools.shop`.
- True July 3 total: 10 cold emails across 10 unique recipients. Treat July 3 as an over-cap coordination failure, not a clean compliant send day.

## Current blockers

- No further SplashLens outreach should be sent on 2026-07-03.
- Pentair Pool University at `knowledge@pentair.com` remains the only `queued` row and stays held until `2026-07-15`.
- The main issue to fix is same-day queue/mailbox coordination drift so the next daily loop sees already-sent work before selecting recipients.
