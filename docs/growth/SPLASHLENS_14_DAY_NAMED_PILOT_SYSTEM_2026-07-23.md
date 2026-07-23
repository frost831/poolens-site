# SplashLens 14-Day Named Pilot System

Date prepared: 2026-07-23

Purpose: turn SplashLens visibility into evidence that a real pool or spa professional completed a useful workflow, returned, and reported a measurable business outcome.

This is an operating package, not a record of enrolled users. Every roster row begins as an unassigned `DEMO-*` slot. A person or organization becomes a named pilot only after direct acceptance and permission to record their business identity.

## Pilot Cohort

| Lane | Slots | Primary proof question |
| --- | ---: | --- |
| Individual field technicians | 25 | Did SplashLens help complete a real lookup, scan, or handoff faster? |
| Pool/spa service companies | 5 | Did the workflow improve documentation, escalation, or callback prevention across a team? |
| Facility or training pilots | 3 | Did the guided workflow make a non-repair operator or learner more confident about the correct next step? |

The source roster is `docs/outreach/splashlens-named-pilot-roster-2026-07-23.csv`.

## Truth Rules

- `DEMO-TECH-*`, `DEMO-COMPANY-*`, and `DEMO-FACILITY-*` are test tags, not people, customers, endorsements, or usage claims.
- Leave names, companies, emails, dates, outcomes, quotes, and story approvals blank until they are supplied or observed from a real opted-in pilot.
- Never convert a click into a completed workflow, a completed workflow into time saved, or a stated intention into a paid conversion.
- Record time saved only as a participant estimate, in whole minutes, and retain the wording `self-reported` in any analysis.
- Record `callback_avoided` as `yes` only when the participant describes the avoided return trip or escalation. Otherwise use `no`, `unknown`, or leave blank.
- `permissioned_story_status` must be `not_requested`, `requested`, `approved`, or `declined`. A useful quote is not permission to publish it.
- Store no customer names, addresses, health information, payment details, access codes, or other sensitive service data in the roster.
- Participation does not imply endorsement, manufacturer verification, diagnosis accuracy, or guaranteed part fitment.

## Enrollment Gate

Before assigning a slot:

1. Confirm the person is a real field technician or has authority to represent the participating company, facility, or training organization.
2. Confirm they agree to a 14-day product-feedback pilot.
3. Explain that SplashLens is a reference aid and does not replace manuals, codes, manufacturer guidance, or qualified judgment.
4. Ask whether their name or organization may be stored internally. Public story permission is a separate decision at Day 14.
5. Replace only the applicable blank identity fields. Keep the `DEMO-*` pilot ID permanently so test traffic is identifiable and removable.
6. Set `enrollment_status=active`, enter real start/end dates, and send only that slot's unique tracked URL.

## Fourteen-Day Assignment

### Day 0 - Baseline

- Record the participant's role and the field task that usually wastes the most time.
- Ask for a rough baseline: typical minutes spent, typical escalation path, and whether repeat visits are common.
- Do not populate an outcome yet.

### Day 1 - 60-Second Field Challenge

- Open the unique pilot URL.
- Try one real code, part, or equipment family.
- Complete one lookup or PartSnap attempt.
- Mark the result `helpful`, `close`, `wrong`, or `missing_info`.
- Record what proof the app requested and what the user still needed.

### Day 3 - Repeat On Real Work

- Use the same workflow on a different real field question.
- Capture whether the user reached a useful next step without leaving SplashLens.
- If the result is wrong or incomplete, record the brand, category, missing evidence, and participant wording without inventing a correction.

### Day 5 - Handoff Proof

- Technician: create or share one senior-tech, vendor, parts-counter, or customer-safe handoff.
- Service company: have an owner or senior tech review one technician handoff for completeness.
- Facility/training: complete one guided Facility Assist or learner scenario and identify the proper escalation point.

### Day 7 - Return Check

- Ask the participant to return without a reminder link if possible.
- Record whether they remembered where to start, which workflow they chose, and whether they completed it.
- Capture a one-to-five ease score and one sentence explaining the score.

### Day 10 - Business Outcome Check

- Technician: did the evidence improve a part request, support call, customer update, or next visit?
- Service company: did a manager receive clearer evidence or avoid preventable follow-up work?
- Facility/training: did the workflow help a non-repair operator document, dose, escalate, or hand off correctly?
- Populate time saved, callback avoided, and missing-information fields only from direct feedback.

### Day 14 - Exit

- Confirm total completed workflows and whether the participant returned after Day 1.
- Ask what they would keep, remove, or change first.
- Ask separately whether they are interested in paid saved history/team tools.
- Ask separately for permission to use their name, organization, outcome, and exact quote.
- Record permission even when declined; never treat silence as approval.

## Lane-Specific Definition Of Done

### Individual Technician

- At least two real workflows attempted.
- At least one feedback classification recorded.
- Day 7 return status known.
- One business-outcome answer recorded, including `unknown` when no outcome can be established.

### Service Company

- At least two participating staff roles touch the workflow, or one tech plus one manager review it.
- One handoff is reviewed for completeness.
- Owner reports whether the workflow could reduce callbacks, parts friction, or after-route paperwork.

### Facility Or Training

- One operator/learner scenario is completed.
- The pilot identifies the exact boundary between operator action and qualified escalation.
- The organization reports whether this belongs in daily operations, post-course reinforcement, or neither.

## Funnel Definitions

| Stage | Count only when |
| --- | --- |
| Pilot assigned | A real participant accepted and owns one slot. |
| Campaign visit | The unique pilot URL records a visit. |
| Challenge started | The participant begins a lookup, scan, or assigned guided workflow. |
| Workflow completed | They reach a result or completed handoff, including an honest wrong/missing result. |
| Feedback captured | A result classification or written note is saved. |
| Seven-day return | The same pilot returns on or after Day 7. |
| Business outcome | Time saved, callback avoided, missing information, or a clearly documented no-impact result is supplied. |
| Paid interest | The participant explicitly asks about or agrees to evaluate paid functionality. |
| Permissioned story | Publication permission is explicitly approved and the approved wording is retained. |

## Seven-Day Operating Target

The public growth target remains a planning target, not a result:

- 100 tracked campaign visits
- 30 app opens
- 15 completed field workflows
- 10 direct feedback responses
- 5 returning users
- 1-3 paid conversions
- 3 permissioned field stories

The pilot roster supplies attribution for the named-pilot portion of that funnel. Campaign-wide activity must remain separate from pilot outcomes.

## Weekly Review

Review the roster every Friday without manufacturing missing values:

1. Count assigned, active, completed, withdrawn, and unreachable slots.
2. Count each funnel stage by pilot lane.
3. Summarize `helpful`, `close`, `wrong`, and `missing_info` outcomes.
4. Report the median self-reported minutes saved only when at least five real values exist.
5. List the three most common missing-information categories verbatim.
6. Separate product defects, corpus gaps, unclear copy, and participant training needs.
7. Move no quote or company name into marketing until its story permission is `approved`.

## Cleanup

- Test traffic remains attributable through `DEMO-*` IDs and `demo_test` tags.
- At pilot close, archive operational outcomes; remove contact details when no longer needed.
- Delete abandoned synthetic slots only after preserving aggregate counts needed for the pilot report.
- Never merge this roster into the main outreach queue automatically.
