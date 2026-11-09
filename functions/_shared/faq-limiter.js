const WINDOW_MS = 60_000;

// Bounded per isolate. No raw IPs, questions, or durable client records.
export function createFaqLimiter({ clock = Date.now, perClient = 10, total = 240 } = {}) {
  let windowStart = 0;
  let requests = 0;
  const counts = new Map();
  let salt;
  function roll(now) {
    if (now >= windowStart + WINDOW_MS || now < windowStart) {
      counts.clear();
      windowStart = now;
      requests = 0;
    }
  }
  const retry = now => Math.max(1, Math.ceil((windowStart + WINDOW_MS - now) / 1000));
  return async function limit(client) {
    let now = clock();
    roll(now);
    if (requests >= total) return retry(now);
    // Cloudflare only permits randomness within an active request.
    salt ??= crypto.getRandomValues(new Uint8Array(16));
    const input = new TextEncoder().encode(/^[0-9a-f.:]{1,64}$/iu.test(client ?? '') ? client : '');
    const bytes = new Uint8Array(salt.length + input.length);
    bytes.set(salt);
    bytes.set(input, salt.length);
    const key = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))).join(',');
    now = clock();
    roll(now);
    const count = counts.get(key) || 0;
    if (requests >= total || count >= perClient) return retry(now);
    counts.set(key, count + 1);
    requests++;
    return 0;
  };
}
