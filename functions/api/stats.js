// GET /api/stats - protected owner stats for SplashLens.
// Env: SUBSCRIBERS_DB, SPLASHLENS_STATS_SECRET

const DEFAULT_ORIGIN = 'https://splashlens.com';

function corsHeaders(request) {
 const origin = request.headers.get('Origin') || '';
 const allowed = new Set([
 'https://splashlens.com',
 'https://www.splashlens.com',
 'http://localhost:8788',
 'http://localhost:8789',
 'http://localhost:5173',
 ]);

 return {
 'Access-Control-Allow-Origin': allowed.has(origin) ? origin : DEFAULT_ORIGIN,
 'Access-Control-Allow-Methods': 'GET, OPTIONS',
 'Access-Control-Allow-Headers': 'Authorization, Content-Type',
 'Access-Control-Max-Age': '86400',
 'Content-Type': 'application/json',
 'Cache-Control': 'no-store',
 };
}

function json(data, status, headers) {
 return new Response(JSON.stringify(data), { status, headers });
}

const EXTERNAL_EVENT_FILTER = `
 AND COALESCE(source, '') NOT IN ('qa', 'codex', 'codex_smoke', 'launch-gate-test')
 AND lower(COALESCE(user_agent, '')) NOT LIKE '%headless%'
 AND lower(COALESCE(user_agent, '')) NOT LIKE '%bot%'
 AND lower(COALESCE(user_agent, '')) NOT LIKE '%crawler%'
 AND lower(COALESCE(user_agent, '')) NOT LIKE '%spider%'
 AND lower(COALESCE(user_agent, '')) NOT LIKE '%preview%'
 AND lower(COALESCE(user_agent, '')) NOT LIKE '%compatible; meta-externalagent%'
 AND COALESCE(path, '') NOT LIKE '/test/%'
 AND COALESCE(path, '') NOT LIKE '%utm_source=qa%'
 AND COALESCE(path, '') NOT LIKE '%utm_medium=playwright%'
 AND COALESCE(path, '') NOT LIKE '%codex%'
 AND COALESCE(path, '') NOT LIKE '%amplitude-readiness%'
 AND COALESCE(path, '') NOT LIKE '%growth-plan%'
 AND COALESCE(path, '') NOT LIKE '%verify=%'
`;

function authOk(request, env) {
 const secret = String(env.SPLASHLENS_STATS_SECRET || env.SPLASHLENS_ADMIN_SECRET || '').trim();
 if (!secret) return false;

 const auth = request.headers.get('Authorization') || '';
 const bearer = auth.replace(/^Bearer\s+/i, '').trim();
 const headerSecret = request.headers.get('X-SplashLens-Stats-Secret') || '';
 return bearer === secret || headerSecret === secret;
}

async function first(db, sql, ...bindings) {
 const row = await db.prepare(sql).bind(...bindings).first();
 return row || {};
}

async function all(db, sql, ...bindings) {
 const res = await db.prepare(sql).bind(...bindings).all();
 return res.results || [];
}

async function count(db, sql, ...bindings) {
 const row = await first(db, sql, ...bindings);
 return Number(row.value || 0);
}

const FUNNEL_STAGES = [
 {
  key: 'traffic',
  label: 'Article / site traffic',
  goal: 'A tech, owner, trainer, facility, or partner lands on SplashLens.',
  events: ['site_page_view', 'campaign_landing_view', 'campaign_view', 'field_challenge_page_view', 'article_referral_open'],
 },
 {
  key: 'app_intent',
  label: 'App or store intent',
  goal: 'They open the web app or click an app-store download path.',
  events: ['open_app_click', 'app_store_download_click', 'google_play_download_click', 'play_store_download_click', 'app_open', 'first_app_open', 'native_shell_open', 'native_shell_first_open', 'pwa_installed'],
 },
 {
  key: 'first_action',
  label: 'First field action',
  goal: 'They start a lookup, PartSnap scan, report, route, or facility workflow.',
  events: ['first_action_started', 'manual_code_search', 'ai_scan_started', 'service_proof_workflow_started', 'facility_workflow_action_selected', 'field_challenge_started', 'field_challenge_routed'],
 },
 {
  key: 'first_value',
  label: 'Useful result',
  goal: 'They get a result, save proof, build a summary, or complete a challenge.',
  events: ['first_value_completed', 'partsnap_result', 'service_report_saved', 'service_proof_summary_generated', 'service_proof_share_link_created', 'field_challenge_completed'],
 },
 {
  key: 'feedback',
  label: 'Feedback captured',
  goal: 'They tell us whether it helped, was wrong, or was missing information.',
  events: ['partsnap_result_feedback', 'field_feedback_quick_answered', 'field_feedback_submitted', 'field_challenge_feedback', 'field_score_feedback'],
 },
 {
  key: 'return_use',
  label: 'Return / continued use',
  goal: 'They come back, continue a saved task, or keep a session alive.',
  events: ['return_task_continued', 'session_started', 'session_heartbeat', 'app_tab_view', 'partsnap_field_stop_reopened'],
 },
 {
  key: 'checkout_intent',
  label: 'Checkout intent',
  goal: 'They click a paid, restore, or native purchase path.',
  events: ['checkout_click', 'upgrade_click', 'post_value_upgrade_clicked', 'partsnap_pro_restore_requested', 'native_purchase_click', 'paid_lane_click', 'paid_lane_lead_captured'],
 },
 {
  key: 'paid_or_restored',
  label: 'Paid / entitlement proof',
  goal: 'Stripe or the app records a completed paid/restore state.',
  events: ['paid_entitlement_activated', 'checkout_success', 'stripe_checkout_completed', 'restore_entitlement_success'],
 },
];

function quotedEvents(events) {
 return events.map((event) => `'${event.replace(/'/g, "''")}'`).join(', ');
}

async function funnelStageStats(db, days) {
 const rows = [];
 for (const stage of FUNNEL_STAGES) {
  const value = await count(db, `
 SELECT COUNT(*) AS value
 FROM events
 WHERE event IN (${quotedEvents(stage.events)})
 AND created_at >= datetime('now', '-${days} days')
 ${EXTERNAL_EVENT_FILTER}
 `);
  rows.push({
   key: stage.key,
   label: stage.label,
   goal: stage.goal,
   count: value,
   events: stage.events,
  });
 }
 return rows.map((row, index) => {
  const previous = index > 0 ? rows[index - 1].count : null;
  const conversionFromPrevious = previous && previous > 0 ? Math.round((row.count / previous) * 1000) / 10 : null;
  return { ...row, conversionFromPrevious };
 });
}

async function partnerIntakeStats(db) {
 const table = await first(db, `SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'partner_intake'`);
 if (!table.name) {
 return {
 metrics: { partnerLeadsTotal: 0, partnerLeads30d: 0, fieldTesterLeadsTotal: 0, fieldTesterLeads30d: 0, pilotLeadsTotal: 0, pilotLeads30d: 0 },
 bySource: [],
 byLane: [],
 };
 }

 const [partnerLeadsTotal, partnerLeads30d, fieldTesterLeadsTotal, fieldTesterLeads30d, pilotLeadsTotal, pilotLeads30d, bySource, byLane] = await Promise.all([
 count(db, `SELECT COUNT(*) AS value FROM partner_intake WHERE source = 'partners-page'`),
 count(db, `SELECT COUNT(*) AS value FROM partner_intake WHERE source = 'partners-page' AND datetime(created_at) >= datetime('now', '-30 days')`),
 count(db, `SELECT COUNT(*) AS value FROM partner_intake WHERE source = 'field-testers-page' OR lower(COALESCE(lane, '')) LIKE '%tester%'`),
 count(db, `SELECT COUNT(*) AS value FROM partner_intake WHERE (source = 'field-testers-page' OR lower(COALESCE(lane, '')) LIKE '%tester%') AND datetime(created_at) >= datetime('now', '-30 days')`),
 count(db, `SELECT COUNT(*) AS value FROM partner_intake WHERE lower(COALESCE(lane, '')) LIKE '%pilot%' OR lower(COALESCE(note, '')) LIKE '%sponsor/affiliate interest: education pilot%'`),
 count(db, `SELECT COUNT(*) AS value FROM partner_intake WHERE (lower(COALESCE(lane, '')) LIKE '%pilot%' OR lower(COALESCE(note, '')) LIKE '%sponsor/affiliate interest: education pilot%') AND datetime(created_at) >= datetime('now', '-30 days')`),
 all(db, `
 SELECT COALESCE(NULLIF(TRIM(source), ''), 'unknown') AS source,
 COUNT(*) AS count,
 SUM(CASE WHEN datetime(created_at) >= datetime('now', '-30 days') THEN 1 ELSE 0 END) AS count30d
 FROM partner_intake
 GROUP BY COALESCE(NULLIF(TRIM(source), ''), 'unknown')
 ORDER BY count DESC, source ASC
 `),
 all(db, `
 SELECT COALESCE(NULLIF(TRIM(lane), ''), 'unknown') AS lane,
 COUNT(*) AS count,
 SUM(CASE WHEN datetime(created_at) >= datetime('now', '-30 days') THEN 1 ELSE 0 END) AS count30d
 FROM partner_intake
 GROUP BY COALESCE(NULLIF(TRIM(lane), ''), 'unknown')
 ORDER BY count DESC, lane ASC
 `),
 ]);

 return {
 metrics: { partnerLeadsTotal, partnerLeads30d, fieldTesterLeadsTotal, fieldTesterLeads30d, pilotLeadsTotal, pilotLeads30d },
 bySource,
 byLane,
 };
}

async function paymentStats(db) {
 const table = await first(db, `SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'payment_events'`);
 if (!table.name) {
 return { byPlan: [], splashlensCompleted: 0, suspectCompleted: 0 };
 }

 const byPlan = await all(db, `
 SELECT event_type,
 COALESCE(plan, 'unknown') AS plan,
 COUNT(*) AS count,
 COUNT(DISTINCT stripe_session_id) AS stripeSessions,
 MIN(created_at) AS firstSeen,
 MAX(created_at) AS lastSeen
 FROM payment_events
 GROUP BY event_type, COALESCE(plan, 'unknown')
 ORDER BY count DESC, plan ASC
 `);

 const splashlensCompleted = byPlan
 .filter((row) => /partsnap|splashlens/i.test(String(row.plan || '')))
 .reduce((sum, row) => sum + Number(row.count || 0), 0);
 const suspectCompleted = byPlan
 .filter((row) => !/partsnap|splashlens/i.test(String(row.plan || '')))
 .reduce((sum, row) => sum + Number(row.count || 0), 0);

 return { byPlan, splashlensCompleted, suspectCompleted };
}

export async function onRequestGet({ request, env }) {
 const headers = corsHeaders(request);

 if (!authOk(request, env)) {
 return json({ ok: false, error: 'Unauthorized' }, 401, headers);
 }

 if (!env.SUBSCRIBERS_DB) {
 return json({ ok: false, error: 'SUBSCRIBERS_DB binding is not configured' }, 503, headers);
 }

 const db = env.SUBSCRIBERS_DB;

 try {
 const [
 events7d,
 events30d,
 pageViews7d,
 pageViews30d,
 scanStarts7d,
 scanStarts30d,
 partSnapResults30d,
 partSnapFeedback30d,
 affiliateClicks30d,
 subscribersTotal,
 subscribers30d,
 topEvents,
 scansByMode,
 partSnapFeedbackByOutcome,
 topManualQueries,
 dailyProxy,
 conversionFunnel7d,
 conversionFunnel30d,
partnerIntake,
payments,
 ] = await Promise.all([
 count(db, `SELECT COUNT(*) AS value FROM events WHERE created_at >= datetime('now', '-7 days') ${EXTERNAL_EVENT_FILTER}`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE created_at >= datetime('now', '-30 days') ${EXTERNAL_EVENT_FILTER}`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE event = 'site_page_view' AND created_at >= datetime('now', '-7 days') ${EXTERNAL_EVENT_FILTER}`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE event = 'site_page_view' AND created_at >= datetime('now', '-30 days') ${EXTERNAL_EVENT_FILTER}`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE event = 'ai_scan_started' AND created_at >= datetime('now', '-7 days') ${EXTERNAL_EVENT_FILTER}`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE event = 'ai_scan_started' AND created_at >= datetime('now', '-30 days') ${EXTERNAL_EVENT_FILTER}`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE event = 'partsnap_result' AND created_at >= datetime('now', '-30 days') ${EXTERNAL_EVENT_FILTER}`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE event = 'partsnap_result_feedback' AND created_at >= datetime('now', '-30 days') ${EXTERNAL_EVENT_FILTER}`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE event = 'affiliate_click' AND created_at >= datetime('now', '-30 days') ${EXTERNAL_EVENT_FILTER}`),
 count(db, `SELECT COUNT(*) AS value FROM subscribers`),
 count(db, `SELECT COUNT(*) AS value FROM subscribers WHERE created_at >= datetime('now', '-30 days')`),
 all(db, `
 SELECT event, COUNT(*) AS count
 FROM events
 WHERE created_at >= datetime('now', '-30 days')
 ${EXTERNAL_EVENT_FILTER}
 GROUP BY event
 ORDER BY count DESC
 LIMIT 12
 `),
 all(db, `
 SELECT COALESCE(mode, json_extract(props, '$.mode'), 'unknown') AS mode, COUNT(*) AS count
 FROM events
 WHERE event = 'ai_scan_started' AND created_at >= datetime('now', '-30 days')
 ${EXTERNAL_EVENT_FILTER}
 GROUP BY mode
 ORDER BY count DESC
 `),
 all(db, `
 SELECT COALESCE(json_extract(props, '$.outcome'), 'unknown') AS outcome, COUNT(*) AS count
 FROM events
 WHERE event = 'partsnap_result_feedback' AND created_at >= datetime('now', '-30 days')
 ${EXTERNAL_EVENT_FILTER}
 GROUP BY outcome
 ORDER BY count DESC, outcome ASC
 `),
 all(db, `
 SELECT json_extract(props, '$.query') AS query, json_extract(props, '$.brand') AS brand, COUNT(*) AS count
 FROM events
 WHERE event = 'manual_code_search'
 AND created_at >= datetime('now', '-30 days')
 AND json_extract(props, '$.query') IS NOT NULL
 ${EXTERNAL_EVENT_FILTER}
 GROUP BY query, brand
 ORDER BY count DESC
 LIMIT 20
 `),
 all(db, `
 SELECT date(created_at) AS day,
 COUNT(*) AS events,
 COUNT(DISTINCT user_agent) AS user_agent_proxy
 FROM events
 WHERE created_at >= datetime('now', '-14 days')
 ${EXTERNAL_EVENT_FILTER}
 GROUP BY day
 ORDER BY day DESC
 `),
 funnelStageStats(db, 7),
 funnelStageStats(db, 30),
partnerIntakeStats(db),
paymentStats(db),
 ]);

 return json({
 ok: true,
 generatedAt: new Date().toISOString(),
 sources: {
 events: 'SUBSCRIBERS_DB.events',
 subscribers: 'SUBSCRIBERS_DB.subscribers',
 partnerIntake: 'SUBSCRIBERS_DB.partner_intake',
 caveats: [
 'DAU is a user-agent proxy until a durable anonymous app ID is captured.',
 'Internal QA, Codex smoke, Playwright, verification, and readiness paths are excluded from owner-facing event totals.',
 'Headless/browser-test heartbeats are excluded from owner-facing event totals.',
 'Installs are not proven by this endpoint until PWA/store install events are added.',
 'PartSnap Pro active subscription truth remains Stripe/KV, not the event table.',
 'Partner totals count partners-page submissions; field tester totals include field-testers-page submissions and tester lanes.',
 'Pilot totals count pilot lanes and Education pilot sponsor-interest notes.',
 ],
 },
 metrics: {
 events7d,
 events30d,
 pageViews7d,
 pageViews30d,
 scanStarts7d,
 scanStarts30d,
 partSnapResults30d,
 partSnapFeedback30d,
 affiliateClicks30d,
 subscribersTotal,
 subscribers30d,
 splashlensPaidCompletions: payments.splashlensCompleted,
 suspectNonSplashLensPaymentRows: payments.suspectCompleted,
 ...partnerIntake.metrics,
 },
 topEvents,
 scansByMode,
 partSnapFeedbackByOutcome,
 topManualQueries,
dailyProxy,
 conversionFunnel7d,
 conversionFunnel30d,
leadsBySource: partnerIntake.bySource,
leadsByLane: partnerIntake.byLane,
paymentsByPlan: payments.byPlan,
 }, 200, headers);
 } catch (err) {
 console.error('Stats error:', err);
 return json({ ok: false, error: 'Stats query failed' }, 500, headers);
 }
}

export async function onRequestOptions({ request }) {
 return new Response(null, { status: 204, headers: corsHeaders(request) });
}
