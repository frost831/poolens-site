// POST /api/subscribe - email capture for Route Ready waitlist
// Env: SUBSCRIBERS_DB (D1 binding)
// Optional env: SPLASHLENS_ALLOWED_ORIGINS, TURNSTILE_SECRET_KEY

const DEFAULT_ALLOWED_ORIGINS = [
  'https://splashlens.com',
  'https://www.splashlens.com',
  'https://poolens-site.pages.dev',
];
const RATE_WINDOW_SECONDS = 60 * 60;
const RATE_LIMIT_PER_IP = 8;

function allowedOrigins(env) {
  return (env.SPLASHLENS_ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function cors(request, env) {
  const origin = request.headers.get('Origin') || '';
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

async function enforceRateLimit(request, env) {
  if (!env.SUBSCRIBERS_DB) return false;
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
  const windowId = Math.floor(Date.now() / (RATE_WINDOW_SECONDS * 1000));
  const key = `${ip}:${windowId}`;

  await env.SUBSCRIBERS_DB.prepare(
    'CREATE TABLE IF NOT EXISTS subscriber_rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL)'
  ).run();

  const existing = await env.SUBSCRIBERS_DB.prepare(
    'SELECT count FROM subscriber_rate_limits WHERE key = ?'
  ).bind(key).first();

  const nextCount = Number(existing?.count || 0) + 1;
  if (nextCount > RATE_LIMIT_PER_IP) return false;

  await env.SUBSCRIBERS_DB.prepare(
    'INSERT INTO subscriber_rate_limits (key, count, expires_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET count = excluded.count, expires_at = excluded.expires_at'
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

export async function onRequestPost({ request, env }) {
  if (!originAllowed(request, env)) {
    return json(request, env, 403, { ok: false, error: 'Origin not allowed' });
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

  const email = (body.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(request, env, 400, { ok: false, error: 'Valid email required' });
  }

  const source = (body.source || 'route-ready').slice(0, 50);

  try {
    await env.SUBSCRIBERS_DB.prepare(
      'INSERT OR IGNORE INTO subscribers (email, source) VALUES (?, ?)'
    ).bind(email, source).run();

    return json(request, env, 200, { ok: true, message: "You're on the list." });
  } catch (err) {
    console.error('Subscribe error:', err);
    return json(request, env, 500, { ok: false, error: 'Database error' });
  }
}

export async function onRequestOptions({ request, env }) {
  return new Response(null, { status: 204, headers: cors(request, env) });
}
