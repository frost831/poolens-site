# SplashLens Outreach Strategy Sit Rep And Claude Handoff

Date: 2026-09-02

## Executive Summary

SplashLens is not invisible anymore. The project has real trade-publication proof, warm industry conversations, app usage alerts, and a sizable outreach ledger. The weak spot is conversion from attention to committed usage and paid subscription. The next plan should stop treating outreach volume as the main success metric and make every touchpoint drive one measurable action:

**Try SplashLens on one real code, part, equipment family, closing-season issue, spa/swim-spa issue, robot/automation issue, or facility workflow. Then tell us if it helped, missed, or saved time.**

Current strongest market angle:

**Get off the pad faster. Identify the part. Check the code. Prove the visit.**

Current monetization wedge:

- Free core remains free.
- PartSnap Pro is the live paid lane.
- Saved Job Pro, Team Field View, Facility Assist, Learning OS, and partner/manufacturer cards are the business expansion lanes.

## Current Source Of Truth

Site repo:

- Local verified checkout: `C:\Users\sales\Documents\Codex\splashlens-proof-gate-20260830\site`
- GitHub: `https://github.com/frost831/poolens-site.git`
- Branch: `master`
- Current commit at handoff creation: `38ceabb`

App repo:

- Local verified checkout: `C:\Users\sales\Documents\Codex\splashlens-proof-gate-20260830\app`
- GitHub: `https://github.com/frost831/poolens.git`
- Branch: `master`
- Current commit at handoff creation: `8830632`

Dropbox note:

- `C:\Users\sales\Dropbox\Projects\poolens-site` and `C:\Users\sales\Dropbox\Projects\poolens` were not local on this PC at this handoff check.
- That is expected under Dropbox Selective Sync. Do not treat it as data loss and do not recreate the folders unless Joshua explicitly rehydrates them.

Primary outreach files:

- `docs\outreach\splashlens-drip-queue.csv`
- `docs\outreach\splashlens-drip-run-log.md`
- `docs\outreach\splashlens-outreach-run-log-2026-08-28.md`
- `docs\outreach\splashlens-closing-season-pilot-send-pack-2026-09-01.md`
- `docs\outreach\splashlens-outreach-templates.md`
- `docs\outreach\splashlens-visibility-engine.md`

Native/store handoff already exists in the app repo:

- `docs\store\MAC_HANDOFF_SPLASHLENS_NORTH_STAR_FIELD_COPY_2026-09-01.md`

## Product State Relevant To Outreach

Already deployed and smoke-checked on 2026-09-01:

- Public site: `https://splashlens.com`
- Web app: `https://app.splashlens.com`
- Stripe monthly checkout now returns a live first-party `checkout.stripe.com` Checkout Session.
- Owner stats route exposes a `Conversion Funnel`.
- Public site has current `ai.txt`, `llms.txt`, sitemap updates, and conservative search/AI crawler language.
- App shell uses current field language:
  - `Saved job history`
  - `Repeat Issue Watch`
- App shell no longer shows:
  - `Callback Risk`
  - `Service Proof Passport`

Recent verification from the 2026-09-01 deployment:

- Site tests: 25/25 passed.
- App tests: 22/22 passed.
- Live UI audit: 32/32 surface checks passed, 6/6 flow checks passed.
- Security headers present on both `splashlens.com` and `app.splashlens.com`.

## Mail And Notification Trust

Gmail sender profile checked on 2026-09-02:

- Joshua Frost `<frost@belowzeromedia.com>`

Recent official app alert evidence:

- Gmail message `1a0505464bdeafa5`
- Subject: `[SplashLens] New marketing signup: demo-proof-gate-20260829204140@example.com`
- From: `SplashLens Alerts <hello@splashlens.com>`
- Delivered to: `frost+splashlens-alerts@belowzeromedia.com`
- SPF: pass
- DKIM: pass for `splashlens.com`
- DMARC: pass for `splashlens.com`

This means the app-alert sender path is working through the SplashLens authenticated sender/domain. The specific message was a proof-gate demo/test signup, not a real customer lead.

## Outreach Ledger Snapshot

Queue snapshot from `splashlens-drip-queue.csv` on 2026-09-02:

- Total rows: 318
- Rows with `last_sent_at`: 196
- Current `sent`: 111
- Current `follow-up-sent`: 64
- Current `replied`: 11
- Current `bounced`: 7
- Current `suppressed`: 1
- Current `queued`: 18
- Current `needs-verification`: 48
- Current `needs-contact`: 25
- Current `research-needed`: 19
- Other holds include community/manual-proof rows and covered-by-sent rows.

Important counting note:

- The main CSV shows 196 touched rows by date, but some rows now sit in `replied`, `bounced`, or `suppressed` status instead of `sent`.
- The August 28 run has a separate run log showing seven additional sends. Do not double-count it unless the CSV has been reconciled into the main queue.

Recent Gmail check:

- Gmail found at least 100 sent SplashLens/PartSnap messages since 2026-06-10 in the first page of sent results, with more available.
- Gmail found 45 inbound SplashLens-related non-self messages since 2026-06-10.
- Gmail found 17 positive/interest-style inbound hits since 2026-06-10.
- Gmail found no unsubscribe/remove/bounce/complaint stop-signal results from 2026-08-27 through 2026-09-02.
- Gmail found seven sent SplashLens messages from 2026-08-28 through 2026-09-02, matching the August 28 run log.

## Outreach Timeline

Logged send/touch dates from the main drip CSV:

- 2026-06-11: 3
- 2026-06-16: 2
- 2026-06-17: 3
- 2026-06-18: 1
- 2026-06-19: 1
- 2026-06-23: 3
- 2026-06-24: 4
- 2026-06-25: 1
- 2026-06-30: 2
- 2026-07-01: 8
- 2026-07-02: 55
- 2026-07-03: 10
- 2026-07-04: 6
- 2026-07-06: 5
- 2026-07-09: 5
- 2026-07-10: 5
- 2026-07-13: 11
- 2026-07-14: 5
- 2026-07-15: 5
- 2026-07-21: 5
- 2026-07-22: 5
- 2026-07-23: 5
- 2026-07-27: 6
- 2026-07-31: 5
- 2026-08-05: 5
- 2026-08-07: 5
- 2026-08-21: 5
- 2026-08-23: 5
- 2026-08-25: 15

Separate latest run:

- 2026-08-28: 7 sent, logged in `splashlens-outreach-run-log-2026-08-28.md`.

## Outreach Types Reached

The queue and logs cover these lanes:

- Trade media and publications: PoolPro, AQUA, Service Industry News, Pool Magazine routes, other publication/editorial routes.
- Podcasts and creators: Pool Nation, Talking Pools, Pool Chasers, The Deep End, Pool Guy style creator lanes, and related show/resource lanes.
- Training and certification: CPO/AFO training schools, aquatic education routes, PHTA/FSPA/IPSSA-adjacent routes, NRPA/AFO route, pool schools.
- Facility and operator routes: aquatics departments, commercial pool operators, municipal/apartment/HOA operator routes, YMCA/university-style operator contacts.
- Manufacturers and reps: equipment manufacturers, product-support routes, rep groups, distributors, warranty/support-style contacts.
- Suppliers and counters: parts suppliers, ecommerce suppliers, distributor/counter workflow prospects.
- Service companies: solo/small service companies, closing-season pool service routes, Midwest and Sun Belt service routes.
- Spa/swim-spa/accessory lanes: Wellis, Cover Valet, Leisure Concepts, spa accessory/support routes.

Keyword scan of queue notes suggests overlapping coverage:

- Media/publication/podcast-related rows: about 92
- Training/operator/facility-related rows: about 111
- Manufacturer/product/support/supplier-related rows: about 200
- Service-company-related rows: about 109
- Association/chapter-related rows: about 17

These are overlapping keyword counts, not exclusive categories.

## Known Positive Outcomes

Confirmed from queue notes and Gmail:

1. PoolPro / Kendrick Content
   - Bethany Branscum replied that PoolPro could include SplashLens.
   - PoolPro published SplashLens:
     `https://poolpromag.com/splashlens-launches-free-field-reference-app/`

2. AQUA Magazine
   - Laura Carew / AQUA responded and published SplashLens.
   - AQUA product/software coverage:
     `https://www.aquamagazine.com/products/business-software/article/15830162/splashlens-splashlens-field-reference-app-for-pool-spa-and-facility-professionals`
   - AQUA closing-season coverage:
     `https://www.aquamagazine.com/products/article/15833207/splashlens-splashlens-new-closing-season-mode`

3. Service Industry News
   - Carrie Dibrell replied that SplashLens looked interesting and wanted to discuss how Service Industry News can help market it.
   - Thread later moved into ad fit, niche reader alignment, part-source transparency, and performance metrics.
   - This remains a warm media/advertising opportunity, not a closed campaign.

4. Aquatic Council / Tim Auerhahn
   - Tim engaged on Facility Assist and CPO/operator workflow.
   - He later said higher-priority projects took over and asked Joshua to reconnect in September.
   - Current queue says do not recontact Tim before 2026-09-08.

5. Space Coast Pool School / Lauren Broom
   - Lauren replied with interest and asked what it would include.
   - This is a warm training/CPO partner lane.

6. App usage and alerting
   - Prior messages showed native first opens, scanner use, PartSnap results, facility support packets, and a proof-gate marketing signup alert.
   - The app alert sender path is authenticated and working.

## Negative / Suppression Outcomes

Hard suppress:

- Fluidra / product support route
  - `productsupport@fluidra.com`
  - Removal request received from Kapri / Fluidra WCS Support.
  - Do not contact Fluidra/Jandy/Polaris/Zodiac through that row unless they initiate.

Known bounces:

- `content@poolonomics.com`
- `contact@poolnationawards.com`
- `wceresources@waketech.edu`
- `bonaccib@njpma.org`
- `mfrancisco@ymcasumter.org`
- `rose@upperstate.org`
- `jjelite.poolservice@gmail.com`

Operational rule:

- These addresses must stay suppressed unless a fresh public replacement route is found and verified.

## What Has Actually Been Done

Outreach operations completed:

- Built and maintained a 318-row outreach queue.
- Sent/followed up across 196 logged touched rows in the main CSV, plus an additional seven-send August 28 run log.
- Created multiple send packs and templates:
  - first-wave outreach
  - founder story
  - PoolPro credibility follow-up
  - AQUA/PoolPro proof strips
  - closing-season campaign
  - Midwest wind-down angle
  - Service Industry News ad-fit prep
  - supplier/product support lanes
  - facility/CPO/training lanes
  - spa/swim-spa lanes
- Built and deployed closing-season site/app positioning.
- Built the current campaign flow around the 60-second field challenge.
- Added owner dashboard funnel visibility.
- Added app feedback and field-score traps.
- Confirmed payment checkout path is live.
- Confirmed official app alert email authentication.

Product/marketing positioning completed:

- Homepage now centers on `Get off the pad faster.`
- Main public buyer message is:
  - Identify the part.
  - Check the code.
  - Prove the visit.
- Better field language replaced jargon:
  - `Saved job history`
  - `Repeat Issue Watch`
  - `Saved Job Pro`
  - `Team Field View`
- Current public credibility:
  - PoolPro coverage
  - AQUA coverage
  - AQUA closing-season coverage

## Current Problem

The bottleneck is not only awareness. It is activation proof.

The project has:

- Publication coverage.
- Warm replies.
- App/store availability.
- Working checkout.
- App usage alerts.
- Broad prospecting.

The project still needs:

- More named users completing one useful workflow.
- More feedback after first use.
- More proof of time saved.
- Clearer conversion from free use to paid PartSnap Pro.
- Less generic outreach and more “show me your ugly real-world case” calls to action.

## Best Current Strategy

For the next 14 days, do not make the main goal “send more emails.” Make the main goal:

**Get 25 named pool/spa/facility people to complete one tracked workflow and produce usable feedback.**

Every channel should point to one of these:

1. 60-second field challenge
   - Try one real code, part, equipment family, closing note, robot issue, automation issue, spa issue, or facility workflow.
   - End with: Helpful, Saved time, Missing info, Wrong.

2. Closing-season field challenge
   - Midwest/Sun Belt service companies.
   - Message: before closing season turns sloppy notes into spring calls, test this on one ugly stop.

3. Supplier/counter challenge
   - Ask what proof they wish techs sent before ordering.
   - Message: fewer vague part requests and cleaner escalation notes.

4. Manufacturer/support challenge
   - Ask what proof they need before support/warranty escalation.
   - Message: model plate, serial, symptom, second photo, app alert, visible label, measurements.

5. Facility/CPO challenge
   - Daily check, contamination event, turnover/flow issue, equipment room note, staff handoff.
   - Message: not every operator is a repair tech; SplashLens can help them document and escalate clearly.

6. Training partner challenge
   - Turn real field misses into 5-minute lessons.
   - Message: after class, students need field reinforcement, not another giant LMS.

## Next Outreach Plan

Immediate next send pool:

- Use the 18 `queued` rows only after fresh checks.
- Work the 48 `needs-verification` rows next.
- Then resolve the 25 `needs-contact` rows.
- Research-needed rows should not be sent until they have current intended-for-business-contact routes.

Required preflight before any send:

- Check `splashlens-drip-rules.md`.
- Check suppression and bounced rows.
- Search Gmail for exact recipient/domain history.
- Search Gmail for replies, bounces, unsubscribes, complaints, delivery failures since the last run.
- Verify source URL.
- Verify MX.
- Send one-to-one only.
- No BCC.
- End with `Talk Soon,`.
- Log exact sent body/subject/Gmail ID.

Recommended next wave size:

- 10-20 carefully verified one-to-one sends per clean window if bounce rate stays zero.
- Stop if hard bounces appear.
- Do not re-hit warm media/partners with generic copy.

Recommended next wave targets:

- Service Industry News follow-through: ad/affiliate/performance offer with clear tracking.
- AQUA and PoolPro: warm thank-you/update only when there is a real product update.
- Midwest service companies: closing-season pain and spring callback prevention.
- Supplier/counter routes: proof before wrong-part orders.
- Spa/swim-spa accessory/product companies: proof prompts and field cards.
- Training schools/operators: Facility Assist and Learning OS.
- Podcast/creator demos: “send one ugly real-world part/code” rather than “please cover us.”

## Recommended Email CTA

Use this CTA everywhere:

```text
Try SplashLens with one real code, part, equipment family, closing-season issue, spa issue, robot/automation issue, or facility workflow.

Then tell me one thing:
Helpful, Saved time, Missing info, or Wrong.
```

## Recommended Offer

Do not lead with “AI.” Lead with field outcome:

```text
Free core tools for the lookup.
Optional Pro tools if you want heavier PartSnap, saved job history, customer-safe notes, and cleaner handoffs.
```

## Service Industry News Strategy

Carrie’s readers are niche, loyal, and tech-focused. They likely do not want a glossy AI pitch.

Best ad angle:

```text
Find the part. Check the code. Leave a cleaner note.

SplashLens is a free field-reference app for pool and spa service pros.
Use it for PartSnap, equipment/code lookup, dosing math, closing-season notes, and proof before ordering.

Try it with one real part or code:
app.splashlens.com
```

Metrics to ask for:

- Dedicated link/QR by placement.
- App opens.
- App Store clicks.
- Google Play clicks.
- PartSnap starts.
- PartSnap results.
- Lookup starts.
- Saved job history starts.
- Checkout starts.
- Paid conversions.

Deal structures to consider:

- Small fixed test placement.
- Affiliate/revenue share on paid conversions.
- Hybrid low fixed + conversion bonus.
- Editorial-style product/resource note only if clearly labeled and accepted by them.

Avoid:

- “AI scanner” as the lead.
- Dense feature lists.
- Claims of guaranteed part fit, diagnosis, warranty help, or manufacturer endorsement.

## Pricing Message To Keep Testing

Free:

- Basic lookup.
- Basic PartSnap.
- Calculators.
- Facility Assist starter.
- Closing-season reference workflows.

PartSnap Pro:

- More scanner workflow.
- Better proof prompts.
- Save/share heavier results.

Saved Job Pro:

- Save customer/pool/job history.
- Create customer-safe summaries.
- Keep proof photos/notes together.

Team Field View:

- See what techs are searching.
- See what is missing.
- Cleaner company handoffs.
- Better owner visibility.

Facility Access:

- Keep gated/request access for now because Tim originated the facility lane and it may become a partner/pilot path.

Partner/Manufacturer Cards:

- Paid B2B setup/monthly lane.
- Position as:
  `Give us model families, known failure points, required proof photos, and preferred verification wording. We turn it into field-safe cards.`

## What Claude Should Evaluate

Claude should review this handoff and answer:

1. Is the current outreach strategy too broad, or is the segment mix correct?
2. Which buyer lane is most likely to produce paid conversion first:
   - solo tech
   - service company owner
   - supplier/counter
   - manufacturer support
   - training school
   - facility/CPO operator
   - publication/media
3. Is the current CTA strong enough to cause action, or should we use a stronger incentive?
4. Should SplashLens offer a free 14-day named pilot with concierge onboarding?
5. What should the first paid B2B package be called and priced?
6. What should Service Industry News be offered:
   - paid ad
   - affiliate
   - hybrid
   - editorial/product note
   - no spend yet
7. What friction still exists between publication attention and paid subscription?
8. What should be removed from the site/app because it still feels too broad or too “AI-generated”?
9. Which next 50 prospects should be prioritized from the current queue statuses?
10. What exact next send copy should be tested against service companies vs suppliers vs trainers?

## Claude Prompt

Paste this to Claude:

```text
You are reviewing SplashLens outreach and conversion strategy.

SplashLens is a free-core pool/spa field reference app at https://app.splashlens.com with a public site at https://splashlens.com.

Current positioning:
Get off the pad faster.
Identify the part. Check the code. Prove the visit.

Current product:
PartSnap, equipment/code lookup, dosing calculators, closing-season workflows, Facility Assist, saved job history, Repeat Issue Watch, app-store/mobile wrapper, Stripe checkout.

Current proof:
PoolPro published SplashLens.
AQUA published SplashLens twice, including Closing Season Mode.
Service Industry News is a warm marketing/ad-fit conversation.
Tim at Aquatic Council engaged on Facility Assist/CPO workflows but asked to reconnect in September.
Lauren at Space Coast Pool School showed interest in a training angle.

Current outreach ledger:
318 total queue rows.
196 rows with last_sent_at in main CSV.
111 current sent.
64 current follow-up-sent.
11 replied.
7 bounced.
1 suppressed.
18 queued.
48 needs-verification.
25 needs-contact.
19 research-needed.
Additional August 28 run log shows 7 more sent.

Known stop:
Fluidra productsupport@fluidra.com requested removal. Do not contact.

Current weakness:
Awareness exists, but paid subscribers are not showing up. The bottleneck appears to be activation proof: getting named techs/companies/facilities to complete one useful workflow, return, give feedback, and then pay.

Please critique the current outreach strategy and give a concrete next plan:
- best buyer segment to prioritize
- strongest CTA
- recommended ad/affiliate structure for Service Industry News
- whether to pursue paid ads yet
- best 14-day named pilot structure
- what to remove or simplify
- what to send next to service companies, suppliers, trainers, and media
- how to create paid conversion without damaging trust in the free app
```

## Bottom-Line Recommendation

Stop chasing generic volume as the main scoreboard. Keep outreach moving, but make the scoreboard:

- named testers recruited
- workflows completed
- feedback captured
- return usage
- checkout starts
- paid conversions
- field stories

The moonshot remains:

**SplashLens becomes the field intelligence layer for pool, spa, swim-spa, and facility work: free for techs to look things up, paid by people who need cleaner proof before callbacks, support calls, wrong part orders, training misses, and messy handoffs.**

## Immediate Checklist

1. Reconcile the August 28 seven sends into the main queue CSV if not already done.
2. Refresh Gmail stop-signal search before any new send.
3. Verify the 18 queued rows and send the cleanest 10-20 only if bounce risk is low.
4. Prioritize one CTA: `Try one real thing and tell us Helpful, Saved time, Missing info, or Wrong.`
5. Build named pilot roster: 25 techs, 5 service companies, 3 facility/training partners.
6. Build one Service Industry News tracked landing link and QR.
7. Offer Carrie a small test/hybrid placement measured on app opens, workflows, checkout starts, and paid conversions.
8. Do not spend meaningful PPC until the funnel dashboard shows actual workflow completion and checkout intent.
9. Reconnect with Tim no earlier than 2026-09-08 unless he writes first.
10. Keep all official app notices through `hello@splashlens.com`; authenticated app alerts are working.

