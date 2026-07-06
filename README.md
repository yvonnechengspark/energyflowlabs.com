# energyflowlabs.com

Static site on GitHub Pages. No build step — push to `main` and it's live.

## File map — what's safe to edit

**Content layer (safe for any tool/model to edit):**

- `assets/places.js` — Aloha places: markers, stories, photos, audio. Add/edit places here.
- `assets/i18n.js` — every UI string on the site. Edit copy here, not in the HTML.

**Core layer (architecture — don't edit for content changes):**

- `assets/style.css` — design system (colors, typography, layout)
- `assets/aloha.js` — map rendering, list view, story cards, audio player logic
- `assets/world-map.js` — auto-generated map data (never hand-edit)
- `index.html` / `aloha.html` / `flow-grove.html` — page skeletons; text lives in i18n.js

Rule of thumb: changing words or adding a place = content layer only. If a change seems to require touching the core layer, it's an architecture change — treat it carefully.

## Pages

- `index.html` — landing (hero + two portals)
- `aloha.html` — travel: world map + stories
- `flow-grove.html` — wellness curation

## How to add a place (Aloha)

Edit `assets/places.js`, copy an existing block:

```js
{
  id: 'lisbon',                    // unique, used for anchors
  lat: 38.72, lon: -9.14,          // marker position (Google the coordinates)
  status: 'story',                 // 'story' = gold marker + card | 'soon' = green dot only
  name: 'Lisbon',
  country: 'Portugal',             // or null
  photo: 'assets/photos/lisbon.jpg',   // or null → gradient placeholder
  audio: null,                     // future: 'assets/audio/lisbon.mp3' → voice-note player appears
  story: '...'                     // or null → placeholder text
}
```

- **Photos**: compress before committing (target < 300KB, e.g. `magick in.jpg -resize 1600x -quality 80 out.jpg`). Put in `assets/photos/`.
- **Audio (later)**: mp3 in `assets/audio/`, set the `audio` field — the player UI is already built and shows up automatically.

## Languages

English-only for now. The i18n layer is in place: to add 中文/Español later, add a dict in `assets/i18n.js` and list the code in `LANGS` — the nav switcher appears automatically, no page edits needed.

## Map

`assets/world-map.js` is auto-generated from Natural Earth data (public domain), equirectangular projection. Markers are computed from lat/lon — no map API, no keys, no cost.
