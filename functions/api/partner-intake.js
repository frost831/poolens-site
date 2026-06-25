// POST /api/partner-intake - partner, advisor, tester, and media inquiry capture.
// Env: SUBSCRIBERS_DB (D1 binding)
// Optional env: SPLASHLENS_ALLOWED_ORIGINS, TURNSTILE_SECRET_KEY, SENDGRID_API_KEY

const DEFAULT_ALLOWED_ORIGINS = [
 'https://splashlens.com',
 'https://www.splashlens.com',
 'https://poolens-site.pages.dev',
];
const RATE_WINDOW_SECONDS = 60 * 60;
const RATE_LIMIT_PER_IP = 6;

function allowedOrigins(env) {
 return (env.SPLASHLENS_ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(','))
 .split(',')
 .map((origin) => origin.trim())
 .filter(Boolean);
}

function cors(request, env) {
 const origin = request.headers.get('Origin') || '';
 const headers = {
 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
 'Access-Control-Allow-Headers': 'Content-Type',
 'Content-Type': 'application/json',
 'Vary': 'Origin',
 };
 if (origin && allowedOrigins(env).includes(origin)) {
 headers['Access-Control-Allow-Origin'] = origin;
 }
 return headers;
}

function json(request, env, status, payload) {
 return new Response(JSON.stringify(payload), { status, headers: cors(request, env) });
}

function originAllowed(request, env) {
 const origin = request.headers.get('Origin');
 return !origin || allowedOrigins(env).includes(origin);
}

function clean(value, max = 500) {
 return String(value || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
}

function notifyConfig(env) {
 return {
 apiKey: (env.SENDGRID_API_KEY || '').trim(),
 from: (env.SENDGRID_FROM || env.FLAGSHIP_NOTIFY_FROM || 'hello@splashlens.com').trim(),
 to: (env.SPLASHLENS_NOTIFY_TO || env.FLAGSHIP_NOTIFY_TO || env.LEAD_NOTIFY_TO || env.ADMIN_EMAIL || '').trim(),
 };
}

async function ensureTables(env) {
 await env.SUBSCRIBERS_DB.prepare(
 `CREATE TABLE IF NOT EXISTS partner_intake (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 email TEXT NOT NULL,
 name TEXT,
 organization TEXT,
 role TEXT,
 lane TEXT,
 website TEXT,
 note TEXT,
 source TEXT,
 path TEXT,
 referrer TEXT,
 country TEXT,
 created_at TEXT NOT NULL
 )`
 ).run();

 await env.SUBSCRIBERS_DB.prepare(
 'CREATE TABLE IF NOT EXISTS partner_intake_rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL)'
 ).run();
}

async function enforceRateLimit(request, env) {
 if (!env.SUBSCRIBERS_DB) return false;
 await ensureTables(env);

 const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
 const windowId = Math.floor(Date.now() / (RATE_WINDOW_SECONDS * 1000));
 const key = `${ip}:${windowId}`;
 const existing = await env.SUBSCRIBERS_DB.prepare(
 'SELECT count FROM partner_intake_rate_limits WHERE key = ?'
 ).bind(key).first();

 const nextCount = Number(existing?.count || 0) + 1;
 if (nextCount > RATE_LIMIT_PER_IP) return false;

 await env.SUBSCRIBERS_DB.prepare(
 'INSERT INTO partner_intake_rate_limits (key, count, expires_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET count = excluded.count, expires_at = excluded.expires_at'
 ).bind(key, nextCount, Math.floor(Date.now() / 1000) + RATE_WINDOW_SECONDS).run();
 return true;
}

async function verifyTurnstile(token, request, env) {
 if (!env.TURNSTILE_SECRET_KEY) return true;
 if (!token) return false;

 const form = new FormData();
 form.append('secret', env.TURNSTILE_SECRET_KEY);
 form.append('response', token);
 const ip = request.headers.get('CF-Connecting-IP');
 if (ip) form.append('remoteip', ip);

 const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
 method: 'POST',
 body: form,
 });
 const result = await response.json().catch(() => ({}));
 return Boolean(result.success);
}

async function sendPartnerAlert(env, record) {
 const config = notifyConfig(env);
 if (!config.apiKey || !config.from || !config.to) {
 return { sent: false, reason: 'missing_sendgrid_config' };
 }

 const subjectLane = record.lane || 'partner inquiry';
 const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
 method: 'POST',
 headers: {
 authorization: `Bearer ${config.apiKey}`,
 'content-type': 'application/json',
 },
 body: JSON.stringify({
 personalizations: [{
 to: [{ email: config.to }],
 subject: `[SplashLens] New partner/advisor intake: ${subjectLane} - ${record.email}`,
 }],
 from: { email: config.from, name: 'SplashLens Alerts' },
 reply_to: { email: record.email, name: record.name || undefined },
 categories: ['splashlens', 'partner-intake', subjectLane.replace(/[^a-z0-9_-]/gi, '-').slice(0, 40)],
 content: [{
 type: 'text/plain',
 value: [
 'New SplashLens partner/advisor/tester inquiry',
 '',
 `Name: ${record.name}`,
 `Email: ${record.email}`,
 `Organization: ${record.organization}`,
 `Role: ${record.role}`,
 `Lane: ${record.lane}`,
 `Website: ${record.website}`,
 `Source: ${record.source}`,
 `Path: ${record.path}`,
 `Referrer: ${record.referrer}`,
 `Country: ${record.country}`,
 `Created: ${record.createdAt}`,
 '',
 'Note:',
 record.note,
 ].join('\n'),
 }],
 }),
 });

 return { sent: response.ok, status: response.status };
}

export async function onRequestGet({ request, env }) {
 return json(request, env, 200, {
 ok: true,
 endpoint: 'splashlens_partner_intake',
 storageConfigured: Boolean(env.SUBSCRIBERS_DB),
 emailConfigured: Boolean((env.SENDGRID_API_KEY || '').trim() && (env.SPLASHLENS_NOTIFY_TO || env.FLAGSHIP_NOTIFY_TO || env.LEAD_NOTIFY_TO || env.ADMIN_EMAIL || '').trim()),
 });
}

export async function onRequestPost({ request, env }) {
 if (!originAllowed(request, env)) {
 return json(request, env, 403, { ok: false, error: 'Origin not allowed' });
 }
 if (!env.SUBSCRIBERS_DB) {
 return json(request, env, 500, { ok: false, error: 'Storage not configured' });
 }
 if (!await enforceRateLimit(request, env)) {
 return json(request, env, 429, { ok: false, error: 'Too many requests' });
 }

 let body;
 try {
 body = await request.json();
 } catch {
 return json(request, env, 400, { ok: false, error: 'Invalid JSON' });
 }

 if (!await verifyTurnstile(body.turnstileToken, request, env)) {
 return json(request, env, 403, { ok: false, error: 'Verification failed' });
 }

 const email = clean(body.email, 180).toLowerCase();
 if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
 return json(request, env, 400, { ok: false, error: 'Valid email required' });
 }

 const record = {
 email,
 name: clean(body.name, 120),
 organization: clean(body.organization, 160),
 role: clean(body.role, 120),
 lane: clean(body.lane || 'partner/advisor', 80),
 website: clean(body.website, 220),
 note: clean(body.note, 1800),
 source: clean(body.source || 'partners-page', 80),
 path: clean(body.path, 300),
 referrer: clean(request.headers.get('Referer') || body.referrer, 500),
 country: clean(request.cf?.country || request.headers.get('CF-IPCountry'), 10),
 createdAt: new Date().toISOString(),
 };

 try {
 await env.SUBSCRIBERS_DB.prepare(
 `INSERT INTO partner_intake
 (email, name, organization, role, lane, website, note, source, path, referrer, country, created_at)
 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
 ).bind(
 record.email,
 record.name,
 record.organization,
 record.role,
 record.lane,
 record.website,
 record.note,
 record.source,
 record.path,
 record.referrer,
 record.country,
 record.createdAt,
 ).run();

 const alert = await sendPartnerAlert(env, record);
 console.log('Partner intake alert:', JSON.stringify({ email: record.email, lane: record.lane, alert }));

 return json(request, env, 200, {
 ok: true,
 message: 'Thanks. We will review this and reach out.',
 alertQueued: Boolean(alert.sent),
 emailConfigured: alert.reason !== 'missing_sendgrid_config',
 });
 } catch (err) {
 console.error('Partner intake error:', err);
 return json(request, env, 500, { ok: false, error: 'Database error' });
 }
}

export async function onRequestOptions({ request, env }) {
 return new Response(null, { status: 204, headers: cors(request, env) });
}
