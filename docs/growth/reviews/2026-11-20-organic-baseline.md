# Organic publishing baseline — November 20, 2026

This was a manual owner-requested run, not proof of a scheduler invocation. Public delivery audit: 2026-11-20T14:15:47Z (08:15 America/Chicago). Canonical starting master: `958d1784fe8ef67d79192619e82d93340a11a8d5`.

## Confirmed observations

- Existing daily Field Notes: 53 released, 67 future scheduled, last scheduled date January 26, 2027. The current latest article is the cartridge-order record for November 20. The next release is November 21 at 08:00 Central.
- Production smoke: 25/25 route checks passed, including the current article/card, unreleased article/card returning 404, private source/tool/test paths returning 404, sitemap index, RSS and AI inventories.
- Discovery audit: 8/8 route checks passed, with all published article URLs in the blog sitemap, the latest 40 in RSS/AI inventory, no future article URLs exposed, a correct latest canonical/date and no public noindex header.
- Each of the 12 official reference URLs in `editorial/sources.mjs` responded HTTP 200 in this run. This establishes reachability only; no model-specific claim or qualified review is established by that check.
- Automated site regression suite: 219 tests passed, zero failures/skips. Four new discovery tests include positive delivery and negative stale-feed, future-leak and noindex cases. Existing artifact-packaging tests run as part of the suite.
- Portfolio Git-health check was run with Fetch. SplashLens app and site passed fetch/remote/account routing. Other unrelated repositories had existing fetch failures; none was changed in this run.

Evidence: [production smoke](../../qa/field-notes/production-smoke.json), [discovery audit](../../qa/field-notes/organic-discovery-20261120.json), [cadence and eight-week calendar](../../organic-growth-cadence.md).

## Operating decision

Retain the working daily release system. Add one substantial existing-page improvement each week, Monday evidence/brief and Thursday completion/review, and monthly store-listing accuracy review. First topic: evidence before ordering an unidentified pool part, improving `/partsnap-proof-library.html`. Prioritize a verified workflow and sanitized example over additional near-duplicate URLs. This topic is an editorial decision; no measured search-demand or conversion winner is claimed.

Created local Codex heartbeat `splashlens-organic-editorial-cadence`, active Monday and Thursday at 09:00 America/Chicago in the current chat. Local execution depends on the PC and Codex being available; the site's existing server-clock daily releases do not. Creation is not proof that a future scheduled run completed. The cadence preserves PR/release approval and the Mac iOS lane, and does not authorize mail, social publishing or spending.

## Bounds

No visitor-visible content, store listing, crawler preference, domain/WAF rule or production deployment changed in this run. The new script, tests and operating documents require no website deployment. The PR will synchronize these operational artifacts; it does not establish a published weekly improvement.

Authenticated Search Console/Bing performance, sitemap processing, verified crawler-origin traffic, actual ChatGPT/Claude/Grok/Perplexity citations/recommendations, installs and paying conversions were not established. No submission, ranking, revenue result or access failure is fabricated. Existing authorized account access can be inspected in future cadence runs; public delivery alone does not supply those measurements. No paid service was provisioned.
