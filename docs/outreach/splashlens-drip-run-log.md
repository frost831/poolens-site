# SplashLens Drip Run Log

## 2026-06-25 daily growth and release-readiness loop

Preflight and readiness checks on 2026-06-25: `https://splashlens.com`, `https://app.splashlens.com`, `https://splashlens.com/api/partner-intake`, and `https://app.splashlens.com/api/events` all returned live `GET` `200` responses. Partner intake and app events both returned JSON showing storage configured and email notifications configured. Owner dashboard checks returned `200` for `https://app.splashlens.com/dashboard` and `301 -> /dashboard` for `https://app.splashlens.com/owner-dashboard`. Discovery surfaces also checked clean with `200` on `https://splashlens.com/sitemap.xml`, `https://splashlens.com/pseo-sitemap.xml`, `https://splashlens.com/seo-hub-sitemap.xml`, `https://splashlens.com/category-hub-sitemap.xml`, `https://splashlens.com/ai.txt`, and `https://splashlens.com/llms.txt`. Live homepage copy still contained `180+` / `230+` language, did not show visible `500+` claims, and the stale `Google Play Coming Soon` badge was no longer present.

Commerce and store status: both `https://app.splashlens.com/api/checkout?plan=monthly` and `?plan=yearly` redirected with `X-SplashLens-Checkout-Mode: payment_link_fallback` and `X-SplashLens-Checkout-Fallback: stripe_api_401`, so direct Stripe Checkout Session creation is still not production-ready even though the public payment links work. The live iOS App Store URL and the public Google Play listing both resolved successfully. The current Play release packet still documents that the `1.0.4` bundle upload was initiated but the final Play Console review/rollout click was not truthfully confirmed from automation.

Gmail hygiene stayed mostly clean: no new unsubscribe/remove-me requests, complaints, or negative replies were found. The known Pool Nation Awards bounce remained the only recent delivery failure in scope. Two meaningful inbox events were confirmed: Bethany Branscum's positive PoolPro/SpaRetailer reply remains active and Joshua's in-thread write-up plus Google Play correction are now reflected as a warm `replied` row, and Intermatic sent an automated acknowledgement (`Ticket #167005`) for the 2026-06-25 support email so that row was moved to `replied`/hold status.

Send decision: sent `0` new emails in this loop. Gmail shows the daily 2026-06-25 cold-send cap was already consumed by the earlier five-recipient creative-lane batch (Fluidra, Waterway, AquaStar, Intermatic, LaMotte). Two additional same-day Gmail messages were warm in-thread PoolPro follow-ups, not fresh cold sends. Because the five cold emails were already out before this loop, this run preserved the no-send boundary and used the time for queue expansion instead.

Queue expansion added or upgraded verified future prospects/contact paths:

- Team Horner Education / Laura Castanza (`LCastanza@teamhorner.com`) from the official June 2024 Team Horner newsletter PDF.
- Jack's Magic (`jacksmagic@jacksmagic.com`) from the official Jack's Magic site.
- PoolRx (`cs@poolrx.com`) from the official PoolRx site footer/contact surface.
- Loop-Loc (`Consumers@LoopLoc.com`) from the official Loop-Loc contact page.
- GLB Pool Care official contact page / helpline path verified, but no public email was visible, so it stays `needs-verification` rather than sendable.

## 2026-06-25 PoolPro/SpaRetailer editorial inbound

Bethany Branscum, Managing Editor for SpaRetailer / PoolPro / PoolPro en Espanol, replied that SplashLens may fit PoolPro magazine's news section and requested a press release or write-up for review. Prepared `docs/outreach/POOLPRO_PRESS_RELEASE_SPLASHLENS_2026-06-25.md` with a reply email, full press release, and short news-item version. Angle: free no-account field reference app for pool service technicians, founder/operator context, PartSnap as a cautious part-identification workflow, and clear non-diagnosis/manual-verification disclaimers.

Sent the PoolPro write-up to Bethany in-thread on 2026-06-25. Gmail sent id: `19efc929b4215d85`. After live verification showed Google Play is already public for `com.splashlens.fieldtools`, sent a correction in-thread replacing the pending-review line with the live Google Play URL. Gmail correction id: `19efc939b35cf2bd`.

## 2026-06-15 Manual Audit

- Verified first-wave outreach had started on 2026-06-11 with 12 individual emails.
- Gmail showed no additional SplashLens outreach sent after 2026-06-12.
- The prior drip automation was not present in the app when update was attempted, so it was recreated as `splashlens-controlled-outreach-drip`.
- Queue updated: `content@poolonomics.com` marked `bounced` after Gmail delivery failure.
- Next eligible queued row remains United Pool Association unless the next automation run verifies additional contacts first.

## Manual media wave - 2026-06-15 21:02:08 -05:00

Sent seven individual SplashLens outreach emails from frost@belowzeromedia.com after live app/site check returned 200 for https://app.splashlens.com and https://splashlens.com. Recipients: editor@poolspamarketing.com, deependfrank@gmail.com, info@unitedpoolassociation.org, office@chlorinekingpools.com, poolenvy@poolenvywi.com, talkingpools@gmail.com, ruleyourpool@gmail.com.

Send boundary: free/no-account app offered now; free reviewer access for extended scanner/PartSnap flow offered on reply only because local entitlement admin secrets were not present in this shell. Copy included conservative reference-not-diagnosis framing and no paid-placement/sponsorship ask.

## Outreach copy update - 2026-06-15 21:07:35 -05:00

Updated future SplashLens outreach language to include founder credibility: Joshua started in the pool industry in sales, then moved into his own pool service company, so SplashLens is grounded in real service/counter lookup friction. Added optional media/podcast/association/creator note that Joshua has been highlighted in industry magazines for tech-forward thinking in the pool space, with guardrails not to frame it as an award, endorsement, partnership, or hard proof unless exact publication names/links are included.

## Outreach copy update - 2026-06-15 21:10:43 -05:00

Added solo-operator agility story to future SplashLens outreach: Joshua used and liked useful pieces of existing CRMs and pool programs, but they moved too slowly for what a solo pool operator needed, so SplashLens was built to move faster and adapt when real field needs show up. Added guardrail to keep this broad and fair, without naming or attacking specific software.

## New outreach batch - 2026-06-16 08:25:31 -05:00

Moved active work to proper outreach branch outreach/splashlens-drip-20260616; no emergency-backup branch usage for this batch. Preflight: connected Gmail sender frost@belowzeromedia.com; searched last 7 days for SplashLens replies, bounces, unsubscribe/remove language, and delivery failures; none found. Live checks returned HTTP 200 for https://app.splashlens.com and https://splashlens.com.

Sent three one-to-one plain-text outreach emails: service@phta.org, contact@pooldial.com, contact@pooloperators.club. Copy included founder pool-sales-to-service-company background, solo-operator agility story, free/no-account app framing, and reference-not-diagnosis caveats. No social/forum posts and no BCC batching.

## Controlled outreach drip - 2026-06-16 09:22:00 -05:00

Preflight: live HTTP checks returned 200 for https://splashlens.com and https://app.splashlens.com. Visible site copy still used 180+ current entries and did not show visible 500+ claims or fake testimonial names. Gmail last-7-day search found no SplashLens replies, bounces, unsubscribe/remove-me requests, complaints, or delivery failures.

Verified current public contact paths and sent five one-to-one plain-text outreach emails: jmcclain@kenilworth.com, info@poolservice.software, admin@carecraft.com, info@thepoolspashow.com, info@westernshow.com. Copy stayed conservative: free no-account reference app, 180+ current entries, possible matches, verification notes, not a diagnosis tool, no official partnership or endorsement claims, and founder pool-sales-to-service background with solo-operator agility framing where appropriate.

## Controlled outreach drip - 2026-06-16 09:21:30 -05:00

Preflight for this run again returned HTTP 200 for https://splashlens.com and https://app.splashlens.com. Visible site copy still used 180+ current entries and did not show visible 500+ claims or fake testimonial names. Gmail last-7-day search again found no inbound SplashLens replies, unsubscribe/remove-me requests, complaints, or new delivery failures beyond the already-known Poolonomics bounce.

Verified sendable public contact paths and sent five one-to-one plain-text outreach emails: hello@unitedaquagroup.com, inquiries@poolscouts.com, service@poolwerx.com, admin@carecraft.com, info@poolservice.software. Copy stayed conservative: free no-account reference app, 180+ current entries, possible matches, verification notes, not a diagnosis tool, no official partnership or endorsement claims, and founder sales-to-service-company plus solo-operator agility context where it fit.

Post-send audit found the outreach branch already contained an earlier same-day 2026-06-16 drip batch that was not reflected in the automation memory. That earlier branch state already included same-day sends to admin@carecraft.com and info@poolservice.software, so this run created duplicate same-day resends to those two recipients only. Queue notes were updated to record the duplicate risk and hold any follow-up until 2026-06-23 or later.

## Follow-up heartbeat - 2026-06-17 04:45:04 -05:00

Preflight: live HTTP checks returned 200 for https://app.splashlens.com and https://splashlens.com. Gmail last-7-day checks found no inbound SplashLens replies, no unsubscribe/remove-me requests, no complaints, and no new delivery failures beyond the already-known Poolonomics bounce from 2026-06-11.

No follow-up emails were sent. The 13 first-wave 2026-06-11 rows all have `next_send_after=2026-06-18`, except Poolonomics which is already marked bounced, so the queue source of truth blocked the 2026-06-17 follow-up send.

Queue expansion added five verified future prospects with public source URLs and notes: Florida Swimming Pool Association Education (Education@FSPA.com), NESPA Update Newsletter / Association Route (info@nespapool.org), Pool Operation Management (info@pooloperationmanagement.com), Pool Training Academy (info@pooltrainingacademy.com), and National Plasterers Council (mail@npconline.org). All were added as queued for 2026-06-18 or later; no social/forum posts and no unverified-row sends occurred.

## Controlled outreach drip - 2026-06-17 09:20:15 -05:00

Preflight: live HTTP checks returned 200 for https://splashlens.com and https://app.splashlens.com. Visible site copy still used 180+ current entries and did not show visible 500+ claims or fake testimonial names. Gmail last-7-day searches found no inbound SplashLens replies, bounces, unsubscribe/remove-me requests, complaints, or new delivery failures beyond the already-known Poolonomics bounce from 2026-06-11.

Sent five one-to-one plain-text outreach emails after re-verifying current public contact paths and checking Gmail for prior sends to the same addresses: Education@FSPA.com, info@nespapool.org, info@pooloperationmanagement.com, info@pooltrainingacademy.com, and commercial@lesl.com. Copy stayed conservative: free no-account reference app, 180+ current entries, possible matches, verification notes, not a diagnosis tool, no official partnership or endorsement claims, and founder sales-to-service-company context where it fit.

Queue updated to mark the five rows above as sent with `last_sent_at=2026-06-17` and `next_send_after=2026-06-24`. National Plasterers Council remains queued for a future verified run; no social/forum posts and no sends to suppressed, replied, bounced, community-held, hold-proof-needed, needs-contact, or unverified rows occurred.

## Controlled outreach drip - 2026-06-17 09:20:45 -05:00

Preflight: live HTTP checks again returned 200 for https://splashlens.com and https://app.splashlens.com. Visible site copy still used 180+ current entries and did not show visible 500+ claims or fake testimonial names. Gmail last-7-day searches again found no inbound SplashLens replies, complaints, unsubscribe/remove-me requests, or new delivery failures beyond the already-known Poolonomics bounce from 2026-06-11.

Verified and sent four new one-to-one plain-text outreach emails to support@paythepoolman.com, help@poolofficemanager.com, team@poolbrain.com, and christi@mpire-group.com, plus one resend to commercial@lesl.com. Copy stayed conservative: free no-account reference app, 180+ current entries, possible matches, verification notes, not a diagnosis tool, no official partnership or endorsement claims, and founder sales-to-service-company context where it fit.

Post-send audit found the queue and run log had been updated by a separate same-day 09:20 CT batch while this run was in progress. That earlier batch had already sent commercial@lesl.com along with Education@FSPA.com, info@nespapool.org, info@pooloperationmanagement.com, and info@pooltrainingacademy.com. As a result, this run created one duplicate same-day resend to commercial@lesl.com only. Queue notes were updated to record the duplicate risk. Everything Under the Sun Expo / FSPA stayed unsent because its queue note still requires a one-pager and screenshots before outreach.

## Controlled outreach drip - 2026-06-18 09:22:00 -05:00

Preflight: live HTTP checks returned 200 for https://splashlens.com and https://app.splashlens.com. Visible site copy still used 180+ current entries, did not show visible 500+ claims, and the homepage "testimonial" section was still only illustrative field-scenario copy, not fake named testimonials. Gmail last-7-day checks found no SplashLens unsubscribe/remove-me requests, complaints, negative replies, or new delivery failures beyond the already-known Poolonomics bounce from 2026-06-11. Queue reconciliation marked Pool Office Manager and Florida Swimming Pool Association Education as `replied` after automated acknowledgements on 2026-06-17.

This run sent five one-to-one plain-text outreach emails: mail@npconline.org, client.services@poolspapatio.com, info@aquatictraininginstitute.com, info@ncpoolschool.com, and sales@getskimmer.com. Copy stayed conservative: free no-account reference app, 180+ current entries, possible matches, verification notes, not a diagnosis tool, no official partnership or endorsement claims, and founder pool-sales-to-service-company context where it fit.

Post-send audit found that a separate same-day 09:20 CT batch had already sent mail@npconline.org and client.services@poolspapatio.com, so this run created duplicate same-day resends to those two recipients only. That overlapping batch also independently sent info@watershape.org, info@heritagepsg.com, and ATC@poolapprenticeship.com before this run's queue patch landed. Queue notes were updated to reflect the duplicate risk, unique new sent rows were added for Aquatic Training Institute, NC Pool School, and Skimmer, and future queue coverage was restored with verified queued rows for Space Coast Pool School / CPOCertified and Pool Certs.

## Controlled outreach drip - 2026-06-18 09:21:13 -05:00

Preflight: live HTTP checks returned 200 for https://splashlens.com and https://app.splashlens.com. Visible site copy still used 180+ current entries and did not show visible 500+ claims or fake testimonial names.

Gmail last-7-day checks found no SplashLens-specific bounces, unsubscribe/remove-me requests, complaints, or delivery failures. Two auto-replies did arrive from prior SplashLens outreach: Education@FSPA.com sent an intermittent-monitoring auto reply, and techsupport@poolofficemanager.com sent an automated acknowledgement. Queue status was updated to `replied` for those two rows.

Only one row was already sendable at the start of the run, so queue expansion verified four more current public contact paths before sending: info@watershape.org (Watershape University / WaterShapes), client.services@poolspapatio.com (Pool Spa Patio Expo), info@heritagepsg.com (Heritage Pool Supply Group), and ATC@POOLAPPRENTICESHIP.COM (Pool & Spa Apprenticeship and Training Committee).

Sent five one-to-one plain-text outreach emails: mail@npconline.org, info@watershape.org, client.services@poolspapatio.com, info@heritagepsg.com, and ATC@POOLAPPRENTICESHIP.COM. Copy stayed conservative: free no-account reference app, 180+ current entries, possible matches, verification notes, not a diagnosis tool, and no official partnership, sponsorship, certification, or endorsement claims.

## Controlled outreach drip - 2026-06-19 09:20:00 -05:00

Preflight: live HTTP checks returned 200 for https://splashlens.com and https://app.splashlens.com. Visible site copy still used 180+ current entries and did not show visible 500+ claims or fake named testimonials.

Gmail last-7-day checks found no SplashLens-specific bounces, unsubscribe/remove-me requests, complaints, negative replies, or delivery failures. The unsubscribe/remove query matched outbound copy only. No inbound SplashLens inbox replies were found.

Same-day reconciliation found an overlapping 09:18-09:19 CT batch had already sent five one-to-one emails before this run's file patch landed: info@cpocertified.com, chad@poolcerts.com, tim@aquaticcouncil.com, editor@ipssa.com, and office@underwaterpools.com. Those rows were already reflected in the queue.

This run then sent three additional one-to-one plain-text emails: info@thetrainingcenter.com, info@ultrapool.net, and support@poolsharkh2o.com. That made the same-day SplashLens total eight sends, exceeding the intended five-send cap because the overlapping batch was discovered after these three sends were already in flight. The three overflow rows are marked sent with Gmail IDs and should not be followed up before 2026-06-26.

Queue expansion added future research rows for American Spa & Pool Pros, SpaRetailer, Tropical Aquatic Pool Education / The Pool Class, PHTA Pool Professionals Podcast, and The Pool Deck by Skimmer. No social/forum/Facebook/Reddit posts were sent.

## Controlled outreach drip - 2026-06-19 09:20:36 -05:00

Preflight: live HTTP checks returned 200 for https://splashlens.com and https://app.splashlens.com. Visible copy still showed 180+ current entries, did not show visible 500+ claims, and no fake-name testimonial markers were found. Gmail last-7-day checks found no inbound SplashLens replies, bounces, unsubscribe/remove-me requests, complaints, or delivery failures; broad hygiene hits were prior outbound drip messages only.

Queue state before expansion had only two sendable queued rows, so this run verified current public contact paths and Gmail prior-send history before sending. No prior Gmail messages were found for info@cpocertified.com, chad@poolcerts.com, tim@aquaticcouncil.com, editor@ipssa.com, office@underwaterpools.com, or aquadesk@aquaticcouncil.com.

Sent five one-to-one plain-text outreach emails: info@cpocertified.com, chad@poolcerts.com, tim@aquaticcouncil.com, editor@ipssa.com, and office@underwaterpools.com. Copy stayed conservative: free no-account reference app, 180+ current entries, possible matches, verification notes, not a diagnosis tool, no official partnership/endorsement/certification claims, and founder pool-sales-to-service-company context where natural.

Queue updated to mark Space Coast Pool School / CPOCertified, Pool Certs, Aquatic Council, IPSSAN Newsletter editorial route, and Underwater Pool Masters CPO Courses as sent with `last_sent_at=2026-06-19` and `next_send_after=2026-06-26`. Added three future `needs-verification` prospects for next-run research: The Training Center CPO, American Spa & Pool Pros, and SpaRetailer. No social/forum/Facebook/Reddit posts were sent.

Post-run reconciliation: the concurrent run at 09:20 CT sent three additional messages after the five-send batch above was already in Gmail: info@thetrainingcenter.com, info@ultrapool.net, and support@poolsharkh2o.com. The queue now marks those three as sent/overflow with Gmail IDs and 2026-06-26 follow-up holds. The Training Center CPO is no longer a future `needs-verification` row; future research coverage remains healthy with 19 `needs-verification` rows.

## Controlled outreach drip - 2026-06-22 09:19:38 -05:00

Preflight: live HTTP checks returned 200 for https://splashlens.com and https://app.splashlens.com. Visible homepage copy still showed 180+ current entries, did not show visible 500+ claims, and no fake-name testimonial markers were found.

Gmail last-7-day checks found no SplashLens-specific bounces, unsubscribe/remove-me requests, complaints, negative replies, or delivery failures. Two inbound messages from Tim Auerhahn at Aquatic Council were found on the 2026-06-19 thread; this was a positive reply and later call-interest note, so the Aquatic Council row was marked `replied` and removed from cold-drip follow-up.

Queue state had no `queued` rows, so this run verified current public contact paths and Gmail prior-send history before sending. No prior Gmail history was found for community@getskimmer.com, rudy@cpoclass.com, office@aagaonline.com, maria@aaschq.org, or info@texascampgrounds.com.

Sent five one-to-one plain-text outreach emails: community@getskimmer.com, rudy@cpoclass.com, office@aagaonline.com, maria@aaschq.org, and info@texascampgrounds.com. Copy stayed conservative: free no-account reference app, 180+ current equipment/error-code entries, possible matches, verification notes, not a diagnosis tool, no official partnership, certification, or endorsement claims, and founder pool-sales-to-service-company context where natural. Gmail sent IDs: 19eefb246f8aab4e, 19eefb29caf3f339, 19eefb2a1311d379, 19eefb2a25770d14, and 19eefb2a569849f3.

Queue updated to mark The Pool Deck by Skimmer as sent, add/send Talking Pools / CPOClass media route, AAGA CPO course, AASC CPO course, and Texas Association of Campgrounds CPO class, and add future `needs-verification` rows for Pool Pro Podcast and Pool Nation Awards. Future coverage remains healthy with 20 `needs-verification` rows. No social/forum/Facebook/Reddit posts were sent.

## Inbound reply logged - 2026-06-22

Lauren Broom at Space Coast Pool School / CPOCertified replied positively to the 2026-06-19 SplashLens outreach from Joshua Frost. Inbound summary: "I am interested. Lets talk, what would this include?" Sender signature included Lauren Broom, B.S., R.S., PHTA Instructor, Authorized OSHA General Industry Trainer, Educational Consultant, Space Coast Pool School, LLC.

Queue action: marked Space Coast Pool School / CPOCertified as `replied` and removed from cold-drip follow-up. Draft reply prepared for Joshua review before send; no email sent by Codex in this step.

## Warm reply sent - 2026-06-22

Sent Joshua's approved reply to Lauren Broom at spacecoastpoolschool@yahoo.com in the existing Gmail thread for "Free reference app for CPO training feedback." Gmail sent message id: `19ef02e43af6e4a9`; thread id: `19ee03fb1c2a70b5`.

Reply included the SplashLens website, web app, iOS App Store link, honest Google Play status as submitted/awaiting approval, positive note that multiple training/media/service replies have come in, and a training-session style app/web layer as a possible partnership direction. Kept framing conservative: SplashLens is a field reference app, not a replacement for CPO training, manuals, instructors, or qualified judgment.

## Controlled outreach drip - 2026-06-23 09:36:00 -05:00

Preflight: live HTTP checks returned 200 for https://splashlens.com and https://app.splashlens.com. Visible homepage copy still showed 180+ current entries, did not show visible 500+ claims, and no fake-name testimonial markers were found.

Gmail last-7-day checks found no SplashLens-specific bounces, unsubscribe/remove-me requests, complaints, negative replies, or delivery failures. Known positive Lauren Broom / Space Coast and Tim Auerhahn / Aquatic Council threads remained the only new inbound reply evidence in scope. No prior Gmail history was found for poolpropod@gmail.com, contact@poolnationawards.com, editorial@kendrickcontent.com, bluestreetpools@gmail.com, or erik@chlorinekingpools.com before sending.

Sent five one-to-one plain-text outreach emails: poolpropod@gmail.com, contact@poolnationawards.com, editorial@kendrickcontent.com, bluestreetpools@gmail.com, and erik@chlorinekingpools.com. Copy stayed conservative: free no-account reference app, 180+ current equipment/error-code entries, possible matches, verification notes, not a diagnosis tool, no official partnership or endorsement claims, and founder pool-sales-to-service-company context where natural. Gmail sent IDs: 19ef4da71585007d, 19ef4da8fe1c3167, 19ef4daa8f9e4f59, 19ef4dac3a46f192, and 19ef4dadfaf929b9.

Queue actions: marked Pool Pro Podcast, Pool Nation Awards, SpaRetailer, and MJ The Pool Pro as sent with `last_sent_at=2026-06-23` and `next_send_after=2026-06-30`; added Chlorine King Pool Service Show as a sent row for erik@chlorinekingpools.com. Audit note: Chlorine King had prior same-organization outreach to office@chlorinekingpools.com on 2026-06-15, but the final pre-send check only found no address-level history for erik@chlorinekingpools.com. This is recorded as same-organization repeat exposure and should not receive a cold follow-up unless they reply. No social/forum/Facebook/Reddit posts were sent.

## Controlled outreach drip - 2026-06-24 09:18:00 -05:00

Preflight: live HTTP checks returned 200 for https://splashlens.com and https://app.splashlens.com. Visible homepage copy showed current entry-count language including 180+ visible table copy and 230+ field troubleshooting/database copy, did not show visible 500+ claims, and no fake-name testimonial markers were found.

Gmail last-7-day checks found a new SplashLens delivery failure from the 2026-06-23 batch: contact@poolnationawards.com bounced with `550 No Such User Here` on 2026-06-23 14:20 UTC. Known positive Lauren Broom / Space Coast and Tim Auerhahn / Aquatic Council threads remained the only recent inbound reply evidence in scope. No unsubscribe/remove-me request, complaint, or negative reply was found.

Queue actions: marked Pool Nation Awards / contact@poolnationawards.com as `bounced`, cleared its follow-up date, and suppressed it from future sends unless a new verified contact route is found. The current queue still has 32 future `needs-verification` rows, above the 25-prospect target.

Send decision: sent 0 emails. The daily drip rules say to stop sending for the day when a bounce is found, so this run preserved the audit trail and did not send additional one-to-one outreach. No social/forum/Facebook/Reddit posts were sent.

## 2026-06-24 - Proof-library campaign prep
- Added PartSnap Proof Library as the primary outreach hook for trainers, media, podcasts, vendors, and manufacturer feedback routes.
- Updated controlled outreach automation prompt to use proof-library link, callback-risk/proof-passport/mystery-ticket language, and the one-real-part/code test ask.
- No emails sent in this prep pass; exact Gmail send still requires suppression checks and approval of recipient/subject/body.


## 2026-06-24 - Proof-library follow-up sends
- Preflight: https://splashlens.com/partsnap-proof-library and https://app.splashlens.com returned HTTP 200.
- Gmail suppression searches found no targeted bounce, unsubscribe/remove-me, complaint, or delivery-failure hits for the batch.
- Read address-level Gmail history for five recipients; all were outbound-only with no replies found.
- Sent 5 one-to-one threaded follow-ups, no BCC:
  - AQUA Magazine <editors@aquamagazine.com> - Gmail id 19efa47a51bc57b8
  - Service Industry News <info@serviceindustrynews.net> - Gmail id 19efa47c350fa0cf
  - Pool Magazine <editor@poolmagazine.com> - Gmail id 19efa47e662d8ad7
  - Pool & Spa Marketing <editor@poolspamarketing.com> - Gmail id 19efa480a68b9d5d
  - Pool Chasers <poolchasers.greg@gmail.com> - Gmail id 19efa483342fc84c
- Copy used the PartSnap Proof Library hook and the one-real-part/code test ask. No endorsement, diagnosis, guarantee, or partnership claims.
- Queue rows marked follow-up-sent with no further cold follow-up unless they reply.

## 2026-06-25 creative lane send prep and capped batch

Preflight: Gmail recent SplashLens search found warm/reply threads only (Bethany/PoolPro, Lauren/Space Coast Pool School, Tim/Aquatic Council) and no new unsubscribe/remove requests, complaints, bounces, or delivery-failure hits for the creative-lane targets. Live HTTP checks returned 200 for https://splashlens.com and https://app.splashlens.com. A stale live homepage "Google Play Coming Soon" trust badge was found, fixed, redeployed, and the follow-up risky-phrase scan returned clean before sending.

Sent 5 one-to-one plain-text emails, respecting the daily cap and no-BCC rule:
- Fluidra / Jandy / Polaris / Zodiac at productsupport@fluidra.com - Gmail id 19efcb802509707b.
- Waterway Plastics at waterway@waterwayplastics.com - Gmail id 19efcb8243e0c45a.
- AquaStar Pool Products at Info@aquastarpoolproducts.com - Gmail id 19efcb845263f34f.
- Intermatic Pool Support at poolsupport@intermatic.com - Gmail id 19efcb8638770632.
- LaMotte Technical Service at tech@lamotte.com - Gmail id 19efcb88070a7fdd.

Copy used the creative-lane feedback/routing ask: field proof, possible part families, water-testing guardrails, support routing, and no endorsement, diagnosis, warranty, fitment, or official-partner claim. Each email ended with "Talk Soon,".

Queue updates: marked Fluidra and Waterway rows sent; added sent rows for AquaStar, Intermatic Pool Support, and LaMotte Technical Service. Generic chemical/parts/distributor/podcast/builder/facility/software waves remain research-needed for future runs.

Blocker: user asked for all creative-lane emails before Friday, but the standing SplashLens drip rule caps cold outreach at 5 per day. More sends require either another daily run after preflight or an explicit rule change.

## Controlled outreach drip - 2026-06-25 09:22:00 -05:00

Preflight: `https://splashlens.com`, `https://app.splashlens.com`, `https://splashlens.com/api/partner-intake`, and `https://app.splashlens.com/api/events` all returned healthy live responses on 2026-06-25. `partner-intake` initially looked broken under a `HEAD` check, but live `GET` returned `ok=true` with storage/email configured and live `POST` validation returned `Valid email required`, confirming the route is up. `https://app.splashlens.com/dashboard` returned 200, and `/owner-dashboard` plus the `/dashboad` typo redirect to `/dashboard`.

Gmail last-7-day checks found no new SplashLens-specific unsubscribe/remove requests, complaints, or delivery failures after the already-recorded Pool Nation Awards bounce. Warm/reply evidence in scope: Bethany Branscum at Kendrick Content replied on 2026-06-24 asking for a PoolPro-ready write-up, Joshua sent the write-up plus a Google Play live-link correction on 2026-06-25, and Intermatic Pool Support sent an automatic acknowledgement/ticket response on 2026-06-25. Known Lauren Broom / Space Coast and Tim Auerhahn / Aquatic Council warm threads remain active background context.

Send decision: sent 0 new cold emails. The June 25 cold-send cap was already consumed by the earlier five one-to-one creative-lane emails, so this pass stayed no-send and did not use BCC, social/forum posts, or any same-organization repeat exposure.

Queue actions: marked SpaRetailer as `replied` because the Kendrick Content thread converted into a warm PoolPro press conversation; marked Intermatic Pool Support as `replied` after the ticket acknowledgement; upgraded the Raypak technical-training route to `queued` with verified public `warranty@raypak.com`; corrected the AquaCal training row because `https://aquacal.com/contact-us/` returned 404 while `https://aquacal.com/service_request` is live; updated HornerXpress / Team Horner to an official `needs-contact` form route; and added two verified future prospects: HASA (`info@hasapool.com`) and Pleatco filtration (`Pleatco_IA_Info@Pentair.com`).

Release-readiness checks: monthly and yearly checkout routes both returned `302` to live Stripe Payment Links with `X-SplashLens-Checkout-Fallback: stripe_api_401`, so direct Stripe API checkout is still blocked by the secret/config issue. Discovery surfaces stayed healthy: site/app `robots.txt`, `sitemap.xml`, `ai.txt`, and `llms.txt` all returned 200. Store-facing URLs also stayed reachable: the iOS App Store listing URL returned 200, the public Google Play listing URL remained live per the June 25 release packet, and `https://app.splashlens.com/?store=ios` plus `?store=android` both returned 200.

Blockers: no additional cold outreach can go out on June 25 without violating the daily cap, and direct Stripe API checkout still fails with `stripe_api_401` even though payment-link fallback works.
## 2026-06-27 - Meeting follow-up replies

- Searched recent SplashLens/pool outreach replies for call, schedule, next week, talk, interested, availability, and meeting language.
- Confirmed two live meeting-intent threads:
  - Tim Auerhahn, Aquatic Council - asked for a quick call about a service program that may tie into SplashLens.
  - Lauren Broom, Space Coast Pool School - replied interested and asked to talk.
- Sent scheduling follow-up to Tim offering next-week Wednesday, Thursday, or Friday, late morning to mid-afternoon Central. Gmail message id: `19f0b06078b636cf`.
- Sent scheduling follow-up to Lauren offering next-week Tuesday, Wednesday, or Thursday, late morning or afternoon Central. Gmail message id: `19f0b060958945eb`.
- Other matching threads reviewed were either PoolPro publication already handled, autoresponders, or unrelated non-SplashLens projects.

## Controlled outreach drip - 2026-06-29

Preflight: live HTTP checks returned healthy responses for `https://splashlens.com` and `https://app.splashlens.com`. Same-day Gmail sent search found 0 SplashLens outreach sends for 2026-06-29 before this run.

Gmail hygiene: sender profile is still Joshua Frost `<frost@belowzeromedia.com>`. Last-7-day SplashLens searches found no unsubscribe/remove-me requests, complaints, or negative replies. The existing Pool Nation Awards delivery failure remains inside the 7-day window: `contact@poolnationawards.com` bounced on 2026-06-23 with `550 No Such User Here` in Gmail thread `19ef4daa0370af71`.

Queue reconciliation: the Pool Nation Awards row is already marked `bounced` with the 550 evidence and remains suppressed from future sends unless a new verified contact route is found. PHTA podcast/public marketing routing was rechecked, but PHTA already has prior SplashLens exposure, so no duplicate cold send was prepared from that lane.

Send decision: sent 0 cold emails. The drip rules say to stop sending for the day when a hard bounce is present in the active hygiene window, so this run preserved deliverability and did not use BCC, social/forum posts, or additional same-organization exposure.

Revenue-readiness note: production checkout still redirects to live Stripe Payment Links, but the first-party Stripe Checkout Session path is returning `stripe_api_401`, which blocks automatic scanner entitlement activation from checkout sessions until the production `STRIPE_SECRET_KEY` is corrected in Cloudflare Pages.

## Controlled outreach drip - 2026-06-29 09:21:12 -05:00

Preflight: `https://splashlens.com`, `https://splashlens.com/partsnap-proof-library.html`, and `https://app.splashlens.com` returned HTTP 200. The visible site scan found no `500+` claim, no known fake testimonial names, and current-entry language including `230+` plus fallback `180+` references.

Gmail hygiene: last-7-day SplashLens searches found no unsubscribe/remove-me requests, complaints, negative replies, or new SplashLens-specific delivery failures. The existing Pool Nation Awards hard bounce remains inside the 7-day window: `contact@poolnationawards.com` failed on 2026-06-23 with `550 No Such User Here` in Gmail message `19ef4daa0370af71`.

Queue reconciliation: the Pool Nation Awards row is already marked `bounced` with the 550 evidence and remains suppressed. Current queue counts before any send were `queued=7`, `needs-verification=31`, and `queued/needs-verification=38`, so the future-prospect target remains above 25.

Send decision: sent 0 cold emails. The drip rules require stopping for the day while a hard bounce is present in the active 7-day hygiene window, so this run did not send one-to-one email, BCC batches, social posts, forum posts, Facebook posts, or Reddit posts.

## Controlled outreach drip - 2026-06-29 09:21:29 -05:00

Preflight: live HTTP checks returned `HTTP/1.1 200 OK` for `https://splashlens.com`, `https://app.splashlens.com`, and `https://splashlens.com/partsnap-proof-library.html` after its 308 redirect to `/partsnap-proof-library`. Body scans found current `230+` and `180+` language on the main site/app where expected and found no visible `500+` claim or fake testimonial-name markers.

Gmail hygiene: sender profile verified as Joshua Frost `<frost@belowzeromedia.com>`. Last-7-day Gmail searches found the known hard bounce from `contact@poolnationawards.com` still inside the active hygiene window: `Delivery Status Notification (Failure)`, Gmail message `19ef4daa0370af71`, thread `19ef4da8fe1c3167`, received 2026-06-23 07:20:29 -07:00, with `550 No Such User Here`. Recent SplashLens search also surfaced warm/reply threads from Space Coast, Aquatic Council, Kendrick Content/PoolPro, and Intermatic acknowledgement history, but no new unsubscribe/remove-me request, complaint, or negative reply.

Queue reconciliation: the Pool Nation Awards row was already marked `bounced` with the 550 evidence, and no additional queue status changes were needed. Current queue snapshot remains `queued=7`, `needs-verification=31`, `sent=57`, `replied=6`, `follow-up-sent=5`, `bounced=2`, `hold-community=6`, `hold-proof-needed=4`, `needs-contact=2`, `research-needed=19`, `second-wave=1`, and `covered-by-sent=1`, leaving 38 future eligible queued/needs-verification prospects.

Send decision: sent 0 cold emails. The checked-in drip rules require stopping for the day when a hard bounce is found in the active Gmail hygiene window, so no one-to-one batch, BCC, social/forum/Facebook/Reddit post, or same-organization repeat exposure was sent today.

## Controlled outreach drip - 2026-06-30 09:24:08 -05:00

Preflight: live HTTP checks returned `HTTP/1.1 200 OK` for `https://splashlens.com`, `https://app.splashlens.com`, and `https://splashlens.com/partsnap-proof-library.html` after its 308 redirect to `/partsnap-proof-library`. Body scans found no visible `500+` claim and no known fake testimonial-name markers. The main public site showed current `230+` and fallback `180+` language; the app showed `230+`.

Gmail hygiene: last-7-day SplashLens searches found no unsubscribe/remove-me requests, complaints, negative replies, or new SplashLens-specific delivery failures. The known Pool Nation Awards delivery failure is still inside the active hygiene window: `contact@poolnationawards.com` bounced on 2026-06-23 with `550 No Such User Here` in Gmail message `19ef4daa0370af71`, thread `19ef4da8fe1c3167`. A delivery-failure-shaped match from 2026-06-26 was inspected and was unrelated Tulboxx transcript content, not a SplashLens bounce.

Reply/acknowledgement review: recent inbound SplashLens/PartSnap searches found Bethany Branscum/Kendrick Content confirming the PoolPro web item was published at `https://poolpromag.com/splashlens-launches-free-field-reference-app/`, and Intermatic Technical Support ticket `#167005` acknowledgement. Both routes were already reflected in the CSV as replied/acknowledged; no new suppression row was needed.

Queue reconciliation: no CSV change was needed. Current queue snapshot remains `queued=7`, `needs-verification=31`, `sent=57`, `replied=6`, `follow-up-sent=5`, `bounced=2`, `hold-community=6`, `hold-proof-needed=4`, `needs-contact=2`, `research-needed=19`, `second-wave=1`, and `covered-by-sent=1`, leaving 38 future eligible queued/needs-verification prospects.

Send decision: sent 0 cold emails. The drip rules require stopping for the day while a hard bounce is present in the active 7-day hygiene window, so this run did not send one-to-one email, BCC batches, social posts, forum posts, Facebook posts, Reddit posts, or additional same-organization exposure.

## Controlled outreach drip - 2026-06-30 10:45:00 -05:00

Preflight: live HTTP checks returned `HTTP/1.1 200 OK` for `https://splashlens.com` and `https://app.splashlens.com`. Body scans found no visible `500+` claim, no known fake testimonial-name markers, public-site `230+` plus fallback `180+` language, and app `230+` language.

Gmail hygiene: sender profile verified as Joshua Frost `<frost@belowzeromedia.com>`. Fresh last-7-day Gmail searches found no unsubscribe/remove-me requests, complaints, negative replies, or SplashLens-specific delivery failures. Same-recipient searches for all 7 queued rows found no prior SplashLens sends to those exact addresses. One recent sent match was an internal GA4 traffic alert to Joshua, not outreach.

Send decision: sent 5 one-to-one plain-text emails, respecting the checked-in daily cap and no-BCC rule:
- Raypak technical training route at `warranty@raypak.com` - Gmail id `19f1935410e73ddf`.
- HornerXpress / Team Horner at `LCastanza@teamhorner.com` - Gmail id `19f19355fc4fd081`.
- Jack's Magic at `jacksmagic@jacksmagic.com` - Gmail id `19f19357e8e24085`.
- PoolRx at `cs@poolrx.com` - Gmail id `19f1935a5081e7b2`.
- Loop-Loc at `Consumers@LoopLoc.com` - Gmail id `19f1935c4f2cb1d1`.

Copy used manufacturer/distributor/chemical/accessory feedback asks with conservative reference-aid language, no endorsement claim, no diagnosis claim, no warranty/fitment/safety certification claim, and each email ended with `Talk Soon,`.

Queue updates: marked the five sent rows as `sent`, set `last_sent_at=2026-06-30`, set `next_send_after=2026-07-04`, and appended Gmail message IDs in notes. Remaining queued rows after the cap: HASA service-pro support at `info@hasapool.com` and Pleatco filtration routing at `Pleatco_IA_Info@Pentair.com`.

Blocker: user asked to send all outreach, but the current checked-in SplashLens drip rule caps cold outreach at 5 per day. The remaining 2 queued rows should be sent in the next eligible run after the standard preflight, unless Joshua explicitly changes the cap in `docs/outreach/splashlens-drip-rules.md`.
