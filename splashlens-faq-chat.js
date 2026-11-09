import { blockedQuestion, CONTACT_PATH, FAQ_FALLBACK, safeFaqPassage, safeFaqSource } from './splashlens-faq-guard.js';

const MAX_MESSAGES = 12;

export function mountFaqChat(root, request = fetch) {
  const form = root.querySelector('#sl-faq-form');
  const input = root.querySelector('#sl-faq-question');
  const submit = root.querySelector('#sl-faq-submit');
  const clear = root.querySelector('#sl-faq-clear');
  const log = root.querySelector('#sl-faq-log');
  const status = root.querySelector('#sl-faq-status');
  const starters = [...root.querySelectorAll('[data-faq-question]')];
  if (!form || !input || !submit || !clear || !log?.firstElementChild || !status) return;

  const greeting = log.firstElementChild;
  const document = root.ownerDocument;
  let pending = null;

  function setBusy(busy) {
    submit.disabled = busy;
    for (const button of starters) button.disabled = busy;
    status.textContent = busy ? 'Finding a source…' : '';
  }

  function append(speaker, text, link) {
    const bubble = document.createElement('div');
    bubble.className = 'sl-faq-chat__bubble';
    if (speaker === 'You') bubble.classList.add('sl-faq-chat__bubble--you');
    const name = document.createElement('span');
    name.className = 'sl-faq-chat__speaker';
    name.textContent = speaker;
    const message = document.createElement('p');
    message.textContent = text;
    bubble.append(name, message);
    if (link) {
      const citation = document.createElement('a');
      citation.href = link.path;
      citation.textContent = link.label;
      bubble.append(citation);
    }
    log.append(bubble);
    while (log.children.length > MAX_MESSAGES + 1) log.children[1].remove();
    log.scrollTop = log.scrollHeight;
  }

  function fallback() {
    append('SplashLens', FAQ_FALLBACK, { path: CONTACT_PATH, label: 'Contact support' });
  }

  async function send(value) {
    if (pending) return;
    const question = value.trim();
    if (!question) return;
    input.value = '';
    // Blocked text never enters the transcript or leaves the browser.
    if (blockedQuestion(question)) {
      fallback();
      return;
    }

    append('You', question);
    const turn = new AbortController();
    pending = turn;
    setBusy(true);
    const timeout = setTimeout(() => turn.abort(), 6000);
    try {
      const response = await request('/api/faq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        cache: 'no-store',
        redirect: 'error',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ question }),
        signal: turn.signal,
      });
      const reply = await response.json();
      if (pending !== turn) return;
      if (!response.ok || !reply?.articleId || !safeFaqPassage(reply.answer) ||
          !safeFaqPassage(reply.title) || !safeFaqSource(reply.source)) fallback();
      else append('SplashLens', reply.answer, { path: reply.source, label: 'Source: ' + reply.title });
    } catch {
      if (pending === turn) fallback();
    } finally {
      clearTimeout(timeout);
      if (pending === turn) {
        pending = null;
        setBusy(false);
      }
    }
  }

  input.disabled = false;
  clear.disabled = false;
  setBusy(false);
  form.addEventListener('submit', event => {
    event.preventDefault();
    void send(input.value);
    input.focus();
  });
  for (const button of starters) {
    button.addEventListener('click', () => {
      void send(button.dataset.faqQuestion);
      input.focus();
    });
  }
  clear.addEventListener('click', () => {
    pending?.abort();
    pending = null;
    input.value = '';
    log.replaceChildren(greeting);
    setBusy(false);
    input.focus();
  });
}

const root = typeof document === 'undefined' ? null : document.getElementById('ask-splashlens');
if (root) mountFaqChat(root);
