(function () {
  const navItems = [
    { label: 'Features', href: '/#features' },
    {
      label: 'Tools',
      items: [
        ['PartSnap', '/partsnap', 'photo-based part clue workflow'],
        ['Parts ID Page', '/partsnap-pool-part-identification-app.html', 'marketing and proof path'],
        ['Job Records', '/partsnap-proof-library.html', 'what to photo before ordering'],
        ['Closing Season', '/closing-season.html', 'winterization proof and callback notes'],
        ['Filter winterizing', '/closing/winterize-pool-filter.html', 'cartridge, sand, and DE proof'],
        ['Verified codes', '/verified-equipment-code-lookup.html', 'guide-scoped HeatPro answers only'],
        ['Works alongside', '/works-alongside-pool-brain-skimmer-jobber.html', 'export a packet; no integration'],
        ['Mystery Lab', '/mystery-part-lab.html', 'weird part review lane'],
        ['AI Scanning', '/#ai', 'error scan, PartSnap, strip reader'],
        ['Open Web App', 'https://app.splashlens.com', 'use the field tools now']
      ]
    },
    {
      label: 'Equipment',
      equipment: true,
      items: [
        ['Robots', '/pool-robots/', 'Dolphin, Polaris, Aiper, Beatbot'],
        ['Automation', '/pool-automation/', 'Omni, IntelliCenter, AquaLink'],
        ['Lighting', '/pool-lighting/', 'niches, transformers, sync issues'],
        ['Salt Cells', '/salt-cells/', 'cell, flow, salt, output clues'],
        ['Spa / Swim Spa', '/spa-hot-tub-troubleshooting-app.html', 'packs, topsides, GFCI, current pumps'],
        ['All Equipment Brands', '/brands/', 'manufacturer and family hubs'],
        { heading: 'Manufacturers' },
        ['Aiper', '/brands/aiper.html', 'robot cleaner codes and checks'],
        ['AquaCal', '/brands/aquacal.html', 'heat pump field reference'],
        ['Automatic Covers', '/brands/automatic-covers.html', 'cover motor and switch clues'],
        ['Beatbot', '/brands/beatbot.html', 'smart robot cleaner reference'],
        ['Betta (BWT)', '/brands/betta-bwt.html', 'skimmer robot reference'],
        ['CMP / PAL / S.R. Smith Lighting', '/brands/cmp-pal-s-r-smith-lighting.html', 'lighting and niche clues'],
        ['Commercial Chem Controllers', '/brands/commercial-chem-controllers.html', 'ORP, pH, and feed systems'],
        ['Hayward', '/brands/hayward.html', 'equipment codes and checks'],
        ['Hayward Salt / AquaRite', '/brands/hayward-salt-turbocell-aquarite.html', 'salt cell and controller clues'],
        ['IntelliFlo / Pentair', '/brands/intelliflo-pentair.html', 'variable-speed pump reference'],
        ['Jandy / Zodiac', '/brands/jandy-zodiac.html', 'automation, heater, and equipment codes'],
        ['Maytronics / Dolphin', '/brands/maytronics-dolphin.html', 'robot cleaner reference'],
        ['Pentair', '/brands/pentair.html', 'equipment codes and checks'],
        ['Pentair Automation', '/brands/pentair-automation-intellitouch-easytouch.html', 'IntelliTouch and EasyTouch'],
        ['Polaris / Zodiac', '/brands/polaris-zodiac.html', 'cleaner and equipment reference'],
        ['Raypak', '/brands/raypak.html', 'heater codes and checks'],
        ['Sta-Rite', '/brands/sta-rite.html', 'pump and equipment reference'],
        ['Waterway', '/brands/waterway.html', 'spa and pump equipment']
      ]
    },
    {
      label: 'Learn',
      items: [
        ['Tech Radar', '/new-tech-radar.html', 'new equipment and product watchlist'],
        ['Verified Field Network', '/verified-field-network.html', 'the moonshot platform layer'],
        ['Field Learning OS', '/field-learning-os.html', 'proof packets into 5-minute lessons'],
        ['Training', '/pool-tech-training-field-reference.html', 'teach newer techs from real stops'],
        ['Blog', '/blog/', 'pool tech articles and guides'],
        ['How It Works', '/#how', 'field workflow overview'],
        ['Compare', '/#compare', 'where SplashLens fits']
      ]
    },
    {
      label: 'Partners',
      items: [
        ['Partner Page', '/partners', 'education, media, manufacturers'],
        ['Teams', '/teams', 'owner visibility and field proof'],
        ['Verified Field Network', '/verified-field-network.html', 'proof, partner cards, and field memory'],
        ['Field Testers', '/field-testers.html', 'send real-world feedback'],
        ['Field Card Packet', '/partner-field-card-packet.html', 'manufacturer-ready proof cards'],
        ['Facilities Pilot', '/facilities', 'QR workflow and support routing'],
        ['Field Proof Pilot', '/field-proof-pilot.html', '14-day company test'],
        ['Media Traffic', '/paid-media.html', 'lean conversion page']
      ]
    },
    { label: 'For Facilities', href: '/facility-assist' },
    {
      label: 'Language',
      lang: true,
      items: [
        ['All Languages', '/languages/', 'choose a translated field workflow'],
        ['Canada', '/ca/', 'Canadian field-reference route'],
        ['Espanol', '/es/', 'Spanish field workflow'],
        ['Francais (Canada)', '/fr-ca/', 'French-Canadian pilot page']
      ]
    }
  ];

  function esc(value) {
    return String(value || '').replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));
  }

  function mobileMenu(items) {
    const blocks = [];
    for (const item of items) {
      if (item.lang) continue;
      if (!item.items) {
        blocks.push(`<a href="${esc(item.href)}"><strong>${esc(item.label)}</strong><span>Open this page</span></a>`);
        continue;
      }
      blocks.push(`<div class="sl-nav-menu-heading">${esc(item.label)}</div>`);
      for (const entry of item.items) {
        if (entry.heading) {
          blocks.push(`<div class="sl-nav-menu-heading">${esc(entry.heading)}</div>`);
          continue;
        }
        const [label, href, desc] = entry;
        blocks.push(`<a href="${esc(href)}"${String(href).startsWith('http') ? ' target="_blank" rel="noopener"' : ''}><strong>${esc(label)}</strong><span>${esc(desc)}</span></a>`);
      }
    }
    return `
      <details class="sl-nav-menu sl-nav-mobile">
        <summary>Menu</summary>
        <div class="sl-nav-menu-panel">${blocks.join('')}</div>
      </details>`;
  }

  function menu(item) {
    if (!item.items) return `<a class="sl-nav-link" href="${esc(item.href)}">${esc(item.label)}</a>`;
    return `
      <details class="sl-nav-menu${item.lang ? ' sl-nav-lang' : ''}${item.equipment ? ' sl-nav-equipment' : ''}">
        <summary>${esc(item.label)}</summary>
        <div class="sl-nav-menu-panel">
          ${item.items.map((entry) => {
            if (entry.heading) return `<div class="sl-nav-menu-heading">${esc(entry.heading)}</div>`;
            const [label, href, desc] = entry;
            return `
            <a href="${esc(href)}"${href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>
              <strong>${esc(label)}</strong>
              <span>${esc(desc)}</span>
            </a>`;
          }).join('')}
        </div>
      </details>`;
  }

  function icon() {
    return `<span class="sl-nav-logo-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 20c2.7-2.7 5.3-2.7 8 0s5.3 2.7 8 0 5.3-2.7 8 0" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M5 25c2.7-2.7 5.3-2.7 8 0s5.3 2.7 8 0 5.3-2.7 8 0" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity=".46"/>
        <circle cx="16" cy="11" r="5.4" stroke="white" stroke-width="2.4"/>
        <circle cx="16" cy="11" r="2" fill="white"/>
      </svg>
    </span>`;
  }

  function style() {
    if (document.getElementById('splashlens-global-nav-style')) return;
    const tag = document.createElement('style');
    tag.id = 'splashlens-global-nav-style';
    tag.textContent = `
      .sl-global-nav{position:sticky;top:0;z-index:9999;background:rgba(255,255,255,.94);backdrop-filter:blur(12px);border-bottom:1px solid #dbe8ef;padding:0 24px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif}
      .sl-nav-inner{max-width:1320px;margin:0 auto;height:60px;display:flex;align-items:center;justify-content:space-between;gap:16px}
      .sl-nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:#0f172a;min-width:max-content}
      .sl-nav-logo-mark{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;background:linear-gradient(145deg,#0284c7,#0369a1);box-shadow:0 8px 18px rgba(2,132,199,.18);flex-shrink:0}
      .sl-nav-logo-mark svg{width:28px;height:28px}
      .sl-nav-logo-copy{display:flex;flex-direction:column;line-height:1.02}
      .sl-nav-logo-name{font-size:1.16rem;font-weight:900;letter-spacing:.01em;color:#0f172a}
      .sl-nav-logo-tag{margin-top:3px;font-size:.58rem;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:#0369a1}
      .sl-nav-links{display:flex;align-items:center;gap:8px;margin-left:auto}
      .sl-nav-link,.sl-nav-menu summary{color:#334155;text-decoration:none;font-size:.9rem;font-weight:650;transition:color .2s}
      .sl-nav-link:hover,.sl-nav-menu summary:hover,.sl-nav-menu[open] summary{color:#0284c7}
      .sl-nav-menu{position:relative}
      .sl-nav-menu summary{list-style:none;cursor:pointer;padding:8px;border-radius:8px;display:inline-flex;align-items:center;gap:5px}
      .sl-nav-menu summary::-webkit-details-marker{display:none}
      .sl-nav-menu summary::after{content:'';width:7px;height:7px;border-right:1.8px solid currentColor;border-bottom:1.8px solid currentColor;transform:rotate(45deg) translateY(-2px);transition:transform .18s ease}
      .sl-nav-menu[open] summary::after{transform:rotate(225deg) translateY(-1px)}
      .sl-nav-menu-panel{position:absolute;top:calc(100% + 10px);left:50%;transform:translateX(-50%);width:min(560px,calc(100vw - 40px));max-height:min(78vh,760px);overflow:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;padding:10px;background:rgba(255,255,255,.98);border:1px solid #dbe8ef;border-radius:12px;box-shadow:0 18px 50px rgba(15,23,42,.16);z-index:10000}
      .sl-nav-equipment .sl-nav-menu-panel{width:min(860px,calc(100vw - 40px));grid-template-columns:repeat(3,minmax(0,1fr))}
      .sl-nav-menu-heading{grid-column:1/-1;margin:4px 2px 2px;padding:9px 10px 7px;border-top:1px solid #dbe8ef;color:#0369a1;font-size:.72rem;font-weight:950;letter-spacing:.12em;text-transform:uppercase}
      .sl-nav-menu-panel a{display:block;padding:10px 11px;border-radius:8px;background:#fff;border:1px solid transparent;line-height:1.2;text-decoration:none}
      .sl-nav-menu-panel a strong{display:block;font-size:.86rem;color:#0f172a}
      .sl-nav-menu-panel a span{display:block;margin-top:3px;font-size:.72rem;color:#64748b}
      .sl-nav-menu-panel a:hover{border-color:#bae6fd;background:#f0f9ff}
      .sl-nav-lang summary{border:1px solid #dbe8ef;color:#334155;background:#f8fafc;font-weight:750}
      .sl-nav-lang .sl-nav-menu-panel{width:min(300px,calc(100vw - 40px));grid-template-columns:1fr;right:0;left:auto;transform:none}
      .sl-nav-cta{background:#0284c7;color:#fff!important;padding:8px 20px;border-radius:100px;text-decoration:none;font-size:.9rem;font-weight:750;transition:background .2s}
      .sl-nav-cta:hover{background:#0369a1}
      .sl-nav-mobile{display:none}
      @media(max-width:1180px){.sl-nav-links{gap:6px}.sl-nav-link,.sl-nav-menu summary,.sl-nav-cta{font-size:.82rem}.sl-nav-cta{padding:8px 14px}}
      @media(max-width:768px){.sl-global-nav{padding:0 14px}.sl-nav-inner{height:auto;min-height:60px;padding:8px 0;gap:8px}.sl-nav-logo-mark{width:34px;height:34px;border-radius:9px}.sl-nav-logo-name{font-size:1rem}.sl-nav-logo-tag{display:none}.sl-nav-links{gap:6px;justify-content:flex-end;flex-wrap:nowrap}.sl-nav-link,.sl-nav-menu:not(.sl-nav-lang):not(.sl-nav-mobile){display:none}.sl-nav-mobile{display:block}.sl-nav-mobile summary,.sl-nav-lang summary,.sl-nav-cta{min-height:44px;display:inline-flex;align-items:center;justify-content:center}.sl-nav-lang{display:block}.sl-nav-lang summary{font-size:0;gap:0;padding:0 12px}.sl-nav-lang summary::before{content:'Lang';font-size:.85rem}.sl-nav-mobile summary{font-size:.85rem;padding:0 12px}.sl-nav-menu-panel,.sl-nav-lang .sl-nav-menu-panel,.sl-nav-mobile .sl-nav-menu-panel{position:fixed;top:64px;left:14px;right:14px;transform:none;width:auto;max-width:calc(100vw - 28px);grid-template-columns:1fr;max-height:min(70vh,calc(100dvh - 80px));overflow:auto}.sl-nav-mobile .sl-nav-menu-panel a{min-height:44px}.sl-nav-cta{padding:0 12px;border-radius:8px;font-size:.85rem}}
    `;
    document.head.appendChild(tag);
  }

  function render() {
    const existing = document.body.querySelector('nav');
    if (existing && existing.hasAttribute('data-preserve-nav')) return;
    style();
    const nav = document.createElement('nav');
    nav.className = 'sl-global-nav';
    nav.setAttribute('aria-label', 'SplashLens primary navigation');
    nav.innerHTML = `
      <div class="sl-nav-inner">
        <a href="/" class="sl-nav-logo">
          ${icon()}
          <span class="sl-nav-logo-copy">
            <span class="sl-nav-logo-name">SplashLens</span>
            <span class="sl-nav-logo-tag">Field Rescue</span>
          </span>
        </a>
        <div class="sl-nav-links">
          ${mobileMenu(navItems)}
          ${navItems.map(menu).join('')}
          <a href="https://app.splashlens.com" target="_blank" rel="noopener" class="sl-nav-cta">Web App</a>
        </div>
      </div>`;

    if (existing) existing.replaceWith(nav);
    else document.body.prepend(nav);

    const menus = Array.from(nav.querySelectorAll('.sl-nav-menu'));
    menus.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        menus.forEach((other) => { if (other !== item) other.open = false; });
      });
    });
    document.addEventListener('click', (event) => {
      if (event.target.closest && event.target.closest('.sl-global-nav')) return;
      menus.forEach((item) => { item.open = false; });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      menus.forEach((item) => { item.open = false; });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
