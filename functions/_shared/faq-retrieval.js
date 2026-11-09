import articles from './faq-articles.json' with { type: 'json' };
import { blockedQuestion, CONTACT_PATH, FAQ_FALLBACK, faqKey, faqTerms, safeFaqPassage, safeFaqSource } from '../../splashlens-faq-guard.js';

const lookup = new Map();
const vocabulary = new Set();
for (const article of articles) {
  for (const phrase of article.queries) {
    const terms = faqTerms(phrase);
    terms.forEach(term => vocabulary.add(term));
    const normalized = faqKey(terms);
    const ids = lookup.get(normalized) || new Map();
    ids.set(article.id, article);
    lookup.set(normalized, ids);
  }
}

export function faqRefusal() {
  return { articleId: null, title: null, answer: FAQ_FALLBACK, source: null, contact: CONTACT_PATH };
}

function oneEdit(a, b) {
  if (Math.abs(a.length - b.length) > 1 || a === b) return false;
  if (a.length > b.length) return oneEdit(b, a);
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  if (a.length < b.length) return a.slice(i) === b.slice(i + 1);
  return a.slice(i + 1) === b.slice(i + 1) ||
    (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2));
}

export function presentFaqArticle(article) {
  if (!article || !/^[a-z][a-z0-9-]*$/u.test(article.id) ||
      !safeFaqPassage(article.title) || !safeFaqPassage(article.answer) || !safeFaqSource(article.source)) return faqRefusal();
  return { articleId: article.id, title: article.title, answer: article.answer, source: article.source, contact: CONTACT_PATH };
}

export function retrieveFaq(question) {
  if (blockedQuestion(question)) return faqRefusal();
  const terms = faqTerms(question);
  if (!terms.length || terms.length > 12 || terms.some(term => terms.filter(other => other === term).length > 2)) return faqRefusal();
  const unknown = [...new Set(terms.filter(term => !vocabulary.has(term)))];
  let corrected = terms;
  // Require all meaningful terms to match a single curated phrase. No partial
  // scores, combined answers, or guessing across competing intents.
  if (unknown.length) {
    const [typo] = unknown;
    if (unknown.length !== 1 || !terms.some(term => vocabulary.has(term)) || !/^[a-z]{5,18}$/u.test(typo)) return faqRefusal();
    const candidates = [...vocabulary].filter(term => oneEdit(typo, term));
    if (candidates.length !== 1) return faqRefusal();
    corrected = terms.map(term => term === typo ? candidates[0] : term);
  }
  const matches = lookup.get(faqKey(corrected));
  return matches?.size === 1 ? presentFaqArticle(matches.values().next().value) : faqRefusal();
}
