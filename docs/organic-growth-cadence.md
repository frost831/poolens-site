# SplashLens organic publishing operations

Owner direction: grow organic discovery without buying placements, subscriptions, advertising, backlinks or reviews. This uses the existing site and local Codex workflow. Existing hosting and Codex usage remain subject to their current plans; no claim of zero operating cost is made. Private partnership correspondence is excluded from public sources.

## Cadence that is already live

Field Notes publishes one bounded documentation note every day at 08:00 America/Chicago through January 26, 2027. At the November 20, 2026 check, 53 articles were public and 67 were future scheduled releases. All 25 production smoke checks passed. All 12 official reference routes responded HTTP 200. Reachability does not validate every statement or establish technical review.

Keep the 120-note release clock, stable URLs and original publication dates. Do not create a competing daily generator or duplicate these articles. The current notes are short reference prompts; the scheduled count is not proof of substantive depth, indexing, audience growth or sales.

## Weekly work

| Time, America/Chicago | Deliverable |
| --- | --- |
| Monday 09:00 | Check live feed, latest article, sitemap and future-page exclusion. Read available Search Console/Bing and aggregate referral/conversion evidence. Select one existing page to improve using the eight-week plan below; record actual evidence and uncertainty. |
| Thursday 09:00 | Finish one substantive improvement to that page: a direct answer, a verified app workflow, a useful example/checklist, precise source links, boundaries and the relevant app CTA. Recheck the facts and submit the tested change in a PR. Publish only after release approval, then verify the custom domain and record the release SHA. |
| First Thursday each month | Include an ASO review alongside the page improvement. Compare the live store text and screenshots with the shipped app; prepare accurate metadata/screenshot changes for the Android and Mac iOS release lanes. |
| January 14, 2027 | Review the next cycle before the January 26 series ends. Continue only with useful distinct material and current evidence; do not automatically generate another bulk series. |

One substantial improvement per week is a working starting point, not a search-engine requirement. If the evidence or qualified review is missing, keep the current page intact and finish a different verified documentation improvement. Do not publish a thinner substitute to fill a quota. Use actual dates for updates and visible correction notes; an unchanged page does not get a new date.

## Eight-week calendar

These are improvements to existing public product/reference pages, not duplicate new keyword URLs. The paired Field Note keeps its existing release date. Each week produces one reviewed page change and two reusable text excerpts (a direct answer and a short checklist) saved with that change. Excerpts are ready for later authorized social use; this cadence does not send messages or publish social posts.

| Week beginning | Improve this existing page | Reader question and useful addition | Related scheduled note |
| --- | --- | --- | --- |
| Nov 23, 2026 | `/partsnap-proof-library.html` | What evidence helps before ordering an unidentified pool part? Add an annotated equipment-label/overview example, distinguish candidate matches from confirmed fit and show the supplier handoff. Use public or isolated QA equipment only. | `sl-field-058`, Nov 25, spa records |
| Nov 30 | `/pool-robot-troubleshooting-app.html` | What should I record before asking for robot-cleaner support? Separate cleaner, power supply and battery identity; show the official model-manual lookup and the limits of visual identification. | `sl-field-068`, Dec 5, robot purchase questions |
| Dec 7 | `/spa-hot-tub-troubleshooting-app.html` | What belongs in a spa-service handoff? Build a fictional record clearly labeled as an example, with observation time, source, unresolved concern and next contact. No treatment or diagnosis. | `sl-field-075`, Dec 12, spa symptom timeline |
| Dec 14 | `/pool-automation-troubleshooting-app.html` | What does a freeze-mode screenshot establish? Show controller identity, displayed state and capture time; explain that a screenshot does not prove equipment operation or freeze protection. | `sl-field-079`, Dec 16, freeze-mode screenshots |
| Dec 21 | `/closing-season.html` | How do I preserve closing and winter-visit records? Show linked observations, declined work and a named follow-up without asserting winterization success or emergency protection. | `sl-field-085`, Dec 22, outage questions |
| Dec 28 | `/service-proof-passport.html` | What should a technician hand to the next person? Show a sanitized sample packet with evidence, source applicability and unresolved items. Recheck the actual export workflow before describing format or persistence. | `sl-field-094`, Dec 31, year-end field notes |
| Jan 4, 2027 | `/pool-robot-troubleshooting-app.html` | How does battery variant change a support request? Improve the existing robot page with current official storage-reference routing, exact identity and a sample question. Do not supply charging/storage settings without the applicable manual and review. | `sl-field-102`, Jan 8, battery variant |
| Jan 11 | `/pool-parts-identification.html` | What should be confirmed before a spring parts order? Add a worked identity-to-source-to-supplier-verification example and an unresolved-fit checklist; distinguish planned equipment from installed equipment. | `sl-field-106`, Jan 12, spring bookings |

For each edit, verify the shipped app flow as well as the existing public page. Primary sources start at `editorial/sources.mjs` and the source library, but a manufacturer homepage alone is insufficient evidence for model-specific instructions. Cite the exact applicable document/section when making a specific claim. Remove claims that cannot be supported. No invented tests, reviewers, case studies, reviews, usage counts or manufacturer endorsements.

## SEO and answer discovery

Use one clear reader question per improved section, answer it directly in visible HTML, give a practical example and link to the precise supporting source. Keep the canonical, descriptive title, relevant internal links, accessible real screenshots, matching visible/schema information and genuine update history. Avoid keyword stuffing, near-duplicate location/model pages and mass AI paraphrases.

The same approved material must drive the public page and any chatbot/index excerpt. Run the existing FAQ compiler and stale-index checks whenever an approved source changes. Do not add private mail, account records or unsupported billing/privacy/retention claims to either surface. Route account, billing and privacy actions to their official workflows.

The sitemap index, RSS and AI inventory already share the Field Notes release source. Run `node tools/check-organic-discovery.mjs` during each cadence check. It fails for stale/missing feed items, future content leaks, missing current sitemap items and public noindex headers. Run `node tools/smoke-field-notes.mjs` for the wider 25-route delivery and private-file checks. Neither command proves indexing or a genuine crawler visit.

### Current official guidance, checked November 20, 2026

| Channel | Supported action and limitation | Official source |
| --- | --- | --- |
| Google Search / AI answers | Keep useful pages crawlable, indexable and internally linked, with visible text and matching structured data. Google says no additional AI markup or special AI text file is required. Eligibility does not guarantee inclusion. | [Google AI features](https://developers.google.com/search/docs/appearance/ai-features) |
| ChatGPT search | `OAI-SearchBot` governs automated search crawling; `GPTBot` is a separate training setting. The current wildcard and explicit search-bot rules allow access. Check actual CDN/WAF evidence before changing rules. | [OpenAI crawlers](https://developers.openai.com/api/docs/bots) |
| Claude | Search uses `Claude-SearchBot`; user-directed retrieval uses `Claude-User`; training uses `ClaudeBot`. The existing wildcard allows them. Training permission is not a search-ranking technique. | [Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| Perplexity | Allow `PerplexityBot` for search. User-directed fetches use `Perplexity-User`. Genuine identity requires the appropriate published IP ranges as well as the user agent. Do not broadly disable WAF protection. | [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) |
| Grok | xAI documents real-time web search and page retrieval. No verified owner submission or guaranteed-recommendation program was established in this review. Maintain accessible useful sources and measure actual citations; do not invent a crawler token or buy a supposed recommendation. | [xAI web search](https://docs.x.ai/developers/tools/web-search) |

Keep existing training preferences unchanged. `llms.txt` and `ai.txt` remain optional discovery aids, not permissions or guaranteed ranking signals. A successful request from our PC, even with a crawler-looking user agent, does not prove that provider can fetch through its own infrastructure. Record genuine crawler identity only from verified origin/IP or provider evidence.

## Store discovery review

Blog discovery and store discovery are separate funnels. Store links must point to verified live listings. Each monthly review checks the shipped feature set, truthful title/short description/subtitle/keywords, relevant category, current support/privacy links, and real screenshots showing the main workflow. Avoid diagnosis, confirmed fit, supported-brand counts or subscription promises unless currently proven. Do not add competitor trademarks to keywords or manufacture/incentivize reviews.

For Android, prepare the change against the live listing and validate through Play Console before publishing. For iOS, send only the finished metadata/screenshot packet to the existing Mac build lane; Mac owns iOS submission. Do not create a duplicate iOS job. Use [Google's listing guidance](https://support.google.com/googleplay/android-developer/answer/13393723) and [Apple's product-page guidance](https://developer.apple.com/app-store/product-page/). Apple distinguishes keyword metadata from promotional text; promotional text does not affect search ranking. Store metadata changes are not included in this site's deployment.

## Measurement and decision rules

Save one dated aggregate record under `docs/growth/reviews/` per real run. Include invocation time/timezone, manual versus scheduler origin when established, checked URLs, source verification dates, source commit, exact changed page and release outcome. Keep private contacts, raw chat, authentication data and customer records out of Git and analytics.

- Search: 28-day impressions, clicks, CTR, query/page pairs, indexing and sitemap-processing evidence from authenticated Google/Bing properties when available. Public search results are observations, not complete indexing reports.
- Answer engines: dated exact question, engine and cited URL/section from an actual observed response. A crawler rule or brand mention is not a recommendation. Do not buy API calls to manufacture a report.
- Activation: consented aggregate article-to-app CTA clicks and verified completed PartSnap/proof actions where the existing instrumentation supports them. An app/store click is not an install or paying customer.
- Commercial: verified purchases/subscription events reported separately from checkout opens and test purchases.

Use 28-day trends and comparable query/page intent; do not choose winners from a handful of visits. With sparse data, follow the next distinct calendar topic and label the decision as editorial. Change one major title/answer/CTA variable at a time. Prioritize useful answers and activation over raw page count. Retention and paid conversion still require actual customer evidence.

## Release and external gates

Canonical repository: `C:\Users\sales\Documents\Codex\Flagships\poolens-site`. Work from current `master` on a feature branch; preserve other work. Follow the portfolio Git-health check and repository tests. Open a PR with the sources, visible content diff, preview/check results and actual gaps; preserve release approval. A pushed branch is not production.

For an approved public change, run `node tools/stage-public-assets.mjs` and deploy only its returned directory with Functions bundled from the repo root, following `docs/field-notes-operations.md`. Verify changed custom-domain pages, sitemap, RSS, AI inventory and FAQ index together. Never deploy the repository root.

Authenticated Search Console/Bing ownership, genuine provider crawler traffic, current store-console metrics and actual AI recommendations are not established by the November 20 public audit. Use existing authorized access when available; record an exact access gap without pretending submission, indexing or ranking. No new credential, paid tool or expanded permission is required to keep the existing daily series running and prepare weekly improvements.
