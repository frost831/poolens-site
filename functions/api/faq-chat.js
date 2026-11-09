import { createFaqLimiter } from '../_shared/faq-limiter.js';
import { faqRefusal, retrieveFaq } from '../_shared/faq-retrieval.js';
import { MAX_QUESTION_LENGTH } from '../../splashlens-faq-guard.js';

const MAX_BODY_BYTES = 1536;
const headers = {
  'Cache-Control': 'no-store, private',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
};

async function readQuestion(request) {
  if (!request.body) return { status: 400 };
  const reader = request.body.getReader();
  const bytes = new Uint8Array(MAX_BODY_BYTES);
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value.byteLength > MAX_BODY_BYTES - size) {
        void reader.cancel().catch(() => {});
        return { status: 413 };
      }
      bytes.set(value, size);
      size += value.byteLength;
    }
    const data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(0, size)));
    if (!data || typeof data !== 'object' || Array.isArray(data) ||
        Object.keys(data).length !== 1 || !Object.hasOwn(data, 'question') ||
        typeof data.question !== 'string' || !data.question.trim()) return { status: 400 };
    return data.question.length > MAX_QUESTION_LENGTH ? { status: 413 } : { question: data.question };
  } catch {
    return { status: 400 };
  } finally {
    reader.releaseLock();
  }
}

export function createFaqHandler(limit = createFaqLimiter()) {
  const refuse = (status, extra = {}) => Response.json(faqRefusal(), { status, headers: { ...headers, ...extra } });
  return async function faqRequest({ request }) {
    if (request.method !== 'POST') return refuse(405, { Allow: 'POST' });
    const origin = request.headers.get('Origin');
    const site = request.headers.get('Sec-Fetch-Site');
    if ((origin !== null && origin !== new URL(request.url).origin) ||
        (site !== null && !['same-origin', 'none'].includes(site))) return refuse(403);
    if (request.headers.get('Content-Type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json' ||
        ![null, 'identity'].includes(request.headers.get('Content-Encoding'))) return refuse(415);
    if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES) return refuse(413);
    try {
      const retry = await limit(request.headers.get('CF-Connecting-IP'));
      if (retry) return refuse(429, { 'Retry-After': String(retry) });
      const input = await readQuestion(request);
      return input.status ? refuse(input.status) : Response.json(retrieveFaq(input.question), { headers });
    } catch {
      return refuse(503);
    }
  };
}
export const onRequest = createFaqHandler();
