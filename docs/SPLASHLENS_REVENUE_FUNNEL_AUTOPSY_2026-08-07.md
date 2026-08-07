# SplashLens Revenue Funnel Autopsy - 2026-08-07

## Question

Why are bookings and paid conversions at zero after broad outreach, press, and app-store availability?

## Tracked

- Public site is live: `https://splashlens.com` returned HTTP 200.
- App checkout readiness is live: `https://app.splashlens.com/api/checkout-readiness` returned `productionReady=true`.
- Stripe account is connected with charges and payouts enabled.
- Stripe webhook is enabled at `https://app.splashlens.com/api/stripe-webhook` with required events present.
- PartSnap Pro monthly and annual Payment Links are configured and active.
- App event endpoint is live with storage and email configured.
- Site event endpoint is live with D1 storage configured.
- GA4 exists on the public site through `ga4.js` with measurement ID `G-9BGE6WFF23`.
- Site Amplitude and app Amplitude are not active because no `AMPLITUDE_API_KEY` secret exists on `poolens-site` or `poolens`.

## Traffic Reality

Cloudflare D1 public-site events for the last 30 days show:

- `site_page_view`: 191
- Homepage `/` page views: 171
- `open_app_click`: 3
- `partsnap_click`: 1
- `app_store_download_click`: 2
- `persona_fork_click`: 4
- `paid_landing_view`: 1
- Real buyer checkout intent: 0
- `checkout_click`: 4, but all four were `source=launch-gate-test` and `mode=test`, not customer intent.

Daily traffic spiked on 2026-07-17 with 49 page views, then settled mostly between 1 and 8 page views per day.

## Biggest Leak

This is not currently a Stripe failure. It is an activation and positioning failure before checkout.

The visitor path is too soft:

1. Press/outreach visitor lands on broad homepage.
2. Homepage offers many lanes: PartSnap, proof, facilities, connected equipment, pricing, stores, manufacturers, learning, languages, partners.
3. Very few visitors click into the app or PartSnap.
4. Almost nobody reaches a paid-intent event.
5. The self-serve $4.99 PartSnap Pro offer has no evidence moment before the ask.

## Missing

- No active Amplitude product analytics layer.
- No current protected app KPI snapshot in this run because the stats secret was not supplied to CLI.
- No obvious primary booking path on the main homepage before this fix.
- No single conversion definition for "booking": demo request, pilot request, paid checkout, or facility request.
- No named-pilot pipeline with assignment, tracked link, deadline, and outcome.
- No clean split between press awareness, field challenge activation, pilot booking, and paid conversion.

## Broken

- Site-to-app activation is too low.
- Paid ask is too early and too small to drive business conversations.
- Outreach has generated replies, but not enough targeted tracked workflows.
- The homepage is credible but broad; it reads like a product universe instead of one urgent test.
- Outreach volume is not yet enough for the desired outcome. About 173 rows have been sent or follow-up-sent, but the 30-day site volume is still only 191 page views, much of it internal/testing noise.

## Buyer Lens

The current pool software market is crowded around route management, billing, GPS, proof of service, customer communication, and company operations.

SplashLens should not try to beat Skimmer, Pool Brain, PaythePoolman, or Pool Service Software as a full CRM right now. SplashLens should sell the missing layer before the CRM:

**Identify it. Prove it. Escalate it. Learn from it.**

Best buyers:

1. Pool service owners with 3-30 techs who need fewer wrong orders, better customer updates, and less after-hours paperwork.
2. Distributors and counter teams who need better proof before part orders.
3. Manufacturer reps/support teams who need cleaner field evidence before warranty/support calls.
4. Facility/CPO/training orgs that need simple guided workflows for non-technical operators.
5. Trainers who can turn field misses into 5-minute lessons.

Weakest buyer right now:

- Anonymous solo tech paying cold for a $4.99 feature before experiencing a save-time moment.

## North Star

**SplashLens becomes the Field Proof Network for pool, spa, and aquatic work.**

Free for techs to use in the field. Paid by teams, facilities, trainers, distributors, and manufacturers that need cleaner evidence before parts orders, callbacks, warranty calls, training gaps, and customer explanations.

## Moonshot

The moonshot is not "AI pool CRM."

The moonshot is:

**Every pool part, code, service stop, facility incident, and support call becomes a verified field-proof object.**

That means SplashLens learns from real-world proof:

- Part photos
- Model plates
- Symptoms
- Codes
- Chemistry readings
- Facility incidents
- Senior-tech handoffs
- Vendor packets
- Manufacturer-approved proof cards
- Outcome feedback

Over time, SplashLens can show what is commonly missing before a tech orders, escalates, quotes, or calls support.

## Fast Fixes

Implemented immediately:

- Added `/field-proof-pilot.html` as a focused conversion page.
- Added a homepage `Book Field Pilot` CTA.
- Added `Field Proof Pilot` to the global Partners nav.
- The pilot form posts to the existing `/api/partner-intake` endpoint, stores in D1, and emails alerts through existing SendGrid wiring.

Next immediate moves:

1. Add real SplashLens `AMPLITUDE_API_KEY` to both Cloudflare Pages projects.
2. Use `/campaign.html` for tech activation and `/field-proof-pilot.html` for business conversations.
3. Stop sending broad "free app" pitches as the main CTA.
4. Send each audience to one measurable action:
   - Tech: run the 60-second field challenge.
   - Owner: request a 14-day Field Proof Pilot.
   - Distributor: test proof-before-ordering.
   - Manufacturer: test verified proof cards.
   - Facility/CPO: request gated facility access.
5. Define booking as `pilot_request_success` or scheduled call, not a store click.

## Event Plan

Primary funnel:

1. `campaign_landing_view`
2. `field_challenge_started`
3. `field_challenge_routed`
4. `field_challenge_feedback`
5. `open_app_click` or `partsnap_click`
6. App-side `first_app_open`
7. App-side first useful workflow: lookup, PartSnap, Facility Assist, proof save, or packet copy
8. `pilot_request_submit`
9. `pilot_request_success`
10. `checkout_click`
11. `checkout_success`

Dashboard must separate:

- Attention
- Activation
- First useful work
- Feedback
- Return use
- Pilot request
- Paid conversion

## Seven-Day Growth Plan

Targets:

- 300 tracked campaign visits
- 75 app opens
- 25 field challenge completions
- 10 feedback submissions
- 10 Field Proof Pilot requests or warm calls
- 5 named pilot candidates
- 3 usable field stories
- 1 paid conversion or committed pilot

Execution:

1. Create 5 tracked links:
   - service-company-owner
   - distributor-counter
   - manufacturer-rep
   - facility-cpo
   - trainer
2. Send warm and cold outreach to those lanes with the right CTA, not the generic homepage.
3. Build 3 short demo clips:
   - "Can SplashLens help with this part?"
   - "What proof is missing before ordering?"
   - "Turn this stop into a customer-safe update."
4. Personally recruit 25 named field testers.
5. Use every reply to ask for one real workflow to test.
6. Review the dashboard daily for completion, not opens.

## Revenue Verdict

Self-serve PartSnap Pro can stay live, but it should not be the main growth bet right now.

The stronger monetization path is:

- Free core app for goodwill and distribution.
- $99-$299/month Field Proof Pilot for small teams.
- $49-$199/month Facility/CPO pilot when appropriate and not ahead of Tim/Aquatic Council partner alignment.
- $500-$2,500/month verified manufacturer/distributor cards and proof workflows.
- Training partner licensing after real field lessons are validated.

The next sell is not "subscribe to the app."

The next sell is:

**Let us run SplashLens on 10 real stops and show whether it saves time, reduces vague part/support calls, or improves handoffs.**

## Confidence

High confidence:

- Checkout infrastructure is not the main zero-booking cause.
- Public-site activation is too low.
- The current paid ask is too cold.

Medium confidence:

- App-side usage may show more activity than public-site events, but it was not pulled in this run without the stats secret.
- Amplitude will expose more precise friction once wired.

Low confidence:

- Any claim about exact user identity or app-store install source until Amplitude, store-console exports, and protected app dashboard data are reviewed together.
