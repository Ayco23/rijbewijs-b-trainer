/* Verkeerssituaties, deel 2: veilig rijden, verkeerstekens, milieu, wetgeving,
   voertuigkennis. Zie situaties.js voor de afspraken en docs/beeldsleutels.md voor
   de namenlijst.

   Gesplitst over twee bestanden zodat er parallel aan getekend kan worden; de app ziet
   één window.SITUATIES. Dit bestand vult aan en vervangt niet, dus het moet ná
   situaties.js geladen worden. */
(function(){

if(!window.SITUATIES) window.SITUATIES = {};

/* ---------------------------------------------------------------------------
   Hulpvormen. Ze staan binnen de IIFE en niet in S2, want window.SITUATIES moet
   precies de beeldsleutels bevatten: controleer.js loopt erover heen en zou een
   hulpsleutel als ongebruikte situatie aanrekenen. Ze geven een fragment terug
   zonder <svg>-wikkel, omdat ze altijd in een tafereel landen.

   Maatafspraak voor de bestuurdersbeelden: viewBox 320x180, horizon op y=62. Het
   wegvlak loopt van (124,62)-(196,62) naar (-50,180)-(370,180), zodat alles wat
   verderop ligt vanzelf smaller en hoger staat.
   --------------------------------------------------------------------------- */

var HORIZON = 62;

/* De weg zelf. Asfalt is een echte kleur en mag dus niet met het thema meebewegen;
   de lucht wel, die is sfeer en gebruikt var(--surface-2). */
function wegVlak(luchtKleur, asfaltKleur){
  return '<rect x="0" y="0" width="320" height="' + HORIZON + '" fill="' + (luchtKleur || 'var(--surface-2)') + '"/>' +
    '<rect x="0" y="' + HORIZON + '" width="320" height="' + (180 - HORIZON) + '" fill="#5a6372"/>' +
    '<path d="M124 ' + HORIZON + 'h72l174 ' + (180 - HORIZON) + 'H-50z" fill="' + (asfaltKleur || '#4a5361') + '"/>';
}

/* Belijning in perspectief: de streep smalt naar de horizon toe en wordt korter,
   anders leest het beeld als een plat bovenaanzicht. */
function middenstreep(doorgetrokken){
  if(doorgetrokken) return '<path d="M158 ' + HORIZON + ' L158 180" stroke="#fff" stroke-width="4" opacity=".9"/>';
  return '<path d="M159 66l2 10h-4zM159 84l3 16h-7zM160 110l5 28h-12zM161 148l8 32h-20z" fill="#fff" opacity=".9"/>';
}
function kantstreep(){
  return '<path d="M124 ' + HORIZON + 'L-30 180h-16L120 ' + HORIZON + 'z" fill="#fff" opacity=".75"/>' +
    '<path d="M196 ' + HORIZON + 'L350 180h16L200 ' + HORIZON + 'z" fill="#fff" opacity=".75"/>';
}

/* De motorkap onderin maakt duidelijk dat je zelf achter het stuur zit; zonder dat
   anker leest een vooraanzicht al snel als een plaatje van buitenaf. */
function motorkap(kleur){
  return '<path d="M-10 180q170 -40 340 0z" fill="' + (kleur || '#2f6bbf') + '"/>' +
    '<path d="M-10 180q170 -40 340 0" fill="none" stroke="currentColor" stroke-width="1" opacity=".35"/>';
}

/* Achteraanzicht van een auto, geschaald. s=1 is ongeveer 80 px breed, dus een auto
   vlak voor je; verderop zet je hem kleiner neer. */
function autoAchter(x, y, s, kleur){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<rect x="-38" y="-44" width="76" height="34" rx="9" fill="' + kleur + '"/>' +
    '<rect x="-42" y="-16" width="84" height="22" rx="6" fill="' + kleur + '"/>' +
    '<rect x="-27" y="-39" width="54" height="22" rx="4" fill="#2a3140" opacity=".8"/>' +
    '<rect x="-40" y="-12" width="13" height="9" rx="2.5" fill="#e8403f"/>' +
    '<rect x="27" y="-12" width="13" height="9" rx="2.5" fill="#e8403f"/>' +
    '<rect x="-20" y="2" width="40" height="7" rx="2" fill="var(--surface-2)" stroke="currentColor" stroke-width="1"/>' +
    '<rect x="-36" y="6" width="10" height="7" rx="2" fill="#222"/>' +
    '<rect x="26" y="6" width="10" height="7" rx="2" fill="#222"/>' +
    '</g>';
}

/* Vooraanzicht: een tegenligger. Koplampen krijgen hun kleur mee, want bij groot
   licht en bij dimlicht is juist dat het verschil. */
function autoVoor(x, y, s, kleur, lampKleur){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<rect x="-36" y="-42" width="72" height="32" rx="9" fill="' + kleur + '"/>' +
    '<rect x="-40" y="-16" width="80" height="22" rx="6" fill="' + kleur + '"/>' +
    '<rect x="-25" y="-37" width="50" height="21" rx="4" fill="#2a3140" opacity=".75"/>' +
    '<circle cx="-28" cy="-6" r="6" fill="' + (lampKleur || '#fff3c4') + '"/>' +
    '<circle cx="28" cy="-6" r="6" fill="' + (lampKleur || '#fff3c4') + '"/>' +
    '<rect x="-34" y="6" width="10" height="7" rx="2" fill="#222"/>' +
    '<rect x="24" y="6" width="10" height="7" rx="2" fill="#222"/>' +
    '</g>';
}

/* Schematische borden: vorm, kleur en symbool. Overgetrokken uit de RVV-vormen en
   niet uit borden.js, want dat bestand hoort bij de bordenmodule. */
function bordRond(cx, cy, r, rand, vulling){
  return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (vulling || '#fff') + '" ' +
    'stroke="' + rand + '" stroke-width="' + (r * 0.22) + '"/>';
}
function bordDriehoek(cx, cy, r){
  return '<path d="M' + cx + ' ' + (cy - r) + 'L' + (cx + r * 0.92) + ' ' + (cy + r * 0.62) +
    'H' + (cx - r * 0.92) + 'z" fill="#fff" stroke="#e8403f" stroke-width="' + (r * 0.2) + '" stroke-linejoin="round"/>';
}
function bordVierkant(cx, cy, h, vulling){
  return '<rect x="' + (cx - h / 2) + '" y="' + (cy - h / 2) + '" width="' + h + '" height="' + h +
    '" rx="2" fill="' + (vulling || '#1a56a8') + '" stroke="#fff" stroke-width="2"/>';
}
function paal(x, yTop, yBot){
  return '<rect x="' + (x - 2) + '" y="' + yTop + '" width="4" height="' + (yBot - yTop) + '" fill="var(--fg-3)"/>';
}

/* Mensje in vooraanzicht; schaal s houdt het perspectief kloppend. */
function mensje(x, y, s, kleur){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<circle cx="0" cy="-30" r="7" fill="' + kleur + '"/>' +
    '<path d="M-8 -22h16l-2 18h-12z" fill="' + kleur + '"/>' +
    '<path d="M-5 -4l-2 16M5 -4l2 16" stroke="' + kleur + '" stroke-width="3.5" stroke-linecap="round"/>' +
    '</g>';
}

/* Fietser van achteren: wat je in de praktijk ziet als je hem inhaalt. */
function fietserAchter(x, y, s, kleur){
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<ellipse cx="0" cy="-2" rx="8" ry="10" fill="none" stroke="currentColor" stroke-width="3"/>' +
    '<path d="M0 -12v-14" stroke="currentColor" stroke-width="3"/>' +
    '<path d="M-9 -26h18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M-7 -24l7 -8l7 8z" fill="' + kleur + '"/>' +
    '<path d="M-7 -30h14v-10h-14z" fill="' + kleur + '"/>' +
    '<circle cx="0" cy="-46" r="6.5" fill="' + kleur + '"/>' +
    '<rect x="-3" y="-4" width="6" height="4" rx="1.5" fill="#e8403f"/>' +
    '</g>';
}

/* Maatpijl met bijschrift. Elke "hoeveel"-vraag hangt hieraan, dus hij staat los
   zodat alle afstanden er hetzelfde uitzien. */
function maat(x1, y1, x2, y2, tekst, kleur){
  var k = kleur || '#f2c200';
  var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  var br = tekst.length * 6.6 + 12;
  return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + k + '" stroke-width="2"/>' +
    '<circle cx="' + x1 + '" cy="' + y1 + '" r="3" fill="' + k + '"/>' +
    '<circle cx="' + x2 + '" cy="' + y2 + '" r="3" fill="' + k + '"/>' +
    '<rect x="' + (mx - br / 2) + '" y="' + (my - 9) + '" width="' + br + '" height="18" rx="5" ' +
    'fill="var(--surface-2)" stroke="' + k + '" stroke-width="1"/>' +
    '<text x="' + mx + '" y="' + (my + 4) + '" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">' + tekst + '</text>';
}

/* Bijschrift in een kader: leesbaar op elk thema, ook boven asfalt. */
function bijschrift(x, y, tekst, kleur){
  var br = tekst.length * 6.3 + 14;
  return '<rect x="' + x + '" y="' + y + '" width="' + br + '" height="19" rx="5" fill="var(--surface-2)" ' +
    'stroke="' + (kleur || 'var(--line)') + '" stroke-width="1"/>' +
    '<text x="' + (x + 7) + '" y="' + (y + 13) + '" font-size="11" fill="currentColor">' + tekst + '</text>';
}

/* Paneel voor de rechte aanzichten (dashboard, rijbewijs, diagram). */
function paneel(h, titel){
  return '<rect x="0" y="0" width="320" height="' + h + '" rx="8" fill="var(--surface-2)"/>' +
    (titel ? '<text x="14" y="21" font-size="12" fill="currentColor" font-weight="700">' + titel + '</text>' : '');
}

function svg(h, label, inhoud){
  return '<svg viewBox="0 0 320 ' + h + '" width="100%" role="img" aria-label="' + label + '">' + inhoud + '</svg>';
}

/* De gebruiker kan beweging hebben uitgezet (systeeminstelling of de app zelf).
   index.html zet dat in GEEN_BEWEGING; wij lezen het pas bij het tekenen, omdat
   dit bestand eerder wordt geladen dan die variabele bestaat. */
function beweegt(){
  try { return !window.GEEN_BEWEGING; } catch(e){ return true; }
}

var S2 = {};

/* ======================= 4. VEILIG RIJDEN ======================= */

/* De afstand moet afleesbaar zijn, dus de maatpijl loopt over het wegdek mee en de
   snelheid staat erbij: zonder snelheid zegt een aantal meters niets. */
S2['veilig-volgafstand'] = function(){
  return svg(180, 'Achter een voorligger op een weg buiten de kom; de tussenruimte en de snelheid zijn aangegeven.',
    wegVlak() + kantstreep() + middenstreep(false) +
    '<rect x="0" y="40" width="320" height="22" fill="#7f9b6a" opacity=".5"/>' +
    autoAchter(160, 118, 0.78, '#c9ccd2') +
    /* Hectometerpaaltjes als maatstok: elk paaltje is 25 meter berm. */
    paal(238, 96, 112) + paal(214, 84, 98) + paal(202, 76, 88) +
    '<text x="244" y="110" font-size="10" fill="currentColor">25 m</text>' +
    '<text x="220" y="96" font-size="10" fill="currentColor">50 m</text>' +
    maat(100, 150, 140, 122, '22 m') +
    bijschrift(10, 10, 'jouw snelheid: 100 km/h') +
    motorkap('#2f6bbf'));
};

/* Mist: het zicht is de vraag, dus er staat een meetbare referentie in beeld - het
   paaltje op 50 meter is nog net een vlek, dat erachter niet meer. */
S2['veilig-mist'] = function(){
  return svg(180, 'Rijden in dichte mist; een paaltje op vijftig meter is nog vaag zichtbaar, daarachter is niets te zien.',
    '<defs><linearGradient id="s2-mist" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#d9dde3" stop-opacity=".95"/>' +
    '<stop offset="1" stop-color="#d9dde3" stop-opacity=".25"/></linearGradient></defs>' +
    wegVlak('#c9ced6') + kantstreep() + middenstreep(false) +
    paal(206, 74, 92) + paal(228, 86, 112) +
    '<rect x="0" y="' + HORIZON + '" width="320" height="118" fill="url(#s2-mist)"/>' +
    '<rect x="0" y="0" width="320" height="' + HORIZON + '" fill="#d9dde3" opacity=".8"/>' +
    maat(232, 128, 208, 96, '50 m') +
    bijschrift(10, 10, 'zicht korter dan 50 meter') +
    /* Het mistlichtsymbool op het dashboard hoort bij de vraag of je het aan mag doen. */
    '<rect x="186" y="148" width="124" height="26" rx="6" fill="#1b2330" opacity=".85"/>' +
    '<circle cx="204" cy="161" r="8" fill="#f2c200"/>' +
    '<path d="M200 158h8M200 162h8" stroke="#1b2330" stroke-width="1.6"/>' +
    '<text x="218" y="165" font-size="11" fill="#fff">mistlicht achter</text>' +
    motorkap('#2f6bbf'));
};

/* Natte weg: het spatwater en de spiegelende strepen maken aquaplaning-vragen
   beantwoordbaar, de waterlaag staat er met een maat bij. */
S2['veilig-regen'] = function(){
  var druppels = '';
  var i;
  for(i = 0; i < 16; i++){
    druppels += '<path d="M' + (12 + i * 20) + ' ' + (6 + (i % 4) * 13) + 'l-4 12" stroke="#9fd0ff" stroke-width="1.6" opacity=".8"/>';
  }
  return svg(180, 'Natte weg met plassen en spatwater achter een voorligger.',
    wegVlak('#8f99a8', '#3c444f') + kantstreep() + middenstreep(false) +
    '<ellipse cx="96" cy="152" rx="56" ry="11" fill="#9fd0ff" opacity=".45"/>' +
    '<ellipse cx="236" cy="134" rx="40" ry="8" fill="#9fd0ff" opacity=".4"/>' +
    autoAchter(176, 122, 0.74, '#c9ccd2') +
    /* Spatwater achter de wielen: zo is te zien dat er een waterlaag ligt. */
    '<path d="M152 122q-14 -10 -26 2q16 -2 26 -2z" fill="#fff" opacity=".6"/>' +
    '<path d="M200 122q14 -10 26 2q-16 -2 -26 -2z" fill="#fff" opacity=".6"/>' +
    druppels +
    bijschrift(10, 96, 'waterlaag op het wegdek') +
    bijschrift(10, 10, 'regen, 80 km/h') +
    motorkap('#2f6bbf'));
};

/* Sneeuw: de temperatuur staat erbij, want bij een vraag over gladheid is juist het
   getal onder nul het aanknopingspunt. */
S2['veilig-gladheid'] = function(){
  return svg(180, 'Besneeuwde weg met bandensporen; de buitenthermometer staat onder nul.',
    wegVlak('#cfd6de', '#e6ebf0') +
    '<rect x="0" y="' + HORIZON + '" width="320" height="118" fill="#dfe5ec"/>' +
    '<path d="M124 ' + HORIZON + 'h72l174 118H-50z" fill="#eef2f6"/>' +
    /* Bandensporen van eerder verkeer: daar ligt nog asfalt, ernaast niet. */
    '<path d="M140 ' + HORIZON + 'l-60 118h30l44 -118z" fill="#9aa4b1" opacity=".75"/>' +
    '<path d="M182 ' + HORIZON + 'l60 118h-30l-44 -118z" fill="#9aa4b1" opacity=".75"/>' +
    '<rect x="0" y="42" width="320" height="20" fill="#f4f7fa"/>' +
    autoAchter(190, 116, 0.6, '#8d99a8') +
    '<rect x="186" y="146" width="124" height="28" rx="6" fill="#1b2330" opacity=".85"/>' +
    '<text x="198" y="165" font-size="14" fill="#f2c200" font-weight="700">-3 °C</text>' +
    '<text x="240" y="165" font-size="11" fill="#fff">buitentemp.</text>' +
    bijschrift(10, 10, 'sneeuw op het wegdek') +
    motorkap('#2f6bbf'));
};

/* Verblinding: de tegenligger brandt groot licht en jouw eigen lampje staat uit -
   de vraag gaat over wat jij doet, dus beide toestanden moeten zichtbaar zijn. */
S2['veilig-verblinding'] = function(){
  return svg(180, 'In het donker nadert een tegenligger met groot licht; jouw eigen grootlichtlampje is uit.',
    '<rect x="0" y="0" width="320" height="180" fill="#121a26"/>' +
    '<path d="M124 ' + HORIZON + 'h72l174 118H-50z" fill="#232c3a"/>' +
    '<path d="M124 ' + HORIZON + 'L-30 180h-16L120 ' + HORIZON + 'z" fill="#fff" opacity=".45"/>' +
    middenstreep(false) +
    /* De bundels zijn breed en lopen door tot aan de kijker: dat is verblinding. */
    '<path d="M82 92L10 180h150z" fill="#fff8d6" opacity=".35"/>' +
    '<path d="M114 92L186 180H40z" fill="#fff8d6" opacity=".35"/>' +
    autoVoor(98, 104, 0.62, '#2b3444', '#fffbe2') +
    '<circle cx="82" cy="98" r="13" fill="#fff8d6" opacity=".55"/>' +
    '<circle cx="114" cy="98" r="13" fill="#fff8d6" opacity=".55"/>' +
    bijschrift(176, 70, 'tegenligger: groot licht', '#f2c200') +
    '<rect x="186" y="146" width="124" height="28" rx="6" fill="#1b2330"/>' +
    '<circle cx="204" cy="160" r="8" fill="#39465a"/>' +
    '<text x="218" y="164" font-size="11" fill="#9aa4b1">grootlicht uit</text>' +
    motorkap('#1d2634'));
};

/* Pech op de vluchtstrook: driehoek, waarschuwingsknipperlichten, hesje en de plek
   achter de vangrail staan er alle vier op, want daar gaan de vragen over. */
S2['veilig-pech'] = function(){
  return svg(180, 'Auto met pech op de vluchtstrook, gevarendriehoek erachter en een inzittende achter de vangrail.',
    '<rect x="0" y="0" width="320" height="70" fill="var(--surface-2)"/>' +
    '<rect x="0" y="70" width="320" height="110" fill="#4a5361"/>' +
    '<rect x="0" y="92" width="320" height="4" fill="#fff" opacity=".8"/>' +
    '<rect x="0" y="96" width="320" height="52" fill="#555f6d"/>' +
    '<text x="12" y="112" font-size="11" fill="#fff" opacity=".8">vluchtstrook</text>' +
    /* Vangrail en berm: de veilige plek is achter de rail. */
    '<rect x="0" y="150" width="320" height="6" rx="2" fill="#aeb6c2"/>' +
    '<rect x="0" y="156" width="320" height="24" fill="#7f9b6a"/>' +
    '<g transform="translate(130 118)">' +
    '<rect x="-44" y="-26" width="88" height="20" rx="7" fill="#d8dbe0"/>' +
    '<rect x="-52" y="-10" width="104" height="16" rx="5" fill="#d8dbe0"/>' +
    '<rect x="-30" y="-23" width="34" height="15" rx="3" fill="#2a3140" opacity=".75"/>' +
    '<circle cx="-30" cy="8" r="7" fill="#222"/><circle cx="30" cy="8" r="7" fill="#222"/>' +
    /* Waarschuwingsknipperlichten aan beide hoeken. */
    '<rect x="-52" y="-6" width="9" height="7" rx="2" fill="#f2a000"/>' +
    '<rect x="43" y="-6" width="9" height="7" rx="2" fill="#f2a000"/>' +
    '</g>' +
    '<path d="M236 134l16 -28l16 28z" fill="none" stroke="#e8403f" stroke-width="6" stroke-linejoin="round"/>' +
    '<text x="214" y="150" font-size="11" fill="#fff">gevarendriehoek</text>' +
    mensje(44, 158, 0.72, '#f2c200') +
    bijschrift(10, 10, 'pech op de autosnelweg') +
    '<text x="12" y="176" font-size="11" fill="currentColor">achter de vangrail</text>');
};

/* Ongeval verderop: wat telt is dat je het al van ver ziet en dat er verkeer achter
   je aan komt - vandaar de rij remlichten en de spiegel. */
S2['veilig-ongeval'] = function(){
  return svg(180, 'Verderop op de weg staat een ongeval; het verkeer ervoor remt en in de spiegel nadert verkeer.',
    wegVlak() + kantstreep() + middenstreep(false) +
    '<rect x="0" y="44" width="320" height="18" fill="#7f9b6a" opacity=".5"/>' +
    /* Twee voertuigen schuin tegen elkaar, met scherfjes ertussen. */
    '<g transform="translate(150 96) scale(.5)">' +
    '<rect x="-40" y="-30" width="80" height="26" rx="8" fill="#c9ccd2" transform="rotate(-12)"/>' +
    '<rect x="6" y="-24" width="78" height="26" rx="8" fill="#9bb3d6" transform="rotate(14)"/>' +
    '</g>' +
    '<path d="M140 100l-4 -8M158 98l3 -9M148 104l0 -10" stroke="#f2c200" stroke-width="1.6"/>' +
    '<circle cx="150" cy="80" r="5" fill="#f2a000"/>' +
    autoAchter(176, 130, 0.72, '#c9ccd2') +
    '<rect x="150" y="116" width="13" height="9" rx="2.5" fill="#ff2d2d"/>' +
    '<rect x="189" y="116" width="13" height="9" rx="2.5" fill="#ff2d2d"/>' +
    '<text x="206" y="124" font-size="11" fill="#fff">remlichten</text>' +
    /* Binnenspiegel: het verkeer achter je is deel van de beslissing. */
    '<rect x="96" y="4" width="92" height="26" rx="8" fill="#1b2330" stroke="currentColor" stroke-width="1"/>' +
    autoAchter(142, 28, 0.22, '#8d99a8') +
    '<text x="192" y="22" font-size="10" fill="currentColor">achter je</text>' +
    bijschrift(10, 40, 'ongeval, 150 m verder') +
    motorkap('#2f6bbf'));
};

/* De dode hoek van een vrachtwagen is groter dan die van een auto en zit vooral
   rechts; daarom staat de fietser daar en is dat vlak het grootst gearceerd. */
S2['veilig-dodehoek'] = function(){
  return svg(180, 'Vrachtwagen van bovenaf met de dodehoekgebieden gearceerd en een fietser rechts naast de cabine.',
    '<defs><pattern id="s2-arc" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
    '<rect x="0" y="0" width="3" height="7" fill="#e8403f" opacity=".5"/></pattern></defs>' +
    paneel(180, 'Dode hoek vrachtwagen (van boven)') +
    /* Vrachtwagen wijst naar rechts: neus bij x=250. */
    '<rect x="60" y="62" width="150" height="56" rx="4" fill="currentColor" opacity=".35"/>' +
    '<rect x="212" y="64" width="46" height="52" rx="6" fill="currentColor" opacity=".8"/>' +
    '<rect x="222" y="70" width="26" height="18" rx="3" fill="#cfe2ff" opacity=".9"/>' +
    '<rect x="206" y="56" width="10" height="7" rx="2" fill="currentColor"/>' +
    '<rect x="206" y="117" width="10" height="7" rx="2" fill="currentColor"/>' +
    /* Rechts langs de cabine: het grootste en gevaarlijkste vlak. */
    '<path d="M214 118h50v44H120l40 -44z" fill="url(#s2-arc)" stroke="#e8403f" stroke-width="1"/>' +
    /* Vlak voor de neus en recht achter de oplegger. */
    '<path d="M258 64h34v52h-34z" fill="url(#s2-arc)" stroke="#e8403f" stroke-width="1"/>' +
    '<path d="M18 62h42v56H18z" fill="url(#s2-arc)" stroke="#e8403f" stroke-width="1"/>' +
    '<circle cx="186" cy="140" r="7" fill="#2fbf71"/>' +
    '<circle cx="174" cy="150" r="5" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<circle cx="198" cy="150" r="5" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M174 150h24M186 150l6 -8" stroke="currentColor" stroke-width="2"/>' +
    '<text x="120" y="174" font-size="11" fill="#e8403f" font-weight="700">fietser staat in de dode hoek</text>' +
    '<text x="18" y="54" font-size="10" fill="currentColor">achter</text>' +
    '<text x="262" y="54" font-size="10" fill="currentColor">voor</text>');
};

/* Animatie: de bal rolt tussen twee geparkeerde auto\'s vandaan. Met beweging uit
   ligt hij stil op het beslismoment - net op de rijbaan - zodat de vraag ook dan
   te beantwoorden is. */
S2['veilig-kind-bal'] = function(){
  var pad = 'M118 158 L196 160';
  var bal = '<circle cx="0" cy="0" r="9" fill="#e8403f"/><path d="M-9 0h18M0 -9v18" stroke="#fff" stroke-width="2"/>';
  var beweging = beweegt()
    ? '<animateMotion dur="1.8s" repeatCount="indefinite" path="' + pad + '"/>'
    : '<animateMotion dur="0.001s" fill="freeze" path="' + pad + '" keyPoints="0.55;0.55" keyTimes="0;1" calcMode="linear"/>';
  return svg(180, 'Woonstraat met geparkeerde auto\'s; tussen twee auto\'s rolt een bal de rijbaan op.',
    wegVlak('#bcd3ea', '#4a5361') +
    '<rect x="0" y="' + HORIZON + '" width="320" height="22" fill="#9aa4b1" opacity=".45"/>' +
    /* Huizenrij op de achtergrond maakt het een woonstraat en geen doorgaande weg. */
    '<path d="M6 62V34l22 -14 22 14v28zM58 62V40l20 -12 20 12v22z" fill="currentColor" opacity=".25"/>' +
    kantstreep() +
    autoAchter(62, 150, 0.95, '#8d99a8') +
    autoAchter(250, 134, 0.8, '#9bb3d6') +
    '<rect x="100" y="120" width="12" height="40" fill="#5a6372" opacity=".4"/>' +
    '<g>' + bal + beweging + '</g>' +
    bijschrift(188, 86, 'kind niet zichtbaar', '#e8403f') +
    bijschrift(10, 10, '30 km-zone') +
    motorkap('#2f6bbf'));
};

/* Animatie: de tegenligger komt naderbij terwijl jij achter een fietser zit. De
   zijafstand staat als maat in beeld; met beweging uit staat de tegenligger op het
   punt waarop je moet kiezen: wachten of inhalen. */
S2['veilig-fietser-inhalen'] = function(){
  var pad = 'M150 72 L104 128';
  var vorm = autoVoor(0, 0, 0.5, '#9bb3d6', '#fff3c4');
  var beweging = beweegt()
    ? '<animateMotion dur="2.6s" repeatCount="indefinite" path="' + pad + '"/>'
    : '<animateMotion dur="0.001s" fill="freeze" path="' + pad + '" keyPoints="0.5;0.5" keyTimes="0;1" calcMode="linear"/>';
  return svg(180, 'Je nadert een fietser rechts op de rijbaan terwijl er een tegenligger aankomt; de zijafstand is aangegeven.',
    wegVlak() + kantstreep() + middenstreep(false) +
    '<rect x="0" y="46" width="320" height="16" fill="#7f9b6a" opacity=".5"/>' +
    '<g>' + vorm + beweging + '</g>' +
    fietserAchter(214, 150, 1.05, '#f2c200') +
    /* De maat loopt dwars over het wegdek, op de hoogte van de fietser. */
    maat(214, 136, 150, 136, '1,5 m?') +
    bijschrift(10, 10, 'tegenligger nadert') +
    motorkap('#2f6bbf'));
};

/* ======================= 5. VERKEERSTEKENS ======================= */

/* Het licht staat op groen en de regelaar geeft stop: beide moeten tegelijk te zien
   zijn, anders is de vraag welke voorgaat niet te beantwoorden. */
S2['tekens-regelaar'] = function(){
  return svg(180, 'Een verkeersregelaar steekt zijn arm op als stopteken, terwijl het verkeerslicht erachter op groen staat.',
    wegVlak() + kantstreep() +
    '<rect x="0" y="44" width="320" height="18" fill="#7f9b6a" opacity=".5"/>' +
    /* Verkeerslicht ernaast, groen brandend. */
    paal(262, 60, 160) +
    '<rect x="248" y="22" width="28" height="60" rx="5" fill="#1b2330"/>' +
    '<circle cx="262" cy="35" r="8" fill="#4a1a1a"/>' +
    '<circle cx="262" cy="52" r="8" fill="#4a3f14"/>' +
    '<circle cx="262" cy="69" r="8" fill="#2fbf71"/>' +
    /* De regelaar: hesje, arm omhoog, gezicht naar jou toe. */
    '<g transform="translate(132 150) scale(1.5)">' +
    '<circle cx="0" cy="-34" r="7" fill="currentColor"/>' +
    '<path d="M-9 -26h18l-2 20h-14z" fill="#f2a000"/>' +
    '<path d="M-9 -16h18" stroke="#fff" stroke-width="2.5"/>' +
    '<path d="M-8 -24l-9 12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M8 -24l8 -16" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>' +
    '<circle cx="17" cy="-42" r="4.5" fill="currentColor"/>' +
    '<path d="M-5 -6l-2 12M5 -6l2 12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>' +
    '</g>' +
    bijschrift(176, 92, 'arm omhoog: stop', '#e8403f') +
    bijschrift(10, 10, 'licht staat op groen', '#2fbf71') +
    motorkap('#2f6bbf'));
};

/* Geel: de afstand tot de stopstreep bepaalt het antwoord, dus die staat er als maat
   bij in plaats van alleen het lampje. */
S2['tekens-licht-geel'] = function(){
  return svg(180, 'Een driekleurig verkeerslicht staat op geel; je nadert de stopstreep.',
    wegVlak() + kantstreep() + middenstreep(false) +
    '<rect x="0" y="44" width="320" height="18" fill="#7f9b6a" opacity=".5"/>' +
    '<path d="M96 104h132v9H88z" fill="#fff" opacity=".9"/>' +
    paal(244, 54, 118) +
    '<rect x="226" y="10" width="36" height="76" rx="6" fill="#1b2330"/>' +
    '<circle cx="244" cy="26" r="10" fill="#4a1a1a"/>' +
    '<circle cx="244" cy="48" r="10" fill="#f2c200"/>' +
    '<circle cx="244" cy="70" r="10" fill="#1f3a2a"/>' +
    maat(60, 150, 92, 112, '12 m') +
    bijschrift(10, 10, 'je rijdt 50 km/h') +
    '<text x="100" y="128" font-size="11" fill="#fff">stopstreep</text>' +
    motorkap('#2f6bbf'));
};

/* Een geel knipperlicht zegt alleen "let op"; het bord eronder zegt waarop. Beide
   dus in beeld, plus het zebrapad waar het over gaat. */
S2['tekens-knipper-geel'] = function(){
  return svg(180, 'Boven een waarschuwingsbord bij een oversteekplaats knippert een geel licht.',
    wegVlak() + kantstreep() +
    '<rect x="0" y="44" width="320" height="18" fill="#7f9b6a" opacity=".5"/>' +
    /* Zebrapad in perspectief: de strepen lopen mee met het wegvlak. */
    '<path d="M112 108h24l-10 22h-30zM144 108h24l-6 22h-28zM176 108h24l-2 22h-26zM208 108h22l2 22h-26z" fill="#fff" opacity=".9"/>' +
    paal(252, 60, 150) +
    '<circle cx="252" cy="22" r="11" fill="#f2c200" stroke="#1b2330" stroke-width="3"/>' +
    '<path d="M234 10l-7 -5M234 34l-7 5M270 10l7 -5M270 34l7 5" stroke="#f2c200" stroke-width="2.5" stroke-linecap="round"/>' +
    bordDriehoek(252, 52, 18) +
    mensje(252, 58, 0.3, '#1b2330') +
    bijschrift(10, 10, 'geel licht knippert', '#f2c200') +
    motorkap('#2f6bbf'));
};

/* Blokmarkering staat voor het puntstuk: de blokken zelf en de splitsing erachter
   moeten te zien zijn, anders is het een willekeurige witte vlek. */
S2['tekens-markering-blok'] = function(){
  var blokken = '';
  var i;
  for(i = 0; i < 5; i++){
    blokken += '<path d="M' + (150 - i * 5) + ' ' + (92 + i * 16) + 'h' + (18 + i * 10) +
      'l2 10h-' + (22 + i * 10) + 'z" fill="#fff" opacity=".92"/>';
  }
  return svg(180, 'Blokmarkering op het wegdek voor een puntstuk waar de weg zich splitst.',
    wegVlak() +
    '<path d="M124 ' + HORIZON + 'h72l174 118H-50z" fill="#4a5361"/>' +
    /* De splitsing: twee rijbanen die uit elkaar lopen. */
    '<path d="M160 ' + HORIZON + 'L236 180h-18L152 80z" fill="#fff" opacity=".7"/>' +
    '<path d="M156 ' + HORIZON + 'L64 180h18l72 -100z" fill="#fff" opacity=".7"/>' +
    blokken +
    kantstreep() +
    bijschrift(10, 10, 'blokmarkering voor het puntstuk') +
    bijschrift(186, 96, 'hier niet rijden') +
    motorkap('#2f6bbf'));
};

/* Het buslicht kent vier standen; de witte balk is er één van. De andere standen
   staan ernaast, want een vraag gaat altijd over het verschil. */
S2['tekens-bus-licht'] = function(){
  return svg(180, 'Een buslicht toont een witte horizontale balk; de overige standen staan ernaast.',
    paneel(180, 'Buslicht') +
    '<rect x="24" y="36" width="76" height="116" rx="10" fill="#1b2330"/>' +
    '<rect x="44" y="82" width="36" height="9" rx="2" fill="#fff"/>' +
    '<circle cx="62" cy="56" r="7" fill="#39465a"/>' +
    '<rect x="56" y="110" width="12" height="34" rx="3" fill="#39465a"/>' +
    '<text x="24" y="170" font-size="11" fill="currentColor" font-weight="700">deze stand</text>' +
    /* De drie andere standen, klein en met hun betekenis erbij. */
    '<rect x="124" y="36" width="44" height="44" rx="8" fill="#1b2330"/>' +
    '<rect x="134" y="54" width="24" height="7" rx="2" fill="#39465a"/>' +
    '<rect x="143" y="44" width="6" height="26" rx="2" fill="#fff"/>' +
    '<text x="176" y="62" font-size="11" fill="currentColor">rijden rechtdoor</text>' +
    '<rect x="124" y="88" width="44" height="44" rx="8" fill="#1b2330"/>' +
    '<circle cx="146" cy="110" r="8" fill="#f2c200"/>' +
    '<text x="176" y="114" font-size="11" fill="currentColor">stoppen, tenzij</text>' +
    '<rect x="124" y="136" width="44" height="36" rx="8" fill="#1b2330"/>' +
    '<rect x="134" y="150" width="24" height="7" rx="2" fill="#fff"/>' +
    '<text x="176" y="158" font-size="11" fill="currentColor">witte balk</text>');
};

/* Matrixbord: het cijfer en het kader eromheen zijn het antwoord, dus die staan groot
   en in de echte kleuren van een matrixsignaal. */
S2['tekens-matrix'] = function(){
  return svg(180, 'Boven de rijstroken van een autosnelweg toont een matrixbord negentig.',
    wegVlak('#8fb4d8') + kantstreep() +
    '<path d="M148 ' + HORIZON + 'L48 180h12l96 -118z" fill="#fff" opacity=".65"/>' +
    '<path d="M178 ' + HORIZON + 'L278 180h-12l-96 -118z" fill="#fff" opacity=".65"/>' +
    /* Portaal over de weg. */
    '<rect x="16" y="20" width="288" height="7" rx="2" fill="var(--fg-3)"/>' +
    paal(24, 27, 140) + paal(296, 27, 140) +
    '<rect x="112" y="27" width="96" height="56" rx="4" fill="#111820" stroke="var(--fg-3)" stroke-width="2"/>' +
    '<circle cx="160" cy="55" r="23" fill="none" stroke="#e8403f" stroke-width="5"/>' +
    '<text x="160" y="64" text-anchor="middle" font-size="26" fill="#f2c200" font-weight="700">90</text>' +
    '<circle cx="124" cy="36" r="3" fill="#f2c200"/>' +
    '<circle cx="196" cy="36" r="3" fill="#f2c200"/>' +
    bijschrift(10, 96, 'signaal boven jouw rijstrook') +
    motorkap('#2f6bbf'));
};

/* Onderbord beperkt het bord erboven. De tekst moet dus echt leesbaar zijn; daarom
   staat dit bord groot en van voren in beeld. */
S2['tekens-bord-onderbord'] = function(){
  return svg(180, 'Een blauw parkeerbord met daaronder een onderbord met de tekst vergunninghouders.',
    paneel(180) +
    paal(160, 112, 176) +
    bordVierkant(160, 56, 72, '#1a56a8') +
    '<text x="160" y="72" text-anchor="middle" font-size="42" fill="#fff" font-weight="700">P</text>' +
    '<rect x="104" y="96" width="112" height="24" rx="2" fill="#fff" stroke="#1b2330" stroke-width="2"/>' +
    '<text x="160" y="113" text-anchor="middle" font-size="13" fill="#1b2330" font-weight="700">vergunninghouders</text>' +
    '<path d="M228 108h-18" stroke="var(--fg-3)" stroke-width="1"/>' +
    '<text x="232" y="112" font-size="11" fill="currentColor">onderbord</text>' +
    '<path d="M228 56h-26" stroke="var(--fg-3)" stroke-width="1"/>' +
    '<text x="232" y="60" font-size="11" fill="currentColor">bord E9</text>');
};

/* ======================= 6. MILIEU ======================= */

/* De naald staat buiten het groene gebied: alleen zo is te zien dat er geschakeld
   moet worden. Het groene vlak is de maatstaf. */
S2['milieu-toerenteller'] = function(){
  return svg(180, 'Toerenteller waarvan de naald rechts van het gemarkeerde zuinige gebied staat.',
    paneel(180, 'Toerenteller (x1000 omw/min)') +
    '<circle cx="160" cy="104" r="62" fill="#1b2330"/>' +
    '<circle cx="160" cy="104" r="62" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"/>' +
    /* Zuinig gebied 2000-2500: een boog over de schaal. */
    '<path d="M122 56A62 62 0 0 1 151 43" fill="none" stroke="#2fbf71" stroke-width="10"/>' +
    '<path d="M186 48A62 62 0 0 1 216 84" fill="none" stroke="#e8403f" stroke-width="10"/>' +
    '<text x="104" y="148" font-size="11" fill="#fff">1</text>' +
    '<text x="110" y="78" font-size="11" fill="#fff">2</text>' +
    '<text x="156" y="60" font-size="11" fill="#fff">3</text>' +
    '<text x="200" y="80" font-size="11" fill="#fff">4</text>' +
    '<text x="206" y="146" font-size="11" fill="#fff">5</text>' +
    /* Naald op ongeveer 3200. */
    '<path d="M160 104L184 58" stroke="#f2c200" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="160" cy="104" r="6" fill="#f2c200"/>' +
    '<text x="160" y="134" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">3e versnelling</text>' +
    '<rect x="14" y="40" width="12" height="9" rx="2" fill="#2fbf71"/>' +
    '<text x="32" y="49" font-size="11" fill="currentColor">zuinig gebied</text>' +
    '<text x="14" y="68" font-size="11" fill="currentColor">2000 - 2500</text>' +
    '<text x="14" y="86" font-size="11" fill="currentColor">omw/min</text>');
};

/* De meter wijst een te lage druk aan en het geadviseerde getal staat ernaast; zonder
   die twee getallen naast elkaar is er niets af te lezen. */
S2['milieu-bandenspanning'] = function(){
  return svg(180, 'Bandenspanningsmeter op de klep van een band wijst 1,8 bar aan; het advies op de sticker is 2,3 bar.',
    paneel(180, 'Bandenspanning meten') +
    '<circle cx="96" cy="104" r="50" fill="#e9edf2" stroke="currentColor" stroke-width="3"/>' +
    '<path d="M60 76A50 50 0 0 1 96 54" fill="none" stroke="#e8403f" stroke-width="7"/>' +
    '<path d="M104 54A50 50 0 0 1 134 80" fill="none" stroke="#2fbf71" stroke-width="7"/>' +
    '<text x="58" y="132" font-size="11" fill="#1b2330">1</text>' +
    '<text x="60" y="80" font-size="11" fill="#1b2330">1,5</text>' +
    '<text x="90" y="68" font-size="11" fill="#1b2330">2</text>' +
    '<text x="118" y="84" font-size="11" fill="#1b2330">2,5</text>' +
    '<text x="124" y="130" font-size="11" fill="#1b2330">3</text>' +
    '<path d="M96 104L70 72" stroke="#1b2330" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="96" cy="104" r="5" fill="#1b2330"/>' +
    '<rect x="70" y="112" width="52" height="20" rx="4" fill="#1b2330"/>' +
    '<text x="96" y="127" text-anchor="middle" font-size="13" fill="#f2c200" font-weight="700">1,8 bar</text>' +
    '<rect x="86" y="150" width="20" height="18" rx="3" fill="currentColor" opacity=".6"/>' +
    /* Het advies van de fabrikant staat op een sticker in de deurstijl. */
    '<rect x="176" y="56" width="128" height="76" rx="6" fill="#fff" stroke="currentColor" stroke-width="2"/>' +
    '<text x="188" y="76" font-size="11" fill="#1b2330" font-weight="700">Sticker deurstijl</text>' +
    '<text x="188" y="98" font-size="11" fill="#1b2330">voor: 2,3 bar</text>' +
    '<text x="188" y="116" font-size="11" fill="#1b2330">achter: 2,1 bar</text>' +
    '<text x="176" y="152" font-size="11" fill="currentColor">meet op een koude band</text>');
};

/* Cruise control zit op het stuur; de knoppen moeten herkenbaar zijn, dus staan ze
   met hun functie erbij en brandt het lampje dat aangeeft dat hij aan staat. */
S2['milieu-cruise'] = function(){
  return svg(180, 'Stuurwiel met de bedieningsknoppen voor cruise control en een brandend controlelampje.',
    paneel(180, 'Cruise control') +
    '<circle cx="160" cy="112" r="62" fill="none" stroke="currentColor" stroke-width="12" opacity=".75"/>' +
    '<circle cx="160" cy="112" r="24" fill="currentColor" opacity=".55"/>' +
    '<path d="M136 108h-38M184 108h38M160 136v26" stroke="currentColor" stroke-width="10" opacity=".55" stroke-linecap="round"/>' +
    /* Knoppenblok linksonder op het stuur. */
    '<rect x="78" y="118" width="54" height="40" rx="8" fill="var(--surface-2)" stroke="currentColor" stroke-width="1.5"/>' +
    '<circle cx="92" cy="130" r="7" fill="#2fbf71"/>' +
    '<text x="88" y="134" font-size="9" fill="#06301b" font-weight="700">+</text>' +
    '<circle cx="118" cy="130" r="7" fill="#9bb3d6"/>' +
    '<text x="115" y="134" font-size="9" fill="#06301b" font-weight="700">-</text>' +
    '<rect x="84" y="142" width="42" height="12" rx="4" fill="#e8403f"/>' +
    '<text x="105" y="151" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">CANCEL</text>' +
    '<path d="M70 128h-18" stroke="var(--fg-3)" stroke-width="1"/>' +
    '<text x="14" y="132" font-size="11" fill="currentColor">sneller</text>' +
    '<text x="14" y="150" font-size="11" fill="currentColor">/ langzamer</text>' +
    /* Controlelampje: cruise staat aan op 100. */
    '<rect x="200" y="34" width="106" height="30" rx="6" fill="#1b2330"/>' +
    '<circle cx="216" cy="49" r="8" fill="#2fbf71"/>' +
    '<text x="232" y="53" font-size="12" fill="#fff" font-weight="700">100 km/h</text>');
};

/* Milieuzone: het bord met de tekst is het hele antwoord, dus dat staat groot en
   leesbaar bij de stadsingang. */
S2['milieu-zone'] = function(){
  return svg(180, 'Bij de ingang van een stad staat een milieuzonebord met een onderbord.',
    wegVlak() + kantstreep() + middenstreep(false) +
    '<path d="M6 62V30l20 -12 20 12v32zM54 62V40l18 -10 18 10v22z" fill="currentColor" opacity=".25"/>' +
    paal(250, 118, 166) +
    '<rect x="206" y="24" width="88" height="94" rx="4" fill="#fff" stroke="#e8403f" stroke-width="5"/>' +
    '<text x="250" y="48" text-anchor="middle" font-size="12" fill="#1b2330" font-weight="700">milieuzone</text>' +
    /* Vrachtwagensilhouet: het symbool op het echte bord. */
    '<rect x="220" y="58" width="36" height="18" rx="2" fill="#1b2330"/>' +
    '<path d="M256 66h12l6 10h-18z" fill="#1b2330"/>' +
    '<circle cx="230" cy="80" r="5" fill="#1b2330"/>' +
    '<circle cx="264" cy="80" r="5" fill="#1b2330"/>' +
    '<text x="250" y="104" text-anchor="middle" font-size="11" fill="#1b2330">geldt 24 uur</text>' +
    bijschrift(10, 10, 'je rijdt de stad binnen') +
    motorkap('#2f6bbf'));
};

/* Stilstaan met de motor aan: de uitlaat rookt en de klok loopt. Dat tweede maakt
   een vraag over wachttijd pas beantwoordbaar. */
S2['milieu-stilstaan'] = function(){
  return svg(180, 'Een auto staat stil voor een gesloten spoorboom met draaiende motor en rokende uitlaat.',
    wegVlak('#bcd3ea') + kantstreep() +
    /* Gesloten overwegboom als reden om stil te staan. */
    '<rect x="40" y="86" width="240" height="10" rx="3" fill="#e8403f"/>' +
    '<rect x="70" y="86" width="30" height="10" fill="#fff"/>' +
    '<rect x="130" y="86" width="30" height="10" fill="#fff"/>' +
    '<rect x="190" y="86" width="30" height="10" fill="#fff"/>' +
    paal(36, 70, 140) +
    '<g transform="translate(196 134) scale(.9)">' +
    '<rect x="-44" y="-30" width="88" height="22" rx="8" fill="#c9ccd2"/>' +
    '<rect x="-52" y="-12" width="104" height="18" rx="6" fill="#c9ccd2"/>' +
    '<rect x="-30" y="-27" width="36" height="17" rx="3" fill="#2a3140" opacity=".75"/>' +
    '<circle cx="-30" cy="8" r="8" fill="#222"/><circle cx="30" cy="8" r="8" fill="#222"/>' +
    '</g>' +
    /* Uitlaatgas: wolkjes achter de bumper. */
    '<circle cx="138" cy="138" r="7" fill="#9aa4b1" opacity=".7"/>' +
    '<circle cx="126" cy="132" r="9" fill="#9aa4b1" opacity=".55"/>' +
    '<circle cx="112" cy="126" r="11" fill="#9aa4b1" opacity=".4"/>' +
    bijschrift(10, 150, 'motor draait') +
    bijschrift(10, 10, 'wachttijd: ruim 1 minuut'));
};

/* ======================= 7. WETGEVING ======================= */

/* De geldigheidsdatum is veld 4b; die staat uitgelicht, met de categorie erbij zodat
   ook een vraag over rijbewijs B te stellen is. */
S2['wet-rijbewijs'] = function(){
  return svg(180, 'Vooraanzicht van een rijbewijs; het veld met de geldigheidsdatum is uitgelicht.',
    paneel(180, 'Rijbewijs') +
    '<rect x="22" y="34" width="276" height="126" rx="10" fill="#e9edf2" stroke="currentColor" stroke-width="2"/>' +
    '<rect x="22" y="34" width="276" height="20" rx="10" fill="#1a56a8"/>' +
    '<text x="34" y="49" font-size="11" fill="#fff" font-weight="700">RIJBEWIJS - NEDERLAND</text>' +
    '<rect x="34" y="66" width="56" height="72" rx="4" fill="#9aa4b1"/>' +
    '<circle cx="62" cy="88" r="12" fill="#e9edf2"/>' +
    '<path d="M44 130q18 -24 36 0z" fill="#e9edf2"/>' +
    '<text x="102" y="76" font-size="10" fill="#1b2330">1. Jansen</text>' +
    '<text x="102" y="92" font-size="10" fill="#1b2330">2. Sanne</text>' +
    '<text x="102" y="108" font-size="10" fill="#1b2330">3. 14.03.2004</text>' +
    '<text x="102" y="124" font-size="10" fill="#1b2330">4a. 02.05.2023</text>' +
    /* Veld 4b uitgelicht: dat is waar het om draait. */
    '<rect x="178" y="94" width="112" height="24" rx="4" fill="#fff" stroke="#e8403f" stroke-width="2"/>' +
    '<text x="184" y="111" font-size="11" fill="#1b2330" font-weight="700">4b. 02.05.2033</text>' +
    '<text x="178" y="80" font-size="10" fill="#e8403f" font-weight="700">geldig tot</text>' +
    '<rect x="178" y="126" width="112" height="22" rx="4" fill="#dce4ee"/>' +
    '<text x="184" y="141" font-size="11" fill="#1b2330" font-weight="700">9. AM  B</text>');
};

/* De massavelden bepalen wat je mag trekken; alleen die drie regels zijn uitgelicht,
   de rest van de kaart is er om het herkenbaar te houden. */
S2['wet-kenteken'] = function(){
  return svg(180, 'Kentekenbewijs met de velden voor de massa van het voertuig en van de aanhangwagen uitgelicht.',
    paneel(180, 'Kentekenbewijs (deel 1B)') +
    '<rect x="22" y="34" width="276" height="134" rx="10" fill="#e9edf2" stroke="currentColor" stroke-width="2"/>' +
    '<rect x="34" y="44" width="92" height="24" rx="4" fill="#f2c200" stroke="#1b2330" stroke-width="1.5"/>' +
    '<text x="80" y="61" text-anchor="middle" font-size="13" fill="#1b2330" font-weight="700">12-ABC-3</text>' +
    '<text x="138" y="54" font-size="10" fill="#1b2330">merk: Volkswagen</text>' +
    '<text x="138" y="68" font-size="10" fill="#1b2330">voertuigcategorie: M1</text>' +
    /* De drie massavelden, elk met hun officiële lettercode. */
    '<rect x="34" y="78" width="252" height="26" rx="4" fill="#fff" stroke="#e8403f" stroke-width="2"/>' +
    '<text x="42" y="95" font-size="11" fill="#1b2330">G. massa ledig voertuig</text>' +
    '<text x="278" y="95" text-anchor="end" font-size="11" fill="#1b2330" font-weight="700">1180 kg</text>' +
    '<rect x="34" y="108" width="252" height="26" rx="4" fill="#fff" stroke="#e8403f" stroke-width="2"/>' +
    '<text x="42" y="125" font-size="11" fill="#1b2330">F.1 toegestane maximummassa</text>' +
    '<text x="278" y="125" text-anchor="end" font-size="11" fill="#1b2330" font-weight="700">1760 kg</text>' +
    '<rect x="34" y="138" width="252" height="26" rx="4" fill="#fff" stroke="#e8403f" stroke-width="2"/>' +
    '<text x="42" y="155" font-size="11" fill="#1b2330">O.1 aanhangwagen geremd</text>' +
    '<text x="278" y="155" text-anchor="end" font-size="11" fill="#1b2330" font-weight="700">1400 kg</text>');
};

/* Glas en sleutels naast elkaar, met beide grenzen eronder: de vraag is altijd welke
   grens voor wie geldt, dus die twee getallen staan naast elkaar. */
S2['wet-alcohol'] = function(){
  return svg(180, 'Een glas bier naast een autosleutel, met de twee alcoholgrenzen eronder.',
    paneel(180, 'Alcohol en rijden') +
    /* Glas. */
    '<path d="M44 40h52v18l-8 56H52l-8 -56z" fill="#f2c200" opacity=".55" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M46 56h48" stroke="#fff" stroke-width="3" opacity=".8"/>' +
    '<text x="70" y="130" text-anchor="middle" font-size="11" fill="currentColor">1 glas</text>' +
    /* Sleutel met afstandsbediening. */
    '<rect x="150" y="56" width="34" height="48" rx="8" fill="currentColor" opacity=".7"/>' +
    '<circle cx="160" cy="70" r="4" fill="var(--surface-2)"/>' +
    '<circle cx="174" cy="70" r="4" fill="var(--surface-2)"/>' +
    '<rect x="182" y="72" width="44" height="9" rx="2" fill="currentColor" opacity=".7"/>' +
    '<path d="M226 72h10v6h-6v9h-6z" fill="currentColor" opacity=".7"/>' +
    '<text x="190" y="130" text-anchor="middle" font-size="11" fill="currentColor">autosleutel</text>' +
    /* De twee grenzen. */
    '<rect x="14" y="140" width="140" height="30" rx="6" fill="#fff" stroke="currentColor" stroke-width="1.5"/>' +
    '<text x="24" y="160" font-size="12" fill="#1b2330" font-weight="700">0,5 ‰ ervaren</text>' +
    '<rect x="166" y="140" width="140" height="30" rx="6" fill="#fff" stroke="#e8403f" stroke-width="2"/>' +
    '<text x="176" y="160" font-size="12" fill="#1b2330" font-weight="700">0,2 ‰ beginnend</text>');
};

/* Vasthouden is het verboden deel, dus de hand om het toestel is het onderwerp; de
   houder op het dashboard staat erbij omdat dat het verschil maakt. */
S2['wet-telefoon'] = function(){
  return svg(180, 'Achter het stuur houdt een bestuurder een telefoon in de hand; op het dashboard zit een lege houder.',
    paneel(180) +
    /* Stuur van achteren gezien. */
    '<circle cx="124" cy="120" r="62" fill="none" stroke="currentColor" stroke-width="12" opacity=".7"/>' +
    '<circle cx="124" cy="120" r="22" fill="currentColor" opacity=".5"/>' +
    '<path d="M102 116H64M146 116h38" stroke="currentColor" stroke-width="10" opacity=".5" stroke-linecap="round"/>' +
    /* Hand met telefoon, rechtsboven het stuur. */
    '<rect x="186" y="34" width="46" height="80" rx="8" fill="#1b2330" stroke="currentColor" stroke-width="2"/>' +
    '<rect x="192" y="42" width="34" height="58" rx="3" fill="#9fd0ff"/>' +
    '<path d="M176 92q-10 10 0 22q10 12 28 12h22v-16h-22z" fill="#d7a06a"/>' +
    '<circle cx="246" cy="60" r="18" fill="none" stroke="#e8403f" stroke-width="4"/>' +
    '<path d="M234 48l24 24" stroke="#e8403f" stroke-width="4"/>' +
    /* Lege houder: het alternatief dat wel mag. */
    '<rect x="26" y="28" width="50" height="34" rx="5" fill="none" stroke="var(--fg-3)" stroke-width="2" stroke-dasharray="4 3"/>' +
    '<text x="26" y="78" font-size="11" fill="currentColor">lege houder</text>');
};

/* De grens is 1,35 meter; daarom staat er een meetlat naast het kind en is de grens
   als lijn getrokken. Zonder die lijn is de vraag niet te beantwoorden. */
S2['wet-gordel-kind'] = function(){
  return svg(180, 'Een kind in een zittingverhoger op de achterbank naast een meetlat met de grens van 1,35 meter.',
    paneel(180, 'Kind in de auto') +
    /* Autostoel in zijaanzicht. */
    '<path d="M92 56h40v76h52v20H92z" fill="currentColor" opacity=".18"/>' +
    '<rect x="120" y="104" width="62" height="18" rx="4" fill="#9bb3d6"/>' +
    '<text x="126" y="146" font-size="11" fill="currentColor">zittingverhoger</text>' +
    /* Kind. */
    '<circle cx="142" cy="74" r="13" fill="currentColor" opacity=".7"/>' +
    '<path d="M130 88h26q8 0 8 10v8h-34z" fill="currentColor" opacity=".7"/>' +
    '<path d="M136 90l24 22" stroke="#e8403f" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M132 116h40" stroke="#e8403f" stroke-width="6" stroke-linecap="round"/>' +
    /* Meetlat: de grens ligt boven het hoofd van dit kind. */
    '<rect x="238" y="34" width="22" height="130" rx="3" fill="#e9edf2" stroke="currentColor" stroke-width="1.5"/>' +
    '<path d="M238 134h22M238 104h14M238 74h14M238 44h14" stroke="#1b2330" stroke-width="1.5"/>' +
    '<path d="M228 74h44" stroke="#e8403f" stroke-width="3"/>' +
    '<text x="266" y="70" font-size="11" fill="#e8403f" font-weight="700">1,35 m</text>' +
    '<path d="M228 104h40" stroke="#2fbf71" stroke-width="2" stroke-dasharray="4 3"/>' +
    '<text x="266" y="118" font-size="11" fill="currentColor">kind: 1,10 m</text>');
};

/* ======================= 8. VOERTUIGKENNIS ======================= */

/* Een rij lampjes met hun echte symbolen: de vraag gaat altijd over welk lampje welke
   kleur heeft en wat je dan doet, dus staat er bij elk één woord. */
S2['voert-dashboard'] = function(){
  return svg(180, 'Instrumentenpaneel met vier waarschuwingslampjes: oliedruk, accu, motorstoring en richtingaanwijzer.',
    paneel(180, 'Lampjes op het instrumentenpaneel') +
    '<rect x="14" y="32" width="292" height="94" rx="10" fill="#1b2330"/>' +
    /* Oliedruk, rood: direct stoppen. */
    '<g transform="translate(52 62)">' +
    '<path d="M-14 0h16q8 0 12 8h-22z" fill="#e8403f"/>' +
    '<path d="M-16 2q-4 6 0 10q6 4 10 -2z" fill="#e8403f"/>' +
    '<text x="-22" y="34" font-size="10" fill="#fff">oliedruk</text>' +
    '</g>' +
    /* Accu, rood. */
    '<g transform="translate(130 62)">' +
    '<rect x="-16" y="-4" width="32" height="18" rx="2" fill="#e8403f"/>' +
    '<rect x="-11" y="-8" width="6" height="4" fill="#e8403f"/>' +
    '<rect x="5" y="-8" width="6" height="4" fill="#e8403f"/>' +
    '<text x="-14" y="34" font-size="10" fill="#fff">accu</text>' +
    '</g>' +
    /* Motorstoring, oranje. */
    '<g transform="translate(208 62)">' +
    '<path d="M-16 2h6v-8h8l4 -4h10v20h-22z" fill="#f2a000"/>' +
    '<text x="-26" y="34" font-size="10" fill="#fff">motorstoring</text>' +
    '</g>' +
    /* Richtingaanwijzer, groen. */
    '<g transform="translate(278 62)">' +
    '<path d="M-14 4l12 -10v6h8v8h-8v6z" fill="#2fbf71"/>' +
    '<text x="-26" y="34" font-size="10" fill="#fff">knipperlicht</text>' +
    '</g>' +
    '<rect x="14" y="138" width="12" height="10" rx="2" fill="#e8403f"/>' +
    '<text x="32" y="147" font-size="11" fill="currentColor">rood</text>' +
    '<rect x="90" y="138" width="12" height="10" rx="2" fill="#f2a000"/>' +
    '<text x="108" y="147" font-size="11" fill="currentColor">oranje</text>' +
    '<rect x="176" y="138" width="12" height="10" rx="2" fill="#2fbf71"/>' +
    '<text x="194" y="147" font-size="11" fill="currentColor">groen</text>');
};

/* De groefdiepte moet af te lezen zijn, dus er staat een dieptemeter met schaal in de
   groef: het getal is het antwoord, niet de band. */
S2['voert-bandprofiel'] = function(){
  return svg(180, 'Dieptemeter in de groef van een band; de schaal geeft 1,2 millimeter aan naast de wettelijke grens van 1,6.',
    paneel(180, 'Profieldiepte meten') +
    '<rect x="20" y="40" width="200" height="40" rx="6" fill="currentColor" opacity=".55"/>' +
    '<rect x="20" y="80" width="200" height="54" fill="currentColor" opacity=".85"/>' +
    /* Groeven; de middelste is uitvergroot met de meter erin. */
    '<rect x="46" y="98" width="16" height="36" fill="var(--surface-2)"/>' +
    '<rect x="150" y="98" width="16" height="36" fill="var(--surface-2)"/>' +
    '<rect x="188" y="98" width="16" height="36" fill="var(--surface-2)"/>' +
    '<rect x="94" y="92" width="26" height="42" fill="var(--surface-2)"/>' +
    '<rect x="20" y="134" width="200" height="8" rx="2" fill="#424b58"/>' +
    /* Dieptemeter: staaf met schaalstreepjes in de uitvergrote groef. */
    '<rect x="100" y="34" width="14" height="76" rx="3" fill="#9bb3d6" stroke="currentColor" stroke-width="1.5"/>' +
    '<path d="M114 98h12M114 90h18M114 82h12M114 74h18" stroke="currentColor" stroke-width="1.5"/>' +
    '<text x="136" y="94" font-size="10" fill="currentColor">1,6 mm</text>' +
    '<text x="136" y="78" font-size="10" fill="currentColor">3,0 mm</text>' +
    '<path d="M94 92h-40" stroke="#e8403f" stroke-width="1" stroke-dasharray="3 2"/>' +
    maat(84, 92, 84, 110, '1,2 mm', '#e8403f') +
    '<rect x="232" y="54" width="76" height="46" rx="6" fill="#fff" stroke="#e8403f" stroke-width="2"/>' +
    '<text x="270" y="76" text-anchor="middle" font-size="11" fill="#1b2330">wettelijk</text>' +
    '<text x="270" y="92" text-anchor="middle" font-size="13" fill="#1b2330" font-weight="700">1,6 mm</text>' +
    '<text x="232" y="128" font-size="11" fill="currentColor">gemeten in de</text>' +
    '<text x="232" y="144" font-size="11" fill="currentColor">hoofdgroef</text>');
};

/* Zijaanzicht, omdat alleen daar de koppeling, de breekkabel en het neusgewicht
   tegelijk te zien zijn. De massa\'s staan erbij voor de rekenvragen. */
S2['voert-aanhanger'] = function(){
  return svg(180, 'Auto met een aanhangwagen in zijaanzicht; de koppeling en de breekkabel zijn uitgelicht.',
    paneel(180, 'Auto met aanhangwagen') +
    '<rect x="0" y="130" width="320" height="18" fill="#4a5361"/>' +
    /* Auto, neus naar links. */
    '<g transform="translate(78 104)">' +
    '<path d="M-56 24h100V8c0-3 -3-5 -7-6l-11-9c-3-3 -6-4 -10-4h-40c-5 0-8 2-11 5l-8 8c-9 2-13 5-13 9z" fill="#2f6bbf"/>' +
    '<path d="M-24 -8h16v9h-24z" fill="#cfe2ff" opacity=".9"/>' +
    '<path d="M-4 -8h11c3 0 4 1 6 3l6 6H-4z" fill="#cfe2ff" opacity=".9"/>' +
    '<circle cx="-32" cy="26" r="9" fill="#222"/><circle cx="26" cy="26" r="9" fill="#222"/>' +
    '</g>' +
    /* Trekhaak en dissel. */
    '<path d="M122 126h34" stroke="currentColor" stroke-width="5"/>' +
    '<circle cx="128" cy="126" r="6" fill="currentColor"/>' +
    /* Breekkabel: lus van auto naar aanhanger. */
    '<path d="M124 130q14 14 30 -2" fill="none" stroke="#e8403f" stroke-width="2.5"/>' +
    '<g transform="translate(228 100)">' +
    '<rect x="-68" y="0" width="136" height="30" rx="4" fill="currentColor" opacity=".5"/>' +
    '<rect x="-68" y="-18" width="136" height="18" rx="3" fill="currentColor" opacity=".28"/>' +
    '<circle cx="-18" cy="32" r="9" fill="#222"/>' +
    '<rect x="62" y="12" width="10" height="8" rx="2" fill="#e8403f"/>' +
    '</g>' +
    '<path d="M134 148v10h88v-10" stroke="var(--fg-3)" stroke-width="1" fill="none"/>' +
    '<text x="134" y="172" font-size="11" fill="currentColor">aanhanger: 900 kg geremd</text>' +
    '<text x="14" y="172" font-size="11" fill="currentColor">auto: 1760 kg</text>' +
    '<path d="M132 122l-14 -22" stroke="var(--fg-3)" stroke-width="1"/>' +
    '<text x="96" y="94" font-size="10" fill="#e8403f" font-weight="700">koppeling + breekkabel</text>');
};

/* Uitstekende lading: de maat en de markering zijn het onderwerp, dus de overhang
   staat als maatpijl erbij en de rode vlag zit op het uiterste punt. */
S2['voert-lading'] = function(){
  return svg(180, 'Een plank steekt achter uit een auto met een rode markering op het uiteinde; de overhang is opgemeten.',
    paneel(180, 'Uitstekende lading') +
    '<rect x="0" y="134" width="320" height="18" fill="#4a5361"/>' +
    '<g transform="translate(110 108)">' +
    '<path d="M-60 24h104V8c0-3 -3-5 -7-6l-11-9c-3-3 -6-4 -10-4h-42c-5 0-8 2-11 5l-8 8c-9 2-15 5-15 9z" fill="#2f6bbf"/>' +
    '<path d="M-28 -8h18v9h-26z" fill="#cfe2ff" opacity=".9"/>' +
    '<path d="M-6 -8h11c3 0 4 1 6 3l6 6H-6z" fill="#cfe2ff" opacity=".9"/>' +
    '<circle cx="-36" cy="26" r="9" fill="#222"/><circle cx="24" cy="26" r="9" fill="#222"/>' +
    '</g>' +
    /* De lading steekt achter uit de kofferbak, naar rechts. */
    '<rect x="150" y="92" width="130" height="12" rx="2" fill="#c89a5b"/>' +
    '<rect x="268" y="80" width="26" height="26" rx="2" fill="#e8403f"/>' +
    '<path d="M268 80l26 26M294 80l-26 26" stroke="#fff" stroke-width="2"/>' +
    maat(168, 70, 280, 70, '1,2 m achter de auto') +
    '<path d="M168 76v16M280 76v16" stroke="#f2c200" stroke-width="1" stroke-dasharray="3 2"/>' +
    '<text x="14" y="166" font-size="11" fill="currentColor">markering: 50 bij 50 cm, rood-wit</text>');
};

/* Een APK-vraag draait om de datum: die staat groot op het keuringsbewijs, met de
   datum van vandaag ernaast zodat er iets te vergelijken valt. */
S2['voert-apk'] = function(){
  return svg(180, 'Keuringsbewijs met de vervaldatum van de APK naast de datum van vandaag.',
    paneel(180, 'APK') +
    '<rect x="22" y="36" width="180" height="124" rx="10" fill="#e9edf2" stroke="currentColor" stroke-width="2"/>' +
    '<rect x="22" y="36" width="180" height="22" rx="10" fill="#2f6bbf"/>' +
    '<text x="34" y="52" font-size="11" fill="#fff" font-weight="700">KEURINGSBEWIJS</text>' +
    '<text x="34" y="80" font-size="11" fill="#1b2330">kenteken: 12-ABC-3</text>' +
    '<text x="34" y="100" font-size="11" fill="#1b2330">gekeurd: 04.11.2024</text>' +
    '<rect x="32" y="110" width="160" height="34" rx="6" fill="#fff" stroke="#e8403f" stroke-width="2"/>' +
    '<text x="42" y="124" font-size="10" fill="#e8403f" font-weight="700">geldig tot</text>' +
    '<text x="42" y="139" font-size="14" fill="#1b2330" font-weight="700">04.11.2025</text>' +
    /* Kalenderblad met vandaag: zonder referentiedatum zegt een vervaldatum niets. */
    '<rect x="218" y="56" width="86" height="80" rx="8" fill="#fff" stroke="currentColor" stroke-width="2"/>' +
    '<rect x="218" y="56" width="86" height="20" rx="8" fill="#e8403f"/>' +
    '<text x="261" y="71" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">vandaag</text>' +
    '<text x="261" y="102" text-anchor="middle" font-size="17" fill="#1b2330" font-weight="700">12</text>' +
    '<text x="261" y="124" text-anchor="middle" font-size="11" fill="#1b2330">dec 2025</text>');
};

/* Achteraanzicht met alle lichten benoemd: bij verlichtingsvragen is het verschil
   tussen achterlicht, remlicht en mistachterlicht het hele punt. */
S2['voert-verlichting'] = function(){
  return svg(180, 'Achterkant van een auto met de achterlichten, remlichten, mistachterlicht, achteruitrijlicht en kentekenverlichting benoemd.',
    paneel(180, 'Verlichting achter') +
    '<g transform="translate(130 120) scale(1.5)">' +
    '<rect x="-38" y="-48" width="76" height="32" rx="9" fill="currentColor" opacity=".55"/>' +
    '<rect x="-44" y="-20" width="88" height="24" rx="6" fill="currentColor" opacity=".55"/>' +
    '<rect x="-27" y="-43" width="54" height="21" rx="4" fill="#2a3140" opacity=".7"/>' +
    /* Linkercluster: achterlicht boven, mistachterlicht onder. */
    '<rect x="-42" y="-16" width="14" height="8" rx="2" fill="#e8403f"/>' +
    '<rect x="-42" y="-6" width="7" height="7" rx="2" fill="#a3140f"/>' +
    '<rect x="-34" y="-6" width="7" height="7" rx="2" fill="#fff"/>' +
    '<rect x="28" y="-16" width="14" height="8" rx="2" fill="#e8403f"/>' +
    '<rect x="28" y="-6" width="7" height="7" rx="2" fill="#a3140f"/>' +
    '<rect x="36" y="-6" width="7" height="7" rx="2" fill="#fff"/>' +
    '<rect x="-13" y="2" width="26" height="6" rx="2" fill="#f4f7fa" stroke="#1b2330" stroke-width="0.6"/>' +
    '</g>' +
    '<path d="M68 96h-30" stroke="var(--fg-3)" stroke-width="1"/>' +
    '<text x="6" y="92" font-size="10" fill="currentColor">achterlicht /</text>' +
    '<text x="6" y="104" font-size="10" fill="currentColor">remlicht</text>' +
    '<path d="M70 112h-34" stroke="var(--fg-3)" stroke-width="1"/>' +
    '<text x="6" y="130" font-size="10" fill="#e8403f" font-weight="700">mistachterlicht</text>' +
    '<path d="M186 112h34" stroke="var(--fg-3)" stroke-width="1"/>' +
    '<text x="224" y="110" font-size="10" fill="currentColor">achteruitrijlicht</text>' +
    '<path d="M150 134v18h74" stroke="var(--fg-3)" stroke-width="1" fill="none"/>' +
    '<text x="228" y="156" font-size="10" fill="currentColor">kentekenlicht</text>');
};

/* Twee balken op dezelfde schaal, maar nu droog tegen nat bij dezelfde snelheid: zo
   is af te lezen hoeveel langer de remweg wordt en blijft de reactieafstand gelijk. */
S2['voert-remweg'] = function(){
  return svg(170, 'Balkdiagram van de stopafstand bij tachtig kilometer per uur op droog en op nat wegdek.',
    paneel(170, 'Stopafstand bij 80 km/h') +
    '<rect x="112" y="12" width="12" height="9" rx="2" fill="#2f6bbf"/>' +
    '<text x="129" y="21" font-size="11" fill="currentColor">reactieafstand</text>' +
    '<rect x="222" y="12" width="12" height="9" rx="2" fill="#e8403f"/>' +
    '<text x="239" y="21" font-size="11" fill="currentColor">remweg</text>' +
    /* Schaal: 1 meter = 2,4 px, zodat 90 m net past. */
    '<text x="14" y="50" font-size="11" fill="currentColor">droog</text>' +
    '<rect x="62" y="38" width="53" height="18" rx="3" fill="#2f6bbf"/>' +
    '<rect x="115" y="38" width="77" height="18" rx="3" fill="#e8403f"/>' +
    '<text x="66" y="51" font-size="11" fill="#fff">22 m</text>' +
    '<text x="119" y="51" font-size="11" fill="#fff">32 m</text>' +
    '<text x="198" y="51" font-size="12" fill="currentColor" font-weight="700">54 m</text>' +
    '<text x="14" y="92" font-size="11" fill="currentColor">nat</text>' +
    '<rect x="62" y="80" width="53" height="18" rx="3" fill="#2f6bbf"/>' +
    '<rect x="115" y="80" width="154" height="18" rx="3" fill="#e8403f"/>' +
    '<text x="66" y="93" font-size="11" fill="#fff">22 m</text>' +
    '<text x="119" y="93" font-size="11" fill="#fff">64 m</text>' +
    '<text x="275" y="93" font-size="12" fill="currentColor" font-weight="700">86 m</text>' +
    '<path d="M62 110v-82" stroke="var(--fg-3)" stroke-width="1" stroke-dasharray="3 3"/>' +
    '<text x="14" y="130" font-size="11" fill="currentColor">De reactieafstand blijft gelijk;</text>' +
    '<text x="14" y="146" font-size="11" fill="currentColor">alleen de remweg loopt op.</text>' +
    '<text x="14" y="162" font-size="11" fill="currentColor">Stopafstand = reactieafstand + remweg.</text>');
};

for(var k in S2) if(Object.prototype.hasOwnProperty.call(S2,k)) window.SITUATIES[k]=S2[k];

})();
