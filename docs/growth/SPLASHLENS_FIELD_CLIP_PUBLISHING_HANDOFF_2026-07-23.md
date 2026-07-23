# SplashLens Field Clip Publishing Handoff

Date prepared: 2026-07-23

Source scripts: `docs/growth/SPLASHLENS_FIELD_CLIP_SCRIPTS_2_WEEK_2026-07-23.md`

This is a preparation and publishing-control handoff. It does not authorize automatic posting, email sending, or invented engagement reporting.

## Cadence

Use one two-week cycle with Central Time as the operating timezone.

| Day | Publish window | Clip |
| --- | --- | --- |
| Week 1 Monday | 7:15-8:15 AM | Can SplashLens identify this? |
| Week 1 Wednesday | 11:30 AM-12:30 PM | What proof is missing before ordering? |
| Week 1 Friday | 7:15-8:15 AM | Turn a service stop into a clear update |
| Week 2 Monday | 7:15-8:15 AM | One code, one useful next step |
| Week 2 Wednesday | 11:30 AM-12:30 PM | Send a senior tech what they need |
| Week 2 Friday | 7:15-8:15 AM | The operator-to-tech handoff |

Priority channels: LinkedIn, Instagram Reels, Facebook business page, and YouTube Shorts. Adjust framing to each channel, but retain the same tracked destination and claim language.

## Per-Clip Production Checklist

1. Confirm the featured workflow exists and completes on the current production build.
2. Use a real item or mark all simulated records, messages, and scenarios `DEMO / TEST` on screen.
3. Record a vertical 1080x1920 screen and field clip with readable captions.
4. Keep the final cut between 20 and 35 seconds.
5. Remove customer, address, serial, access, billing, and private service information.
6. Confirm spoken copy does not promise diagnosis, fitment, time savings, callback prevention, accuracy, or endorsement.
7. Include the assigned tracked URL in the channel destination.
8. Have one human review the final video, caption, thumbnail, destination, and disclosure.
9. Publish only after `approval_status=approved` in the publishing log below.
10. Record the platform post URL and actual metrics after publication; leave unknown fields blank.

## Publishing Log Template

Use one row per channel per clip. This table is intentionally blank and must not be prefilled with imagined dates or results.

| Clip ID | Channel | Scheduled at | Approval status | Published at | Post URL | Views | Tracked visits | Challenge starts | Workflows completed | Notes |
| --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| W1-MON |  |  | draft |  |  |  |  |  |  |  |
| W1-WED |  |  | draft |  |  |  |  |  |  |  |
| W1-FRI |  |  | draft |  |  |  |  |  |  |  |
| W2-MON |  |  | draft |  |  |  |  |  |  |  |
| W2-WED |  |  | draft |  |  |  |  |  |  |  |
| W2-FRI |  |  | draft |  |  |  |  |  |  |  |

## Simple Automation Handoff

Recommended automation behavior:

- Sunday at 4:00 PM CT: create the next week's three-item production checklist from the approved script pack.
- Monday, Wednesday, and Friday at 6:45 AM CT: verify an approved asset, caption, and tracked URL exist; otherwise report `BLOCKED - human asset or approval required`.
- Two hours after a confirmed publication: capture the platform post URL and available public engagement counts.
- Twenty-four hours after publication: capture tracked visits, challenge starts, and completed workflows from the owner analytics source.
- Friday at 4:00 PM CT: produce a factual weekly summary separating platform views, tracked visits, completed workflows, and direct feedback.

Automation guardrails:

- Draft and remind by default; do not auto-publish until platform credentials, final-asset QA, and an explicit owner approval rule are documented.
- Never send email or edit `docs/outreach/splashlens-drip-queue.csv` from the content automation.
- Never infer a download, completed workflow, time saved, or paid conversion from a view or click.
- Never reuse a participant's name, company, quote, photo, or result unless the named-pilot roster shows explicit story approval.
- Stop and report when the production workflow, tracked destination, or required disclosure does not match the clip.
- Retain the clip ID and campaign parameters so every published asset can be reconciled to its traffic.

## Weekly Decision Rule

After six clips, rank topics by completed workflows per tracked visit, not raw views. Continue the two strongest formats, revise the two with high clicks but low completion, and retire any format that produces neither useful feedback nor completed workflows after two properly distributed attempts.
