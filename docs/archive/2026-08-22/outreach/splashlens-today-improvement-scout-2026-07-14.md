# SplashLens Today Improvement Scout - 2026-07-14

## Send Gate

Cold outreach should not run today unless a fresh manual Gmail review clears the hard-bounce concern. The new pre-send guard was added at:

```text
tools/splashlens_outreach_day_lock.ps1
```

Test result on 2026-07-14:

```text
SplashLens outreach send gate: BLOCKED
- Recent hard-bounce/delivery-failure language found in the last 7 days of the run log
```

That matches the 2026-07-13 run-log truth: two overlapping batches produced 10 cold sends and two hard bounces. Today should be queue expansion, warm-thread handling, and creative prep rather than another cold batch.

## Best Improvement Shipped Today

Add a single-writer outreach day lock so two automations cannot both see a clean slate and double-spend the daily cap again.

Workflow:

1. Run `tools\splashlens_outreach_day_lock.ps1`.
2. If `PASS`, send at most five one-to-one emails.
3. Update `splashlens-drip-queue.csv`.
4. Append `splashlens-drip-run-log.md`.
5. Release with `tools\splashlens_outreach_day_lock.ps1 -Release`.

## Creative Outreach Lanes To Prep Instead Of Sending Today

### Service Proof For The AI/Efficiency Moment

Current signal: pool media is actively talking about AI, pricing pressure, service efficiency, and operational excellence. SplashLens should not pitch "AI app" generically. The sharper angle is:

```text
Service proof layer for techs and operators: identify what is visible, capture what is missing, document the stop, and make the next handoff cleaner.
```

Priority lanes:

- AQUA-style service report/editorial routes, only with a fresh hook because AQUA has prior exposure.
- Pool service podcasts with business/operator audiences.
- Education/chapter routes where a proof workflow can help new techs after class.

### New-Tech Radar Pitch

Current signal: AQUA Magazine's July 2026 New & Improved page is actively covering products and upgraded solutions for pool/spa pros, including software, water-care, and equipment-adjacent updates. Pitch angle: SplashLens can maintain a "field-safe new-tech radar" for robots, automation, spa controls, AOP/chemical systems, and proof prompts.

CTA:

```text
Send us one new product, model family, or support scenario your readers are seeing in the field. We will turn it into a cautious field-reference card with proof prompts, not a diagnosis claim.
```

### Robot / AI Pool Cleaner Angle

Current signal: consumer and tech media are reviewing newer AI pool robots, self-cleaning docks, smart mapping, debris recognition, and long-runtime devices. Pitch angle: SplashLens should own the service-tech side of this wave: robot troubleshooting, model recognition, cable/track/filter/power-supply proof, and "what to capture before warranty/support."

Targets already aligned in the queue or prior prep:

- Beatbot
- Aiper
- iGarden
- Maytronics / Dolphin
- Polaris / Fluidra suppressed where applicable
- WYBOT / Betta rows only if not already follow-up-sent or suppressed

### Facility / CPO Operator Angle

Current signal: Tim/Aquatic Council feedback points toward a lighter workflow for CPOs, apartment complexes, swim schools, hotels, YMCAs, and municipal pools. Pitch angle: "first safe action, proof, and escalation packet" rather than deep tech troubleshooting.

Best queued lanes:

- PHTA Pool Professionals Podcast
- NESPA / Pool & Spa Show
- FSPA education/chapter presenters
- SC operator/provider routes
- CPO schools and aquatic training providers

### Service Proof OS Angle

Position this to service owners, trainers, and CRM-adjacent communities:

```text
SplashLens is not trying to replace route software. It helps prove the stop before the CRM entry: photos, readings, part evidence, missing-proof prompts, notes, callback-risk flags, and customer-safe summaries.
```

Best queue targets:

- McCallum's Pool Service & Repair
- P-Jay's Pools
- Neptune Pools Service and Repair
- Frank's Pool Services
- service-owner podcasts and route-business coaches

### Distributor / CRM-Adjacent Angle

Frame carefully:

```text
SplashLens is not the system of record. It is the fast stop-level reference and proof layer before notes enter Pool360, Skimmer, Pool Brain, Jobber, a counter conversation, or the office.
```

This is useful for distributor counters, training teams, and software communities, but it needs a non-competitive, no-partnership-claim tone.

### Municipal / Aquatics Facility Angle

Non-obvious lane: municipal pools, aquatic directors, apartment operators, YMCAs, hotels, and parks/recreation teams that need a simple incident/support packet, not deep repair logic.

Pitch:

```text
When the responsible person is not the repair tech, SplashLens can help capture the right visible proof before calling a qualified tech or reopening a decision.
```

### Spa / Swim Spa Expansion Angle

The queue now has enough spa/swim-spa targets to run a focused wave after the bounce window clears:

- Dimension One Spas
- Dream Maker Spas
- Endless Pools
- Coast Spas
- Wellis
- Balboa Water Group
- Spa Parts Plus
- Cover Valet
- Leisure Concepts / Covermate

Pitch should ask for proof requirements and common support misses, not partnership or endorsement.

## Today's Safe Action List

1. Do not send cold outreach while the hard-bounce gate is red.
2. Research and verify five more robot/automation/spa/new-tech contacts.
3. Prepare a "New Tech Radar + Service Proof" one-page pitch for AQUA-style product/news editors.
4. Prepare a "Facility Assist pilot" email for warm Tim/Aquatic Council style conversations.
5. Recheck Gmail for warm replies. Warm replies can be handled individually because they are not cold drip.

## Manual Verification Flags

Before any future send, recheck queue and Gmail for:

- `follow-up-sent`
- `replied`
- `bounced`
- `suppressed`
- Fluidra/Jandy/Polaris/Zodiac routes after the remove request
- forum/community/social lanes
- same-organization overexposure for PHTA, Pool Nation, Pool Magazine, AQUA, and Pool Chasers

## Copy Hook For Next Eligible Cold Day

Subject:

```text
Field proof prompts for new pool and spa tech
```

Body:

```text
Hi [Name],

I am Joshua Frost, founder of SplashLens. I started in pool sales, then moved into my own service company, so SplashLens came from real field lookup and documentation friction.

We are building a field-safe New Tech Radar inside SplashLens for the things techs are seeing more often: robots, automation, spa controls, swim spas, AOP/chemical systems, lights, pumps, heaters, and mystery parts.

The goal is not to diagnose or guarantee fit. The goal is to help a tech capture better proof before ordering, escalating, calling support, or documenting the stop.

If you have one product family, weird part, code, or support scenario your team sees often, I would be grateful for a pointer. We can turn it into a conservative reference card and keep any manufacturer/training language clean.

Talk Soon,
Joshua Frost
Founder, SplashLens
hello@splashlens.com
```
