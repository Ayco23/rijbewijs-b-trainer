/* Taferelen bij de lesstof: 18 schematische diagrammen als inline SVG.
   Inline en niet als bestand, omdat de artifact-CSP externe afbeeldingen
   blokkeert — dezelfde reden als bij de borden.

   Kleurafspraak: lijnen en tekst gebruiken currentColor, zodat ze in het
   lichte en het donkere thema meelopen met de tekstkleur van de container.
   Vlakken op de achtergrond gebruiken var(--surface-2) en secundaire lijnen
   var(--line) / var(--fg-3) — dat zijn de variabelen die index.html echt
   definieert. Alleen echte verkeerskleuren staan hard in de code: asfalt,
   belijning, rood/oranje/groen en glas. Die betekenen iets en mogen dus niet
   per thema verschuiven.

   Elke functie geeft een string terug met een <svg> van 320 breed zonder
   height; index.html schaalt via CSS (width:100%). Mobiel-eerst: ze worden
   op ongeveer 360 px bekeken, dus lettergroottes blijven 11-13. */
(function(){

/* Hulpvormen. Ze staan binnen de IIFE en niet in het object zelf, want
   window.ILLUSTRATIES moet precies de 18 taferelen bevatten: index.html mag
   er overheen lopen zonder op hulpsleutels te stuiten. Ze geven een fragment
   terug zonder <svg>-wikkel, omdat ze altijd in een tafereel landen. */
function autoZij(kleur){
  return '<g>' +
    '<path d="M5 24h62v-6c0-2.4-1.8-4.2-4.8-4.8l-7.2-6c-1.8-1.8-3.6-2.4-6-2.4H26c-3 0-4.8 1-6.6 3L14 13.2C8 14.2 5 16.2 5 19z" fill="' + kleur + '"/>' +
    '<path d="M25 7h10v6H19z" fill="#cfe2ff" opacity=".85"/>' +
    '<path d="M37 7h7c1.6 0 2.4.5 3.6 1.7L51.2 13H37z" fill="#cfe2ff" opacity=".85"/>' +
    '<circle cx="20" cy="25" r="6.5" fill="#222"/><circle cx="20" cy="25" r="2.6" fill="#bbb"/>' +
    '<circle cx="54" cy="25" r="6.5" fill="#222"/><circle cx="54" cy="25" r="2.6" fill="#bbb"/>' +
    '</g>';
}
function mens(x, y, kleur){
  return '<g transform="translate(' + x + ' ' + y + ')">' +
    '<circle cx="0" cy="-18" r="5" fill="' + kleur + '"/>' +
    '<path d="M0 -13v10M-6 -8h12M0 -3l-5 9M0 -3l5 9" stroke="' + kleur + '" stroke-width="2.5" stroke-linecap="round" fill="none"/>' +
    '</g>';
}

window.ILLUSTRATIES = {

  /* Het sterkste diagram van de set: twee balken onder elkaar laten zien dat
     bij dubbele snelheid de reactieafstand verdubbelt maar de remweg vier
     keer zo lang wordt. Daarom staan beide balken op dezelfde schaal. */
  stopafstand: function(){
    return '<svg viewBox="0 0 320 170" width="100%" role="img" ' +
      'aria-label="Balkdiagram: bij 50 km per uur is de stopafstand ongeveer 14 plus 13 is 27 meter, bij 100 km per uur 28 plus 50 is 78 meter. De snelheid verdubbelt, de remweg wordt vier keer zo lang.">' +
      '<rect x="0" y="0" width="320" height="170" rx="8" fill="var(--surface-2)"/>' +
      /* Schaal: 1 meter = 3,4 px, zodat 78 m net binnen de breedte past. */
      '<text x="14" y="22" font-size="12" fill="currentColor" font-weight="700">Stopafstand</text>' +
      '<rect x="100" y="14" width="12" height="9" rx="2" fill="#2f6bbf"/>' +
      '<text x="117" y="22" font-size="11" fill="currentColor">reactie</text>' +
      '<rect x="168" y="14" width="12" height="9" rx="2" fill="#e8403f"/>' +
      '<text x="185" y="22" font-size="11" fill="currentColor">remweg</text>' +

      '<text x="14" y="52" font-size="12" fill="currentColor">50 km/h</text>' +
      '<rect x="14" y="58" width="48" height="18" rx="3" fill="#2f6bbf"/>' +
      '<rect x="62" y="58" width="44" height="18" rx="3" fill="#e8403f"/>' +
      '<text x="16" y="71" font-size="11" fill="#fff">14 m</text>' +
      '<text x="66" y="71" font-size="11" fill="#fff">13 m</text>' +
      '<text x="114" y="71" font-size="12" fill="currentColor" font-weight="700">= 27 m</text>' +

      '<text x="14" y="104" font-size="12" fill="currentColor">100 km/h</text>' +
      '<rect x="14" y="110" width="95" height="18" rx="3" fill="#2f6bbf"/>' +
      '<rect x="109" y="110" width="170" height="18" rx="3" fill="#e8403f"/>' +
      '<text x="16" y="123" font-size="11" fill="#fff">28 m</text>' +
      '<text x="113" y="123" font-size="11" fill="#fff">50 m</text>' +
      '<text x="14" y="146" font-size="12" fill="currentColor" font-weight="700">= 78 m</text>' +

      '<path d="M70 150h236" stroke="var(--fg-3)" stroke-width="1" stroke-dasharray="3 3"/>' +
      '<text x="76" y="163" font-size="11" fill="currentColor">2x snelheid = 4x remweg</text>' +
      '</svg>';
  },

  /* Twee seconden is de enige regel die je rijdend kunt tellen; de maatpijl
     laat zien dat het om tijd gaat en niet om een vast aantal meters. */
  tweeseconden: function(){
    return '<svg viewBox="0 0 320 130" width="100%" role="img" ' +
      'aria-label="Twee auto\'s achter elkaar met een tussenruimte van twee seconden.">' +
      '<rect x="0" y="40" width="320" height="56" fill="#424b58"/>' +
      '<rect x="0" y="66" width="320" height="3" fill="#fff" opacity=".2"/>' +
      '<g transform="translate(10 48)">' + autoZij('#f2c200') + '</g>' +
      '<g transform="translate(222 48)">' + autoZij('#2f6bbf') + '</g>' +
      '<path d="M86 104h148" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M86 104l9-5v10zM234 104l-9-5v10z" fill="currentColor"/>' +
      '<rect x="134" y="94" width="52" height="20" rx="5" fill="var(--surface-2)" stroke="currentColor" stroke-width="1"/>' +
      '<text x="145" y="108" font-size="12" fill="currentColor" font-weight="700">2 sec</text>' +
      '<text x="10" y="26" font-size="12" fill="currentColor">Tel: 21 - 22 nadat de voorligger een punt passeert</text>' +
      '</svg>';
  },

  /* Bovenaanzicht: de spiegels dekken kegels af, en wat daartussen valt is de
     dode hoek. De fietser staat er in, want dat is het hele punt. */
  dodehoek: function(){
    return '<svg viewBox="0 0 320 150" width="100%" role="img" ' +
      'aria-label="Auto van bovenaf met spiegelvelden en het gearceerde dodehoekgebied, met een fietser daarin.">' +
      '<defs><pattern id="ill-arc" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<rect x="0" y="0" width="3" height="7" fill="#e8403f" opacity=".45"/></pattern></defs>' +
      '<rect x="0" y="0" width="320" height="150" rx="8" fill="var(--surface-2)"/>' +
      /* Spiegelvelden als lichte kegels vanuit de buitenspiegels. */
      '<path d="M118 52 L10 16 L10 60 Z" fill="#2f6bbf" opacity=".22"/>' +
      '<path d="M118 98 L10 134 L10 90 Z" fill="#2f6bbf" opacity=".22"/>' +
      /* Dode hoek: tussen spiegelveld en ooghoek, links achter. */
      '<path d="M122 96 L58 128 L22 128 L112 104 Z" fill="url(#ill-arc)" stroke="#e8403f" stroke-width="1"/>' +
      /* Auto van boven, neus naar rechts. */
      '<rect x="118" y="58" width="130" height="34" rx="12" fill="currentColor" opacity=".85"/>' +
      '<rect x="150" y="63" width="52" height="24" rx="6" fill="#cfe2ff" opacity=".9"/>' +
      '<rect x="128" y="52" width="10" height="6" rx="2" fill="currentColor"/>' +
      '<rect x="128" y="92" width="10" height="6" rx="2" fill="currentColor"/>' +
      /* Fietser in de dode hoek. */
      '<circle cx="74" cy="114" r="6" fill="#2fbf71"/>' +
      '<circle cx="62" cy="122" r="5" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<circle cx="86" cy="122" r="5" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M62 122l12 0M74 122l6-8" stroke="currentColor" stroke-width="2"/>' +
      '<text x="14" y="18" font-size="11" fill="currentColor">spiegelveld</text>' +
      '<text x="150" y="140" font-size="11" fill="#e8403f" font-weight="700">dode hoek: kijk om</text>' +
      '</svg>';
  },

  /* Twee bundels naast elkaar: alleen de lengte en de hoek verschillen, want
     dat is precies wat het verschil maakt voor de tegenligger. */
  dimlicht: function(){
    return '<svg viewBox="0 0 320 150" width="100%" role="img" ' +
      'aria-label="Dimlicht geeft een korte bundel naar beneden, groot licht een lange bundel die de tegenligger verblindt.">' +
      '<rect x="0" y="0" width="320" height="150" rx="8" fill="var(--surface-2)"/>' +
      '<text x="12" y="18" font-size="12" fill="currentColor" font-weight="700">Dimlicht</text>' +
      '<rect x="0" y="22" width="320" height="46" fill="#424b58"/>' +
      '<g transform="translate(10 28)">' + autoZij('#2f6bbf') + '</g>' +
      '<path d="M78 44 L162 62 L78 56 Z" fill="#f2c200" opacity=".75"/>' +
      '<text x="170" y="60" font-size="11" fill="currentColor">ca. 50 m</text>' +
      '<g transform="translate(262 28) scale(-1 1)">' + autoZij('#2fbf71') + '</g>' +

      '<text x="12" y="88" font-size="12" fill="currentColor" font-weight="700">Groot licht</text>' +
      '<rect x="0" y="92" width="320" height="46" fill="#424b58"/>' +
      '<g transform="translate(10 98)">' + autoZij('#2f6bbf') + '</g>' +
      '<path d="M78 112 L252 104 L252 126 L78 122 Z" fill="#f2c200" opacity=".75"/>' +
      '<g transform="translate(300 98) scale(-1 1)">' + autoZij('#2fbf71') + '</g>' +
      '<text x="150" y="136" font-size="11" fill="#e8403f" font-weight="700">verblindt</text>' +
      '</svg>';
  },

  /* Doorsnede, niet het loopvlak: alleen zo is te zien waar de 1,6 mm zit. */
  bandprofiel: function(){
    var groeven = '';
    var i;
    for(i = 0; i < 5; i++){
      groeven += '<rect x="' + (62 + i * 38) + '" y="62" width="16" height="34" fill="var(--surface-2)"/>';
    }
    return '<svg viewBox="0 0 320 140" width="100%" role="img" ' +
      'aria-label="Doorsnede van een band: de groeven moeten minstens 1,6 millimeter diep zijn.">' +
      '<rect x="0" y="0" width="320" height="140" rx="8" fill="var(--surface-2)"/>' +
      '<rect x="24" y="28" width="272" height="34" rx="6" fill="currentColor" opacity=".55"/>' +
      '<rect x="24" y="62" width="272" height="34" fill="currentColor" opacity=".85"/>' +
      groeven +
      '<rect x="24" y="96" width="272" height="6" rx="2" fill="#424b58"/>' +
      '<path d="M46 62v34" stroke="#f2c200" stroke-width="2"/>' +
      '<path d="M46 62l-4 6h8zM46 96l-4-6h8z" fill="#f2c200"/>' +
      '<rect x="100" y="106" width="118" height="22" rx="6" fill="var(--surface-2)" stroke="currentColor" stroke-width="1"/>' +
      '<text x="110" y="121" font-size="12" fill="currentColor" font-weight="700">minimaal 1,6 mm</text>' +
      '<text x="24" y="20" font-size="11" fill="currentColor">profieldiepte</text>' +
      '</svg>';
  },

  /* Niet alle lampjes zijn even dringend; de kleur is de boodschap, dus die
     staat hier centraal met één woord ernaast. */
  dashboard: function(){
    return '<svg viewBox="0 0 320 140" width="100%" role="img" ' +
      'aria-label="Waarschuwingslampjes: rood betekent stoppen, oranje betekent controleren, groen betekent dat iets aan staat.">' +
      '<rect x="0" y="0" width="320" height="140" rx="8" fill="var(--surface-2)"/>' +
      '<text x="16" y="24" font-size="12" fill="currentColor" font-weight="700">Kleur = urgentie</text>' +

      '<circle cx="42" cy="56" r="17" fill="#e8403f"/>' +
      '<path d="M36 50h12M42 50v12" stroke="#fff" stroke-width="3" stroke-linecap="round"/>' +
      '<text x="72" y="54" font-size="13" fill="currentColor" font-weight="700">Rood</text>' +
      '<text x="72" y="70" font-size="11" fill="currentColor">stoppen</text>' +

      '<circle cx="42" cy="100" r="17" fill="#f2c200"/>' +
      '<path d="M42 91v10" stroke="#1b2330" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="42" cy="108" r="2" fill="#1b2330"/>' +
      '<text x="72" y="98" font-size="13" fill="currentColor" font-weight="700">Oranje</text>' +
      '<text x="72" y="114" font-size="11" fill="currentColor">controleren</text>' +

      '<circle cx="200" cy="56" r="17" fill="#2fbf71"/>' +
      '<path d="M192 56l6 6 10-12" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<text x="230" y="54" font-size="13" fill="currentColor" font-weight="700">Groen</text>' +
      '<text x="230" y="70" font-size="11" fill="currentColor">staat aan</text>' +
      '</svg>';
  },

  /* Haaientanden wijzen naar wie moet wachten; de punt staat naar de
     naderende bestuurder toe. */
  rotonde: function(){
    var tanden = '';
    var i;
    for(i = 0; i < 5; i++){
      tanden += '<path d="M' + (150 + i * 9) + ' 128l4.5 9h-9z" fill="#fff"/>';
    }
    return '<svg viewBox="0 0 320 160" width="100%" role="img" ' +
      'aria-label="Rotonde van bovenaf: verkeer op de rotonde heeft voorrang, bij de oprit liggen haaientanden.">' +
      '<rect x="0" y="0" width="320" height="160" rx="8" fill="var(--surface-2)"/>' +
      '<circle cx="160" cy="68" r="56" fill="#424b58"/>' +
      '<circle cx="160" cy="68" r="26" fill="#2fbf71" opacity=".75"/>' +
      '<circle cx="160" cy="68" r="26" fill="none" stroke="#fff" stroke-width="2"/>' +
      '<rect x="138" y="118" width="44" height="42" fill="#424b58"/>' +
      '<rect x="0" y="48" width="106" height="40" fill="#424b58"/>' +
      '<rect x="214" y="48" width="106" height="40" fill="#424b58"/>' +
      tanden +
      /* Pijlen met de rijrichting mee: op een rotonde rijd je rechtsom. */
      '<path d="M160 24a44 44 0 0 1 38 22" stroke="#fff" stroke-width="3" fill="none"/>' +
      '<path d="M198 46l-11-2 5-8z" fill="#fff"/>' +
      '<path d="M160 112a44 44 0 0 1-38-22" stroke="#fff" stroke-width="3" fill="none"/>' +
      '<path d="M122 90l11 2-5 8z" fill="#fff"/>' +
      '<text x="190" y="142" font-size="11" fill="currentColor" font-weight="700">haaientanden: verleen voorrang</text>' +
      '</svg>';
  },

  /* De vluchtstrook is geen rijstrook: hij heeft daarom een doorgetrokken
     streep en een andere toon dan de rijstroken. */
  snelweg: function(){
    var streep = '';
    var i;
    for(i = 0; i < 9; i++){
      streep += '<rect x="' + (8 + i * 36) + '" y="63" width="20" height="4" rx="2" fill="#fff"/>';
    }
    return '<svg viewBox="0 0 320 150" width="100%" role="img" ' +
      'aria-label="Autosnelweg van bovenaf met twee rijstroken, een vluchtstrook rechts en een invoegstrook.">' +
      '<rect x="0" y="0" width="320" height="150" rx="8" fill="var(--surface-2)"/>' +
      '<rect x="0" y="24" width="320" height="86" fill="#424b58"/>' +
      '<rect x="0" y="24" width="320" height="4" fill="#fff"/>' +
      streep +
      '<rect x="0" y="100" width="320" height="4" fill="#fff"/>' +
      '<rect x="0" y="104" width="320" height="18" fill="#3a434e"/>' +
      '<path d="M150 150 L230 122 L320 122 L320 104 L198 104 Z" fill="#424b58"/>' +
      '<text x="10" y="48" font-size="11" fill="#fff">rijstrook</text>' +
      '<text x="10" y="88" font-size="11" fill="#fff">rijstrook</text>' +
      '<text x="10" y="118" font-size="11" fill="#fff">vluchtstrook</text>' +
      '<text x="196" y="142" font-size="11" fill="currentColor" font-weight="700">invoegstrook</text>' +
      '<text x="10" y="18" font-size="11" fill="currentColor">vluchtstrook alleen bij pech</text>' +
      '</svg>';
  },

  /* Op een erf is de hele breedte van de weg speelruimte; daarom staan de
     figuren bewust niet netjes op een stoep. */
  erf: function(){
    return '<svg viewBox="0 0 320 150" width="100%" role="img" ' +
      'aria-label="Erf van bovenaf: voetgangers mogen de hele breedte gebruiken, je rijdt er stapvoets, ongeveer 15 kilometer per uur.">' +
      '<rect x="0" y="0" width="320" height="150" rx="8" fill="var(--surface-2)"/>' +
      '<rect x="0" y="30" width="320" height="86" fill="#424b58"/>' +
      '<rect x="0" y="30" width="320" height="86" fill="#2f6bbf" opacity=".12"/>' +
      /* Vier figuren verspreid over de volle breedte. */
      mens(46, 54, '#f2c200') +
      mens(104, 92, '#2fbf71') +
      mens(176, 48, '#e8403f') +
      mens(236, 88, '#cfe2ff') +
      '<circle cx="140" cy="100" r="6" fill="#e8403f"/>' +
      '<path d="M140 100l22 8" stroke="currentColor" stroke-width="2"/>' +
      '<rect x="252" y="40" width="56" height="24" rx="6" fill="#2f6bbf"/>' +
      '<text x="262" y="56" font-size="12" fill="#fff" font-weight="700">15</text>' +
      '<text x="282" y="56" font-size="10" fill="#fff">km/h</text>' +
      '<text x="10" y="20" font-size="12" fill="currentColor" font-weight="700">Erf: stapvoets, voetganger gaat voor</text>' +
      '<text x="10" y="136" font-size="11" fill="currentColor">parkeren alleen in de vakken met een P</text>' +
      '</svg>';
  },

  /* Andreaskruis plus knipperlichten plus bomen: de drie dingen die je bij
     een overweg moet herkennen, in één beeld. */
  spoorweg: function(){
    return '<svg viewBox="0 0 320 150" width="100%" role="img" ' +
      'aria-label="Spoorwegovergang met andreaskruis, rode knipperlichten en gesloten bomen.">' +
      '<rect x="0" y="0" width="320" height="150" rx="8" fill="var(--surface-2)"/>' +
      '<rect x="0" y="54" width="320" height="52" fill="#424b58"/>' +
      /* Rails en dwarsliggers. */
      '<rect x="0" y="66" width="320" height="4" fill="var(--fg-3)"/>' +
      '<rect x="0" y="90" width="320" height="4" fill="var(--fg-3)"/>' +
      '<rect x="140" y="60" width="40" height="40" fill="#5a6470"/>' +
      /* Andreaskruis: enkel spoor. */
      '<g transform="translate(40 16)">' +
      '<path d="M0 0l34 24M34 0L0 24" stroke="#e8403f" stroke-width="6" stroke-linecap="round"/>' +
      '<rect x="14" y="26" width="6" height="36" fill="var(--fg-3)"/>' +
      '</g>' +
      /* Knipperlichten. */
      '<circle cx="110" cy="26" r="9" fill="#e8403f"/>' +
      '<circle cx="134" cy="26" r="9" fill="#e8403f" opacity=".3"/>' +
      '<rect x="119" y="34" width="6" height="28" fill="var(--fg-3)"/>' +
      /* Bomen, gesloten. */
      '<rect x="196" y="40" width="112" height="9" rx="4" fill="#e8403f"/>' +
      '<rect x="206" y="40" width="14" height="9" fill="#fff"/>' +
      '<rect x="240" y="40" width="14" height="9" fill="#fff"/>' +
      '<rect x="274" y="40" width="14" height="9" fill="#fff"/>' +
      '<rect x="194" y="40" width="6" height="34" fill="var(--fg-3)"/>' +
      '<text x="10" y="128" font-size="11" fill="currentColor" font-weight="700">Rood knipperlicht: stoppen, ook zonder trein</text>' +
      '<text x="10" y="144" font-size="11" fill="currentColor">Nooit de overweg op als je er niet af kunt</text>' +
      '</svg>';
  },

  /* De afstandsmarkering en de vluchtdeur zijn het enige dat telt als het
     misgaat; daarom staan ze groot in beeld. */
  tunnel: function(){
    var lampen = '';
    var i;
    for(i = 0; i < 6; i++){
      lampen += '<rect x="' + (36 + i * 46) + '" y="34" width="22" height="5" rx="2" fill="#f2c200"/>';
    }
    return '<svg viewBox="0 0 320 150" width="100%" role="img" ' +
      'aria-label="Tunnelbuis met verlichting, een afstandsmarkering en een vluchtdeur.">' +
      '<rect x="0" y="0" width="320" height="150" rx="8" fill="var(--surface-2)"/>' +
      '<path d="M16 130V60a144 46 0 0 1 288 0v70z" fill="#2b323c"/>' +
      lampen +
      '<rect x="16" y="112" width="288" height="18" fill="#424b58"/>' +
      '<rect x="120" y="119" width="80" height="4" rx="2" fill="#fff" opacity=".8"/>' +
      /* Vluchtdeur met groen pictogram. */
      '<rect x="248" y="76" width="30" height="36" rx="3" fill="#2fbf71"/>' +
      '<rect x="256" y="84" width="8" height="20" rx="2" fill="#fff"/>' +
      '<text x="226" y="72" font-size="11" fill="#2fbf71" font-weight="700">vluchtdeur</text>' +
      /* Afstandsmarkering langs de wand. */
      '<rect x="36" y="84" width="46" height="20" rx="4" fill="#fff"/>' +
      '<text x="42" y="99" font-size="12" fill="#1b2330" font-weight="700">100 m</text>' +
      '<text x="36" y="76" font-size="11" fill="#f2c200">afstandsmarkering</text>' +
      '<text x="16" y="146" font-size="11" fill="currentColor">Pech: alarmlichten aan, motor uit, sleutel in het slot</text>' +
      '</svg>';
  },

  /* De auto staat vóór de strepen stil: wachten op de zebra zelf is te laat. */
  zebra: function(){
    var strepen = '';
    var i;
    for(i = 0; i < 5; i++){
      strepen += '<rect x="' + (150 + i * 20) + '" y="40" width="11" height="64" fill="#fff"/>';
    }
    return '<svg viewBox="0 0 320 150" width="100%" role="img" ' +
      'aria-label="Voetgangersoversteekplaats: de auto staat stil voor de zebra terwijl een voetganger wacht om over te steken.">' +
      '<rect x="0" y="0" width="320" height="150" rx="8" fill="var(--surface-2)"/>' +
      '<rect x="0" y="40" width="320" height="64" fill="#424b58"/>' +
      strepen +
      '<rect x="140" y="40" width="4" height="64" fill="#fff" opacity=".5"/>' +
      '<g transform="translate(20 52)">' + autoZij('#2f6bbf') + '</g>' +
      mens(188, 118, '#f2c200') +
      '<path d="M188 110v-10" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M188 96l-5 8h10z" fill="currentColor"/>' +
      '<text x="12" y="24" font-size="12" fill="currentColor" font-weight="700">Stoppen voor de zebra, niet erop</text>' +
      '<text x="12" y="140" font-size="11" fill="currentColor">Niet inhalen vlak voor een zebra</text>' +
      '</svg>';
  },

  /* Pijlen vertellen het hele verhaal: de achterkant gaat de ene kant op,
     het stuur gaat dezelfde kant op. */
  slippen: function(){
    return '<svg viewBox="0 0 320 150" width="100%" role="img" ' +
      'aria-label="De achterkant van de auto breekt naar rechts uit; stuur dan naar dezelfde kant, naar de slip toe.">' +
      '<rect x="0" y="0" width="320" height="150" rx="8" fill="var(--surface-2)"/>' +
      '<rect x="0" y="30" width="320" height="86" fill="#424b58"/>' +
      '<rect x="0" y="70" width="320" height="4" fill="#fff" opacity=".25"/>' +
      /* Auto van boven, schuingezet. */
      '<g transform="translate(120 72) rotate(-18)">' +
      '<rect x="-62" y="-18" width="124" height="36" rx="12" fill="currentColor" opacity=".85"/>' +
      '<rect x="-28" y="-13" width="48" height="26" rx="6" fill="#cfe2ff" opacity=".9"/>' +
      '</g>' +
      /* Spoor van de uitbrekende achterkant. */
      '<path d="M44 108q40 14 86 0" stroke="#e8403f" stroke-width="3" fill="none" stroke-dasharray="6 4"/>' +
      '<path d="M130 108l-11-5 2 10z" fill="#e8403f"/>' +
      '<text x="38" y="128" font-size="11" fill="#e8403f" font-weight="700">achterkant breekt uit</text>' +
      /* Stuurrichting. */
      '<circle cx="246" cy="66" r="24" fill="none" stroke="currentColor" stroke-width="4"/>' +
      '<path d="M222 66h48M246 66v22" stroke="currentColor" stroke-width="4"/>' +
      '<path d="M268 40a30 30 0 0 1 14 18" stroke="#2fbf71" stroke-width="3" fill="none"/>' +
      '<path d="M282 58l-9-6 10-3z" fill="#2fbf71"/>' +
      '<text x="196" y="112" font-size="11" fill="#2fbf71" font-weight="700">stuur naar de slip toe</text>' +
      '<text x="12" y="22" font-size="11" fill="currentColor">Niet remmen, gas los, kijk waar je heen wilt</text>' +
      '</svg>';
  },

  /* Mistlicht achter mag pas onder de 50 m zicht: de drie auto's laten zien
     hoe snel het zicht wegvalt. */
  mist: function(){
    return '<svg viewBox="0 0 320 140" width="100%" role="img" ' +
      'aria-label="In mist neemt het zicht af; onder de vijftig meter zicht mag het mistlicht achter aan en geldt maximaal vijftig kilometer per uur.">' +
      '<rect x="0" y="0" width="320" height="140" rx="8" fill="var(--surface-2)"/>' +
      '<rect x="0" y="34" width="320" height="70" fill="#424b58"/>' +
      '<g transform="translate(16 46)">' + autoZij('#2f6bbf') + '</g>' +
      '<g transform="translate(130 46)" opacity=".55">' + autoZij('var(--asfalt)') + '</g>' +
      '<g transform="translate(240 46)" opacity=".2">' + autoZij('var(--asfalt)') + '</g>' +
      /* Mistsluier: wordt naar rechts dichter. */
      '<rect x="100" y="34" width="220" height="70" fill="var(--surface-2)" opacity=".55"/>' +
      '<rect x="200" y="34" width="120" height="70" fill="var(--surface-2)" opacity=".55"/>' +
      '<circle cx="18" cy="74" r="5" fill="#e8403f"/>' +
      '<text x="12" y="26" font-size="11" fill="currentColor" font-weight="700">mistlicht achter aan</text>' +
      '<path d="M16 116h120" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M16 116l9-5v10zM136 116l-9-5v10z" fill="currentColor"/>' +
      '<text x="46" y="132" font-size="12" fill="currentColor" font-weight="700">zicht &lt; 50 m</text>' +
      '<text x="172" y="132" font-size="11" fill="currentColor">dan maximaal 50 km/h</text>' +
      '</svg>';
  },

  /* De koppeling en de kogeldruk zijn waar het in de vragen om gaat, dus die
     krijgen hier de maatpijl. */
  aanhanger: function(){
    return '<svg viewBox="0 0 320 140" width="100%" role="img" ' +
      'aria-label="Auto met aanhangwagen: de koppeling verbindt beide, het maximum getrokken gewicht staat op het kentekenbewijs.">' +
      '<rect x="0" y="0" width="320" height="140" rx="8" fill="var(--surface-2)"/>' +
      '<rect x="0" y="86" width="320" height="22" fill="#424b58"/>' +
      '<g transform="translate(6 56)">' + autoZij('#2f6bbf') + '</g>' +
      /* Dissel en koppeling. */
      '<path d="M78 92l24-6" stroke="currentColor" stroke-width="3"/>' +
      '<circle cx="90" cy="89" r="6" fill="none" stroke="#e8403f" stroke-width="2"/>' +
      '<text x="62" y="124" font-size="11" fill="#e8403f" font-weight="700">koppeling</text>' +
      /* Aanhanger. */
      '<rect x="102" y="56" width="140" height="32" rx="4" fill="currentColor" opacity=".7"/>' +
      '<circle cx="146" cy="92" r="10" fill="#222"/><circle cx="146" cy="92" r="4" fill="#bbb"/>' +
      '<circle cx="206" cy="92" r="10" fill="#222"/><circle cx="206" cy="92" r="4" fill="#bbb"/>' +
      '<path d="M102 44h140" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M102 44l9-5v10zM242 44l-9-5v10z" fill="currentColor"/>' +
      '<text x="110" y="38" font-size="11" fill="currentColor" font-weight="700">max. getrokken massa</text>' +
      '<text x="12" y="22" font-size="11" fill="currentColor">Rijbewijs B: combinatie tot 3500 kg</text>' +
      '<text x="250" y="124" font-size="11" fill="currentColor">80 km/h</text>' +
      '</svg>';
  },

  /* 30 meter is de afstand die mensen onderschatten; daarom staat hij als
     maat in beeld en niet alleen als woord. */
  pech: function(){
    return '<svg viewBox="0 0 320 140" width="100%" role="img" ' +
      'aria-label="Auto met pech op de vluchtstrook, alarmlichten aan en een gevarendriehoek op ongeveer dertig meter erachter.">' +
      '<rect x="0" y="0" width="320" height="140" rx="8" fill="var(--surface-2)"/>' +
      '<rect x="0" y="30" width="320" height="48" fill="#424b58"/>' +
      '<rect x="0" y="78" width="320" height="4" fill="#fff"/>' +
      '<rect x="0" y="82" width="320" height="22" fill="#3a434e"/>' +
      '<text x="8" y="97" font-size="10" fill="#fff">vluchtstrook</text>' +
      '<g transform="translate(228 76)">' + autoZij('#f2c200') + '</g>' +
      /* Alarmlichten als pulserende stippen op beide hoeken. */
      '<circle cx="232" cy="92" r="4" fill="#f2c200"/>' +
      '<circle cx="300" cy="92" r="4" fill="#f2c200"/>' +
      /* Gevarendriehoek erachter. */
      '<path d="M86 104 L104 74 L122 104 Z" fill="none" stroke="#e8403f" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M66 118h152" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M66 118l9-5v10zM218 118l-9-5v10z" fill="currentColor"/>' +
      '<text x="116" y="134" font-size="12" fill="currentColor" font-weight="700">ca. 30 m</text>' +
      '<text x="10" y="22" font-size="11" fill="currentColor">Stap uit aan de rechterkant, ga achter de vangrail staan</text>' +
      '</svg>';
  },

  /* De loop over schouder en heupbot is het verschil tussen houden en
     doorsnijden; daarom is de gordel de enige gekleurde lijn. */
  gordel: function(){
    return '<svg viewBox="0 0 320 160" width="100%" role="img" ' +
      'aria-label="Driepuntsgordel: de band loopt over het midden van de schouder en laag over de heupen, niet over de buik.">' +
      '<rect x="0" y="0" width="320" height="160" rx="8" fill="var(--surface-2)"/>' +
      /* Stoel. */
      '<path d="M96 26h52v96h66v22H96z" fill="currentColor" opacity=".15"/>' +
      /* Inzittende, zijaanzicht. */
      '<circle cx="132" cy="44" r="18" fill="currentColor" opacity=".7"/>' +
      '<path d="M118 62h32q14 0 14 16v44h-46z" fill="currentColor" opacity=".7"/>' +
      '<path d="M118 122h74v22h-74z" fill="currentColor" opacity=".7"/>' +
      /* De gordel zelf. */
      '<path d="M126 62 L162 118" stroke="#e8403f" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M122 128 L184 128" stroke="#e8403f" stroke-width="7" stroke-linecap="round"/>' +
      '<circle cx="162" cy="124" r="6" fill="#f2c200"/>' +
      '<text x="196" y="72" font-size="11" fill="currentColor" font-weight="700">midden over</text>' +
      '<text x="196" y="86" font-size="11" fill="currentColor">de schouder</text>' +
      '<path d="M192 74l-30 12" stroke="var(--fg-3)" stroke-width="1"/>' +
      '<text x="200" y="134" font-size="11" fill="currentColor" font-weight="700">laag over de heup</text>' +
      '<path d="M196 130l-16-2" stroke="var(--fg-3)" stroke-width="1"/>' +
      '<text x="14" y="152" font-size="11" fill="currentColor">Niet gedraaid, niet onder de arm</text>' +
      '</svg>';
  },

  /* Twee grenzen, twee balken: de beginner heeft minder ruimte, en de
     reactietijd loopt op nog voor je iets merkt. */
  alcohol: function(){
    return '<svg viewBox="0 0 320 160" width="100%" role="img" ' +
      'aria-label="Alcoholgrenzen: 0,5 promille voor ervaren bestuurders en 0,2 promille voor beginnende bestuurders; de reactietijd loopt op.">' +
      '<rect x="0" y="0" width="320" height="160" rx="8" fill="var(--surface-2)"/>' +
      /* Glas. */
      '<path d="M26 24h44l-6 36-10 8v22h12v6H30v-6h12V68l-10-8z" fill="#cfe2ff" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
      /* Grenzen. */
      '<text x="94" y="36" font-size="12" fill="currentColor" font-weight="700">0,5 promille</text>' +
      '<text x="94" y="52" font-size="11" fill="currentColor">ervaren bestuurder</text>' +
      '<text x="94" y="78" font-size="12" fill="#e8403f" font-weight="700">0,2 promille</text>' +
      '<text x="94" y="94" font-size="11" fill="currentColor">beginnend bestuurder (5 jaar)</text>' +
      /* Reactietijd als twee balken. */
      '<text x="14" y="118" font-size="11" fill="currentColor">nuchter</text>' +
      '<rect x="92" y="108" width="58" height="12" rx="3" fill="#2fbf71"/>' +
      '<text x="156" y="118" font-size="11" fill="currentColor">1 sec</text>' +
      '<text x="14" y="140" font-size="11" fill="currentColor">na alcohol</text>' +
      '<rect x="92" y="130" width="142" height="12" rx="3" fill="#e8403f"/>' +
      '<text x="240" y="140" font-size="11" fill="currentColor">veel langer</text>' +
      '<text x="14" y="156" font-size="11" fill="currentColor">Koffie, douche of frisse lucht helpen niet: alleen tijd.</text>' +
      '</svg>';
  }

};
})();
