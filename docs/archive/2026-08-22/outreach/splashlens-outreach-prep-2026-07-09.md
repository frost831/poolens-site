# SplashLens outreach prep - 2026-07-09

## Decision

Sent 0 cold emails.

Reason: the checked-in outreach log still records the 2026-07-05 Fluidra WCS remove-me / not-interested signal inside the required 7-day stop window. A fresh Gmail stop-signal search on 2026-07-09 returned no new matching message ids, but the known July 5 stop signal remains binding until the next clean recheck on 2026-07-12.

## Live preflight

- `https://splashlens.com` returned HTTP 200.
- `https://app.splashlens.com` returned HTTP 200.
- `https://splashlens.com/sitemap.xml` returned HTTP 200.
- `https://app.splashlens.com/api/checkout?plan=monthly` returned HTTP 200 in this check.
- `https://app.splashlens.com/api/checkout?plan=yearly` returned HTTP 200 in this check.

Note: older run-log proof recorded checkout endpoints as 302 with direct Stripe payment-link headers. The current check confirms reachability, but the next monetization audit should re-check whether the body still routes users cleanly to Stripe from the UI.

## Scrape and prospecting work

Source list created:

- `docs/outreach/splashlens-source-urls-2026-07-09.txt`

Generated artifacts:

- `docs/outreach/splashlens-prospect-review-2026-07-09.csv`
- `docs/outreach/splashlens-prospect-review-2026-07-09-summary.json`
- `docs/outreach/splashlens-prospect-candidates-2026-07-09.csv`

Scrape result:

- 20 source URLs.
- 122 raw review rows.
- 58 deduped candidates after cleanup.
- 57 duplicate rows.
- 7 junk rows.

Excluded from send-ready queue:

- Fort Worth city staff/media directory addresses surfaced from a CPO event page. These are not pool-industry outreach targets.
- The Training Center Houston instructor route, because the same organization already received cold outreach on 2026-06-19 and a duplicate cold touch on 2026-07-01.
- The Grit Game individual marketing emails, because the live pool-podcast roundup page did not expose a clean pool-specific owner/editor contact in the fetched body.

## Queue changes

Updated:

- PHTA Pool Professionals Podcast -> `queued`, `marketing@phta.org`, eligible 2026-07-12, with same-organization caution because `service@phta.org` already had prior exposure.

Added:

- Wake Tech Certified Pool Operator Training -> `queued`, `wceresources@waketech.edu`, eligible 2026-07-12.
- HD Supply Pool Maintenance Training -> `needs-verification`, `customercare@hdsupply.com`, broad customer-care route; find a better training/editorial route before send.
- New Jersey Pest Management Association CPO -> `queued`, `bonaccib@njpma.org`, eligible 2026-07-12.
- The Training Center Houston instructor route -> `covered-by-sent`, no further cold outreach unless they reply.
- The Grit Game pool-podcast roundup -> `needs-contact`, use manual/form route only after review.

Queue snapshot after edits:

- `queued=27`
- `needs-verification=35`
- `needs-contact=20`
- `covered-by-sent=2`
- `sent=36`
- `follow-up-sent=59`
- `replied=9`
- `suppressed=1`
- `bounced=2`

## Gmail preflight

Gmail profile used: `frost@belowzeromedia.com`.

Fresh stop-signal query:

`newer_than:7d (SplashLens OR PartSnap OR "Mystery Part" OR "Service Proof Passport" OR Fluidra OR Jandy) (unsubscribe OR "remove me" OR "do not contact" OR complaint OR "not interested" OR bounce OR bounced OR undeliverable OR "delivery failure" OR failed) -in:trash -in:spam`

Result: no new matching message ids.

Exact-recipient history checks:

- `wceresources@waketech.edu` -> no messages found.
- `customercare@hdsupply.com` -> no messages found.
- `bonaccib@njpma.org` -> no messages found.
- `marketing@phta.org` -> no messages found.
- `info@thetrainingcenter.com` -> existing sent history found, including duplicate 2026-07-01 send. Do not send same-organization cold outreach again.

## Next clean send path

On 2026-07-12 or later, only after a fresh same-day Gmail stop-signal search:

1. Send at most 5 one-to-one emails.
2. Pick from `queued` rows only.
3. Prefer CPO/training/media rows first, then spa/swim-spa manufacturer rows.
4. Do not send to `needs-verification`, `needs-contact`, `covered-by-sent`, `follow-up-sent`, `sent`, `replied`, `bounced`, or `suppressed`.
5. End every message with `Talk Soon,`.

## Safe copy for CPO/training rows

Subject: Free field reference app for pool techs and trainees

Hi {{team/name}},

I am Joshua Frost, founder of SplashLens. I started in pool sales, then moved into my own service company, so this came from the lookup friction techs hit on real stops.

SplashLens is a free no-account field reference app for pool and spa techs:
https://app.splashlens.com

It covers equipment and error-code lookup, PartSnap parts ID prompts, connected-pool troubleshooting, spa/hot-tub prompts, dosing math, notes, and proof packets. It is not a replacement for CPO training, instructors, manufacturer manuals, label directions, or qualified judgment.

If it is useful for your students or operators, I would love blunt feedback on what is missing, what should be safer, and what would save a tech time in the field.

Talk Soon,
Joshua Frost
Founder, SplashLens
hello@splashlens.com

## Safe copy for media/creator rows

Subject: SplashLens field app idea for your pool pro audience

Hi {{name/team}},

I am Joshua Frost, founder of SplashLens. I started in pool sales, then moved into my own service company, and built this because field lookups, part proof, and training gaps were eating too much route time.

SplashLens is a free no-account field reference app for pool and spa techs:
https://app.splashlens.com

The practical test is simple: try it with one weird part, code, or equipment family your audience sees often. PartSnap and the reference tools are meant to return possible paths, missing proof, and cleaner escalation notes, not guaranteed diagnoses or manufacturer-backed answers.

If it is not useful, I would rather hear that directly.

Talk Soon,
Joshua Frost
Founder, SplashLens
hello@splashlens.com
