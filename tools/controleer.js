/* Controleert de content en de koppeling met de app.
   Gebruik: node tools/controleer.js   (vanuit de projectmap)

   Dit vangt structuurfouten, geen inhoudelijke. Een vraag kan hier groen zijn
   en toch het verkeerde antwoord bevatten — daarvoor moet je de content tegen
   de wettekst leggen. Zie docs/content-en-bronnen.md. */
const fs = require('fs');
const path = require('path');

const WORTEL = path.resolve(__dirname, '..');
const bron = f => path.join(WORTEL, f);

global.window = {};
require(bron('borden.js'));
require(bron('content-modules.js'));
require(bron('content-modules2.js'));
require(bron('content-extra.js'));

const SIGNS = window.SIGNS || [];
const EXTRA = window.EXTRA || {};
const MODS = (window.MODULES || []).concat(window.MODULES2 || []).sort((a, b) => a.nr - b.nr);

const html = fs.readFileSync(bron('index.html'), 'utf8');
const js = html.match(/<script>([\s\S]*)<\/script>/)[1];

const fouten = [];
const codes = new Set(SIGNS.map(s => s.c));

/* ---- 1. De app moet alle contentbestanden laden ---- */
for (const f of ['borden.js', 'content-modules.js', 'content-modules2.js', 'content-extra.js']) {
  if (!html.includes('<script src="' + f + '">')) fouten.push('index.html laadt ' + f + ' niet');
}

/* ---- 2. Modules ---- */
for (const m of MODS) {
  if (!new RegExp('\\' + m.kleur + '\\b').test(html)) fouten.push(m.id + ': kleurvariabele ' + m.kleur + ' ontbreekt in de CSS');
  if (!js.includes("'" + m.id + "'") && !js.includes(m.id + ':')) {
    /* niet elke module hoeft met naam in de code voor te komen; alleen het icoon wel */
  }
  const ico = js.slice(js.indexOf('mod: {'), js.indexOf('modIcoon:'));
  if (!new RegExp('\\b' + m.id + ":'").test(ico)) fouten.push(m.id + ': geen pictogram in AFB.mod');
}

/* ---- 3. Vragen ---- */
let aantal = 0;
const types = {};
const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

for (const m of MODS) {
  const vragen = m.questions.concat(EXTRA[m.id] || []);
  aantal += vragen.length;
  vragen.forEach((q, i) => {
    const id = m.id + '#' + i;
    types[q.t] = (types[q.t] || 0) + 1;
    if (!q.u) fouten.push(id + ': geen uitleg');
    if (q.signCode && !codes.has(q.signCode)) {
      /* geen fout: de app filtert bordvragen zonder bord weg */
    }
    switch (q.t) {
      case 'mc': case 'sign':
        if (!Number.isInteger(q.a) || !q.o || q.o[q.a] === undefined) fouten.push(id + ': ongeldig mc-antwoord');
        break;
      case 'jn':
        if (q.a !== 0 && q.a !== 1) fouten.push(id + ': ja/nee-antwoord moet 0 of 1 zijn');
        break;
      case 'multi':
        if (!Array.isArray(q.a) || !q.a.length || !q.a.every(x => q.o[x] !== undefined)) fouten.push(id + ': ongeldig multi-antwoord');
        break;
      case 'order':
        if (!Array.isArray(q.a) || q.a.length !== q.o.length) fouten.push(id + ': volgorde dekt niet alle opties');
        break;
      case 'fill':
        if (typeof q.a !== 'string' || norm(q.a) === '') fouten.push(id + ': invulantwoord normaliseert naar leeg (' + JSON.stringify(q.a) + ')');
        break;
      default:
        fouten.push(id + ': onbekend vraagtype ' + q.t);
    }
  });

  /* ---- 4. Puzzels ---- */
  (m.puzzles || []).forEach((p, i) => {
    const ids = p.scene.actors.map(a => a.id);
    if (p.a.length !== ids.length || !p.a.every(x => ids.includes(x)))
      fouten.push(m.id + ' puzzel ' + i + ': antwoord past niet op de actors');
  });

  /* ---- 5. Lessen ---- */
  m.lessons.forEach((l, i) => {
    if (!l.t || !l.b) fouten.push(m.id + ' les ' + i + ': kop of tekst ontbreekt');
  });
}

/* ---- 6. Borden ---- */
if (new Set(SIGNS.map(s => s.c)).size !== SIGNS.length) fouten.push('dubbele bordcodes in borden.js');
SIGNS.forEach(s => { if (!s.svg || !s.svg.startsWith('<svg')) fouten.push('bord ' + s.c + ': geen bruikbare SVG'); });

/* ---- 7. Renderpaden mogen niet opslaan ---- */
const render = js.slice(js.indexOf('function vVandaag'), js.indexOf('/* ---------- LEREN'));
if (/bewaar\(\)/.test(render)) fouten.push('ERNSTIG: een renderpad roept bewaar() aan — dat wist de voortgang bij het starten');
if (/teken\(\);\s*initOpslag\(\)/.test(js)) fouten.push('ERNSTIG: teken() draait vóór initOpslag() — dat wist de voortgang');

/* ---- 8. Elk veld van S moet in schoon() staan ---- */
const sBlok = js.slice(js.indexOf('var S = {'), js.indexOf('MODULES.forEach(function(m){ S.mod'));
const schoon = js.slice(js.indexOf('function schoon'), js.indexOf('/* ---------- Wat je vandaag deed'));
for (const veld of (sBlok.match(/\b([a-zA-Z]+)\s*:/g) || []).map(s => s.replace(/\s*:$/, ''))) {
  if (!schoon.includes(veld)) fouten.push('veld S.' + veld + ' komt niet voor in schoon() — het overleeft geen herlaadbeurt');
}

console.log('modules: ' + MODS.length + ' | lessen: ' + MODS.reduce((n, m) => n + m.lessons.length, 0) +
            ' | vragen: ' + aantal + ' | borden: ' + SIGNS.length +
            ' | puzzels: ' + MODS.reduce((n, m) => n + (m.puzzles || []).length, 0));
console.log('vraagtypes: ' + JSON.stringify(types));
console.log(fouten.length ? '\nFOUTEN (' + fouten.length + '):\n - ' + fouten.join('\n - ') : '\nalles in orde');
process.exit(fouten.length ? 1 : 0);
