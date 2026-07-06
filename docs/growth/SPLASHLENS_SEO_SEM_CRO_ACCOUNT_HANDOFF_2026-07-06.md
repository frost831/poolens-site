# SplashLens SEO / SEM / CRO Account Handoff - 2026-07-06

## Repo-Side Changes Completed

- Added explicit GA4 event wrapper in `ga4.js`.
- Mapped core conversion events:
  - `checkout_click` -> GA4 `begin_checkout`
  - `app_store_download_click` -> GA4 `select_app_store`
  - `google_play_download_click` -> GA4 `select_google_play`
  - `open_app_click` -> GA4 `open_app`
  - `partsnap_click` -> GA4 `select_partsnap`
  - `team_deployment_click` and `route_ready_notify_submit` -> GA4 `generate_lead`
- Preserved attribution params on GA4 events:
  - `utm_source`
  - `utm_medium`
  - `utm_campaign`
  - `utm_content`
  - `utm_term`
  - `gclid`
  - `gbraid`
  - `wbraid`
- Added five paid/search landing pages:
  - `/lp/pool-parts-id-app.html`
  - `/lp/pool-equipment-troubleshooting-app.html`
  - `/lp/pool-chemical-calculator-app.html`
  - `/lp/pool-tech-app.html`
  - `/lp/pool-service-training-app.html`
- Added shared landing page assets:
  - `/paid-search.css`
  - `/paid-search.js`
- Added the landing pages to:
  - `/sitemap.xml`
  - `/ai.txt`
  - `/llms.txt`

## GA4 Account Steps

Property expected by repo: `G-9BGE6WFF23`.

1. Open Google Analytics.
2. Confirm the SplashLens web stream uses measurement ID `G-9BGE6WFF23`.
3. Open Realtime.
4. Visit these pages with a test UTM:
   - `https://splashlens.com/lp/pool-parts-id-app.html?utm_source=qa&utm_medium=test&utm_campaign=conversion-proof`
   - `https://splashlens.com/lp/pool-equipment-troubleshooting-app.html?utm_source=qa&utm_medium=test&utm_campaign=conversion-proof`
5. Click:
   - Open SplashLens Free
   - Try PartSnap Free
   - Download on the App Store
   - Get it on Google Play
   - Upgrade Scanner
6. In GA4 Admin -> Events, confirm events arrive:
   - `paid_landing_view`
   - `open_app`
   - `select_partsnap`
   - `select_app_store`
   - `select_google_play`
   - `begin_checkout`
7. Mark these as key events/conversions:
   - `begin_checkout`
   - `select_app_store`
   - `select_google_play`
   - `open_app`
   - `generate_lead`

## Google Search Console Steps

1. Open Search Console for `https://splashlens.com/`.
2. Confirm submitted sitemaps:
   - `sitemap.xml`
   - `pseo-sitemap.xml`
   - `seo-hub-sitemap.xml`
   - `category-hub-sitemap.xml`
3. Submit/refresh `sitemap.xml` after deploy because it now includes the paid/search landing pages.
4. Export last 28 days performance with:
   - Queries
   - Pages
   - Clicks
   - Impressions
   - CTR
   - Average position
5. Prioritize pages with high impressions and low CTR for title/meta rewrites.

## Google Ads / PPC Steps

Do not spend broadly until GA4 key events are visible in Realtime and marked as conversions.

Starter ad groups:

1. Pool parts ID app
   - Landing page: `https://splashlens.com/lp/pool-parts-id-app.html`
   - Intent: mystery part, pool part finder, pool pump part identification.
2. Pool equipment troubleshooting
   - Landing page: `https://splashlens.com/lp/pool-equipment-troubleshooting-app.html`
   - Intent: pool error codes, pump/heater/salt/robot troubleshooting.
3. Pool chemical calculator
   - Landing page: `https://splashlens.com/lp/pool-chemical-calculator-app.html`
   - Intent: pool chemical calculator, pool dosing calculator, SLAM calculator.
4. Pool tech app
   - Landing page: `https://splashlens.com/lp/pool-tech-app.html`
   - Intent: pool service app, pool tech app, field app.
5. Pool service training app
   - Landing page: `https://splashlens.com/lp/pool-service-training-app.html`
   - Intent: pool tech training, pool service training, CPO training companion.

Suggested first test:

- Budget: small validation budget only.
- Bidding: maximize clicks only if conversion import is not ready; switch to conversion-focused bidding after events are trusted.
- Exclude homeowner-only terms if the campaign is aimed at pros.
- Keep brand/manufacturer endorsement language out of ads.

## Google Business Profile

SplashLens is national software, not a local pool service company. GBP is useful for brand legitimacy only.

Recommended setup if Google allows the profile:

- Business name: SplashLens
- Category: Software company
- Website: `https://splashlens.com`
- Service area: United States
- Hide physical address unless there is a deliberate public office decision.
- Description: `SplashLens is a field reference app for pool service technicians, with PartSnap pool parts ID, equipment troubleshooting, chemical calculators, offline manual tools, and service documentation workflows.`
- Do not describe SplashLens as a pool service contractor.

## Current Truth

- Repo/code can support the growth loop.
- Deployed on 2026-07-06 to Cloudflare Pages. Production URLs checked at `https://splashlens.com`.
- Live production checks passed for:
  - `/paid-media.html`
  - `/lp/pool-parts-id-app.html`
  - `/lp/pool-equipment-troubleshooting-app.html`
  - `/lp/pool-chemical-calculator-app.html`
  - `/lp/pool-tech-app.html`
  - `/lp/pool-service-training-app.html`
  - six AEO answer pages for PartSnap, robots, automation, lights, salt cells, and pool tech workflows.
- Sitemap counts after deploy:
  - `sitemap.xml`: 347 URLs
  - `pseo-sitemap.xml`: 253 URLs
  - `seo-hub-sitemap.xml`: 19 URLs
  - `category-hub-sitemap.xml`: 9 URLs
- First-party usage endpoint verified after deploy:
  - latest event: `open_app_click`
  - latest path: `/paid-media.html?utm_source=codex&utm_medium=test&utm_campaign=ga4_realtime_probe`
  - events last 7 days at verification time: 34
  - events last 30 days at verification time: 125
- Browser proof confirmed the GA4 script loaded and sent a GA collect request for the paid/media page.
- Browser proof confirmed the GA4 data layer received a `begin_checkout` event with UTM attribution.
- GA4 Realtime screen, Google Search Console sitemap status, Bing Webmaster Tools sitemap status, and Google Ads conversion settings still require authenticated console access.
- PPC should not be scaled until GA4 key events and Search Console linking are confirmed inside Google.
