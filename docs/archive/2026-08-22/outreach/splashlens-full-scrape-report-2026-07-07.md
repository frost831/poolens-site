# SplashLens Full Scrape Report - 2026-07-07

## Send Boundary

No emails were sent in this pass.

This was a scrape, dedupe, queue-prep, and product-source pass. Sending should remain gated by `docs/outreach/splashlens-drip-rules.md`, including the 5/day cap, Gmail stop-signal search, no duplicate follow-ups, no BCC, and `Talk Soon,` signoff.

## Inputs Checked

- Queue: `docs/outreach/splashlens-drip-queue.csv`
- Rules: `docs/outreach/splashlens-drip-rules.md`
- Raw scrape source list: `docs/outreach/splashlens-scrape-source-urls-2026-07-07.txt`
- Sanitized deduped scrape output: `docs/outreach/splashlens-scrape-review-deduped-2026-07-07.csv`
- Summary JSON: `docs/outreach/splashlens-scrape-summary-2026-07-07.json`
- Recent Gmail sent sample: 100 SplashLens/PartSnap-related sent messages returned from the first 14-day sent-mail page.
- Gmail stop-signal query: no matching SplashLens/PartSnap unsubscribe, remove, complaint, bounce, failed, or undeliverable hits returned in the last 14 days.

## Scrape Results

- Source URLs scraped: 19
- Raw review rows: 733
- Unique extracted emails after cleanup: 709
- Manual directory review rows: 697
- Duplicate/covered rows after queue update: 11
- Manual personal/owner review rows: 1
- Committed review rows: 12 non-directory rows only

Important: the 697 PHTA directory emails are not send-ready. They are public directory leads, but they need company-site verification, suppression checks, and a clear business basis before any one-to-one outreach. The full directory email dump was not committed; only counts and the safe non-directory review rows were saved.

## Queue Result

Before this pass, the queue had 182 rows.

After this pass:

- Total queue rows: 189
- `queued`: 9
- `needs-verification`: 37
- Future pool (`queued` + `needs-verification`): 46

This restores the future-prospect buffer above the 25-row target.

## New Rows Added To Queue

All rows were added as `needs-verification`, not send-ready.

| Target | Email | Segment | Source |
| --- | --- | --- | --- |
| Anderson Aquatics | `brad@andersonaquatics.com` | Training/AFO-CPO provider | `https://www.andersonaquatics.com/classes` |
| Integrity Consultants CPO course | `cs@integrity-consultants.com` | Training/CPO provider | `https://integrity-consultants.com/certified-pool-spa-operator-course/` |
| McCallum's Pool Service & Repair | `support@mccallumspoolservice.com` | Pool service company | `https://mccallumspoolservice.com/` |
| P-Jay's Pools | `pjayspoolco@gmail.com` | Pool service company | `https://www.pjayspools.com/` |
| Neptune Pools Service and Repair | `daryl@neptunepoolsaz.com` | Pool service company | `https://neptunepoolsaz.com/` |
| Frank's Pool Services | `frank@frankspoolservices.com` | Pool service company | `https://frankspoolservicesinc.com/` |
| Custom Pool Route | `cpr@custompoolroute.com` | Pool route / service-company network | `https://custompoolroute.com/about-us/` |

## Already Covered / Do Not Rehit Cold

- Pool Chasers: already `follow-up-sent`.
- Talking Pools / CPO Class: already `follow-up-sent`.
- The Deep End Pool Podcast: already `follow-up-sent`.
- Pool Magazine editor route: already `follow-up-sent`.
- Pool Magazine sales route: held for proof/paid-placement decision.
- Aiper support: already contacted on 2026-07-01; do not rehit without clean routing and queue rules.
- Fluidra WCS / product-support routes: suppressed from prior removal request.

## Manuals And Guides

Yes, there are accessible manuals/guides we can use better.

New source index created:

- `docs/product-intel/splashlens-manual-guide-source-index-2026-07-07.md`

High-value sources found:

- Hayward manuals and heat-pump troubleshooting guides.
- Pentair self-help, download center, pump parts, heater parts, and valve parts PDFs.
- Maytronics Dolphin manuals lookup.
- Aiper troubleshooting center and dealer/product lanes.
- Waterway instruction manuals, including pool/spa controls and NEO spa controllers.
- AquaCal manuals and heat-pump fault guidance.
- Polaris parts/manuals.
- Cover-Pools parts guide.

Use these as source links and proof-prompt inputs. Do not copy full manuals, diagrams, or parts tables into SplashLens.

## PartSnap Best-Practice Add

New PartSnap taxonomy created:

- `docs/product-intel/partsnap-source-and-part-taxonomy-2026-07-07.md`

Core PartSnap proof ladder:

- Wide equipment photo.
- Model plate.
- Part close-up.
- Context photo.
- Measurement.
- Symptom/code.
- Safety boundary.
- Current manual/source link.

Priority part families:

- Pumps.
- Heaters and heat pumps.
- Salt systems.
- Automation.
- Lighting.
- Robots and cleaners.
- Filters.
- Valves/plumbing.
- Covers.
- Spa/hot-tub systems.
- Chemical feeders/controllers.

## Next Product Work

1. Add source-link metadata into the app for major brands and categories.
2. Expand heat-pump fault codes from official Hayward/AquaCal/Pentair/Jandy-style manuals.
3. Add PartSnap proof templates for pump, robot, cover, heater, valve, and spa-pack packets.
4. Add a manual/source URL field to partner-verified cards.
5. Build a "source-backed field card" page for each major category without republishing manuals.

## Verdict

Prep pass succeeded. Queue is replenished, duplicate risk was reduced, manuals/guides are mapped, and PartSnap has a stronger source-backed taxonomy.

No outbound email should be sent from this report alone. The next send pass must rerun Gmail hygiene, verify row source pages, and respect daily cap.
