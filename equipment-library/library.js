const filters = document.querySelector('.filters');
const query = document.querySelector('#equipment-query');
const brand = document.querySelector('#equipment-brand');
const category = document.querySelector('#equipment-category');
const count = document.querySelector('#equipment-count');
const empty = document.querySelector('#equipment-empty');
const scanNote = document.querySelector('#equipment-scan-note');

function normalize(value) {
  return value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
const compact = value => value.replaceAll(' ', '');
const models = Array.from(document.querySelectorAll('.model'), model => ({
  model,
  keywords: normalize(model.dataset.search),
  condensed: compact(normalize(model.dataset.search)),
  titles: model.querySelector('h2').textContent.split(' / ').map(normalize),
}));
let scanModels = null;

function matchesText(entry, text) {
  const normalized = normalize(text);
  if (!normalized) return true;
  return normalized.split(' ').every(word => entry.keywords.includes(word)) ||
    entry.condensed.includes(compact(normalized));
}

function scanMatches(make, name) {
  const modelName = normalize(name);
  if (!modelName) return [];
  const matchingBrand = models.filter(entry => !make || entry.model.dataset.brand === make);
  const exactTitles = matchingBrand.filter(entry => {
    const makeName = normalize(entry.model.dataset.brand);
    return entry.titles.some(title => modelName === title || modelName === makeName + ' ' + title);
  });
  return exactTitles.length ? exactTitles : matchingBrand.filter(entry => matchesText(entry, modelName));
}

function selectKnownBrand(value) {
  return Array.from(brand.options).some(option => option.value === value) ? value : '';
}

function readCandidate(value) {
  if (value.length > 125) return null;
  try {
    const candidate = JSON.parse(value);
    if (!Array.isArray(candidate) || candidate.length !== 2 ||
        !candidate.every(part => typeof part === 'string') || candidate[1].length > 80 ||
        (candidate[0] && !selectKnownBrand(candidate[0]))) return null;
    return candidate;
  } catch {
    return null;
  }
}

function loadScan(scan) {
  const mode = scan.get('scan');
  if (mode !== 'model' && mode !== 'possible') return;
  const make = selectKnownBrand(scan.get('brand'));
  const name = (scan.get('q') || '').slice(0, query.maxLength);
  const candidates = mode === 'model' ? [[make, name]] :
    scan.getAll('candidate').slice(0, 8).map(readCandidate).filter(Boolean);
  const matches = new Set(candidates.flatMap(([candidateBrand, candidateModel]) => scanMatches(candidateBrand, candidateModel)));
  const matchedBrands = new Set(Array.from(matches, entry => entry.model.dataset.brand));
  category.value = '';
  if (matches.size) {
    brand.value = matchedBrands.size === 1 ? Array.from(matchedBrands)[0] : '';
    query.value = mode === 'model' ? name : '';
    scanModels = matches;
    scanNote.textContent = mode === 'model' && matches.size === 1
      ? 'Filtered from the PartSnap label scan. Confirm the full model and revision before opening a reference.'
      : 'Possible matches from PartSnap. Compare the model on your equipment label before choosing a reference.';
  } else {
    brand.value = make;
    query.value = '';
    scanNote.textContent = make && mode === 'possible' && !candidates.length
      ? 'PartSnap found the brand. Compare the equipment label with the models listed below.'
      : make ? 'The scanned model could not be matched to a library entry. These are other references for the scanned brand.'
      : 'The scanned model could not be matched to a library entry. Search by the full model number on the equipment label.';
  }
  scanNote.hidden = false;
}

function updateResults() {
  let shown = 0;
  for (const entry of models) {
    const { model } = entry;
    const matchesQuery = matchesText(entry, query.value);
    const matchesBrand = !brand.value || model.dataset.brand === brand.value;
    const matchesCategory = !category.value || model.dataset.category === category.value;
    model.hidden = !((!scanModels || scanModels.has(entry)) && matchesQuery && matchesBrand && matchesCategory);
    if (!model.hidden) shown++;
  }
  count.textContent = shown === 1 ? '1 model or family' : `${shown} models and families`;
  empty.hidden = shown > 0;
}

const initial = new URLSearchParams(location.search);
query.value = (initial.get('q') || '').slice(0, query.maxLength);
for (const select of [brand, category]) {
  const value = initial.get(select.name);
  if (Array.from(select.options).some(option => option.value === value)) select.value = value;
}
loadScan(new URLSearchParams(location.hash.slice(1)));
function updateFilters(event) {
  if (event.target === query) {
    scanModels = null;
    scanNote.hidden = true;
  }
  updateResults();
}
filters.addEventListener('input', updateFilters);
filters.addEventListener('change', updateFilters);
filters.addEventListener('submit', event => event.preventDefault());
filters.addEventListener('reset', () => {
  requestAnimationFrame(() => {
    scanModels = null;
    scanNote.hidden = true;
    updateResults();
    query.focus();
  });
});
filters.hidden = false;
updateResults();
