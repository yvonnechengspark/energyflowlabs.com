// Energy Flow Labs — UI strings
// English-only for now. To add a language later: add a dict (e.g. I18N.zh = {...}),
// add the code to LANGS, and the switcher appears automatically. Pages don't change.

const I18N = {
  en: {
    'nav.aloha': 'Aloha',
    'nav.grove': 'Flow Grove',

    'home.tagline': 'Healing begins when energy flows freely.\nWe create spaces for that to happen.',
    'home.scroll': 'explore',
    'home.grove.eyebrow': 'Wellness',
    'home.grove.desc': 'A curated collection of wellness finds — products, practices, and tools that help energy move.',
    'home.grove.cta': 'Enter the grove',
    'home.aloha.eyebrow': 'Travel',
    'home.aloha.desc': 'Three years on the road, 30+ countries. Photos and stories from the places that stayed with me.',
    'home.aloha.cta': 'See the map',

    'aloha.eyebrow': 'Travel',
    'aloha.sub': '30+ countries in three years. Every marker is a place I lived a little. The gold ones have stories ready — tap them.',
    'aloha.view.map': 'Map',
    'aloha.view.list': 'List',
    'aloha.legend.story': 'story ready',
    'aloha.legend.soon': 'coming soon',
    'aloha.stories.eyebrow': 'From the road',
    'aloha.stories.title': 'Stories',
    'aloha.badge.story': 'Story',
    'aloha.badge.soon': 'Soon',
    'aloha.audio.label': 'Voice note',
    'aloha.story.placeholder': 'This story is on its way. It will be told in my own words, not summarized.',

    'grove.eyebrow': 'Wellness',
    'grove.sub': 'Everything you want to do runs on one system: your body. Flow Grove is where I keep the things that actually help it run well — no miracle cures, just what earns its place.',
    'grove.note': 'Nothing for sale yet. When there is, it will be something I would hand to a friend.',

    'grove.cat.nourish': 'Nourish',
    'grove.cat.move': 'Move',
    'grove.cat.restore': 'Restore',
    'grove.cat.calm': 'Calm',
    'grove.cat.ground': 'Ground',

    'grove.ess.nourish': 'Food as information. What you eat is a message to every cell — oils, ferments, fiber, the things worth being picky about.',
    'grove.ess.move': 'Movement as medicine. The body was built to be used, not spared.',
    'grove.ess.restore': 'Repair happens when you stop. Sleep, breath, light, rhythm.',
    'grove.ess.calm': 'Steadiness is the body’s real strength. The nervous system, stress, and coming back to center.',
    'grove.ess.ground': 'The space around you shapes you too. Scent, sound, and the small rituals that hold a day together.',

    'footer.tag': 'Let energy flow'
  }
};

const LANGS = ['en'];
const LANG_LABELS = { en: 'EN', zh: '中文', es: 'ES' };

function detectLang() {
  const saved = localStorage.getItem('efl-lang');
  if (saved && LANGS.includes(saved)) return saved;
  const nav = (navigator.language || 'en').toLowerCase();
  const guess = nav.startsWith('zh') ? 'zh' : nav.startsWith('es') ? 'es' : 'en';
  return LANGS.includes(guess) ? guess : LANGS[0];
}

let currentLang = detectLang();

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

// Pick a translated field from a {en, zh, es} object or plain string
function tField(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[currentLang] || obj.en || Object.values(obj)[0] || '';
}

function applyI18n() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const text = t(el.dataset.i18n);
    if (text.includes('\n')) {
      el.innerHTML = '';
      text.split('\n').forEach((line, i) => {
        if (i > 0) el.appendChild(document.createElement('br'));
        el.appendChild(document.createTextNode(line));
      });
    } else {
      el.textContent = text;
    }
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
  document.dispatchEvent(new CustomEvent('langchange', { detail: currentLang }));
}

function setLang(lang) {
  if (!LANGS.includes(lang)) return;
  currentLang = lang;
  localStorage.setItem('efl-lang', lang);
  applyI18n();
}

function initLangSwitch() {
  document.querySelectorAll('.lang-switch').forEach(box => {
    box.innerHTML = '';
    if (LANGS.length < 2) { box.style.display = 'none'; return; }
    LANGS.forEach(lang => {
      const btn = document.createElement('button');
      btn.className = 'lang-btn';
      btn.dataset.lang = lang;
      btn.textContent = LANG_LABELS[lang] || lang.toUpperCase();
      btn.setAttribute('aria-label', 'Switch language: ' + (LANG_LABELS[lang] || lang));
      btn.addEventListener('click', () => setLang(lang));
      box.appendChild(btn);
    });
  });
  applyI18n();
}

document.addEventListener('DOMContentLoaded', initLangSwitch);
