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
 affiliateClicks30d,
 subscribersTotal,
 subscribers30d,
 topEvents,
 scansByMode,
 topManualQueries,
 dailyProxy,
 partnerIntake,
 ] = await Promise.all([
 count(db, `SELECT COUNT(*) AS value FROM events WHERE created_at >= datetime('now', '-7 days')`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE created_at >= datetime('now', '-30 days')`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE event = 'site_page_view' AND created_at >= datetime('now', '-7 days')`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE event = 'site_page_view' AND created_at >= datetime('now', '-30 days')`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE event = 'ai_scan_started' AND created_at >= datetime('now', '-7 days')`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE event = 'ai_scan_started' AND created_at >= datetime('now', '-30 days')`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE event = 'partsnap_result' AND created_at >= datetime('now', '-30 days')`),
 count(db, `SELECT COUNT(*) AS value FROM events WHERE event = 'affiliate_click' AND created_at >= datetime('now', '-30 days')`),
 count(db, `SELECT COUNT(*) AS value FROM subscribers`),
 count(db, `SELECT COUNT(*) AS value FROM subscribers WHERE created_at >= datetime('now', '-30 days')`),
 all(db, `
 SELECT event, COUNT(*) AS count
 FROM events
 WHERE created_at >= datetime('now', '-30 days')
 GROUP BY event
 ORDER BY count DESC
 LIMIT 12
 `),
 all(db, `
 SELECT COALESCE(mode, json_extract(props, '$.mode'), 'unknown') AS mode, COUNT(*) AS count
 FROM events
 WHERE event = 'ai_scan_started' AND created_at >= datetime('now', '-30 days')
 GROUP BY mode
 ORDER BY count DESC
 `),
 all(db, `
 SELECT json_extract(props, '$.query') AS query, json_extract(props, '$.brand') AS brand, COUNT(*) AS count
 FROM events
 WHERE event = 'manual_code_search'
 AND created_at >= datetime('now', '-30 days')
 AND json_extract(props, '$.query') IS NOT NULL
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
 GROUP BY day
 ORDER BY day DESC
 `),
 partnerIntakeStats(db),
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
 affiliateClicks30d,
 subscribersTotal,
 subscribers30d,
 ...partnerIntake.metrics,
 },
 topEvents,
 scansByMode,
 topManualQueries,
 dailyProxy,
 leadsBySource: partnerIntake.bySource,
 leadsByLane: partnerIntake.byLane,
 }, 200, headers);
 } catch (err) {
 console.error('Stats error:', err);
 return json({ ok: false, error: 'Stats query failed' }, 500, headers);
 }
}

export async function onRequestOptions({ request }) {
 return new Response(null, { status: 204, headers: corsHeaders(request) });
}
