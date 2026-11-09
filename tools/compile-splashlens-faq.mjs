import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'parse5';
import { blockedQuestion, faqKey, faqTerms, safeFaqPassage, safeFaqSource } from '../splashlens-faq-guard.js';

export const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const canonicalOrigin = 'https://splashlens.com';
const routeFiles = new Map([['/faq.html', 'faq.html'], ['/support.html', 'support.html']]);
const marker = '<!-- splashlens-faq-widget -->';
const text = (root, file) => readFile(path.join(root, file), 'utf8');
const eol = value => value.replaceAll('\r\n', '\n');
const attribute = (node, name) => node.attrs?.find(attr => attr.name === name)?.value;
function* walk(node) {
  yield node;
  for (const child of node.childNodes || []) yield* walk(child);
  if (node.content) yield* walk(node.content);
}
function hidden(node) {
  const style = (attribute(node, 'style') || '').replace(/\s+/g, '').toLowerCase();
  return ['script', 'style', 'template', 'noscript', 'dialog'].includes(node.tagName) ||
    (node.tagName === 'details' && attribute(node, 'open') === undefined) ||
    attribute(node, 'hidden') !== undefined || attribute(node, 'inert') !== undefined ||
    attribute(node, 'aria-hidden')?.toLowerCase() === 'true' ||
    /(?:^|\s)(?:hidden|sr-only|visually-hidden|is-hidden|d-none)(?:\s|$)/i.test(attribute(node, 'class') || '') ||
    /(?:^|;)(?:display:none|visibility:(?:hidden|collapse)|content-visibility:hidden|opacity:0(?:\.0+)?)(?:!important)?(?:;|$)/i.test(style);
}

export async function compileFaq({ sourceRoot = repoRoot, pages = sourceRoot, write = false } = {}) {
  const sameSource = path.resolve(sourceRoot) === path.resolve(pages);
  assert.ok(!write || sameSource, 'Regenerate from source, not staged HTML');
  const entries = JSON.parse(await text(sourceRoot, 'content/faq/intents.json'));
  assert.ok(Array.isArray(entries) && entries.length > 0 && entries.length <= 100, 'Expected a bounded FAQ intent list');
  const ids = new Set();
  const sources = new Set();
  const phrases = new Map();
  const documents = new Map();
  const articles = [];
  for (const entry of entries) {
    assert.deepEqual(Object.keys(entry).sort(), ['id', 'lastReviewed', 'queries', 'source', 'title']);
    const { id, title, source, lastReviewed, queries } = entry;
    assert.ok(/^[a-z][a-z0-9-]{0,79}$/u.test(id) && !ids.has(id), 'Invalid or duplicate FAQ article ID: ' + id);
    assert.ok(safeFaqSource(source) && !sources.has(source), id + ': duplicate or unapproved source route');
    assert.ok(safeFaqPassage(title), id + ': unsafe title');
    assert.match(lastReviewed, /^\d{4}-\d{2}-\d{2}$/u);
    assert.equal(new Date(lastReviewed).toISOString().slice(0, 10), lastReviewed, id + ': invalid review date');
    ids.add(id);
    sources.add(source);
    const [route, anchor] = source.split('#');
    assert.ok(routeFiles.has(route), id + ': source outside public route manifest');
    if (!documents.has(route)) {
      const nodes = [...walk(parse(await text(pages, routeFiles.get(route))))];
      const canonical = nodes.filter(node => node.tagName === 'link' && attribute(node, 'rel') === 'canonical');
      assert.equal(canonical.length, 1, route + ': expected one canonical link');
      assert.equal(attribute(canonical[0], 'href'), canonicalOrigin + route, route + ': wrong canonical origin or path');
      documents.set(route, nodes);
    }
    const nodes = documents.get(route).filter(node => attribute(node, 'id') === anchor);
    assert.equal(nodes.length, 1, source + ': missing or duplicate source anchor');
    const paragraph = nodes[0];
    assert.ok(['p', 'span', 'li'].includes(paragraph.tagName) && attribute(paragraph, 'data-faq-answer') !== undefined,
      source + ': source must be a marked public paragraph, span, or list item');
    let inMain = false;
    for (let node = paragraph; node; node = node.parentNode) {
      assert.ok(!hidden(node), source + ': source is hidden');
      if (node.tagName === 'main') inMain = true;
    }
    assert.ok(inMain, source + ': source is outside main content');
    // Text-only marked passages prevent hidden nodes or markup becoming answers.
    assert.ok(paragraph.childNodes.every(node => node.nodeName === '#text'), source + ': answer passage must contain only visible text');
    const answer = paragraph.childNodes.map(node => node.value).join('').replace(/\s+/g, ' ').trim();
    assert.ok(safeFaqPassage(answer), source + ': answer failed text and privacy checks');
    assert.ok(Array.isArray(queries) && queries.length > 0 && queries.length <= 30, id + ': invalid search phrase list');
    for (const query of queries) {
      assert.ok(typeof query === 'string' && !blockedQuestion(query), id + ': blocked search phrase');
      const terms = faqTerms(query);
      const key = faqKey(terms);
      assert.ok(key && terms.length <= 12 && terms.every(term => terms.filter(other => other === term).length <= 2),
        id + ': search phrase is empty or too broad');
      assert.ok(!phrases.has(key) || phrases.get(key) === id, id + ': ambiguous phrase also maps to ' + phrases.get(key));
      phrases.set(key, id);
    }
    articles.push({ id, title, answer, source, lastReviewed, queries });
  }
  const generated = JSON.stringify(articles, null, 2) + '\n';
  const compiled = path.join(sourceRoot, 'functions', '_shared', 'faq-articles.json');
  if (write) {
    await writeFile(compiled, generated);
    await writeFile(path.join(sourceRoot, 'faq'), await text(sourceRoot, 'faq.html'));
  } else {
    assert.equal(eol(await readFile(compiled, 'utf8')), generated,
      'FAQ index is stale; update the public passage, then run node tools/compile-splashlens-faq.mjs --write');
    assert.equal(eol(await text(pages, 'faq')), eol(await text(pages, 'faq.html')), 'Extensionless FAQ alias differs from the canonical page');
  }
  return articles;
}

export async function mountFaqWidgets(output, sourceRoot = repoRoot) {
  const markup = await text(sourceRoot, 'tools/faq-widget.html');
  const markupNodes = [...walk(parse(markup))];
  for (const id of ['sl-faq-launcher', 'sl-faq-dialog', 'sl-faq-close', 'ask-splashlens']) {
    assert.equal(markupNodes.filter(node => attribute(node, 'id') === id).length, 1, 'FAQ template needs one ' + id);
  }
  for (const file of ['index.html', 'faq.html']) {
    const page = await text(output, file);
    assert.equal(page.split(marker).length, 2, file + ': expected exactly one widget slot');
    const mounted = page.replace(marker, () => markup.trimEnd());
    const nodes = [...walk(parse(mounted))];
    for (const id of ['sl-faq-launcher', 'sl-faq-dialog', 'ask-splashlens']) {
      assert.equal(nodes.filter(node => attribute(node, 'id') === id).length, 1, file + ': duplicate widget');
    }
    await writeFile(path.join(output, file), mounted);
    if (file === 'faq.html') await writeFile(path.join(output, 'faq'), mounted);
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const write = process.argv.includes('--write');
  const built = process.argv.includes('--built');
  const articles = await compileFaq({ write, pages: built ? path.join(repoRoot, '_deploy/public') : repoRoot });
  console.log((write ? 'Generated ' : 'Verified ') + articles.length + ' FAQ answers against ' + (built ? 'staged' : 'source') + ' pages.');
}
