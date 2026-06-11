# SplashLens Full Audit and Mac Handoff

Updated: May 26, 2026

## Executive Call

SplashLens is coherent enough to keep launching as a web PWA today. The homepage and app now mostly say the same thing: free field-rescue tools, manual/offline core, online AI scanner, and optional web PartSnap Pro for unlimited scans.

The native app-store path needs one hard rule: submit the store wrapper in free-core mode, not the normal web checkout mode. Apple and Google both treat subscriptions or paid access to app functionality as native billing territory unless a specific policy exception applies. The app now supports store wrapper mode through:

- iOS wrapper URL: `https://app.splashlens.com/?store=ios`
- Android wrapper URL: `https://app.splashlens.com/?store=android`

Those modes suppress direct Stripe upgrade CTAs when the scan limit is reached.

## Verified Live State

| Surface | Status | Notes |
|---|---:|---|
| `https://splashlens.com/` | 200 | Shows PartSnap Pro, free field tools, checkout links |
| `https://splashlens.com/privacy` | 200 | Mentions online AI scanner, Stripe, email capture, anonymous launch events |
| `https://splashlens.com/terms` | 200 | Updated to free-core plus paid web checkout posture |
| `https://splashlens.com/route-ready` | 200 | Free pilot page is live |
| `https://splashlens.com/blog/` | 200 | Blog index is live, but contains stale old-positioning posts |
| `https://app.splashlens.com/` | 200 | App loads with 10 free AI scans monthly |
| `https://app.splashlens.com/api/scan` | 200 on valid JPEG POST | Valid test image returned low-confidence JSON |
| `https://splashlens.com/api/event` | 200 on POST | Writes to D1 `events` table |
| `https://splashlens.com/api/subscribe` | 200 on valid POST | Writes to D1 `subscribers` table |

## What Is Wired

- `poolens` app deploys to Cloudflare Pages project `poolens`.
- `poolens-site` deploys to Cloudflare Pages project `poolens-site`.
- AI scanner backend: `poolens/functions/api/scan.js`.
- Site event capture: `poolens-site/functions/api/event.js`.
- Route Ready email capture: `poolens-site/functions/api/subscribe.js`.
- Checkout redirect functions exist on both app and site.
- D1 database `splashlens-subscribers` has tables:
  - `events`
  - `subscribers`
- First-party event tracking captures:
  - `site_page_view`
  - `open_app_click`
  - `checkout_click`
  - `ai_scan_started`
  - `partsnap_result`
  - `affiliate_click`
  - `part_search_click`
  - `store_scan_limit_reached`

## High-Risk Gaps

### P0 - Native Store Payment Compliance

Web checkout is fine for the web PWA. It is not safe to submit the normal web checkout flow inside a store-distributed native wrapper for paid unlimited AI scans.

Mac must wrap:

- iOS: `https://app.splashlens.com/?store=ios`
- Android: `https://app.splashlens.com/?store=android`

Do not wrap plain `https://app.splashlens.com` for store submission unless native IAP / Google Play Billing is added first.

Sources:

- Apple App Review Guideline 3.1.1 / 3.1.3 payment rules: https://developer.apple.com/app-store/review/guidelines/
- Google Play Payments policy: https://support.google.com/googleplay/android-developer/answer/9858738

### P0 - Paid Entitlement Is Not Real Yet

PartSnap Pro checkout is live, but entitlement enforcement is not production-grade:

- Scan limit is localStorage only.
- "I already upgraded" unlock is local-device trust.
- No Stripe webhook.
- No account login.
- No server-side subscription validation.

This is acceptable for a fast season web launch, but it is not a real subscription system. Do not tell store reviewers, partners, or buyers that account-based subscription entitlement is built.

### P0 - AI Cost Abuse Risk

Immediate fix added in the PoolLens source repo: `/api/scan` now has exact-origin CORS, image size checks, fail-closed AI key handling, optional Cloudflare Rate Limiting, optional KV monthly metering, and a production fail-closed path when no server metering binding is present.

Next fix: bind `SCAN_USAGE_KV` and `SCAN_RATE_LIMITER` in the `poolens` Cloudflare Pages project, then consider Turnstile or account-based entitlement before paid traffic scales.

### P1 - Blog/SEO Layer Has Drift

The homepage and app are aligned, but old blog posts and docs still contain stale language:

- `PoolLens` / `poolens.pages.dev` references remain in older blog posts and docs.
- Some blog posts describe AI scanner as "coming" or "preview" while scanner is live.
- Some posts mention account management and sync features that are not in the current app.
- Older docs and some generated content still contain pre-pivot language. The top-level `llms.txt` has been corrected, but the broader blog/docs layer still needs cleanup.

This is not launch-blocking for the app, but it is trust debt and AEO/SEO drift.

### P1 - Route Ready Claims Need Tightening

Route Ready is correctly positioned as free pilot, but some copy implies certificates and verification flows that are not built:

- The public Route Ready page has been tightened to say certificate and verification flows are planned, not live.
- Keep future copy in that posture until the module content and verification endpoint are actually built.

Recommended: keep Route Ready as "planned certificate / pilot feedback" until content and verification are built.

### P1 - Affiliate Disclosure Not Ready

Amazon buy links exist, but `AFFILIATE_TAG` is still `YOUR_TAG`, so no commission is active. Once an affiliate tag is added, the site/app needs a clear affiliate disclosure near buy links and in Terms/Privacy.

FTC guidance requires material connections to be disclosed clearly and conspicuously.

Source: FTC endorsement/affiliate disclosure guidance: https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides

### P1 - Privacy Is Better But Could Be More Specific

Privacy now discloses online scanner, email capture, Stripe, and anonymous launch events. If we want it tighter, add that event rows may include user agent, referrer, approximate country, event name, and path.

### P2 - PWA Manifest Uses SVG Only

The PWA manifest only includes `favicon.svg`. Store wrappers and Play listings usually want PNG icon assets at standard sizes. Mac should generate:

- 1024x1024 App Store icon
- 512x512 Play icon
- 192x192 and 512x512 PWA icons
- maskable icon if TWA tooling asks for it

### P2 - No Native Screenshots Packet Yet

We need real phone screenshots, not just website screenshots:

- Home/rescue screen
- Error code lookup result
- Chemical dosing calculator
- AI scanner mode selector
- PartSnap result
- Service note/report screen
- Store free-mode scan limit screen

## Website/App Alignment

### Aligned

- "Stuck at the equipment pad?" field rescue wedge.
- Free core tools.
- Manual lookup offline after first load.
- AI scanner online only.
- PartSnap Pro as web paid launch product.
- Route Ready as future/free pilot layer.

### Not Fully Aligned

- Blog/AEO layer still has older PoolLens and coming-soon language.
- Old handoff/business docs still mention paid-first PoolLens Pro / Learn assumptions.
- Some route/training copy overstates unbuilt certificate verification.
- Store wrapper handoff had to be corrected to free-core mode; Mac must not use old plain URL assumptions.

## Mac Build Handoff

### Step 1 - Pull Current Repos

```bash
cd ~/Dropbox/Projects/poolens
git pull
git rev-parse --short HEAD

cd ~/Dropbox/Projects/poolens-site
git pull
git rev-parse --short HEAD
```

Expected minimum commits after this handoff:

- `poolens`: includes store wrapper mode and `STORE_WRAPPER_HANDOFF.md`
- `poolens-site`: includes updated terms/privacy, launch analytics, and this audit file

### Step 2 - iOS Wrapper Target

Wrap this exact URL:

```text
https://app.splashlens.com/?store=ios
```

Do not use the plain app URL for App Store review until native billing or approved external purchase handling is in place.

Suggested iOS listing:

```text
SplashLens is a free field rescue app for pool service technicians. Search pool equipment error codes, calculate chemical doses, create service notes, follow filter guides, and use online AI scanning for equipment displays, pool parts, and test strips.
```

Short subtitle:

```text
Pool tech error codes and dosing
```

Review notes:

```text
SplashLens is a utility/reference app for pool service professionals. No account is required. Manual tools work offline after first load. AI camera scanning is user-initiated and requires internet. Pool/customer data is stored locally on the device. This App Store build uses the free-core store mode and does not present direct external Stripe upgrade buttons.
```

### Step 3 - Android Wrapper Target

Wrap this exact URL:

```text
https://app.splashlens.com/?store=android
```

Suggested Play short description:

```text
Free pool tech field app: error codes, dosing, service notes, and online AI scanner.
```

Data Safety declarations:

- App activity: feature usage events if the native wrapper surfaces web analytics; do not mark as sold.
- Photos/videos: user-initiated camera images for AI scanner processing.
- Personal info: no account required in wrapper; do not claim email collection unless routing users to web waitlist inside the wrapper.
- Payment info: not collected in store wrapper mode.
- Data deletion: local browser/site data can be cleared by uninstalling or clearing app data; email deletion requests through `hello@splashlens.com` if they used the web waitlist.

### Step 4 - Screenshot Run

Use a clean simulator/device install.

1. Launch app with `?store=ios` or `?store=android`.
2. Confirm home screen says "10 free AI scans monthly. Manual tools stay free."
3. Search an error code like `E05` and capture a result.
4. Open Dosing and capture a chlorine/pH calculation.
5. Open Scan and capture the mode bar.
6. Use a test image if simulator camera is unavailable, or capture real-device camera permission.
7. Exhaust or mock the scan limit only if feasible; confirm no Stripe checkout buttons appear in store mode.
8. Capture service note/report screen.
9. Open Privacy from the web listing if needed and verify it matches current data collection.

### Step 5 - Store Submission No-Go Checks

Do not submit if any of these are true:

- Store wrapper shows `$4.99`, `$39`, "Upgrade Monthly", "Save Annual", or direct Stripe checkout.
- Store wrapper opens `https://buy.stripe.com/...` from inside the app.
- Store review notes claim subscription entitlement/account sync exists.
- App screenshots include checkout buttons.
- Privacy answers omit user-submitted images for AI scanner processing.
- Route Ready is represented as a paid or completed training product.

### Step 6 - After Store Approval

If approved as free-core:

- Keep web PWA monetization active separately.
- Use store listings mainly as discovery and trust.
- Drive techs to use the app, not to buy inside the app.
- Build native billing later if store channel usage proves worth it.

## Immediate Next Fix List

1. Clean `llms.txt` and top 20 blog posts for current product truth.
2. Add server-side scan metering/rate limiting.
3. Add affiliate disclosure before any Amazon tag goes live.
4. Generate proper PNG app icons.
5. Create a screenshot packet for Mac/App Store/Play.
6. Decide whether PartSnap Pro stays web-only or gets native IAP later.
