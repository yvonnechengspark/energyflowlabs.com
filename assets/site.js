// Site-wide config — CONTENT LAYER: safe to edit.
//
// Social links: empty = nothing shows in the footer.
// When ready, add entries and they appear on every page automatically:
//   { label: 'TikTok', url: 'https://www.tiktok.com/@...' }
//   { label: 'YouTube', url: 'https://youtube.com/@...' }
//   { label: 'Telegram', url: 'https://t.me/...' }

const SITE_SOCIAL = [
  // intentionally empty for now — people arrive FROM social, the footer slot is reserved
];

function buildFooterSocial() {
  const host = document.getElementById('footer-social');
  if (!host) return;
  host.innerHTML = '';
  if (!SITE_SOCIAL.length) { host.style.display = 'none'; return; }
  host.style.display = '';
  SITE_SOCIAL.forEach(s => {
    const a = document.createElement('a');
    a.className = 'f-social';
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.label;
    host.appendChild(a);
  });
}

document.addEventListener('DOMContentLoaded', buildFooterSocial);
