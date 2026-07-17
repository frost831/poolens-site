# SplashLens Search Visibility Tracking - 2026-07-06

## Canonical Property

- Site: `https://splashlens.com/`
- App: `https://app.splashlens.com/`
- GA4 measurement ID in repo: `G-9BGE6WFF23`
- Primary sitemap: `https://splashlens.com/sitemap.xml`
- Supporting sitemaps:
  - `https://splashlens.com/pseo-sitemap.xml`
  - `https://splashlens.com/seo-hub-sitemap.xml`
  - `https://splashlens.com/category-hub-sitemap.xml`
  - `https://splashlens.com/source-pages-sitemap.xml`

## Search Console Weekly Pull

Export the last 28 days every Monday and paste the top movers below.

| Date | Query | Page | Clicks | Impressions | CTR | Avg Position | Action |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| 2026-07-06 | pending console export | pending |  |  |  |  | Verify sitemap processing after deploy |
| 2026-07-17 | language expansion watch | `/languages/`, `/es/`, `/ca/`, `/fr-ca/`, `/pt-br/`, `/ht/` |  |  |  |  | Confirm fresh sitemap processing and watch app-open lift |

## Console Submission Checklist

Google sitemap submission must be confirmed in the authenticated Search Console property because Google's public sitemap ping endpoint is deprecated.

Google Search Console:

- Property: `https://splashlens.com/`
- Console URL: `https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fsplashlens.com%2F`
- Submit or verify:
  - `sitemap.xml`
  - `pseo-sitemap.xml`
  - `seo-hub-sitemap.xml`
  - `category-hub-sitemap.xml`
  - `source-pages-sitemap.xml`

Bing Webmaster Tools:

- Site: `https://splashlens.com/`
- Console URL: `https://www.bing.com/webmasters/`
- Submit or verify:
  - `https://splashlens.com/sitemap.xml`
  - `https://splashlens.com/pseo-sitemap.xml`
  - `https://splashlens.com/seo-hub-sitemap.xml`
  - `https://splashlens.com/category-hub-sitemap.xml`
  - `https://splashlens.com/source-pages-sitemap.xml`
- Automation option: wire Bing Webmaster API only after a valid account API key is available in the runtime. No Bing API key was present in the local environment during this pass.

2026-07-17 evidence:

- `https://splashlens.com/sitemap.xml` returned HTTP 200 and includes `/languages/`, `/pt-br/`, and `/ht/`.
- `https://splashlens.com/robots.txt` returned HTTP 200 and references all five sitemap files.
- `https://splashlens.com/ai.txt` and `https://splashlens.com/llms.txt` returned HTTP 200 and now expose the language-support hub and pilot/demand pages.
- Google Search Console and Bing Webmaster Tools still require authenticated console confirmation for final "Submitted/Success" state.

## Pages To Watch First

| Page | Intent | Primary KPI | Next CRO/SEO Action |
| --- | --- | --- | --- |
| `/paid-media.html` | media and paid traffic | open app, store click, checkout click | Hold PPC until GA4 Realtime events are confirmed |
| `/lp/pool-parts-id-app.html` | pool parts ID app | PartSnap click, checkout click | Test headline against part-identification search traffic |
| `/what-app-identifies-pool-parts.html` | AEO answer | impressions, PartSnap click | Expand with real field examples as corpus grows |
| `/pool-robot-troubleshooting-app.html` | robot troubleshooting | open app, query growth | Add new robot model cards as they are verified |
| `/pool-automation-troubleshooting-app.html` | connected pool | open app, query growth | Add specific automation family pages |
| `/pool-light-troubleshooting-app.html` | pool lighting | open app, query growth | Add niche/transformer/retrofit terms |
| `/salt-cell-troubleshooting-app.html` | salt systems | open app, query growth | Add cell/controller family aliases |
| `/pool-tech-field-reference-app.html` | tech workflow | open app, install click | Add proof/passport and training examples |
| `/languages/` | language-support answer | language app open, requested-language event | Watch Spanish, French Canada, Portuguese, Haitian Creole demand before deeper localization |
| `/es/` | Spanish field support | Spanish app open, PartSnap, proof save | Expand in-app Spanish proof prompts and store metadata |
| `/ca/` | Canada market pilot | Canada app open, Facility Assist, PartSnap | Pair with Canadian pool/spa outreach |
| `/fr-ca/` | French-Canadian pilot | French requested-language event | Build full French only after usage or partner signal |
| `/pt-br/` | Portuguese demand capture | Portuguese requested-language event | Keep page live; do not build full app translation until dashboard shows demand |
| `/ht/` | Haitian Creole demand capture | Haitian Creole requested-language event | Keep page live; test South Florida/facility lane first |

## CTR Fix Rule

If a page has high impressions and low CTR, update only one thing at a time:

1. Title tag.
2. Meta description.
3. First visible headline.
4. Opening answer block.

Track the change date in this file so the Search Console lift can be attributed.

## Paid Gate

PPC remains on hold until all are true:

- `/paid-media.html` is live.
- GA4 Realtime shows `open_app`, `select_partsnap`, `begin_checkout`, `select_app_store`, and `select_google_play`.
- First-party `/api/event` logs the same click path.
- Google Search Console has accepted the refreshed sitemap.
- Bing Webmaster Tools has accepted the refreshed sitemap or the Bing API is wired with a valid account key.

## GBP Decision

Google Business Profile is optional and should be treated as brand legitimacy, not local-service SEO.

Recommended decision: create only if SplashLens can be listed honestly as a software company with real company contact details. Do not create a fake pool-service or service-area profile.
