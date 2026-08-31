import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const statsSource = readFileSync(new URL('../functions/api/stats.js', import.meta.url), 'utf8');

async function loadStatsModule() {
  const encoded = Buffer.from(statsSource, 'utf8').toString('base64');
  return import(`data:text/javascript;base64,${encoded}`);
}

test('owner stats exclude internal QA and smoke traffic from event totals', () => {
  assert.match(statsSource, /const EXTERNAL_EVENT_FILTER = `/);
  assert.match(statsSource, /COALESCE\(source, ''\) NOT IN \('qa', 'codex', 'codex_smoke'\)/);
  assert.match(statsSource, /utm_source=qa/);
  assert.match(statsSource, /utm_medium=playwright/);
  assert.match(statsSource, /amplitude-readiness/);
  assert.match(statsSource, /growth-plan/);
  assert.match(statsSource, /verify=%/);
  assert.match(statsSource, /Internal QA, Codex smoke, Playwright, verification, and readiness paths are excluded/);
});

test('all event dashboard query groups use the clean external event filter', () => {
  const eventQueryMarkers = [
    'events7d',
    'events30d',
    'pageViews7d',
    'pageViews30d',
    'scanStarts7d',
    'scanStarts30d',
    'partSnapResults30d',
    'partSnapFeedback30d',
    'affiliateClicks30d',
    'topEvents',
    'scansByMode',
    'partSnapFeedbackByOutcome',
    'topManualQueries',
    'dailyProxy',
  ];

  for (const marker of eventQueryMarkers) {
    assert.match(statsSource, new RegExp(`${marker}[\\s\\S]{0,900}EXTERNAL_EVENT_FILTER`));
  }
});

test('authorized stats request runs event queries with the external traffic filter', async () => {
  const { onRequestGet } = await loadStatsModule();
  const capturedSql = [];
  const db = {
    prepare(sql) {
      capturedSql.push(sql);
      return {
        bind() {
          return this;
        },
        async first() {
          if (sql.includes("sqlite_master") && sql.includes("partner_intake")) {
            return {};
          }
          return { value: 0 };
        },
        async all() {
          return { results: [] };
        },
      };
    },
  };

  const request = new Request('https://splashlens.com/api/stats', {
    headers: { Authorization: 'Bearer test-secret' },
  });

  const response = await onRequestGet({
    request,
    env: {
      SPLASHLENS_STATS_SECRET: 'test-secret',
      SUBSCRIBERS_DB: db,
    },
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.ok, true);

  const eventQueries = capturedSql.filter((sql) => /\bFROM events\b/.test(sql));
  assert.ok(eventQueries.length >= 12);

  for (const sql of eventQueries) {
    assert.match(sql, /NOT IN \('qa', 'codex', 'codex_smoke'\)/);
    assert.match(sql, /utm_source=qa/);
    assert.match(sql, /utm_medium=playwright/);
    assert.match(sql, /amplitude-readiness/);
    assert.match(sql, /growth-plan/);
    assert.match(sql, /verify=%/);
  }
});
