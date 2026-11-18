/* Bouwt de drie publicatievormen uit index.html + de contentbestanden.
   Gebruik: node tools/bouw.js   (vanuit de projectmap)

   De scriptverwijzingen worden vervangen door de inhoud zelf, en er komt een
   compleet HTML-omhulsel omheen. Dat omhulsel voegt het artifact-platform
   normaal zelf toe; buiten dat platform moeten we het zelf meeleveren. */
const fs = require('fs');
const path = require('path');

const WORTEL = path.resolve(__dirname, '..');
const bron = f => path.join(WORTEL, f);

const OMHULSEL_KOP =
  '<!doctype html>\n<html lang="nl">\n<head>\n<meta charset="utf-8">\n' +
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' +
  '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);' +
  'padding-bottom:env(safe-area-inset-bottom,0px)}' +
  'body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}' +
  '[hidden]{display:none!important}</style>\n</head>\n<body>\n';

const DOELEN = ['rijbewijs-b-trainer.html', 'site/index.html', 'gh-repo/index.html'];
/* Deze bestanden gaan ook los mee naar de repo, zodat de bron daar leesbaar blijft. */
const BRONKOPIEEN = ['borden.js', 'content-modules.js', 'content-modules2.js', 'content-extra.js'];

let pagina = fs.readFileSync(bron('index.html'), 'utf8');

const ingeplakt = [];
pagina = pagina.replace(/<script src="([^"]+)"><\/script>/g, (m, f) => {
  const p = bron(f);
  if (!fs.existsSync(p)) {
    console.error('ONTBREEKT: ' + f + ' — de bouw stopt, want dit geeft een stil kapotte app.');
    process.exit(1);
  }
  ingeplakt.push(f);
  return '<script>\n' + fs.readFileSync(p, 'utf8') + '\n</script>';
});

const uit = OMHULSEL_KOP + pagina + '\n</body>\n</html>\n';

for (const d of DOELEN) {
  const p = bron(d);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, uit);
}
for (const f of BRONKOPIEEN) {
  if (fs.existsSync(bron(f))) fs.copyFileSync(bron(f), bron('gh-repo/src/' + f));
}
fs.copyFileSync(bron('index.html'), bron('gh-repo/src/artifact-index.html'));

console.log('ingeplakt: ' + ingeplakt.join(', '));
console.log('geschreven: ' + DOELEN.join(', '));
console.log('grootte: ' + (uit.length / 1024).toFixed(0) + ' kB');

/* Controle achteraf: er mag geen externe verwijzing overblijven behalve het lettertype. */
const extern = (uit.match(/\s(?:src|href)="(?!#)[^"]*"/g) || [])
  .filter(s => !s.includes('fonts.googleapis.com'));
console.log(extern.length ? 'LET OP, externe verwijzingen over: ' + extern.join(' ')
                          : 'geen externe verwijzingen over (op het lettertype na)');
