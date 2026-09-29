(() => {
  const search = document.getElementById('note-search');
  search?.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    const notes = [...document.querySelectorAll('[data-note]')];
    let count = 0;
    for (const note of notes) {
      note.hidden = !note.textContent.toLowerCase().includes(query);
      if (!note.hidden) count++;
    }
    document.getElementById('note-count').textContent = `${count} matching ${count === 1 ? 'note' : 'notes'}`;
    document.getElementById('no-notes').hidden = count !== 0;
  });
  const choice = document.getElementById('analytics-choice');
  const key = 'splashlens-field-notes-analytics';
  let enabled = false;
  let loaded = false;
  try { enabled = localStorage.getItem(key) === 'yes'; } catch {}
  function sync() {
    choice.textContent = enabled ? 'On' : 'Off';
    choice.setAttribute('aria-pressed', String(enabled));
    choice.setAttribute('aria-label', `${enabled ? 'Disable' : 'Enable'} optional analytics`);
    window['ga-disable-G-9BGE6WFF23'] = !enabled;
    if (!enabled || loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-9BGE6WFF23', { send_page_view: false, page_location: `https://splashlens.com${location.pathname}`, page_referrer: '' });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-9BGE6WFF23';
    document.head.append(script);
  }
  if (choice) {
    choice.addEventListener('click', () => {
      enabled = !enabled;
      try { localStorage.setItem(key, enabled ? 'yes' : 'no'); } catch {}
      sync();
    });
    sync();
  }
  document.addEventListener('click', event => {
    const link = event.target.closest?.('[data-blog-cta]');
    const article = document.querySelector('[data-article-id]');
    if (!link || !article || !enabled || !window.gtag) return;
    window.gtag('event', 'blog_cta_click', {
      article_id: article.dataset.articleId, cluster: article.dataset.cluster,
      cta_id: link.dataset.blogCta, campaign: 'blog_120d_2026q4',
      page_location: `https://splashlens.com${location.pathname}`, page_referrer: '',
      destination_host: new URL(link.href).hostname
    });
  });
})();
