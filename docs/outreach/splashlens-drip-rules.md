# SplashLens Controlled Outreach Drip Rules

## Sender

- Send from: Joshua Frost <frost@belowzeromedia.com>
- Public reply/contact: hello@splashlens.com
- Reply routing: hello@splashlens.com forwards to frost@belowzeromedia.com

## Daily Send Boundary

- Maximum 3 cold emails per weekday.
- Send one-to-one only. Do not use BCC batches.
- Do not send to Facebook groups, Reddit threads, forums, or community admins without authenticated-account review and group-rule confirmation.
- Do not send to `needs-verification` rows until a current public contact path is verified.
- Do not send to `hold-proof-needed` rows until a one-page PDF or stronger usage proof exists.
- Stop sending for the day if a bounce, complaint, unsubscribe/request-not-to-contact, or negative reply is found.

## Required Preflight

Before sending any daily batch:

1. Search Gmail for replies, bounces, unsubscribe language, and delivery failures from the last 7 days.
2. Update `docs/outreach/splashlens-drip-queue.csv` statuses:
   - `replied`
   - `bounced`
   - `suppressed`
   - `sent`
   - `needs-verification`
   - `queued`
3. Check the live site for unsafe claims before sending:
   - No visible `500+` claims.
   - No fake testimonial names.
   - Current positioning says 180+ current entries.
4. Send only if the live app and site return HTTP 200.

## Copy Rules

- Use plain text.
- Link only once unless the recipient clearly needs both app and site.
- No fake urgency.
- Include concise founder context in future outreach when it fits: Joshua started in the pool industry in sales, then moved into his own pool service company, so SplashLens comes from real service/counter lookup friction.
- It is acceptable to add that Joshua used and liked useful pieces of existing CRMs and pool programs, but they moved too slowly for a solo pool operator, so SplashLens was built to be faster and more agile when real field needs show up.
- Keep CRM/program language broad and fair. Do not name, mock, or attack specific software unless a documented comparison is being sent.
- For media, podcast, association, and creator/editorial targets, it is acceptable to add that Joshua has been highlighted in industry magazines for tech-forward thinking in the pool space.
- Do not present the magazine note as an award, endorsement, partnership, or hard proof unless exact publication names/links are included in the message.
- No "official," "endorsed," "partnered," or manufacturer/distributor affiliation claims.
- No "diagnoses," "guarantees," or "tells you what to replace."
- Say "reference app," "possible matches," "verification notes," and "qualified tech/manual verification."

## Follow-Up

- Follow up once only, no earlier than 4 days after first send.
- Follow-up must be shorter than the original.
- Do not follow up if the recipient replied, bounced, or is suppressed.

## Batch Priority

1. `queued` Tier 1 and Tier 2 media/blog/creator/association rows.
2. Newly verified media/blog/creator/association contacts.
3. Second-wave software/training/buying-group contacts only after one-pager/proof exists.

## Output Expected From Each Run

- Number sent.
- Recipient list.
- Any suppressions/bounces/replies found.
- Queue rows changed.
- Any blockers.
