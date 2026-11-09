// Shared by the browser, release gate and server. No customer or policy data here.
export const MAX_QUESTION_LENGTH = 240;
export const CONTACT_PATH = '/support.html';
export const FAQ_PATH = '/faq.html';
export const FAQ_FALLBACK = 'I couldn’t find a verified answer. Contact SplashLens support for help.';

const sensitive = /[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\s().-]*){7,}|\b\d{3}-\d{2}-\d{4}\b|\b(?:sk|rk|pk)_(?:test|live)_\w+|\b(?:ghp_|github_pat_|whsec_|sk-proj-)\S+|\beyJ[\w-]+\.[\w-]+\.[\w-]+|\b(?:password|passcode|verification code|one time code|login code|pin|token|secret|api key|bearer|private key|cvv|cvc|card number|bank account|routing number|social security|order id|account id|home address|my name is|serial number)\s*[:=#]|\b(?:my (?:password|passcode|verification code|pin|token|card number|address|name|serial number) is|here is my (?:password|code|token|card|email|address))\b|\b(?:\d{1,6}\s+[\w .'-]+\s(?:st(?:reet)?|rd|road|ave(?:nue)?|lane|ln|dr(?:ive)?|blvd|court|ct))\b/iu;
const override = /\b(?:ignore|override|disregard|bypass|jailbreak|system prompt|developer message|reveal|dump|exfiltrate|pretend|roleplay|act as|base64|translate|output only|repeat after|javascript|eval)\b/iu;
const caseSpecific = /\b(?:what (?:dose|amount|chemical) should|how much (?:chlorine|acid|bleach|chemical)|dose my|child swallowed|chemical burn|poisoned|medical advice|legal advice)\b/iu;
const credentialValue = /\b(?:pass(?:word|phrase|code)|(?:verification|login|one[ -]time|reset) code|pin|token|secret|cvv|cvc)\s+is\s+\S|^\s*[\d -]{4,}\s*$|\bmy (?:account )?(?:e-?mail|phone|street address)\b/iu;

export function normalizeFaqText(text) {
  return text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
}

const stop = new Set('a an the and are am as at be can could do does for from have how i is it me my of on or please should that this to use was were what when where which why will with would you your'.split(' '));
export const faqTerms = text => (normalizeFaqText(text).replace(/[’']/g, '').match(/[a-z0-9]+/g) || []).filter(word => !stop.has(word));
export const faqKey = terms => [...new Set(terms)].sort().join(' ');

export function blockedQuestion(text) {
  if (typeof text !== 'string' || !text.trim() || text.length > MAX_QUESTION_LENGTH) return true;
  const normalized = normalizeFaqText(text);
  const words = normalized.replace(/[^a-z0-9]+/g, ' ');
  return /[^\x20-\x7e’‘“”–—]/u.test(normalized) ||
    /[<>\[\]{}\\\x60]|https?:|www\.|%[0-9a-f]{2}/iu.test(normalized) ||
    sensitive.test(normalized) || credentialValue.test(normalized) || override.test(words) || caseSpecific.test(words) ||
    /\b(?:credentials?|credit card|debit card|payment details|private account information|my email|my phone)\b/iu.test(words);
}

export function safeFaqSource(path) {
  return typeof path === 'string' && /^\/(?:faq|support)\.html#[a-z][a-z0-9-]{0,79}$/u.test(path);
}

export function safeFaqPassage(value) {
  return typeof value === 'string' && value.trim() && value.length <= 650 &&
    !/[<>\u0000-\u001f\u007f\p{Cf}]/u.test(value) &&
    !sensitive.test(value) && !/https?:\/\/|[$€£¥]\s*\d|\b\d+\s*(?:dollars|usd|cad)\b/iu.test(value);
}
