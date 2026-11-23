/* Verkeerssituaties bij de vragen: inline SVG, gezien vanuit de bestuurdersstoel.

   Inline en niet als los bestand, omdat de artifact-CSP externe afbeeldingen blokkeert
   - dezelfde reden als bij de borden en de lesillustraties.

   Deze set gaat mee in alle drie de varianten van de app. De privéversie heeft daarnaast
   examenbeeld.js met overgenomen beeld op dezelfde sleutels; beeldVoor() in index.html
   kiest die eerst. Een sleutel die hier staat werkt dus overal, ook publiek.

   Afspraken, gelijk aan illustraties.js:
   - viewBox 320 breed, geen height; index.html schaalt via CSS
   - lijnen en tekst in currentColor zodat licht en donker thema meelopen
   - var(--surface-2) en var(--line) voor achtergrondvlakken
   - echte verkeerskleuren hard gecodeerd: asfalt, belijning, rood/oranje/groen, glas
   - mobiel-eerst: ze worden op ongeveer 360 px bekeken */
(function(){

window.SITUATIES = {};

/* ======================= HULPVORMEN =======================
   Ze staan binnen de IIFE en niet in window.SITUATIES, want index.html loopt over dat
   object heen als lijst van beschikbare taferelen; een hulpsleutel zou daar als
   situatie meetellen. Ze geven een fragment terug zonder <svg>-wikkel. */

/* Echte verkeerskleuren. Ze betekenen iets en mogen dus niet met het thema meebewegen. */
var ASFALT = '#4a5361', BERM = '#6f7a66', STREEP = '#ffffff';
var ROOD = '#c1121c', BLAUW = '#0b4ea2', GEEL = '#f2c200', GROEN = '#2b9c57';
var ORANJE = '#f08a24', GLAS = '#cfe2ff', GRIJS = '#2a2d2f', FIETSROOD = '#9c4a3c';

function svgWikkel(hoogte, label, inhoud){
  return '<svg viewBox="0 0 320 ' + hoogte + '" width="100%" role="img" aria-label="' + label + '">' +
    inhoud + '</svg>';
}

/* De bestuurdersblik: lucht boven de horizon, berm eronder, wegdek als trapezium dat
   naar het verdwijnpunt toeloopt. Alle rijbaanvragen delen deze bak, zodat een bord of
   streep in elk tafereel op dezelfde hoogte en schaal staat. */
var HORIZON = 72;
function wegVooruit(hoogte, linksOnder, rechtsOnder, linksBoven, rechtsBoven){
  return '<rect x="0" y="0" width="320" height="' + HORIZON + '" fill="var(--surface-2)"/>' +
    '<rect x="0" y="' + HORIZON + '" width="320" height="' + (hoogte - HORIZON) + '" fill="' + BERM + '"/>' +
    '<path d="M' + linksBoven + ' ' + HORIZON + 'H' + rechtsBoven + 'L' + rechtsOnder + ' ' + hoogte +
      'H' + linksOnder + 'Z" fill="' + ASFALT + '"/>';
}
/* Een streep in perspectief: van een punt op de horizon naar een punt onderaan. */
function streep(xBoven, xOnder, hoogte, kleur, breedOnder, streepjes){
  var k = kleur || STREEP;
  return '<path d="M' + xBoven + ' ' + HORIZON + 'L' + xOnder + ' ' + hoogte + '" stroke="' + k +
    '" stroke-width="' + (breedOnder || 4) + '" fill="none"' +
    (streepjes ? ' stroke-dasharray="' + streepjes + '"' : '') + '/>';
}

/* Borden worden schematisch nagetekend (vorm + kleur + symbool) en niet uit borden.js
   gehaald: die SVG's zijn 300x300 en in deze taferelen is een bord 20 tot 40 px breed. */
function paal(x, yTop, yBodem){
  return '<rect x="' + (x - 1.6) + '" y="' + yTop + '" width="3.2" height="' + (yBodem - yTop) +
    '" fill="var(--fg-3)"/>';
}
function bordRond(x, y, r, binnen){
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#f7fbf5" stroke="' + ROOD +
    '" stroke-width="' + (r * 0.30) + '"/>' + (binnen || '');
}
function bordBlauwVlak(x, y, b, h, binnen){
  return '<rect x="' + (x - b / 2) + '" y="' + (y - h / 2) + '" width="' + b + '" height="' + h +
    '" rx="2" fill="' + BLAUW + '" stroke="#fff" stroke-width="1.5"/>' + (binnen || '');
}
function bordWitVlak(x, y, b, h, binnen){
  return '<rect x="' + (x - b / 2) + '" y="' + (y - h / 2) + '" width="' + b + '" height="' + h +
    '" rx="2" fill="#f7fbf5" stroke="' + GRIJS + '" stroke-width="1.2"/>' + (binnen || '');
}
function bordDriehoek(x, y, b, binnen){
  var h = b * 0.87;
  return '<path d="M' + x + ' ' + (y - h / 2) + 'L' + (x + b / 2) + ' ' + (y + h / 2) + 'H' + (x - b / 2) +
    'Z" fill="#f7fbf5" stroke="' + ROOD + '" stroke-width="' + (b * 0.14) + '" stroke-linejoin="round"/>' +
    (binnen || '');
}
/* B6 staat op zijn kop en is daarom een eigen vorm, niet bordDriehoek gespiegeld. */
function bordB6(x, y, b){
  var h = b * 0.87;
  return '<path d="M' + (x - b / 2) + ' ' + (y - h / 2) + 'H' + (x + b / 2) + 'L' + x + ' ' + (y + h / 2) +
    'Z" fill="#f7fbf5" stroke="' + ROOD + '" stroke-width="' + (b * 0.15) + '" stroke-linejoin="round"/>';
}
function bordB7(x, y, r){
  var p = '', i, a;
  for(i = 0; i < 8; i++){
    a = (Math.PI / 4) * i + Math.PI / 8;
    p += (i ? 'L' : 'M') + (x + r * Math.cos(a)).toFixed(1) + ' ' + (y + r * Math.sin(a)).toFixed(1);
  }
  return '<path d="' + p + 'Z" fill="' + ROOD + '" stroke="#fff" stroke-width="1.6"/>' +
    '<text x="' + x + '" y="' + (y + r * 0.32) + '" text-anchor="middle" font-size="' + (r * 0.8) +
    '" font-weight="800" fill="#fff">STOP</text>';
}
/* B1: gele ruit met witte rand. */
function bordB1(x, y, r){
  return '<path d="M' + x + ' ' + (y - r) + 'L' + (x + r) + ' ' + y + 'L' + x + ' ' + (y + r) + 'L' + (x - r) +
    ' ' + y + 'Z" fill="#fff"/>' +
    '<path d="M' + x + ' ' + (y - r * 0.62) + 'L' + (x + r * 0.62) + ' ' + y + 'L' + x + ' ' + (y + r * 0.62) +
    'L' + (x - r * 0.62) + ' ' + y + 'Z" fill="' + GEEL + '"/>';
}
/* F5: rode pijl omhoog (jij) rechts, zwarte pijl omlaag links - zo staat hij in RVV
   bijlage 1, en de richting van de pijlen is precies waar de vraag over gaat. */
function bordF5(x, y, r){
  var pijl = function(px, op, kl){
    var t = op ? -1 : 1;
    return '<path d="M' + px + ' ' + (y + t * r * 0.55) + 'l' + (r * 0.26) + ' ' + (t * r * 0.3) +
      'h' + (-r * 0.13) + 'v' + (-t * r * 0.85) + 'h' + (-r * 0.26) + 'v' + (t * r * 0.85) +
      'h' + (-r * 0.13) + 'Z" fill="' + kl + '"/>';
  };
  return bordRond(x, y, r, '') + pijl(x + r * 0.33, true, ROOD) + pijl(x - r * 0.33, false, GRIJS);
}

/* Auto van achteren: dat is wat je als bestuurder van je voorligger ziet. */
function autoAchter(x, y, b, kleur){
  var h = b * 0.72;
  return '<g transform="translate(' + x + ' ' + y + ')">' +
    '<path d="M' + (-b / 2) + ' 0h' + b + 'v' + (-h * 0.55) + 'l' + (-b * 0.14) + ' ' + (-h * 0.45) +
    'h' + (-b * 0.72) + 'Z" fill="' + kleur + '"/>' +
    '<path d="M' + (-b * 0.3) + ' ' + (-h * 0.56) + 'h' + (b * 0.6) + 'l' + (-b * 0.07) + ' ' + (-h * 0.34) +
    'h' + (-b * 0.46) + 'Z" fill="' + GLAS + '" opacity=".9"/>' +
    '<rect x="' + (-b / 2 + b * 0.04) + '" y="' + (-h * 0.42) + '" width="' + (b * 0.16) + '" height="' +
    (h * 0.18) + '" rx="1.5" fill="#e8403f"/>' +
    '<rect x="' + (b / 2 - b * 0.2) + '" y="' + (-h * 0.42) + '" width="' + (b * 0.16) + '" height="' +
    (h * 0.18) + '" rx="1.5" fill="#e8403f"/>' +
    '</g>';
}
/* Auto van voren: de tegenligger. */
function autoVoor(x, y, b, kleur){
  var h = b * 0.72;
  return '<g transform="translate(' + x + ' ' + y + ')">' +
    '<path d="M' + (-b / 2) + ' 0h' + b + 'v' + (-h * 0.55) + 'l' + (-b * 0.14) + ' ' + (-h * 0.45) +
    'h' + (-b * 0.72) + 'Z" fill="' + kleur + '"/>' +
    '<path d="M' + (-b * 0.3) + ' ' + (-h * 0.56) + 'h' + (b * 0.6) + 'l' + (-b * 0.07) + ' ' + (-h * 0.34) +
    'h' + (-b * 0.46) + 'Z" fill="' + GLAS + '" opacity=".9"/>' +
    '<rect x="' + (-b / 2 + b * 0.05) + '" y="' + (-h * 0.4) + '" width="' + (b * 0.18) + '" height="' +
    (h * 0.16) + '" rx="2" fill="#fff6c8"/>' +
    '<rect x="' + (b / 2 - b * 0.23) + '" y="' + (-h * 0.4) + '" width="' + (b * 0.18) + '" height="' +
    (h * 0.16) + '" rx="2" fill="#fff6c8"/>' +
    '</g>';
}
/* Auto van opzij, neus naar rechts: voor parkeer- en haltetaferelen. */
function autoZij(x, y, b, kleur){
  var s = b / 72;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<path d="M5 24h62v-6c0-2.4-1.8-4.2-4.8-4.8l-7.2-6c-1.8-1.8-3.6-2.4-6-2.4H26c-3 0-4.8 1-6.6 3L14 13.2C8 14.2 5 16.2 5 19z" fill="' + kleur + '"/>' +
    '<path d="M25 7h10v6H19z" fill="' + GLAS + '" opacity=".85"/>' +
    '<path d="M37 7h7c1.6 0 2.4.5 3.6 1.7L51.2 13H37z" fill="' + GLAS + '" opacity=".85"/>' +
    '<circle cx="20" cy="25" r="6.5" fill="#222"/><circle cx="54" cy="25" r="6.5" fill="#222"/>' +
    '</g>';
}
/* Auto van bovenaf, neus naar +x, rond de oorsprong: alleen voor de bo-taferelen en
   voor animateMotion met rotate="auto". */
function autoBoven(kleur){
  return '<g><rect x="-11" y="-6" width="22" height="12" rx="3" fill="' + kleur + '"/>' +
    '<rect x="-1" y="-4.4" width="7" height="8.8" rx="2" fill="' + GLAS + '" opacity=".9"/>' +
    '<rect x="-8" y="-4.4" width="4.5" height="8.8" rx="1.5" fill="' + GLAS + '" opacity=".55"/></g>';
}
function mens(x, y, hoogte, kleur){
  var s = hoogte / 28;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<circle cx="0" cy="-23" r="5" fill="' + kleur + '"/>' +
    '<path d="M0 -18v10M-6 -13h12M0 -8l-5 8M0 -8l5 8" stroke="' + kleur + '" stroke-width="3.2" ' +
    'stroke-linecap="round" fill="none"/></g>';
}
function fietser(x, y, b, kleur){
  var s = b / 30;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<circle cx="-9" cy="0" r="7" fill="none" stroke="' + GRIJS + '" stroke-width="2"/>' +
    '<circle cx="9" cy="0" r="7" fill="none" stroke="' + GRIJS + '" stroke-width="2"/>' +
    '<path d="M-9 0l6-9h8l4 9M-3 -9h8" stroke="' + GRIJS + '" stroke-width="2" fill="none"/>' +
    '<circle cx="1" cy="-17" r="4" fill="' + kleur + '"/>' +
    '<path d="M1 -13l-4 5M1 -13l6 3" stroke="' + kleur + '" stroke-width="3" stroke-linecap="round"/></g>';
}
function tekst(x, y, grootte, inhoud, kleur, dik){
  return '<text x="' + x + '" y="' + y + '" font-size="' + grootte + '" fill="' + (kleur || 'currentColor') +
    '"' + (dik ? ' font-weight="700"' : '') + '>' + inhoud + '</text>';
}

/* Beweging. GEEN_BEWEGING staat in index.html en kan bij het laden van dit bestand nog
   niet bestaan, dus hij wordt pas bij het tekenen uitgelezen - net als sceneSVG() doet.
   Het meegegeven pad eindigt altijd op het beslismoment: staat beweging uit, dan springt
   het voertuig daar in een tik naartoe en blijft staan. */
function stil(){
  return !!window.GEEN_BEWEGING;
}
function motie(pad, dur, draai){
  var r = draai || '0';
  if(stil()){
    return '<animateMotion dur="0.001s" fill="freeze" rotate="' + r + '" path="' + pad +
      '" keyPoints="1;1" keyTimes="0;1" calcMode="linear"/>';
  }
  return '<animateMotion dur="' + dur + 's" repeatCount="indefinite" rotate="' + r + '" path="' + pad + '"/>';
}
/* Een zwaailicht dat uit gaat als beweging uit staat: knipperen is ook beweging. */
function zwaai(x, y, r, kleur){
  var c = '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + kleur + '"';
  if(stil()) return c + '/>';
  return c + '><animate attributeName="opacity" values="1;0.25;1" dur="0.6s" repeatCount="indefinite"/></circle>';
}

/* ======================= 1. GEBRUIK VAN DE WEG ======================= */

window.SITUATIES['weg-binnenkom'] = function(){
  return svgWikkel(180, 'Je rijdt de bebouwde kom binnen: aan weerszijden van de weg staat een blauw kombord met de plaatsnaam.',
    wegVooruit(180, 30, 290, 138, 182) +
    streep(160, 160, 180, STREEP, 3, '10 14') +
    /* De komborden zelf dragen het antwoord: binnen de kom geldt 50 tenzij anders. */
    paal(44, 96, 142) + bordBlauwVlak(44, 88, 60, 20, tekst(21, 92, 11, 'Zandvliet', '#fff', true)) +
    paal(278, 96, 142) + bordBlauwVlak(278, 88, 60, 20, tekst(254, 92, 11, 'Zandvliet', '#fff', true)) +
    /* Bebouwing links en rechts maakt zichtbaar dat dit geen buitenweg is. */
    '<rect x="0" y="52" width="32" height="40" fill="var(--line)"/>' +
    '<rect x="288" y="48" width="32" height="46" fill="var(--line)"/>');
};

window.SITUATIES['weg-buitenkom'] = function(){
  return svgWikkel(180, 'Tweebaansweg buiten de bebouwde kom met een rond bord 80 langs de kant.',
    wegVooruit(180, 24, 296, 136, 184) +
    streep(160, 160, 180, STREEP, 3, '12 16') +
    /* De kantstrepen horen erbij: ze maken het een weg buiten de kom en geen stadsstraat. */
    streep(140, 36, 180, STREEP, 2) + streep(180, 284, 180, STREEP, 2) +
    paal(272, 100, 150) + bordRond(272, 86, 20,
      tekst(258, 92, 17, '80', GRIJS, true)));
};

window.SITUATIES['weg-autosnelweg'] = function(){
  return svgWikkel(180, 'Autosnelweg met drie rijstroken en het blauwe bord G1 bij de oprit.',
    wegVooruit(180, 10, 310, 134, 186) +
    streep(150, 110, 180, STREEP, 3, '14 18') +
    streep(170, 212, 180, STREEP, 3, '14 18') +
    streep(133, 12, 180, STREEP, 2) + streep(187, 308, 180, STREEP, 2) +
    paal(44, 104, 150) +
    bordBlauwVlak(44, 88, 48, 36,
      /* G1 schematisch: twee gescheiden rijbanen met een viaduct erover. */
      '<path d="M28 100h32M30 100l4-22M58 100l-4-22" stroke="#fff" stroke-width="2.4" fill="none"/>' +
      '<path d="M26 82h36" stroke="#fff" stroke-width="3"/>' +
      '<path d="M30 82v8M58 82v8" stroke="#fff" stroke-width="2"/>'));
};

window.SITUATIES['weg-autoweg'] = function(){
  return svgWikkel(180, 'Autoweg met het blauwe bord G3 waarop een vooraanzicht van een auto staat.',
    wegVooruit(180, 22, 298, 136, 184) +
    streep(160, 160, 180, STREEP, 3, '12 16') +
    streep(138, 30, 180, STREEP, 2) + streep(182, 290, 180, STREEP, 2) +
    paal(46, 104, 150) +
    bordBlauwVlak(46, 88, 42, 34,
      '<path d="M32 98h28v-8l-5-9H37l-5 9z" fill="#fff"/>' +
      '<rect x="38" y="83" width="16" height="6" rx="1.5" fill="' + BLAUW + '"/>'));
};

window.SITUATIES['weg-30zone'] = function(){
  return svgWikkel(180, 'Woonstraat met een 30-kilometerzonebord en een verkeersdrempel op het wegdek.',
    wegVooruit(180, 48, 272, 142, 178) +
    /* De drempel is de tweede aanwijzing naast het bord: hier wordt 30 ook afgedwongen. */
    '<path d="M70 150h180l10 14H60Z" fill="#d8d2c6"/>' +
    '<path d="M70 150h30l-10 14H60ZM130 150h30l-10 14h-30ZM190 150h30l-10 14h-30Z" fill="' + GRIJS + '"/>' +
    paal(266, 108, 152) +
    bordWitVlak(266, 88, 46, 54,
      '<circle cx="266" cy="78" r="16" fill="#f7fbf5" stroke="' + ROOD + '" stroke-width="4.5"/>' +
      tekst(256, 84, 15, '30', GRIJS, true) +
      tekst(252, 106, 11, 'zone', GRIJS, true)) +
    '<rect x="0" y="54" width="40" height="46" fill="var(--line)"/>' +
    '<rect x="282" y="56" width="38" height="44" fill="var(--line)"/>');
};

window.SITUATIES['weg-inhalen-streep'] = function(){
  return svgWikkel(180, 'Weg met in het midden een doorgetrokken streep aan jouw kant en een onderbroken streep daarnaast.',
    wegVooruit(180, 20, 300, 136, 184) +
    /* De streep die het dichtst bij jou ligt telt; die ligt hier rechts van het paar. */
    streep(157, 142, 180, STREEP, 3, '12 16') +
    streep(163, 176, 180, STREEP, 4) +
    streep(136, 26, 180, STREEP, 2) + streep(184, 294, 180, STREEP, 2) +
    autoAchter(214, 150, 54, '#2f6bbf') +
    tekst(8, 20, 11, 'jouw kant van de weg is rechts', 'currentColor'));
};

window.SITUATIES['weg-inhalen-vrij'] = function(){
  return svgWikkel(180, 'Weg met een onderbroken middenstreep; in de verte komt een tegenligger aan.',
    wegVooruit(180, 20, 300, 136, 184) +
    streep(160, 160, 180, STREEP, 3, '12 16') +
    streep(136, 26, 180, STREEP, 2) + streep(184, 294, 180, STREEP, 2) +
    autoAchter(216, 148, 52, '#2f6bbf') +
    autoVoor(146, 84, 16, '#b64b4b'));
};

window.SITUATIES['weg-voorsorteren'] = function(){
  return svgWikkel(180, 'Voorsorteervakken met pijlen op het wegdek: linksaf, rechtdoor en rechtsaf.',
    wegVooruit(180, 10, 310, 132, 188) +
    streep(146, 86, 180, STREEP, 3) + streep(174, 234, 180, STREEP, 3) +
    /* De pijlen op het asfalt bepalen het antwoord, dus ze staan groot en apart. */
    '<path d="M60 170l-14-12 14-12v7h18v10H60Z" fill="' + STREEP + '"/>' +
    '<path d="M160 146l12 14h-7v12h-10v-12h-7Z" fill="' + STREEP + '"/>' +
    '<path d="M258 170l14-12-14-12v7h-18v10h18Z" fill="' + STREEP + '"/>' +
    tekst(8, 20, 11, 'kruispunt met drie voorsorteervakken', 'currentColor'));
};

window.SITUATIES['weg-parkeren-blauw'] = function(){
  return svgWikkel(180, 'Blauwe zone met parkeervakken met blauwe strepen en een bord parkeerschijf verplicht.',
    '<rect x="0" y="0" width="320" height="' + HORIZON + '" fill="var(--surface-2)"/>' +
    '<rect x="0" y="' + HORIZON + '" width="320" height="108" fill="' + ASFALT + '"/>' +
    '<rect x="0" y="118" width="320" height="6" fill="#b9c0cb"/>' +
    /* De blauwe vakstrepen zeggen samen met het bord dat hier een schijf nodig is. */
    '<path d="M30 124v34M110 124v34M190 124v34M270 124v34M20 158h260" stroke="#2f6bbf" ' +
    'stroke-width="3" fill="none"/>' +
    autoZij(36, 118, 70, '#6f7f94') + autoZij(196, 118, 70, '#8a6f9c') +
    paal(288, 96, 124) +
    bordBlauwVlak(288, 80, 44, 44,
      tekst(281, 76, 20, 'P', '#fff', true) +
      '<circle cx="288" cy="90" r="7" fill="#fff"/>' +
      '<path d="M288 90l0-5M288 90l4 2" stroke="' + BLAUW + '" stroke-width="1.6"/>') +
    tekst(8, 20, 11, 'blauwe zone', 'currentColor', true));
};

window.SITUATIES['weg-parkeren-stoep'] = function(){
  return svgWikkel(170, 'Een auto staat met twee wielen op de stoep geparkeerd; de stoeprand is duidelijk zichtbaar.',
    '<rect x="0" y="0" width="320" height="76" fill="var(--surface-2)"/>' +
    '<rect x="0" y="76" width="320" height="94" fill="' + ASFALT + '"/>' +
    /* De stoeprand staat expres hoog in beeld: of de auto erop staat is de hele vraag. */
    '<rect x="0" y="86" width="320" height="30" fill="#b9c0cb"/>' +
    '<rect x="0" y="116" width="320" height="6" fill="#8d95a1"/>' +
    '<path d="M0 100h320" stroke="#a2aab6" stroke-width="1.5" stroke-dasharray="14 10"/>' +
    autoZij(96, 96, 130, '#2f6bbf') +
    mens(286, 112, 32, 'currentColor') +
    tekst(8, 164, 11, 'de voorwielen staan op het trottoir', '#fff'));
};

window.SITUATIES['weg-parkeren-uitrit'] = function(){
  return svgWikkel(170, 'Een auto staat geparkeerd voor een uitrit met verlaagde stoepbanden.',
    '<rect x="0" y="0" width="320" height="70" fill="var(--surface-2)"/>' +
    '<rect x="0" y="70" width="320" height="100" fill="' + ASFALT + '"/>' +
    '<rect x="0" y="78" width="320" height="26" fill="#b9c0cb"/>' +
    /* De uitrit herken je aan de schuin aflopende banden; daar staat de auto voor. */
    '<path d="M118 78h84l-10 26h-64Z" fill="#9aa2ae"/>' +
    '<rect x="128" y="40" width="64" height="40" fill="var(--line)"/>' +
    '<rect x="150" y="56" width="20" height="24" fill="var(--fg-3)"/>' +
    autoZij(120, 104, 110, '#b64b4b') +
    tekst(8, 162, 11, 'de auto staat voor de uitrit van het pand', '#fff'));
};

window.SITUATIES['weg-stilstaan-bocht'] = function(){
  return svgWikkel(180, 'Een auto staat stil vlak voor een onoverzichtelijke bocht; achter de bocht is de weg niet te zien.',
    '<rect x="0" y="0" width="320" height="' + HORIZON + '" fill="var(--surface-2)"/>' +
    '<rect x="0" y="' + HORIZON + '" width="320" height="108" fill="' + BERM + '"/>' +
    /* De weg buigt achter de begroeiing weg: daardoor is zichtbaar dat je hier niet
       van ver te zien bent. */
    '<path d="M60 180C70 130 120 96 190 88l40-4 10 10-44 6C140 110 104 138 96 180Z" fill="' + ASFALT + '"/>' +
    '<path d="M110 180c10-40 48-70 104-80" stroke="' + STREEP + '" stroke-width="3" ' +
    'stroke-dasharray="10 14" fill="none"/>' +
    '<path d="M236 76c26-6 50-2 66 10v38c-28-22-60-30-92-26Z" fill="var(--line)"/>' +
    autoZij(104, 150, 104, '#2f6bbf') +
    tekst(8, 20, 11, 'je staat stil vlak voor de bocht', 'currentColor'));
};

window.SITUATIES['weg-gehandicapt'] = function(){
  return svgWikkel(170, 'Parkeervak met bord E6: een blauw bord met een witte P en het rolstoelsymbool.',
    '<rect x="0" y="0" width="320" height="70" fill="var(--surface-2)"/>' +
    '<rect x="0" y="70" width="320" height="100" fill="' + ASFALT + '"/>' +
    '<path d="M60 90v70M240 90v70M50 160h200" stroke="' + STREEP + '" stroke-width="3" fill="none"/>' +
    /* Het rolstoelsymbool op het wegdek en op het bord: samen dragen ze het antwoord. */
    '<g transform="translate(150 126) scale(1.3)" opacity=".85">' +
    '<circle cx="0" cy="-10" r="3.4" fill="' + STREEP + '"/>' +
    '<circle cx="0" cy="4" r="9" fill="none" stroke="' + STREEP + '" stroke-width="2.6"/>' +
    '<path d="M-2 -6v8h8" stroke="' + STREEP + '" stroke-width="2.6" fill="none"/></g>' +
    paal(286, 84, 120) +
    bordBlauwVlak(286, 64, 46, 46,
      tekst(276, 58, 20, 'P', '#fff', true) +
      '<g transform="translate(286 74) scale(0.8)">' +
      '<circle cx="0" cy="-8" r="2.6" fill="#fff"/>' +
      '<circle cx="0" cy="2" r="7" fill="none" stroke="#fff" stroke-width="2.2"/>' +
      '<path d="M-2 -5v6h6" stroke="#fff" stroke-width="2.2" fill="none"/></g>'));
};

window.SITUATIES['weg-rijstrook-kruis'] = function(){
  return svgWikkel(180, 'Signaalgevers boven de snelweg: een rood kruis boven de middelste rijstrook en groene pijlen boven de andere.',
    wegVooruit(180, 10, 310, 134, 186) +
    streep(150, 110, 180, STREEP, 3, '14 18') +
    streep(170, 212, 180, STREEP, 3, '14 18') +
    /* Het portaal staat laag genoeg om de drie signalen groot te kunnen tonen. */
    '<rect x="0" y="34" width="320" height="8" fill="var(--fg-3)"/>' +
    '<rect x="8" y="42" width="6" height="40" fill="var(--fg-3)"/>' +
    '<rect x="306" y="42" width="6" height="40" fill="var(--fg-3)"/>' +
    '<rect x="68" y="42" width="40" height="34" rx="3" fill="#15191f"/>' +
    '<path d="M76 50l24 18M100 50l-24 18" stroke="#2b9c57" stroke-width="0"/>' +
    '<path d="M78 52l20 14M98 52l-20 14" stroke="' + GROEN + '" stroke-width="0"/>' +
    '<path d="M88 70l-10-12h6v-8h8v8h6Z" fill="' + GROEN + '"/>' +
    '<rect x="140" y="42" width="40" height="34" rx="3" fill="#15191f"/>' +
    '<path d="M148 50l24 18M172 50l-24 18" stroke="#e8403f" stroke-width="5" stroke-linecap="round"/>' +
    '<rect x="212" y="42" width="40" height="34" rx="3" fill="#15191f"/>' +
    '<path d="M232 70l-10-12h6v-8h8v8h6Z" fill="' + GROEN + '"/>');
};

window.SITUATIES['weg-invoegen'] = function(){
  /* Animatie: jouw auto rijdt over de invoegstrook naar het punt waar de strook eindigt.
     Daar valt de beslissing, dus daar stopt het pad - en daar staat hij stil als de
     gebruiker beweging uit heeft. */
  var pad = 'M296 176L250 150L214 136';
  return svgWikkel(185, 'Je rijdt over de invoegstrook naar de snelweg; op de rechterrijstrook rijdt al een auto.',
    wegVooruit(185, 40, 300, 140, 184) +
    '<path d="M186 ' + HORIZON + 'L320 150v35L250 185Z" fill="' + ASFALT + '"/>' +
    streep(160, 134, 185, STREEP, 3, '14 18') +
    streep(184, 250, 185, STREEP, 3, '18 12') +
    autoAchter(176, 118, 32, '#6f7f94') +
    '<g>' + autoBoven('#2f6bbf') + motie(pad, 3.2, 'auto') + '</g>' +
    tekst(8, 20, 11, 'de invoegstrook loopt dood op het eind', 'currentColor'));
};

window.SITUATIES['weg-busstrook'] = function(){
  return svgWikkel(180, 'Weg met rechts een busstrook met het opschrift LIJNBUS, gescheiden door een doorgetrokken streep.',
    wegVooruit(180, 14, 306, 134, 186) +
    streep(146, 96, 180, STREEP, 3, '14 18') +
    streep(172, 226, 180, STREEP, 4) +
    /* Het opschrift op het asfalt is het verkeersteken; zonder dat is het zomaar een strook. */
    '<text x="268" y="166" font-size="15" font-weight="800" fill="' + STREEP + '" text-anchor="middle" ' +
    'transform="rotate(-6 268 166)">LIJNBUS</text>' +
    '<rect x="238" y="92" width="34" height="30" rx="3" fill="#b64b4b"/>' +
    '<rect x="243" y="96" width="24" height="12" rx="2" fill="' + GLAS + '"/>');
};

/* ======================= 2. VOORRANG ======================= */

/* De bo-taferelen zijn van bovenaf, net als de bestaande puzzels: op een kruispunt is
   dat het enige aanzicht waarin alle vier de takken tegelijk te zien zijn. */
function kruisBoven(hoogte){
  var h = hoogte;
  return '<rect x="0" y="0" width="320" height="' + h + '" fill="var(--surface-2)"/>' +
    '<rect x="0" y="' + (h / 2 - 34) + '" width="320" height="68" fill="' + ASFALT + '"/>' +
    '<rect x="126" y="0" width="68" height="' + h + '" fill="' + ASFALT + '"/>' +
    '<path d="M0 ' + (h / 2) + 'h110M210 ' + (h / 2) + 'h110" stroke="' + STREEP + '" stroke-width="2" ' +
    'stroke-dasharray="12 10"/>' +
    '<path d="M160 0v' + (h / 2 - 40) + 'M160 ' + (h / 2 + 40) + 'V' + h + '" stroke="' + STREEP +
    '" stroke-width="2" stroke-dasharray="12 10"/>';
}
/* Haaientanden als rij driehoekjes die naar jou wijzen. */
function haaientanden(x, y, aantal, richting){
  var s = '', i, bx;
  for(i = 0; i < aantal; i++){
    bx = x + i * 9;
    s += '<path d="M' + bx + ' ' + y + 'h7l-3.5 ' + (richting * 7) + 'Z" fill="' + STREEP + '"/>';
  }
  return s;
}

window.SITUATIES['bo-gelijk-kruis'] = function(){
  /* Geen borden en geen tanden: dat is het punt van dit tafereel. De drie voertuigen
     rijden naar hun stopplek toe en staan daar stil zodra beweging uit staat. */
  return svgWikkel(220, 'Gelijkwaardig kruispunt van bovenaf zonder borden; drie voertuigen naderen het kruispunt, jij komt van onderen.',
    kruisBoven(220) +
    '<g>' + autoBoven('#2f6bbf') + motie('M176 220L176 160', 2.6, 'auto') + '</g>' +
    '<g>' + autoBoven('#b64b4b') + motie('M0 128L104 128', 2.6, 'auto') + '</g>' +
    '<g>' + autoBoven('#e0a21c') + motie('M320 92L216 92', 2.6, 'auto') + '</g>' +
    tekst(182, 198, 11, 'jij', '#fff', true) +
    tekst(10, 118, 11, 'links', '#fff', true) +
    tekst(282, 82, 11, 'rechts', '#fff', true));
};

window.SITUATIES['bo-haaientanden'] = function(){
  return svgWikkel(220, 'Kruispunt van bovenaf met haaientanden dwars over jouw tak, onderaan.',
    kruisBoven(220) +
    /* De tanden liggen op jouw tak en wijzen naar jou: jij verleent voorrang. */
    haaientanden(130, 152, 7, 1) +
    '<g transform="translate(176 186)">' + autoBoven('#2f6bbf') + '</g>' +
    '<g transform="translate(60 128)">' + autoBoven('#b64b4b') + '</g>' +
    tekst(182, 212, 11, 'jij', '#fff', true) +
    tekst(118, 186, 11, 'haaientanden', '#fff', true));
};

window.SITUATIES['bo-rotonde'] = function(){
  /* Haaientanden bij elke oprit: dat bepaalt dat het verkeer op de rotonde voorgaat.
     Het rijdende voertuig op de rotonde laat zien waar het om gaat. */
  var ring = 'M160 50a60 60 0 1 1-0.1 0';
  return svgWikkel(230, 'Rotonde van bovenaf met haaientanden bij elke oprit; op de rotonde rijdt een auto.',
    '<rect x="0" y="0" width="320" height="230" fill="var(--surface-2)"/>' +
    '<rect x="128" y="170" width="64" height="60" fill="' + ASFALT + '"/>' +
    '<rect x="128" y="0" width="64" height="58" fill="' + ASFALT + '"/>' +
    '<rect x="0" y="83" width="58" height="64" fill="' + ASFALT + '"/>' +
    '<rect x="262" y="83" width="58" height="64" fill="' + ASFALT + '"/>' +
    '<circle cx="160" cy="115" r="76" fill="' + ASFALT + '"/>' +
    '<circle cx="160" cy="115" r="40" fill="' + BERM + '"/>' +
    haaientanden(132, 178, 6, -1) +
    haaientanden(132, 52, 6, 1) +
    tekst(126, 216, 11, 'jij nadert', '#fff', true) +
    '<g>' + autoBoven('#b64b4b') + motie(ring, 5, 'auto') + '</g>' +
    '<g transform="translate(176 206)">' + autoBoven('#2f6bbf') + '</g>');
};

window.SITUATIES['voorrang-b6'] = function(){
  return svgWikkel(185, 'Je nadert een kruispunt; rechts staat bord B6 en op het wegdek liggen haaientanden.',
    wegVooruit(185, 40, 290, 138, 182) +
    '<rect x="0" y="96" width="320" height="30" fill="' + ASFALT + '"/>' +
    streep(160, 160, 148, STREEP, 3, '10 14') +
    /* Bord en tanden samen: het bord alleen zou in de verte nauwelijks leesbaar zijn. */
    haaientanden(74, 140, 18, 1) +
    paal(284, 100, 150) + bordB6(284, 86, 40) +
    autoVoor(60, 118, 30, '#b64b4b'));
};

window.SITUATIES['voorrang-b7'] = function(){
  return svgWikkel(185, 'Kruispunt met het achthoekige stopbord en een brede witte stopstreep dwars over jouw rijstrook.',
    wegVooruit(185, 40, 290, 138, 182) +
    '<rect x="0" y="96" width="320" height="30" fill="' + ASFALT + '"/>' +
    streep(160, 160, 140, STREEP, 3, '10 14') +
    /* De stopstreep is de plek waar je moet stoppen; die moet dus echt in beeld. */
    '<path d="M68 144h186l8 12H60Z" fill="' + STREEP + '"/>' +
    paal(284, 100, 150) + bordB7(284, 84, 22));
};

window.SITUATIES['voorrang-voorrangsweg'] = function(){
  return svgWikkel(185, 'Je rijdt op een voorrangsweg: rechts staat de gele ruit, de zijweg heeft haaientanden.',
    wegVooruit(185, 40, 290, 138, 182) +
    '<rect x="0" y="100" width="320" height="28" fill="' + ASFALT + '"/>' +
    streep(160, 160, 185, STREEP, 3, '10 14') +
    /* De tanden liggen op de zijweg, niet op de jouwe: daarom liggen ze verticaal. */
    '<path d="M44 102h7l-3.5 7ZM44 112h7l-3.5 7ZM274 102h7l-3.5 7ZM274 112h7l-3.5 7Z" fill="' + STREEP + '"/>' +
    paal(282, 102, 150) + bordB1(282, 84, 22));
};

window.SITUATIES['voorrang-tram'] = function(){
  return svgWikkel(185, 'Een tram nadert van links over rails die het kruispunt oversteken.',
    wegVooruit(185, 36, 292, 138, 182) +
    '<rect x="0" y="92" width="320" height="38" fill="' + ASFALT + '"/>' +
    '<path d="M0 104h320M0 116h320" stroke="#8d95a1" stroke-width="2.5"/>' +
    streep(160, 160, 150, STREEP, 3, '10 14') +
    /* De tram staat links en rijdt naar rechts; de rails maken duidelijk dat het geen bus is. */
    '<g transform="translate(26 82)">' +
    '<rect x="0" y="0" width="76" height="34" rx="5" fill="#d8d2c6"/>' +
    '<rect x="56" y="5" width="16" height="14" rx="2" fill="' + GLAS + '"/>' +
    '<rect x="6" y="5" width="42" height="14" rx="2" fill="' + GLAS + '" opacity=".7"/>' +
    '<rect x="0" y="22" width="76" height="5" fill="' + ROOD + '"/>' +
    '<circle cx="18" cy="36" r="4" fill="#222"/><circle cx="60" cy="36" r="4" fill="#222"/></g>');
};

window.SITUATIES['voorrang-zebra'] = function(){
  return svgWikkel(185, 'Zebrapad dwars over de weg met een voetganger die staat te wachten op de stoep.',
    wegVooruit(185, 30, 296, 138, 182) +
    /* De strepen staan in perspectief: breder naar voren toe, zoals je ze echt ziet. */
    '<path d="M64 150h22l-8 24H52ZM102 150h22l-6 24H94ZM140 150h22l-4 24h-24ZM178 150h22l-2 24h-24Z' +
    'M216 150h22l0 24h-24Z" fill="' + STREEP + '"/>' +
    '<rect x="252" y="146" width="68" height="12" fill="#b9c0cb"/>' +
    mens(276, 146, 44, 'currentColor') +
    tekst(8, 20, 11, 'de voetganger wil oversteken', 'currentColor'));
};

window.SITUATIES['voorrang-afslaan-voet'] = function(){
  return svgWikkel(185, 'Je slaat rechtsaf; op de zijweg steekt een voetganger over.',
    wegVooruit(185, 46, 268, 140, 180) +
    '<path d="M200 98h120v44H178Z" fill="' + ASFALT + '"/>' +
    /* De pijl op jouw rijstrook zegt wat jij doet; de voetganger staat op de weg die je inrijdt. */
    '<path d="M150 176l0-20h22v-8l16 12-16 12v-8h-14v12Z" fill="' + STREEP + '"/>' +
    mens(248, 134, 40, 'currentColor') +
    '<path d="M256 112v20" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/>' +
    '<path d="M256 108l-5 8h10Z" fill="currentColor"/>' +
    tekst(8, 20, 11, 'je gaat rechtsaf die zijweg in', 'currentColor'));
};

window.SITUATIES['voorrang-uitrit'] = function(){
  return svgWikkel(185, 'Je rijdt een uitrit uit; voor je ligt een rood fietspad waarop een fietser nadert.',
    '<rect x="0" y="0" width="320" height="64" fill="var(--surface-2)"/>' +
    '<rect x="0" y="64" width="320" height="121" fill="' + BERM + '"/>' +
    /* De verlaagde band onderin maakt het een uitrit en geen zijweg; dat verschil is de vraag. */
    '<path d="M96 185h128l-18-66h-92Z" fill="#9aa2ae"/>' +
    '<rect x="0" y="100" width="320" height="26" fill="' + FIETSROOD + '"/>' +
    '<rect x="0" y="76" width="320" height="24" fill="' + ASFALT + '"/>' +
    '<path d="M0 126h320" stroke="' + STREEP + '" stroke-width="2" stroke-dasharray="10 8"/>' +
    fietser(82, 118, 46, '#2b6cb0') +
    tekst(8, 20, 11, 'je komt uit de uitrit', 'currentColor'));
};

window.SITUATIES['voorrang-bus'] = function(){
  /* Binnen de kom: het kombord staat erbij, want buiten de kom geldt de busregel niet.
     De bus draait zijn richtingaanwijzer aan en komt tot aan het punt waar hij invoegt. */
  var pad = 'M30 0L54 0';
  return svgWikkel(185, 'Binnen de bebouwde kom wil een lijnbus van de halte wegrijden; zijn richtingaanwijzer knippert.',
    wegVooruit(185, 24, 298, 136, 184) +
    streep(160, 160, 185, STREEP, 3, '12 16') +
    '<rect x="0" y="118" width="130" height="10" fill="#b9c0cb"/>' +
    paal(20, 86, 120) + bordBlauwVlak(20, 78, 36, 14, '') +
    '<g>' +
    '<g transform="translate(-30 0)">' +
    '<rect x="40" y="96" width="112" height="44" rx="5" fill="#d8d2c6"/>' +
    '<rect x="128" y="101" width="18" height="16" rx="2" fill="' + GLAS + '"/>' +
    '<rect x="46" y="101" width="72" height="16" rx="2" fill="' + GLAS + '" opacity=".7"/>' +
    '<rect x="40" y="122" width="112" height="6" fill="' + GROEN + '"/>' +
    tekst(48, 136, 10, 'LIJNBUS', GRIJS, true) +
    '<circle cx="62" cy="142" r="5" fill="#222"/><circle cx="134" cy="142" r="5" fill="#222"/>' +
    zwaai(150, 120, 4, ORANJE) +
    '</g>' + motie(pad, 2, '0') + '</g>' +
    tekst(8, 20, 11, 'bebouwde kom, de bus geeft richting aan', 'currentColor'));
};

window.SITUATIES['voorrang-hulpdienst'] = function(){
  /* Van achteren gezien: de ambulance nadert en komt tot vlak achter je. Het beslismoment
     is als hij in je spiegel staat, dus daar eindigt het pad. */
  var pad = 'M0 -40L0 0';
  return svgWikkel(185, 'In je achteruitkijkspiegel nadert een ambulance met zwaailicht van achteren.',
    wegVooruit(185, 24, 298, 136, 184) +
    streep(160, 160, 185, STREEP, 3, '12 16') +
    /* De spiegelrand eromheen zegt dat je naar achteren kijkt en niet vooruit. */
    '<rect x="40" y="26" width="240" height="120" rx="14" fill="none" stroke="currentColor" stroke-width="3"/>' +
    '<g>' +
    '<g transform="translate(0 -20)">' +
    '<rect x="112" y="92" width="96" height="52" rx="6" fill="#f2f4f7"/>' +
    '<rect x="122" y="100" width="76" height="20" rx="3" fill="' + GLAS + '"/>' +
    '<rect x="112" y="126" width="96" height="7" fill="' + ROOD + '"/>' +
    zwaai(132, 88, 6, '#2f6bbf') + zwaai(188, 88, 6, '#2f6bbf') +
    '</g>' + motie(pad, 2.4, '0') + '</g>' +
    tekst(48, 164, 11, 'achteruitkijkspiegel', 'currentColor'));
};

window.SITUATIES['voorrang-smalweg'] = function(){
  return svgWikkel(185, 'Smalle doorgang met bord F5 en een tegenligger die al in de versmalling rijdt.',
    wegVooruit(185, 50, 270, 142, 178) +
    /* De versmalling zelf plus het bord: zonder de obstakels zou het bord in de lucht hangen. */
    '<rect x="112" y="96" width="14" height="40" fill="var(--line)"/>' +
    '<rect x="194" y="96" width="14" height="40" fill="var(--line)"/>' +
    '<path d="M126 136l-26 49M194 136l26 49" stroke="' + STREEP + '" stroke-width="3"/>' +
    autoVoor(160, 120, 36, '#b64b4b') +
    paal(272, 104, 158) + bordF5(272, 86, 22));
};

/* ======================= 3. BIJZONDERE WEGEN EN MANOEUVRES ======================= */

window.SITUATIES['bijz-erf'] = function(){
  return svgWikkel(185, 'Je rijdt een erf binnen: het blauwe erfbord staat rechts en er spelen kinderen op de klinkers.',
    '<rect x="0" y="0" width="320" height="' + HORIZON + '" fill="var(--surface-2)"/>' +
    '<rect x="0" y="' + HORIZON + '" width="320" height="113" fill="#8a6f5e"/>' +
    /* Klinkers in plaats van asfalt: op een erf is er geen rijbaan apart van het trottoir. */
    '<path d="M0 100h320M0 128h320M0 158h320" stroke="#6f5a4c" stroke-width="2"/>' +
    '<path d="M40 100v85M110 100v85M190 100v85M268 100v85" stroke="#6f5a4c" stroke-width="2"/>' +
    mens(116, 150, 34, 'currentColor') + mens(146, 158, 38, 'currentColor') +
    '<circle cx="176" cy="160" r="7" fill="' + ORANJE + '"/>' +
    '<rect x="0" y="40" width="46" height="40" fill="var(--line)"/>' +
    paal(282, 102, 152) +
    bordBlauwVlak(282, 80, 48, 46,
      '<rect x="264" y="84" width="36" height="12" fill="#fff" opacity=".35"/>' +
      '<path d="M270 84h26l-4-10h-18Z" fill="#fff"/>' +
      '<circle cx="276" cy="68" r="3.4" fill="#fff"/><circle cx="290" cy="70" r="3" fill="#fff"/>'));
};

window.SITUATIES['bijz-erf-uit'] = function(){
  return svgWikkel(185, 'Je verlaat het erf: het bord einde erf staat rechts, voor je ligt een gewone rijbaan.',
    '<rect x="0" y="0" width="320" height="' + HORIZON + '" fill="var(--surface-2)"/>' +
    '<rect x="0" y="' + HORIZON + '" width="320" height="113" fill="#8a6f5e"/>' +
    '<path d="M0 140h320M70 140v45M160 140v45M250 140v45" stroke="#6f5a4c" stroke-width="2"/>' +
    '<rect x="0" y="' + HORIZON + '" width="320" height="52" fill="' + ASFALT + '"/>' +
    '<path d="M0 100h320" stroke="' + STREEP + '" stroke-width="2" stroke-dasharray="12 10"/>' +
    paal(282, 104, 152) +
    bordBlauwVlak(282, 82, 48, 46,
      '<rect x="264" y="86" width="36" height="12" fill="#fff" opacity=".35"/>' +
      '<path d="M270 86h26l-4-10h-18Z" fill="#fff"/>' +
      '<circle cx="276" cy="70" r="3.4" fill="#fff"/><circle cx="290" cy="72" r="3" fill="#fff"/>' +
      /* De rode streep over het bord is het enige verschil met G5 en dus het antwoord. */
      '<path d="M258 104L306 60" stroke="' + ROOD + '" stroke-width="4"/>'));
};

window.SITUATIES['bijz-overweg-and'] = function(){
  return svgWikkel(185, 'Onbewaakte spoorwegovergang met alleen een andreaskruis; er zijn geen bomen en geen lichten.',
    wegVooruit(185, 36, 292, 138, 182) +
    '<rect x="0" y="112" width="320" height="26" fill="#6f6257"/>' +
    '<path d="M0 118h320M0 132h320" stroke="#8d95a1" stroke-width="3"/>' +
    streep(160, 160, 112, STREEP, 3, '10 14') +
    paal(272, 76, 150) +
    /* Enkel kruis = enkelspoor; de vraag gaat vaak precies over dat onderscheid. */
    '<g transform="translate(272 62)">' +
    '<path d="M-26 -9L26 9M-26 9L26 -9" stroke="#f7fbf5" stroke-width="12" stroke-linecap="round"/>' +
    '<path d="M-26 -9L26 9M-26 9L26 -9" stroke="' + ROOD + '" stroke-width="5" stroke-linecap="round"/>' +
    '</g>');
};

window.SITUATIES['bijz-overweg-licht'] = function(){
  return svgWikkel(185, 'Spoorwegovergang met gesloten bomen en twee rode knipperlichten.',
    wegVooruit(185, 36, 292, 138, 182) +
    '<rect x="0" y="116" width="320" height="24" fill="#6f6257"/>' +
    '<path d="M0 122h320M0 134h320" stroke="#8d95a1" stroke-width="3"/>' +
    /* De gesloten boom is het beslissende detail en loopt daarom helemaal over de rijbaan. */
    '<rect x="36" y="100" width="212" height="10" rx="3" fill="#f2f4f7"/>' +
    '<rect x="36" y="100" width="36" height="10" fill="' + ROOD + '"/>' +
    '<rect x="108" y="100" width="36" height="10" fill="' + ROOD + '"/>' +
    '<rect x="180" y="100" width="36" height="10" fill="' + ROOD + '"/>' +
    paal(262, 62, 150) +
    '<rect x="238" y="56" width="48" height="20" rx="6" fill="#15191f"/>' +
    zwaai(250, 66, 7, '#e8403f') + zwaai(274, 66, 7, '#e8403f'));
};

window.SITUATIES['bijz-tunnel'] = function(){
  return svgWikkel(185, 'Je nadert een tunnel met het tunnelbord en verlichting in de tunnelbuis.',
    '<rect x="0" y="0" width="320" height="' + HORIZON + '" fill="var(--surface-2)"/>' +
    '<rect x="0" y="' + HORIZON + '" width="320" height="113" fill="' + BERM + '"/>' +
    '<path d="M40 185V110a120 70 0 0 1 240 0v75Z" fill="var(--line)"/>' +
    '<path d="M70 185V116a90 56 0 0 1 180 0v69Z" fill="#1b2027"/>' +
    '<rect x="70" y="150" width="180" height="35" fill="' + ASFALT + '"/>' +
    /* De lampjes in de buis laten zien dat het echt een tunnel is en geen viaduct. */
    '<circle cx="104" cy="132" r="3" fill="#fff6c8"/><circle cx="140" cy="124" r="3" fill="#fff6c8"/>' +
    '<circle cx="180" cy="124" r="3" fill="#fff6c8"/><circle cx="216" cy="132" r="3" fill="#fff6c8"/>' +
    '<path d="M160 185v-22" stroke="' + STREEP + '" stroke-width="3" stroke-dasharray="8 8"/>' +
    paal(292, 86, 160) +
    bordBlauwVlak(292, 68, 44, 36,
      '<path d="M276 84V72a16 12 0 0 1 32 0v12Z" fill="#fff"/>' +
      '<rect x="286" y="76" width="12" height="8" fill="' + BLAUW + '"/>'));
};

window.SITUATIES['bijz-fietsstrook'] = function(){
  return svgWikkel(185, 'Weg met rechts een rode fietsstrook met een onderbroken streep en een fietssymbool.',
    wegVooruit(185, 14, 306, 134, 186) +
    /* Onderbroken streep: dat maakt het een fietsstrook en geen vrijliggend fietspad. */
    '<path d="M186 ' + HORIZON + 'L306 185H238L180 ' + HORIZON + 'Z" fill="' + FIETSROOD + '"/>' +
    streep(180, 238, 185, STREEP, 3, '14 12') +
    streep(150, 110, 185, STREEP, 3, '14 18') +
    '<g transform="translate(252 158) scale(1.1)">' +
    '<circle cx="-9" cy="0" r="7" fill="none" stroke="' + STREEP + '" stroke-width="2.4"/>' +
    '<circle cx="9" cy="0" r="7" fill="none" stroke="' + STREEP + '" stroke-width="2.4"/>' +
    '<path d="M-9 0l6-9h8l4 9M-3 -9h8" stroke="' + STREEP + '" stroke-width="2.4" fill="none"/></g>');
};

window.SITUATIES['bijz-keren'] = function(){
  return svgWikkel(185, 'Brede weg zonder middenberm; de boog laat zien hoe je hier zou keren, in de verte komt verkeer aan.',
    wegVooruit(185, 10, 310, 132, 188) +
    streep(160, 160, 185, STREEP, 3, '12 16') +
    streep(134, 16, 185, STREEP, 2) + streep(186, 304, 185, STREEP, 2) +
    /* De keerboog is een overlay in oranje: hij hoort niet bij het wegdek maar toont de
       manoeuvre waar de vraag over gaat. */
    '<path d="M214 178C214 130 110 128 86 168" stroke="' + ORANJE + '" stroke-width="4" fill="none" ' +
    'stroke-dasharray="10 7"/>' +
    '<path d="M86 168l12-2-6 11Z" fill="' + ORANJE + '"/>' +
    autoVoor(150, 92, 20, '#b64b4b') +
    tekst(8, 20, 11, 'in een keer keren op de rijbaan', 'currentColor'));
};

window.SITUATIES['bijz-achteruit'] = function(){
  return svgWikkel(185, 'Je rijdt achteruit een parkeervak uit; achter je loopt een voetganger langs.',
    '<rect x="0" y="0" width="320" height="56" fill="var(--surface-2)"/>' +
    '<rect x="0" y="56" width="320" height="129" fill="' + ASFALT + '"/>' +
    /* Blik door de achterruit: de raamstijlen laten zien waarom je zo weinig ziet. */
    '<path d="M0 185V56h320v129Z" fill="none"/>' +
    '<path d="M44 90v95M276 90v95M30 90h260" stroke="' + STREEP + '" stroke-width="3" fill="none"/>' +
    autoZij(188, 96, 90, '#6f7f94') +
    mens(96, 150, 48, 'currentColor') +
    '<path d="M76 150h-40" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4"/>' +
    '<rect x="0" y="0" width="320" height="30" fill="var(--fg-3)" opacity=".5"/>' +
    tekst(10, 20, 11, 'zicht door de achterruit', '#fff', true));
};

window.SITUATIES['bijz-file'] = function(){
  /* Filerijden met een vrije middenstrook: de voertuigen schuiven naar links en rechts
     uiteen en de hulpdienst rijdt ertussendoor. Staat beweging uit, dan staat de gang
     open en de ambulance erin - dat is het beslismoment. */
  var pad = 'M160 185L160 100';
  return svgWikkel(190, 'File op de snelweg van bovenaf: de rijen zijn uiteengeweken zodat er in het midden een vrije doorgang is.',
    '<rect x="0" y="0" width="320" height="190" fill="var(--surface-2)"/>' +
    '<rect x="40" y="0" width="240" height="190" fill="' + ASFALT + '"/>' +
    '<path d="M160 0v190" stroke="' + STREEP + '" stroke-width="2" stroke-dasharray="12 10" opacity=".4"/>' +
    '<path d="M46 0v190M274 0v190" stroke="' + STREEP + '" stroke-width="2"/>' +
    '<g transform="translate(96 40) rotate(-90)">' + autoBoven('#6f7f94') + '</g>' +
    '<g transform="translate(96 92) rotate(-90)">' + autoBoven('#b64b4b') + '</g>' +
    '<g transform="translate(96 146) rotate(-90)">' + autoBoven('#e0a21c') + '</g>' +
    '<g transform="translate(226 44) rotate(-90)">' + autoBoven('#8a6f9c') + '</g>' +
    '<g transform="translate(226 100) rotate(-90)">' + autoBoven('#2f6bbf') + '</g>' +
    '<g transform="translate(226 154) rotate(-90)">' + autoBoven('#5c9c6f') + '</g>' +
    '<g>' +
    '<g transform="rotate(-90)"><rect x="-18" y="-8" width="36" height="16" rx="3" fill="#f2f4f7"/>' +
    '<rect x="2" y="-6" width="12" height="12" rx="2" fill="' + GLAS + '"/>' +
    zwaai(-10, -10, 3.4, '#2f6bbf') + zwaai(-10, 10, 3.4, '#2f6bbf') + '</g>' +
    motie(pad, 3.4, '0') + '</g>' +
    tekst(126, 184, 11, 'vrije doorgang', '#fff', true));
};

window.SITUATIES['bijz-wegwerk'] = function(){
  return svgWikkel(190, 'Wegwerkzaamheden: pijlen en pionnen leiden het verkeer naar een versmalde doorgang, met het waarschuwingsbord erbij.',
    wegVooruit(190, 14, 306, 134, 186) +
    streep(150, 110, 190, STREEP, 3, '14 18') +
    /* De pionnenrij loopt schuin naar binnen: dat is de versmalling zelf. */
    '<path d="M186 ' + HORIZON + 'L306 190H250L178 ' + HORIZON + 'Z" fill="' + ORANJE + '" opacity=".25"/>' +
    (function(){
      var s = '', i, px, py, b;
      for(i = 0; i < 6; i++){
        py = 86 + i * 20; px = 182 + i * 13; b = 4 + i * 1.6;
        s += '<path d="M' + px + ' ' + py + 'l' + b + ' ' + (b * 2) + 'h' + (-2 * b) + 'Z" fill="' + ORANJE + '"/>';
        s += '<rect x="' + (px - b * 0.7) + '" y="' + (py + b * 0.9) + '" width="' + (b * 1.4) +
          '" height="' + (b * 0.5) + '" fill="#fff"/>';
      }
      return s;
    })() +
    paal(54, 104, 160) +
    bordDriehoek(54, 86, 44,
      /* J16: het werkmannetje met de schop. */
      '<circle cx="54" cy="80" r="3.4" fill="' + GRIJS + '"/>' +
      '<path d="M54 84v9M50 96l4-3 5 3M54 86l8-4" stroke="' + GRIJS + '" stroke-width="2.4" fill="none"/>' +
      '<path d="M62 82l5-3 2 4-5 3Z" fill="' + GRIJS + '"/>'));
};

})();
