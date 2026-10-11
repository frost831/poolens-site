const SAFE_KEYS = new Set([
  'client_id', 'session_id', 'client_reference_id', 'source', 'plan', 'placement', 'store',
  'attribution_source', 'attribution_medium', 'attribution_campaign', 'attribution_referrer_host',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'field_challenge', 'challenge_path', 'challenge_id', 'challenge_type',
  'audience', 'persona', 'role', 'known_role', 'identity_source', 'identity_confidence',
  'destination', 'destination_path', 'publication', 'publisher', 'content_type', 'content_id',
  'feature', 'mode', 'page_path', 'path', 'demo', 'test', 'synthetic',
]);

export function safeAnalyticsPath(value, origin = 'https://splashlens.com') {
  try {
    const url = new URL(String(value || '/'), origin);
    if (!/^https?:$/.test(url.protocol)) return '/';
    if (/@|%40/i.test(url.pathname)) return '/';
    return url.pathname.slice(0, 300) || '/';
  } catch {
    return '/';
  }
}

export function safeAnalyticsReferrer(value) {
  try {
    const url = new URL(String(value || ''));
    if (!/^https?:$/.test(url.protocol)) return '';
    if (/@|%40/i.test(url.pathname)) return '';
    return `${url.origin}${url.pathname}`.slice(0, 300);
  } catch {
    return '';
  }
}

export function safeAnalyticsProps(input = {}) {
  const props = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  return Object.fromEntries(Object.entries(props).flatMap(([key, value]) => {
    if (!SAFE_KEYS.has(key)) return [];
    if (['demo', 'test', 'synthetic'].includes(key)) return [[key, value === true || value === 'true']];
    if (typeof value !== 'string' && typeof value !== 'number') return [];
    const text = String(value).trim().slice(0, 160);
    if (['path', 'page_path', 'destination_path'].includes(key)) return [[key, safeAnalyticsPath(text)]];
    if (!text || /@|\+\d{7,}|\b\d{3}[-. ]\d{3}[-. ]\d{4}\b/.test(text)) return [];
    if (key === 'client_reference_id' && !/^sl_checkout_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(text)) return [];
    if (!/^[a-z0-9_ .:/-]+$/i.test(text)) return [];
    return [[key, text]];
  }));
}
