# SplashLens Visibility Engine

Source of truth:

- Queue: `docs/outreach/splashlens-drip-queue.csv`
- Rules: `docs/outreach/splashlens-drip-rules.md`
- Run log: `docs/outreach/splashlens-drip-run-log.md`
- Public hooks:
  - https://splashlens.com
  - https://splashlens.com/campaign.html
  - https://splashlens.com/closing-season.html
  - https://splashlens.com/partsnap.html
  - https://splashlens.com/mystery-part-lab.html
  - https://splashlens.com/partners.html
  - https://splashlens.com/facility-assist
  - https://app.splashlens.com

## Goal

Make SplashLens visible where pool technicians already trust information: training rooms, distributor counters, trade publications, podcasts, creator channels, manufacturer support ecosystems, and service-owner software communities.

The message stays simple: SplashLens gives pool techs time back by helping them move faster, cleaner, and with better proof at the equipment pad. It is a reference aid, not a diagnosis replacement.

Current push: Closing Season Pilot. Ask real techs, service owners, suppliers, trainers, and facility operators to try one code, part, equipment family, closing note, or proof workflow before Midwest closing season gets noisy.

## Outreach Lanes

### 1. Mystery Part Challenge

Best targets:

- Pool podcasts
- YouTube creators
- Pool magazines
- Training instructors
- Distributor counter managers
- Manufacturer support teams

Primary ask:

> Send us one weird pool part, model plate, label, or error code you think apps usually miss. We will run it through PartSnap, show the proof, and share where it stays cautious.

Use link:

- https://splashlens.com/mystery-part-lab.html

Why it works:

- Gives creators a testable segment.
- Gives trainers a classroom scenario.
- Gives manufacturers/distributors a reason to improve verification cards.
- Gives SplashLens useful product feedback without pretending every result is perfect.

### 2. Training Resource Lane

Best targets:

- CPO instructors
- Pool schools
- PHTA instructors
- Apprenticeship groups
- Apartment/campground operator training contacts
- Service company trainers

Primary ask:

> Would this be useful as a free field reference layer for students after class?

Use language:

- Free no-account reference app.
- PartSnap, Route Brain, error lookup, dosing math, saved job history, and Facility Assist.
- Not a substitute for CPO training, manuals, instructors, or qualified judgment.
- Joshua started in pool sales, moved into his own service company, and built this from real lookup friction.

### 3. Media, Podcast, Creator Lane

Best targets:

- Pool magazines
- Newsletters
- Pool podcasts
- YouTube/TikTok/Instagram creators
- Service-tech educators

Primary ask:

> Would you be open to testing the app or sending one mystery part/code for a PartSnap challenge segment?

Story angles:

- A solo pool operator built a faster field reference layer because existing tools moved too slowly for day-to-day tech friction.
- PartSnap creates clean boss/supplier notes so a newer tech can send better proof before ordering.
- Repeat issue watch helps techs avoid blind part orders and weak end-of-stop notes.
- Mystery Part Lab is a real-world test, not a polished demo.

### 4. Distributor Counter Lane

Best targets:

- SCP/POOLCORP local branches and education routes
- Heritage Pool Supply Group branches
- Leslie's Pro/commercial contacts
- Independent distributors
- Regional counter managers

Primary ask:

> Could PartSnap reduce vague counter lookup requests if a tech showed up with a cleaner proof packet?

Keep it local and humble. Ask for feedback, not a partnership. Do not imply distributor approval.

### 5. Manufacturer Verification Lane

Best targets:

- Pentair
- Hayward
- Fluidra/Jandy/Zodiac/Polaris
- Raypak
- AquaCal
- Waterway
- CMP/PAL/S.R.Smith lighting
- Maytronics/Dolphin
- Aiper, Beatbot, Betta, BWT
- Coverstar, Cover-Pools, automatic cover teams
- Chemical controller and feeder companies

Primary ask:

> We are building partner-verified cards for common field clues. Who can tell us what not to claim and which proof a tech should capture before ordering?

Do not use "verified" publicly until there is a real partner review or written approval.

### 6. Software Community Lane

Best targets:

- Skimmer community/media/newsletter
- Pool Brain
- Pool Office Manager
- Jobber pool-service audience
- Pool service business coaches
- Buying groups and route-owner communities

Primary ask:

> You run the business layer. SplashLens is the field reference layer at the pad. Would this help your users' techs finish cleaner?

Avoid attacking other CRMs. The founder story is that Joshua liked pieces of existing tools but wanted something faster and more agile for a single pool operator.

### 7. Tech Ambassador Lane

Best targets:

- Solo operators
- Senior service techs
- Repair techs
- Tech-forward service company owners
- Early warm responders

Offer:

- "Founding Field Tester"
- Free early access to PartSnap improvements
- Direct feature feedback loop
- Optional credit only with permission

Primary ask:

> Would you test one part, one code, or one service note workflow and tell us where it slows you down?

## Auto Loop

Weekdays, the automation should:

1. Run live preflight for `https://splashlens.com` and `https://app.splashlens.com`.
2. Search Gmail for replies, bounces, unsubscribe/remove requests, complaints, and delivery failures.
3. Suppress replied, bounced, negative, or remove-request contacts.
4. Pick verified `queued` rows that pass same-day source, MX, exact-history, cooldown, suppression, and sender-health checks.
5. If sendable rows are thin, research and add verified prospects before sending.
6. Rotate lanes so the same audience is not over-hit:
   - Monday: training and associations.
   - Tuesday: podcasts, creators, and media.
   - Wednesday: distributors and software/community routes.
   - Thursday: manufacturers and partner-verification routes.
   - Friday: follow-ups, warm replies, ambassador invites, and queue expansion.
7. Update `last_sent_at`, `next_send_after`, `status`, and notes.
8. Append to `splashlens-drip-run-log.md`.
9. Commit only outreach files.

## Send Gates

Do not send if:

- Site or app is not HTTP 200.
- Gmail shows a bounce, complaint, unsubscribe, remove request, or negative reply.
- The row has no verified public contact path.
- The row is a social/forum/community post route.
- The row is same-organization repeat exposure within the last 14 days unless it is a warm reply.
- The copy would imply official partnership, certification, manufacturer approval, diagnosis, warranty, or guaranteed fit.

## Success Signals

Do not count email opens. Count:

- Replies.
- Demo/call requests.
- Mystery part submissions.
- PartSnap usage events.
- Partner card feedback.
- App opens and installs.
- Saved proofs and shared PartSnap packets.
- Requests for training, consulting, or partner verification.
- The owner stats funnel from article/site traffic to app/store intent, first field action, useful result, feedback, return use, checkout intent, and paid/restore proof.
