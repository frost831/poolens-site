// POST /api/event - first-party launch event capture.
// Env: SUBSCRIBERS_DB (D1 binding shared with the Route Ready waitlist)

const ALLOWED_ORIGINS = new Set([
 'https://splashlens.com',
 'https://www.splashlens.com',
 'https://app.splashlens.com',
 'http://localhost:8788',
 'http://localhost:5173',
]);

const ALERT_EVENTS = new Set([
 'app_store_download_click',
 'checkout_click',
 'open_app_click',
]);

const APP_FUNNEL_EVENTS = new Set([
 'article_referral_open',
 'campaign_landing_view',
 'campaign_view',
 'field_challenge_page_view',
 'field_challenge_started',
 'field_challenge_routed',
 'field_challenge_feedback',
 'app_store_download_click',
 'google_play_download_click',
 'play_store_download_click',
 'open_app_click',
 'partsnap_click',
 'checkout_click',
]);

function corsHeaders(request) {
 const origin = request.headers.get('Origin') || '';
 return {
 'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://splashlens.com',
 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
 'Access-Control-Allow-Headers': 'Content-Type',
 'Access-Control-Max-Age': '86400',
 'Content-Type': 'application/json',
 };
}

function clean(value, max = 120) {
 return String(value || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
}

async function forwardToAppFunnel(record, props) {
 if (!APP_FUNNEL_EVENTS.has(record.event)) return { sent: false, skipped: true };
 const safeProps = {
  client_id: clean(props.client_id || props.clientId, 120),
  session_id: clean(props.session_id || props.sessionId, 160),
  attribution_source: clean(props.attribution_source || record.source, 80),
  attribution_medium: clean(props.attribution_medium || props.medium, 80),
  attribution_campaign: clean(props.attribution_campaign || props.campaign, 120),
  attribution_referrer_host: clean(props.attribution_referrer_host, 120),
  field_challenge: clean(props.field_challenge || props.challenge, 80),
  challenge_path: clean(props.challenge_path, 40),
  challenge_id: clean(props.challenge_id, 100),
  challenge_type: clean(props.challenge_type, 40),
  pilot_id: clean(props.pilot_id || props.pilot, 80),
  participant_id: clean(props.participant_id || props.participant, 80),
  referral_id: clean(props.referral_id || props.ref, 80),
  audience: clean(props.audience, 80),
  known_email: clean(props.known_email || props.contact_email || props.email || props.e || props.sl_email, 180).toLowerCase(),
  known_name: clean(props.known_name || props.contact_name || props.name || [props.first_name, props.last_name].filter(Boolean).join(' '), 140),
  known_company: clean(props.known_company || props.company || props.organization || props.org || props.account, 160),
  known_role: clean(props.known_role || props.role || props.audience || props.persona, 80),
  lead_id: clean(props.lead_id || props.contact_id || props.recipient_id || props.prospect_id, 120),
  identity_source: clean(props.identity_source || props.attribution_source || record.source, 80),
  identity_confidence: clean(props.known_email || props.contact_email || props.email || props.e || props.sl_email ? 'tracked-email-link' : props.lead_id || props.contact_id || props.recipient_id || props.prospect_id ? 'tracked-link' : '', 40),
  destination: clean(props.destination, 120),
  demo: props.demo === true || props.demo === 'true',
  test: props.test === true || props.test === 'true',
  synthetic: props.synthetic === true || props.synthetic === 'true',
 };
 try {
  const response = await fetch('https://app.splashlens.com/api/events', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({
    event: record.event,
    source: record.source || 'marketing-site',
    path: record.path,
    props: safeProps,
   }),
  });
  return { sent: response.ok, status: response.status };
 } catch (error) {
  console.warn('SplashLens funnel forwarding failed:', String(error));
  return { sent: false, reason: 'forward_failed' };
 }
}

function notifyConfig(env) {
 return {
 apiKey: (env.SENDGRID_API_KEY || '').trim(),
 from: (env.SENDGRID_FROM || env.FLAGSHIP_NOTIFY_FROM || 'hello@splashlens.com').trim(),
 to: (env.SPLASHLENS_NOTIFY_TO || env.FLAGSHIP_NOTIFY_TO || env.LEAD_NOTIFY_TO || env.ADMIN_EMAIL || '').trim(),
 };
}

async function sendEventAlert(env, record) {
 const config = notifyConfig(env);
 if (!config.apiKey || !config.from || !config.to) {
 return { sent: false, reason: 'missing_sendgrid_config' };
 }

 const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
 method: 'POST',
 headers: {
 authorization: `Bearer ${config.apiKey}`,
 'content-type': 'application/json',
 },
 body: JSON.stringify({
personalizations: [{
to: [{ email: config.to }],
subject: `[SplashLens] ${record.event}`,
custom_args: { product: 'splashlens', template_id: 'site_event_alert', correlation_id: record.correlationId },
}],
 from: { email: config.from, name: 'SplashLens Alerts' },
 categories: ['splashlens', 'site-event', record.event],
 content: [{
 type: 'text/plain',
 value: [
 'SplashLens conversion event',
 '',
 `Event: ${record.event}`,
 `Source: ${record.source}`,
 `Path: ${record.path}`,
 `Plan: ${record.plan}`,
 `Mode: ${record.mode}`,
 `Referrer: ${record.referrer}`,
 `Country: ${record.country}`,
 `Created: ${record.createdAt}`,
 '',
 `Props: ${record.propsJson}`,
 ].join('\n'),
 }],
 }),
 });

 return { sent: response.ok, status: response.status };
}

function isoAgeMinutes(value) {
 if (!value) return null;
 const then = new Date(value);
 if (Number.isNaN(then.getTime())) return null;
 return Math.max(0, Math.round((Date.now() - then.getTime()) / 60000));
}

async function countSince(db, days) {
 const row = await db.prepare(
 `SELECT COUNT(*) AS count
 FROM events
 WHERE datetime(created_at) >= datetime('now', ?)`
 ).bind(`-${days} days`).first();
 return Number(row?.count || 0);
}

export async function onRequestGet({ request, env }) {
 const headers = corsHeaders(request);
 try {
 const latest = await env.SUBSCRIBERS_DB.prepare(
 `SELECT event, source, path, created_at
 FROM events
 ORDER BY datetime(created_at) DESC
 LIMIT 1`
 ).first();
 const topRows = await env.SUBSCRIBERS_DB.prepare(
 `SELECT event, COUNT(*) AS count
 FROM events
 WHERE datetime(created_at) >= datetime('now', '-7 days')
 GROUP BY event
 ORDER BY count DESC
 LIMIT 8`
 ).all();
 const latestAt = latest?.created_at || null;
 const latestAgeMinutes = isoAgeMinutes(latestAt);
 return new Response(JSON.stringify({
 ok: true,
 project: 'splashlens',
 source: 'first_party_d1',
 stored: true,
 fresh: latestAgeMinutes !== null && latestAgeMinutes <= 1440,
 latest_received_at: latestAt,
 latest_age_minutes: latestAgeMinutes,
 latest_event: latest?.event || null,
 latest_path: latest?.path || null,
 events_7d: await countSince(env.SUBSCRIBERS_DB, 7),
 events_30d: await countSince(env.SUBSCRIBERS_DB, 30),
 top_events: (topRows?.results || []).map((row) => ({
 event: row.event,
 count: Number(row.count || 0),
 })),
 }), { status: 200, headers });
 } catch (err) {
 console.error('Event status error:', err);
 return new Response(JSON.stringify({ ok: false, error: 'Database error' }), { status: 500, headers });
 }
}

export async function onRequestPost({ request, env }) {
 const headers = corsHeaders(request);
 let body;

 try {
 body = await request.json();
 } catch {
 return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { status: 400, headers });
 }

 const event = clean(body.event || body.name, 80);
 if (!event) {
 return new Response(JSON.stringify({ ok: false, error: 'Event name required' }), { status: 400, headers });
 }

 const props = body.props && typeof body.props === 'object' ? body.props : {};
 const path = clean(body.path || props.path, 300);
 const plan = clean(body.plan || props.plan, 60);
 const mode = clean(body.mode || props.mode, 60);
 const source = clean(body.source || props.source || 'unknown', 60);
 const referrer = clean(request.headers.get('Referer') || body.referrer || props.referrer, 500);
 const userAgent = clean(request.headers.get('User-Agent'), 300);
 const country = clean(request.cf?.country, 10);
 const propsJson = JSON.stringify(props).slice(0, 2000);
 const record = {
 correlationId: crypto.randomUUID(),
 event,
 source,
 path,
 plan,
 mode,
 referrer,
 country,
 propsJson,
 createdAt: new Date().toISOString(),
 };

 try {
 await env.SUBSCRIBERS_DB.prepare(
 `INSERT INTO events (event, source, path, plan, mode, props, user_agent, referrer, country)
 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
 ).bind(event, source, path, plan, mode, propsJson, userAgent, referrer, country).run();

 const funnelForward = await forwardToAppFunnel(record, props);

 let alert = { sent: false, skipped: true };
 if (ALERT_EVENTS.has(event)) {
 alert = await sendEventAlert(env, record);
 console.log('Event alert:', JSON.stringify({ event, source, alert }));
 }

 return new Response(JSON.stringify({
 ok: true,
 alertQueued: Boolean(alert.sent),
 emailConfigured: alert.reason !== 'missing_sendgrid_config',
 funnelForwarded: Boolean(funnelForward.sent),
 }), { status: 200, headers });
 } catch (err) {
 console.error('Event capture error:', err);
 return new Response(JSON.stringify({ ok: false, error: 'Database error' }), { status: 500, headers });
 }
}

export async function onRequestOptions({ request }) {
 return new Response(null, { status: 204, headers: corsHeaders(request) });
}
