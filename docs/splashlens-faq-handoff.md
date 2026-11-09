# SplashLens FAQ chat handoff

Release candidate for `frost831/poolens-site` on `codex/splashlens-source-backed-faq-20261109`. The English public homepage and FAQ share one draggable launcher and native dialog. The app and installed store shells are unchanged. This is a local review candidate; production approval is pending.

## Evidence and ownership

- Public site: [SplashLens](https://splashlens.com/), [FAQ](https://splashlens.com/faq), [current plans](https://splashlens.com/#pricing), [Teams](https://splashlens.com/teams), and [terms](https://splashlens.com/terms.html).
- App: [SplashLens web app](https://app.splashlens.com/), [verified account/data deletion form](https://app.splashlens.com/data-deletion.html), and [app privacy policy](https://app.splashlens.com/privacy.html). The read-only live app shell observed November 9, 2026 loaded app asset version `20261030-privacy-deletion`. The form and send-code control rendered; no live verification email or request was submitted. App privacy-deletion and checkout fixtures exercise those paths without provider calls.
- Published human contact: `hello@splashlens.com` from the site's Terms. The proposed support page is a landing page for this existing address and verified app routes. It adds no support SLA, refund promise, data-retention promise, or eligibility rule.
- Joshua Frost is the named repository maintainer and release review coordinator. He should confirm the product/support wording and identify the privacy and billing approvers for the linked policy and provider flows. No separate owner sign-off is recorded for this new page.
- Reference: HyperPulse PR #207 as identified in the supplied guide; launcher, chat, guard, retrieval, limiter, compiler, and preview patterns were inspected in the canonical HyperPulse checkout at `f926199207c6cdb57b247f2007cff67f4643003a`. HyperPulse claims, ages, and contacts were not copied.

Review date means the source was checked for this candidate, not that legal or release approval was granted. Recommended owner review: on any relevant release and monthly for account, privacy, and billing routes; next proposed review December 9, 2026.

## Coverage inventory

The intent manifest is `content/faq/intents.json`. Each record lists its title, stable citation, review date, and curated questions. The compiled index contains 14 existing product FAQ passages and 12 support/routing passages. All questions target an English public audience; the help page does not infer region, purchase channel, account status, or permissions.

| Topic | Status and authoritative link |
| --- | --- |
| Create an account / get started | Covered: [start using SplashLens](/support.html#account-help) repeats the published manual lookup and free field-profile distinction. Registration role eligibility beyond the public description routes to support. |
| Sign in and regain access | Routed: [Account and profile help](/support.html#access-help), plus the verified [web Pro restore label](/support.html#restore-help). No invented password-reset path or recovery guarantee. |
| Close account or delete data | Covered: [verified deletion route](/support.html#deletion-help) links to the app's form; the official form and app policy describe scope, verification, processing, and exceptions. The bot neither requests an email code nor submits the form. |
| Data storage and use | Routed to the [app privacy policy](/support.html#privacy-help). The marketing privacy page contains older account/storage descriptions; do not quote those as current app policy. |
| Access, correction, export, and retention | Routed: [data requests](/support.html#data-help) and [app privacy](/support.html#privacy-help). No unsupported self-service data export or deletion timeline. |
| Terms, privacy, eligibility, and rules | Covered by [published terms](/support.html#terms-help) and app privacy links. Location-specific eligibility and legal interpretation go to support. |
| Accounts, teams, permissions, and sharing | [Teams/member access](/support.html#teams-help) routes administrative and case-specific questions to support; [customer sharing](/faq.html#customer-sharing) retains the public human-review guidance. |
| Billing, cancellation, refunds, fulfillment | [Current pricing](/support.html#pricing-help), [restore](/support.html#restore-help), and [billing help](/support.html#billing-help). No hard-coded prices or refund outcomes. Hardware shipping, order status, and warranty fulfillment are outside this FAQ; exact fitment or warranty approval is not promised. |
| Product help and known limits | Covered: [SplashLens overview](/faq.html#app-overview), [PartSnap](/faq.html#partsnap-overview), [offline](/faq.html#offline-tools), [AI summaries](/faq.html#ai-summaries), and [CRM fit](/faq.html#crm-fit). Unverified device or store compatibility routes to support. |
| Safety, misuse, security, accessibility | [Field escalation](/faq.html#escalation) and [report an issue](/support.html#report-help). No case-specific diagnosis, dosing, legal, or compliance advice. |

## Preview, build, and approval

Node 22+ from the site repository:

```powershell
npm ci
node tools/compile-splashlens-faq.mjs
npm test
npx playwright install chromium
npm run qa:faq
npm run preview:faq
```

Open [homepage preview](http://127.0.0.1:8797/) or [FAQ preview](http://127.0.0.1:8797/faq.html). Ask “What works offline?”, “How do I delete my account?”, and an unrelated question. Check the citation, help fallback, Clear, and Close. The preview binds loopback, stages the allowlisted assets, runs the real FAQ handler, and does not expose checkout, mail, account, or other production endpoints.

For a release, edit the authoritative visible passage first. Review the wording and route with the owner; update the search phrases and date as needed, then run:

```powershell
node tools/compile-splashlens-faq.mjs --write
git diff -- faq.html faq support.html content/faq/intents.json functions/_shared/faq-articles.json
node tools/stage-public-assets.mjs
node tools/compile-splashlens-faq.mjs --built
npm test
npm run qa:faq
```

The stager checks the source index before mounting the shared widget, checks the final staged pages and the FAQ alias, and excludes content, tooling, docs, and server files. CI requires both the staging gate and staged Chromium checks. Deploy only `_deploy/public` from the repository with its matching Pages Functions, after normal approval. Never upload the repo root. Revert the public passages and server index together. Smoke the custom domain and open a citation after the approved release.

## Verified on November 9, 2026

| Final QA run | Site regression | Staged Chromium |
| --- | --- | --- |
| 1 | 213 passed, 0 failed, 0 skipped | 5 passed, 0 failed, 0 skipped |
| 2 | 213 passed, 0 failed, 0 skipped | 5 passed, 0 failed, 0 skipped |
| 3 | 213 passed, 0 failed, 0 skipped | 5 passed, 0 failed, 0 skipped |

The site suite includes 26 direct questions, 16 paraphrases (including a typo), and 31 negative questions. Compiler tests reproduce stale, removed, hidden, duplicated and cross-origin sources and verify regeneration. Browser tests cover mouse and touch drag/tap, arrow keys, Enter and Escape, focus, resize, scroll, Clear, support fallback, cookie omission, source text, and static links with scripts disabled. The existing live UI baseline passed 32 page/viewport checks and six read-only flows with mutating and analytics requests suppressed. The paired app's privacy-deletion and checkout fixtures passed 21 checks. No live account, email, payment, or deletion mutation was performed.

## Privacy and operations

The browser sends only the current question, same origin, without credentials. It rejects known sensitive forms before adding them to the transcript or sending them. The endpoint independently validates the question and request shape, uses no AI provider or database, and neither logs nor stores question text. The UI displays only text and validated local citations. The in-memory transcript has 12 message slots plus the greeting and clears on refresh. The server limits requests to 1,536 bytes and questions to 240 characters, returns no-cache responses, and retains only short-lived salted client counters. These limits are per isolate; configure a separate Cloudflare rule if cross-isolate enforcement is required. Check Cloudflare or any proxy/APM body-capture settings before release.

Unmatched, mixed, and unsupported-language requests go to support. A full normalized phrase or a single uniquely correctable typo must identify exactly one article. A question never triggers a billing, account, email, or deletion action. Report a wrong match by editing the authoritative passage or search phrases and adding a regression question; do not add private material to the index.
