// Flow Grove — categories and curated items
// CONTENT LAYER: safe to edit.
//
// Categories are nodes on the grove visual. To add a curated item, add to GROVE_ITEMS:
//   { category: 'food', name: 'Some olive oil', note: 'why I actually use it (one honest line)',
//     url: 'https://...', image: 'assets/photos/oil.jpg' }   // url/image optional
// Items appear on the page automatically, grouped under their category.

const GROVE_CATEGORIES = [
  { id: 'mind',   x: 130, y: 168 },
  { id: 'body',   x: 258, y: 258 },
  { id: 'food',   x: 388, y: 148 },
  { id: 'sleep',  x: 512, y: 246 },
  { id: 'sound',  x: 636, y: 142 },
  { id: 'space',  x: 758, y: 252 },
  { id: 'ritual', x: 878, y: 172 }
];

const GROVE_ITEMS = [
  // empty for now — curation in progress
];

/* ---------- rendering (core logic below, no content) ---------- */

const GROVE_NS = 'http://www.w3.org/2000/svg';

function buildGroveVisual() {
  const host = document.getElementById('grove-visual');
  if (!host) return;
  host.innerHTML = '';

  const W = 1000, H = 400;
  const svg = document.createElementNS(GROVE_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Flow Grove');

  // flowing vines weaving through the category nodes
  const vines = [
    { d: 'M-40,210 C120,120 240,300 390,180 S620,90 760,240 S940,140 1040,200', cls: 'vine vine-1' },
    { d: 'M-40,150 C140,240 300,120 460,230 S700,280 840,150 S980,230 1040,170', cls: 'vine vine-2' },
    { d: 'M-40,270 C180,180 340,260 520,170 S740,200 900,260 S1000,180 1040,240', cls: 'vine vine-3' }
  ];
  vines.forEach(v => {
    const p = document.createElementNS(GROVE_NS, 'path');
    p.setAttribute('d', v.d);
    p.setAttribute('class', v.cls);
    svg.appendChild(p);
  });

  GROVE_CATEGORIES.forEach((cat, i) => {
    const hasItems = GROVE_ITEMS.some(it => it.category === cat.id);
    const g = document.createElementNS(GROVE_NS, 'g');
    g.setAttribute('class', 'grove-node' + (hasItems ? ' grove-node-live' : ''));

    const halo = document.createElementNS(GROVE_NS, 'circle');
    halo.setAttribute('cx', cat.x); halo.setAttribute('cy', cat.y); halo.setAttribute('r', 14);
    halo.setAttribute('class', 'gn-halo');
    halo.style.animationDelay = (i * -1.3) + 's';
    g.appendChild(halo);

    const core = document.createElementNS(GROVE_NS, 'circle');
    core.setAttribute('cx', cat.x); core.setAttribute('cy', cat.y); core.setAttribute('r', 4.5);
    core.setAttribute('class', 'gn-core');
    g.appendChild(core);

    const label = document.createElementNS(GROVE_NS, 'text');
    label.setAttribute('x', cat.x);
    // alternate label placement above/below to avoid crowding the vines
    label.setAttribute('y', cat.y < 200 ? cat.y - 26 : cat.y + 38);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'gn-label');
    label.textContent = t('grove.cat.' + cat.id);
    g.appendChild(label);

    if (hasItems) {
      g.style.cursor = 'pointer';
      g.addEventListener('click', () => {
        const el = document.getElementById('shelf-' + cat.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    svg.appendChild(g);
  });

  host.appendChild(svg);
}

function buildGroveChips() {
  const host = document.getElementById('grove-chips');
  if (!host) return;
  host.innerHTML = '';
  GROVE_CATEGORIES.forEach(cat => {
    const chip = document.createElement('span');
    chip.className = 'grove-chip';
    chip.textContent = t('grove.cat.' + cat.id);
    host.appendChild(chip);
  });
}

function buildGroveShelf() {
  const host = document.getElementById('grove-shelf');
  if (!host) return;
  host.innerHTML = '';
  if (!GROVE_ITEMS.length) return; // nothing curated yet — the visual carries the page

  GROVE_CATEGORIES.forEach(cat => {
    const items = GROVE_ITEMS.filter(it => it.category === cat.id);
    if (!items.length) return;

    const section = document.createElement('div');
    section.className = 'shelf-section';
    section.id = 'shelf-' + cat.id;

    const head = document.createElement('div');
    head.className = 'g-eyebrow';
    head.textContent = t('grove.cat.' + cat.id);
    section.appendChild(head);

    const grid = document.createElement('div');
    grid.className = 'shelf-grid';
    items.forEach(it => {
      const card = document.createElement(it.url ? 'a' : 'div');
      card.className = 'grove-card shelf-card';
      if (it.url) { card.href = it.url; card.target = '_blank'; card.rel = 'noopener'; }

      if (it.image) {
        const img = document.createElement('img');
        img.src = it.image;
        img.alt = it.name;
        img.loading = 'lazy';
        img.className = 'shelf-img';
        card.appendChild(img);
      }
      const h = document.createElement('h3');
      h.textContent = it.name;
      card.appendChild(h);
      const p = document.createElement('p');
      p.textContent = it.note || '';
      card.appendChild(p);
      grid.appendChild(card);
    });
    section.appendChild(grid);
    host.appendChild(section);
  });
}

function renderGrove() {
  buildGroveVisual();
  buildGroveChips();
  buildGroveShelf();
}

document.addEventListener('DOMContentLoaded', renderGrove);
document.addEventListener('langchange', renderGrove);
