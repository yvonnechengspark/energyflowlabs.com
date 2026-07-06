// Aloha — places data
// To add a place: copy a block, fill in lat/lon and name, set status.
//   status: 'story' = has content (gold marker + story card) | 'soon' = coming soon (green dot)
//   photo:  path like 'assets/photos/hilo.jpg' (compress before upload), or null for placeholder
//   audio:  path like 'assets/audio/hilo.mp3' — optional, planned for later.
//           When set, a voice-note player appears on the card automatically. Leave null for now.
//   story:  plain string, or { en: ..., zh: ..., es: ... } if translations come back later

const PLACES = [
  {
    id: 'big-island',
    lat: 19.70, lon: -155.09,
    status: 'story',
    name: 'Big Island, Hawaiʻi',
    country: 'United States',
    photo: null,
    audio: null,
    story: 'walking home from hilo night market. guy in front of us lit a cigarette, took one step, then stepped aside with a smile to let us pass. didn’t want us breathing it in. such a small thing but it hit me.'
  },
  {
    id: 'chiang-mai',
    lat: 18.79, lon: 98.98,
    status: 'story',
    name: 'Chiang Mai',
    country: 'Thailand',
    photo: null,
    audio: null,
    story: null // placeholder text shown until Yvonne writes it
  },
  {
    id: 'mexico',
    lat: 19.43, lon: -99.13,
    status: 'story',
    name: 'Mexico',
    country: null,
    photo: null,
    audio: null,
    story: null
  },

  // ---- coming soon ----
  { id: 'spain', lat: 40.42, lon: -3.70, status: 'soon', name: 'Spain', country: null, photo: null, audio: null, story: null },
  { id: 'iceland', lat: 64.15, lon: -21.94, status: 'soon', name: 'Iceland', country: null, photo: null, audio: null, story: null },
  { id: 'bali', lat: -8.65, lon: 115.22, status: 'soon', name: 'Bali', country: 'Indonesia', photo: null, audio: null, story: null },
  { id: 'california', lat: 37.40, lon: -122.08, status: 'soon', name: 'California', country: 'United States', photo: null, audio: null, story: null },
  { id: 'new-york', lat: 40.71, lon: -74.01, status: 'soon', name: 'New York', country: 'United States', photo: null, audio: null, story: null },
  { id: 'shenzhen', lat: 22.54, lon: 114.06, status: 'soon', name: 'Shenzhen', country: 'China', photo: null, audio: null, story: null }
];
