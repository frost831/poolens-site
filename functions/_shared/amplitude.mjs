const AMPLITUDE_HTTP_V2_ENDPOINT = 'https://api2.amplitude.com/2/httpapi';
import { safeAnalyticsPath, safeAnalyticsProps } from './analytics-privacy.mjs';

function clean(value, max = 120) {
 return String(value || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
}

function envFlag(value) {
 return /^(1|true|yes|on)$/i.test(String(value || '').trim());
}

export function amplitudeApiKey(env) {
 return String(env.AMPLITUDE_API_KEY || env.SPLASHLENS_AMPLITUDE_API_KEY || '').trim();
}

export function amplitudeEnabled(env) {
 return Boolean(amplitudeApiKey(env)) && !envFlag(env.SPLASHLENS_AMPLITUDE_DISABLED);
}

export function amplitudeConfigPayload(env) {
 const enabled = amplitudeEnabled(env);
 return {
  ok: true,
  enabled,
  status: enabled ? 'ready' : 'missing_api_key',
  ingestion: 'server_side_http_v2',
  keyExposed: false,
  project: 'splashlens',
  product: 'site',
  sdkUrl: 'https://cdn.amplitude.com/libs/analytics-browser-2.11.7-min.js.gz',
 };
}

function pruneObject(value) {
 return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== null && item !== ''));
}

function groups(props) {
 const campaign = clean(props.attribution_campaign || props.campaign || '', 120);
 const publisher = clean(props.publication || props.publisher || props.attribution_source || '', 80);
 const value = pruneObject({ campaign, publisher });
 return Object.keys(value).length ? value : undefined;
}

function identity(record, props) {
 const clientId = clean(props.client_id || props.clientId || '', 120);
 const fallback = clean(record.correlationId || `${record.event}:${record.createdAt}`, 180);
 const deviceId = clientId || fallback || 'splashlens-site-device';
 return {
  device_id: deviceId.length >= 5 ? deviceId : 'splashlens-site-device',
 };
}

export async function forwardEventToAmplitude(env, record, props = {}) {
 if (!amplitudeEnabled(env)) return { sent: false, skipped: true, reason: 'missing_amplitude_api_key' };
 const safeProps = safeAnalyticsProps(props);
 const payload = {
  api_key: amplitudeApiKey(env),
  events: [{
   ...identity(record, safeProps),
   event_type: clean(record.event || 'site_event', 80),
   event_properties: pruneObject({
    ...safeProps,
    product: 'splashlens',
    source: clean(record.source || safeProps.source || safeProps.attribution_source || 'site', 80),
    path: safeAnalyticsPath(record.path || safeProps.path),
    page_path: safeAnalyticsPath(record.path || safeProps.path),
    plan: clean(record.plan || safeProps.plan || '', 60),
    mode: clean(record.mode || safeProps.mode || '', 60),
   }),
   user_properties: pruneObject({
    product: 'splashlens',
    source: clean(record.source || safeProps.source || safeProps.attribution_source || 'site', 80),
    role: clean(safeProps.known_role || safeProps.role || safeProps.audience || safeProps.persona || '', 80),
    identity_source: clean(safeProps.identity_source || safeProps.attribution_source || record.source || 'site', 80),
   }),
   groups: groups(safeProps),
   time: Date.parse(record.createdAt || '') || Date.now(),
   insert_id: clean(record.correlationId || `${record.event}:${record.createdAt}`, 180),
  }],
 };
 try {
  const response = await fetch(AMPLITUDE_HTTP_V2_ENDPOINT, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(payload),
  });
  return { sent: response.ok, status: response.status };
 } catch (error) {
  console.warn('Amplitude forwarding failed:', String(error));
  return { sent: false, reason: 'forward_failed' };
 }
}
