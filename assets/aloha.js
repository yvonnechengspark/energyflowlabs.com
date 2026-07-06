// Aloha page — map rendering, list view, story cards, audio players
// Depends on: world-map.js (WORLD_MAP), places.js (PLACES), i18n.js (t, tField, currentLang)

const SVG_NS = 'http://www.w3.org/2000/svg';

function project(lat, lon) {
  const x = (lon + 180) / 360 * WORLD_MAP.width;
  const y = (WORLD_MAP.latTop - lat) / 180 * (WORLD_MAP.width / 2);
  return [x, y];
}

/* ---------- Map ---------- */

function buildMap() {
  const shell = document.getElementById('map-shell');
  shell.querySelectorAll('svg').forEach(s => s.remove());

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${WORLD_MAP.width} ${WORLD_MAP.height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'World map');

  const land = document.createElementNS(SVG_NS, 'path');
  land.setAttribute('d', WORLD_MAP.path);
  land.setAttribute('class', 'land');
  land.setAttribute('fill-rule', 'evenodd');
  svg.appendChild(land);

  PLACES.forEach(place => {
    const [x, y] = project(place.lat, place.lon);
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', `marker marker-${place.status}`);
    g.dataset.id = place.id;

    if (place.status === 'story') {
      const pulse = document.createElementNS(SVG_NS, 'circle');
      pulse.setAttribute('cx', x); pulse.setAttribute('cy', y); pulse.setAttribute('r', 5);
      pulse.setAttribute('class', 'marker-pulse');
      g.appendChild(pulse);
    }

    const core = document.createElementNS(SVG_NS, 'circle');
    core.setAttribute('cx', x); core.setAttribute('cy', y);
    core.setAttribute('r', place.status === 'story' ? 5 : 3.5);
    core.setAttribute('class', 'marker-core');
    g.appendChild(core);

    // invisible larger hit area for small targets
    const hit = document.createElementNS(SVG_NS, 'circle');
    hit.setAttribute('cx', x); hit.setAttribute('cy', y); hit.setAttribute('r', 14);
    hit.setAttribute('fill', 'transparent');
    g.appendChild(hit);

    g.addEventListener('mouseenter', () => showTip(place, g, svg));
    g.addEventListener('mouseleave', hideTip);
    g.addEventListener('click', () => {
      if (place.status === 'story') {
        jumpToStory(place.id);
      } else {
        showTip(place, g, svg, true);
      }
    });

    svg.appendChild(g);
  });

  shell.insertBefore(svg, shell.firstChild);
}

let tipTimer = null;

function showTip(place, markerEl, svg, autoHide) {
  const shell = document.getElementById('map-shell');
  const tip = document.getElementById('map-tip');
  tip.innerHTML = '';
  const name = document.createTextNode(tField(place.name));
  tip.appendChild(name);
  const status = document.createElement('span');
  status.className = 'tip-status';
  status.textContent = place.status === 'story' ? t('aloha.legend.story') : t('aloha.legend.soon');
  tip.appendChild(status);
  tip.classList.toggle('story-tip', place.status === 'story');

  const core = markerEl.querySelector('.marker-core');
  const shellRect = shell.getBoundingClientRect();
  const coreRect = core.getBoundingClientRect();
  tip.style.left = (coreRect.left + coreRect.width / 2 - shellRect.left) + 'px';
  tip.style.top = (coreRect.top - shellRect.top) + 'px';
  tip.classList.add('show');

  clearTimeout(tipTimer);
  if (autoHide) tipTimer = setTimeout(hideTip, 1800);
}

function hideTip() {
  document.getElementById('map-tip').classList.remove('show');
}

function jumpToStory(id) {
  const card = document.getElementById('story-' + id);
  if (!card) return;
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  card.classList.add('flash');
  setTimeout(() => card.classList.remove('flash'), 2400);
}

/* ---------- List view ---------- */

function buildList() {
  const list = document.getElementById('place-list');
  list.innerHTML = '';
  const sorted = [...PLACES].sort((a, b) => (a.status === 'story' ? -1 : 1) - (b.status === 'story' ? -1 : 1));
  sorted.forEach(place => {
    const row = document.createElement('button');
    row.className = 'place-row' + (place.status === 'story' ? ' has-story' : '');
    row.type = 'button';

    const left = document.createElement('span');
    const name = document.createElement('span');
    name.className = 'p-name';
    name.textContent = tField(place.name);
    left.appendChild(name);
    if (place.country) {
      const c = document.createElement('span');
      c.className = 'p-country';
      c.textContent = tField(place.country);
      left.appendChild(c);
    }

    const badge = document.createElement('span');
    badge.className = 'p-badge';
    badge.textContent = place.status === 'story' ? t('aloha.badge.story') : t('aloha.badge.soon');

    row.appendChild(left);
    row.appendChild(badge);
    if (place.status === 'story') row.addEventListener('click', () => jumpToStory(place.id));
    list.appendChild(row);
  });
}

/* ---------- View toggle ---------- */

function setView(view) {
  document.getElementById('map-view').style.display = view === 'map' ? '' : 'none';
  document.getElementById('list-view').style.display = view === 'list' ? '' : 'none';
  document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
}

/* ---------- Story cards ---------- */

const PH_GRADIENTS = [
  'radial-gradient(120% 120% at 20% 15%, rgba(245,166,35,0.28) 0%, transparent 55%), radial-gradient(110% 110% at 85% 80%, rgba(46,125,60,0.5) 0%, transparent 65%), linear-gradient(160deg, #123920, #0a1a0e)',
  'radial-gradient(120% 120% at 80% 10%, rgba(124,200,144,0.32) 0%, transparent 60%), radial-gradient(100% 100% at 15% 85%, rgba(245,166,35,0.16) 0%, transparent 55%), linear-gradient(200deg, #14301c, #0a1a0e)',
  'radial-gradient(130% 130% at 50% 0%, rgba(250,221,168,0.2) 0%, transparent 55%), radial-gradient(110% 110% at 80% 90%, rgba(26,74,36,0.7) 0%, transparent 70%), linear-gradient(180deg, #0f2a16, #0a1a0e)'
];

function buildStories() {
  const box = document.getElementById('story-cards');
  box.innerHTML = '';
  PLACES.filter(p => p.status === 'story').forEach((place, i) => {
    const card = document.createElement('article');
    card.className = 'story-card';
    card.id = 'story-' + place.id;

    // photo
    const photo = document.createElement('div');
    photo.className = 'story-photo';
    if (place.photo) {
      const img = document.createElement('img');
      img.src = place.photo;
      img.alt = tField(place.name);
      img.loading = 'lazy';
      photo.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'photo-ph';
      ph.style.background = PH_GRADIENTS[i % PH_GRADIENTS.length];
      const letter = document.createElement('span');
      letter.className = 'ph-letter';
      letter.textContent = tField(place.name).charAt(0) || '·';
      ph.appendChild(letter);
      photo.appendChild(ph);
    }

    // body
    const body = document.createElement('div');
    body.className = 'story-body';

    if (place.country) {
      const country = document.createElement('div');
      country.className = 'story-country';
      country.textContent = tField(place.country);
      body.appendChild(country);
    }

    const h3 = document.createElement('h3');
    h3.className = 'story-place';
    h3.textContent = tField(place.name);
    body.appendChild(h3);

    const text = document.createElement('p');
    text.className = 'story-text' + (place.story ? '' : ' placeholder');
    text.textContent = place.story ? tField(place.story) : t('aloha.story.placeholder');
    body.appendChild(text);

    // Voice notes are planned but not recorded yet — the player only
    // appears once a place has an audio file set in places.js
    if (place.audio) body.appendChild(buildAudio(place));
    card.appendChild(photo);
    card.appendChild(body);
    box.appendChild(card);
  });
}

/* ---------- Audio player ---------- */

function buildAudio(place) {
  const box = document.createElement('div');
  box.className = 'audio-box has-audio';

  const btn = document.createElement('button');
  btn.className = 'audio-play';
  btn.type = 'button';
  btn.textContent = '▶';
  btn.setAttribute('aria-label', t('aloha.audio.label'));

  const meta = document.createElement('div');
  meta.className = 'audio-meta';
  const label = document.createElement('div');
  label.className = 'audio-label';
  label.textContent = t('aloha.audio.label');
  meta.appendChild(label);

  const wave = document.createElement('div');
  wave.className = 'audio-wave';
  const heights = [8, 13, 6, 16, 10, 19, 8, 14, 6, 11, 17, 7, 13, 9, 18, 6, 12, 15, 8, 10, 16, 7, 13, 9, 6, 14, 11, 8];
  heights.forEach(h => {
    const bar = document.createElement('i');
    bar.style.height = h + 'px';
    wave.appendChild(bar);
  });
  meta.appendChild(wave);

  const audio = new Audio(place.audio);
  audio.preload = 'none';
  const bars = wave.querySelectorAll('i');
  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = '❚❚';
      box.classList.add('playing');
    } else {
      audio.pause();
      btn.textContent = '▶';
      box.classList.remove('playing');
    }
  });
  audio.addEventListener('timeupdate', () => {
    const frac = audio.duration ? audio.currentTime / audio.duration : 0;
    const n = Math.floor(frac * bars.length);
    bars.forEach((b, i) => b.classList.toggle('played', i < n));
  });
  audio.addEventListener('ended', () => {
    btn.textContent = '▶';
    box.classList.remove('playing');
    bars.forEach(b => b.classList.remove('played'));
  });

  box.appendChild(btn);
  box.appendChild(meta);
  return box;
}

/* ---------- Init ---------- */

function renderAll() {
  buildMap();
  buildList();
  buildStories();
}

document.addEventListener('DOMContentLoaded', () => {
  renderAll();
  document.querySelectorAll('.view-btn').forEach(b => {
    b.addEventListener('click', () => setView(b.dataset.view));
  });
  // Mobile: map is small at phone width, list reads better as the default
  setView(window.innerWidth < 640 ? 'list' : 'map');
});

document.addEventListener('langchange', renderAll);
