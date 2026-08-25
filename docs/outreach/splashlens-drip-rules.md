# SplashLens Controlled Outreach Drip Rules

## Sender

- Send from: Joshua Frost <frost@belowzeromedia.com>
- Public reply/contact: hello@splashlens.com
- Reply routing: hello@splashlens.com forwards to frost@belowzeromedia.com

## Send Boundary

- No fixed cold-email daily limit. Send volume is governed by sender health, recipient quality, verified rows, cooldowns, and live preflight status.
- Send one-to-one only. Do not use BCC batches.
- Do not send to Facebook groups, Reddit threads, forums, or community admins without authenticated-account review and group-rule confirmation.
- Do not send to `follow-up-sent` rows; those have already received the one allowed cold follow-up.
- Do not send to `needs-verification` rows until a current public contact path is verified.
- Do not send to `hold-proof-needed` rows until a one-page PDF or stronger usage proof exists.
- Stop sending if a bounce, complaint, unsubscribe/request-not-to-contact, or negative reply is found in the fresh preflight or during the run.
- Stop sending if Gmail/API errors, unusual delivery failures, or sender-authentication warnings appear.
- When the verified sendable queue is empty, use the run to research more public contact paths and append them as `queued` or `needs-verification`.

## Required Preflight

Before sending any daily batch:

0. Run the single-writer/day-lock guard from the repo root:
   - `powershell -ExecutionPolicy Bypass -File tools\splashlens_outreach_day_lock.ps1`
   - If it reports `BLOCKED`, do not send cold outreach. Use the run for queue expansion, warm replies, or manual review only.
   - Release the lock only after the Gmail send, queue update, and run-log append are complete:
     `powershell -ExecutionPolicy Bypass -File tools\splashlens_outreach_day_lock.ps1 -Release`
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
5. Select only rows that have a verified public contact route, no stop signal, and no cooldown conflict.

## Copy Rules

- Use plain text.
- Link only once unless the recipient clearly needs both app and site.
- End all outbound SplashLens outreach emails with `Talk Soon,` before Joshua's name.
- No fake urgency.
- Include concise founder context in future outreach when it fits: Joshua started in the pool industry in sales, then moved into his own pool service company, so SplashLens comes from real service/counter lookup friction.
- It is acceptable to add that Joshua used and liked useful pieces of existing CRMs and pool programs, but they moved too slowly for a solo pool operator, so SplashLens was built to be faster and more agile when real field needs show up.
- Keep CRM/program language broad and fair. Do not name, mock, or attack specific software unless a documented comparison is being sent.
- For media, podcast, association, and creator/editorial targets, it is acceptable to add that Joshua has been highlighted in industry magazines for tech-forward thinking in the pool space.
- Do not present the magazine note as an award, endorsement, partnership, or hard proof unless exact publication names/links are included in the message.
- The factual coverage line may name AQUA Magazine and PoolPro only when the exact published URLs are included or the message links to the tracked campaign page that names them. Say `published` or `coverage`, never `endorsed`, `partnered`, `approved`, or `recommended`.
- AQUA's 2026-08-18 newsletter placement is scheduled, not completed. Do not claim newsletter publication until it is verified after deployment.
- No "official," "endorsed," "partnered," or manufacturer/distributor affiliation claims.
- No "diagnoses," "guarantees," or "tells you what to replace."
- Say "reference app," "possible matches," "verification notes," and "qualified tech/manual verification."

## Follow-Up

- Follow up once only, no earlier than 4 days after first send.
- Follow-up must be shorter than the original.
- Do not follow up if the recipient replied, bounced, or is suppressed.

## Batch Priority

Use `docs/outreach/splashlens-visibility-engine.md` and `docs/outreach/splashlens-outreach-templates.md` for lane strategy and copy.

1. Warm replies and requested follow-ups.
2. `queued` Tier 1 and Tier 2 media/blog/creator/association rows.
3. Mystery Part Challenge targets: pool podcasts, pool publications, creators, trainers, distributor counters, and manufacturer support routes.
4. Newly researched pool podcasts, pool magazines, pool publications, pool bloggers, creator/tech educators, associations, training groups, and trade-show/media contacts with current public contact paths.
5. Distributor, manufacturer, software community, and buying-group contacts only when framed as feedback/resource routing, not a partnership claim.
6. Field tester / ambassador invites for real pool techs and tech-forward service company owners.

## Queue Expansion

- Every run should try to keep at least 25 future eligible prospects in `queued` or `needs-verification`.
- If sendable rows are thin, research more public contacts before sending.
- Prefer official contact pages, podcast pages, publication staff/contact pages, association pages, and clearly public business emails.
- Do not use scraped personal emails, private social profiles, or stale snippets as sendable contacts without verification.
- Add newly found prospects to `docs/outreach/splashlens-drip-queue.csv` with source URL, segment, status, and notes.
- Keep thinking of new places to send: pool schools, podcasts, magazines, YouTube channels, distributor counters, manufacturer product/training/support routes, trade shows, associations, buying groups, service coaches, route-owner communities, and tech-forward solo operators.

## Output Expected From Each Run

- Number sent.
- Recipient list.
- Any suppressions/bounces/replies found.
- Queue rows changed.
- Newly found prospects added.
- Any blockers.
