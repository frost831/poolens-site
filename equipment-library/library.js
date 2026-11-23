const filters = document.querySelector('.filters');
const query = document.querySelector('#equipment-query');
const brand = document.querySelector('#equipment-brand');
const category = document.querySelector('#equipment-category');
const count = document.querySelector('#equipment-count');
const empty = document.querySelector('#equipment-empty');

function normalize(value) {
  return value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
const compact = value => value.replaceAll(' ', '');
const models = Array.from(document.querySelectorAll('.model'), model => ({
  model,
  keywords: normalize(model.dataset.search),
  condensed: compact(normalize(model.dataset.search)),
}));

function updateResults() {
  const words = normalize(query.value).split(' ').filter(Boolean);
  let shown = 0;
  for (const { model, keywords, condensed } of models) {
    const matchesQuery = words.every(word => keywords.includes(word)) ||
      condensed.includes(words.join(''));
    const matchesBrand = !brand.value || model.dataset.brand === brand.value;
    const matchesCategory = !category.value || model.dataset.category === category.value;
    model.hidden = !(matchesQuery && matchesBrand && matchesCategory);
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
filters.addEventListener('input', updateResults);
filters.addEventListener('change', updateResults);
filters.addEventListener('submit', event => event.preventDefault());
filters.addEventListener('reset', () => {
  requestAnimationFrame(() => {
    updateResults();
    query.focus();
  });
});
filters.hidden = false;
updateResults();
