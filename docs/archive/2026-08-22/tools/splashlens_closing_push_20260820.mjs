import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import path from 'node:path';

const OUTREACH_DIR = path.join('docs', 'outreach');
const rawPath = path.join(OUTREACH_DIR, 'splashlens-prospect-review-2026-08-20.csv');
const queuePath = path.join(OUTREACH_DIR, 'splashlens-drip-queue.csv');
const cleanPath = path.join(OUTREACH_DIR, 'splashlens-prospect-review-clean-2026-08-20.csv');
const summaryPath = path.join(OUTREACH_DIR, 'splashlens-closing-season-push-2026-08-20.md');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(value);
      value = '';
    } else if (char === '\n') {
      row.push(value.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      value = '';
    } else {
      value += char;
    }
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  const [headers, ...records] = rows.filter((candidate) => candidate.some((cell) => cell !== ''));
  return records.map((record) => Object.fromEntries(headers.map((header, index) => [header, record[index] || ''])));
}

function csvCell(value) {
  return `"${String(value || '').replace(/"/g, '""')}"`;
}

function writeCsv(filePath, rows, headers) {
  const body = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ].join('\n');
  writeFileSync(filePath, `${body}\n`, 'utf8');
}

const rawRows = parseCsv(readFileSync(rawPath, 'utf8'));
const queueRows = parseCsv(readFileSync(queuePath, 'utf8').replace(/^\uFEFF/, ''));
const queueHeaders = Object.keys(queueRows[0]);
const queueEmails = new Set(queueRows.map((row) => (row.email || '').trim().toLowerCase()).filter(Boolean));
const queueDomains = new Set(queueRows
  .map((row) => (row.email || '').toLowerCase().split('@')[1])
  .filter(Boolean));
const queueTargets = new Set(queueRows.map((row) => (row.target || '').trim().toLowerCase()).filter(Boolean));

const badEmailParts = [
  'example@',
  'u003e',
  'hostingersite',
  'webmaster@',
  'noreply',
  'no-reply',
  'attendeecustomerservice@',
  'accounting@',
];
const seen = new Set();
const reviewed = [];
const appended = [];
let sameDomainCount = 0;
let rejectedCount = 0;

for (const row of rawRows) {
  const email = (row.email || '').trim().toLowerCase();
  let decision = 'new_needs_verification';
  if (!email || badEmailParts.some((part) => email.includes(part))) {
    decision = 'reject_noise';
  } else if (seen.has(email)) {
    decision = 'reject_duplicate_scrape';
  } else if (queueEmails.has(email)) {
    decision = 'reject_existing_queue_email';
  } else {
    seen.add(email);
    const domain = email.split('@')[1] || '';
    if (queueDomains.has(domain)) {
      decision = 'same_domain_manual_review';
      sameDomainCount += 1;
    }
  }
  if (decision.startsWith('reject')) rejectedCount += 1;
  reviewed.push({ ...row, review_decision: decision });

  if (decision === 'new_needs_verification') {
    const baseTarget = ((row.page_title || row.discovered_url || email).split('|')[0] || email).trim().slice(0, 90);
    const target = queueTargets.has(baseTarget.toLowerCase()) ? `${baseTarget} (${email})` : baseTarget;
    const segment = {
      'creator-media': 'Podcast/creator',
      publication: 'Trade media',
      training: 'Training/certification',
      manufacturer: 'Manufacturer',
      'pool-service-company': 'Pool service company',
    }[row.lane] || 'Research/industry route';
    appended.push({
      target,
      segment,
      tier: '3',
      email,
      source_url: row.discovered_url || row.source_url,
      status: 'needs-verification',
      template: 'closing_season_review',
      daily_cap_group: 'splashlens',
      last_sent_at: '',
      next_send_after: '',
      notes: 'Discovered in 2026-08-20 closing-season scrape from public source page. Verify fit, suppression, and exact route before any send.',
    });
    queueTargets.add(target.toLowerCase());
  }
}

writeCsv(cleanPath, reviewed, [
  'source_url',
  'discovered_url',
  'email',
  'page_title',
  'lane',
  'status',
  'note',
  'review_decision',
]);

if (appended.length) {
  appendFileSync(
    queuePath,
    appended.map((row) => queueHeaders.map((header) => csvCell(row[header])).join(',')).join('\n') + '\n',
    'utf8',
  );
}

const sourceCount = new Set(rawRows.map((row) => row.source_url)).size;
const summary = `# SplashLens Closing-Season Push - 2026-08-20

## What changed today

- Refreshed \`campaign.html\` around closing-season pressure, messy end-of-season notes, connected-pump proof prompts, and a clearer PartSnap Pro upgrade path.
- Verified the public site, app, and checkout readiness before queue work.
- Ran current public-source scrape from ${sourceCount} source URLs.
- Raw scrape: ${rawRows.length} rows.
- Cleaned review file: \`${cleanPath.replace(/\\\\/g, '/')}\`.
- New queue rows appended as \`needs-verification\`: ${appended.length}.
- Same-domain manual-review rows retained but not appended: ${sameDomainCount}.
- Noise/existing rows rejected from append: ${rejectedCount}.

## Current hooks to use

- Closing season in the Midwest: test one ugly stop before route notes turn into winter callbacks.
- AQUA August product roundup includes SplashLens, giving a fresh factual coverage hook.
- Connected-pump intelligence: IntelliFlo3 / IntelliPro3 style prompts now ask for pump plate, app or drive alert, schedule, flow/pressure/water-level context, and RS-485/I-O board evidence.
- Paid step stays clean: free core first, PartSnap Pro after value is felt.

## Approval-Ready Five-Recipient Send Pack

Send Boundary: draft/approval-ready only unless Joshua explicitly says \`send\`.

1. PoolRx — \`cs@poolrx.com\` — chemical/water-care route — closing-season proof before recurring treatment questions.
2. Jack's Magic — \`jacksmagic@jacksmagic.com\` — stain/chemistry specialist route — proof prompts before support escalation.
3. Chlorine King Pool Service — \`office@chlorinekingpools.com\` — creator/service operator route — one ugly closing-season stop challenge.
4. Pool Spa Patio Expo — \`client.services@poolspapatio.com\` — education/trade-show route — field-proof workflow for service education audience.
5. Raypak technical training route — \`warranty@raypak.com\` — manufacturer training/support route — better proof before warranty/support questions.

## Exact Copy For Service / Creator Recipient

Subject: One ugly closing-season stop for SplashLens

Hi [Name],

I am Joshua Frost, founder of SplashLens. I started in pool sales, then moved into my own service company, so this came from real route, repair, and counter lookup friction.

As closing season starts creeping up in the Midwest, I am pushing SplashLens around one practical ask: try it on one ugly real stop before the route gets noisy.

Run one code, mystery part, equipment family, connected-pump alert, or proof workflow here:
https://splashlens.com/campaign.html?utm_source=outreach&utm_medium=email&utm_campaign=closing_season_2026&utm_content=service_company

The core app is free, no account required. PartSnap gives possible part paths and proof prompts, not fitment guarantees. The goal is cleaner notes, better model/photo proof, and less guessing before someone orders blind or has to explain the visit later.

If it saves time or falls short, I would genuinely appreciate blunt field feedback.

Talk Soon,
Joshua Frost
Founder, SplashLens
hello@splashlens.com

## Exact Copy For Product / Support / Training Recipient

Subject: Better proof before closing-season support questions

Hi [Name],

I am Joshua Frost, founder of SplashLens. I built it after seeing how often pool techs and support teams get stuck with a vague photo, old part, missing model plate, or rushed end-of-season repair question.

SplashLens is a free-core field reference app for pool and spa pros:
https://splashlens.com/campaign.html?utm_source=outreach&utm_medium=email&utm_campaign=closing_season_2026&utm_content=supplier_product

The practical workflow is simple: identify a possible part or equipment family, capture model plates and markings, show what proof is missing, and create a cleaner senior-tech/vendor/support packet before anyone orders blind or escalates with half the story.

It does not diagnose, guarantee fit, replace manuals, or imply manufacturer approval. Would someone on your team be open to testing it with one real support scenario and telling us what proof techs should capture first?

Talk Soon,
Joshua Frost
Founder, SplashLens
hello@splashlens.com

## Scrape Sources

- AQUA August 2026 New & Improved
- PoolDial pool podcast roundup
- Feedspot swimming pool podcasts
- PSP Expo education and contact routes
- PHTA events/podcast pages
- Pool Magazine trade-show and podcast pages
- FSPA education
- Service Industry News contact/social directory

## Notes

- No bounces, unsubscribe/remove, complaints, or delivery-failure hits were found in the 30-day Gmail stop-signal search.
- Day-lock passed at 0/5 sends for 2026-08-20.
- Queue send is still capped by project rule at five one-to-one plain-text emails per day.
`;

writeFileSync(summaryPath, summary, 'utf8');

console.log(JSON.stringify({
  rawRows: rawRows.length,
  reviewedRows: reviewed.length,
  appendedRows: appended.length,
  sameDomainManualReview: sameDomainCount,
  rejectedRows: rejectedCount,
  cleanPath,
  summaryPath,
}, null, 2));
