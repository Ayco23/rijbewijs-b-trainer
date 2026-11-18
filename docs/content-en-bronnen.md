# Content, bronnen en de geverifieerde artikeltabel

## Datamodel

### Module

```js
{ id:'voorrang', nr:2, titel:'Voorrang', kleur:'--m-voorrang',
  samenvatting:'…', lessons:[…], questions:[…], puzzles:[…] }
```

`kleur` verwijst naar een CSS-variabele die in `index.html` voor beide thema's is gedefinieerd.
Een nieuwe module heeft dus ook een nieuwe `--m-…` in alle drie de `:root`-blokken nodig.

### Les

```js
{ t:'kop', b:'lopende tekst', a:'RVV 1990, art. 15 lid 1' }
```

94 lessen, allemaal met exact deze drie velden.

### Vraag

```js
{ t:type, v:'vraagtekst', o:[opties], a:antwoord, u:'uitleg', art:'wetsartikel' }
```

| type | `a` is | let op |
|---|---|---|
| `jn` | `0` = Ja, `1` = Nee | makkelijk te verwisselen |
| `mc` | index in `o` | |
| `sign` | index in `o`, plus `signCode` | vraag toont het bord erboven |
| `multi` | array van indexen | |
| `order` | array van indexen in juiste volgorde | |
| `fill` | string | vergelijking strip alles behalve a-z0-9 |

Bij `fill` moet het antwoord na normalisatie niet leeg worden. `"1,6"` wordt `"16"`, dus de
vraag moet zeggen hoe je het schrijft. Dit ging één keer mis: cijfers werden volledig
weggestript, waardoor elk antwoord goed werd gerekend.

### Puzzel

```js
{ v:'vraag', scene:{type:'kruis'|'uitrit', borden:'haaientanden-zuid', actors:[…]}, a:['B','A'], u:'…', art:'…' }
```

Actor: `{id, van:'noord'|'oost'|'zuid'|'west'|'uitrit'|'trottoir', naar:'rd'|'links'|'rechts',
label, kleur:'jij', soort:'fiets'|'tram'|'voet'}`. `a` is de volgorde van actor-id's.

## Geverifieerde artikeltabel

Gecontroleerd tegen de geconsolideerde tekst van het RVV 1990 (BWBR0004825) op
wetten.overheid.nl. **Gebruik deze tabel; verzin geen nummers.**

| art. | onderwerp |
|---|---|
| 3 | rechts houden |
| 4 | voetgangers |
| **5** | **fietsers gebruiken het verplichte fietspad** |
| 10 | plaats op de weg |
| 11 | inhalen |
| 12 | inhalen bij oversteekplaats |
| 14 | kruispunt vrijlaten |
| 15 | voorrang op kruispunten |
| 16 | militaire colonne en uitvaartstoet niet doorsnijden |
| 17 lid 2 | richting aangeven bij afslaan |
| 18 | afslaan: rechtdoor gaat voor |
| 19 | stoppen binnen de zichtbare vrije afstand |
| 20, 21, 22 | maximumsnelheden |
| 23 | stilstaan verboden |
| 24 | parkeren verboden |
| 25 | parkeerschijf |
| 32 lid 2 | dimmen en niet verblinden |
| 33 | verlichting van gekoppelde aanhangwagens |
| 34 lid 2 | mistlicht |
| **42** | **minimumsnelheid autosnelweg (60) en autoweg (50)** |
| 43 | keren, achteruitrijden, vluchtstrook |
| 44 | voetgangers mogen de volle breedte van een erf gebruiken |
| 45 | op een erf niet sneller dan 15 km per uur |
| 46 | parkeren op een erf |
| 49 | voor laten gaan (blinden, voetgangers) |
| 50 | voorrangsvoertuig |
| 51 | loslopende dieren |
| 54 | bijzondere manoeuvres |
| 55 | richting aangeven bij bijzondere manoeuvres |
| **56** | **wegrijdende lijnbus binnen de bebouwde kom** |
| 58 | gevarendriehoek (±30 m; niet nodig bij alarmlichten) |
| 59, 60 | gordels en kinderzitjes |
| 61a | mobiel apparaat vasthouden |
| 68 | driekleurige verkeerslichten |
| 70 | tram- en buslichten |
| 71 | overweglichten |
| **73** | **rijstrooklichten (rood kruis, groene pijl)** |
| **75** | **geel knipperlicht: gevaarlijk punt** |
| 76 | doorgetrokken streep |
| 78 | richting volgen van je voorsorteervak |
| 80 | haaientanden |
| 81 | busbaan en busstrook |
| **82** | **aanwijzingen van een verkeersregelaar** |
| **84** | **aanwijzingen gaan boven verkeerstekens en verkeersregels** |
| 86d, 86e | milieuzone (C22a) en nul-emissiezone (C22c) |

**Gevaar en hinder staat in de Wegenverkeerswet, niet in het RVV**: WVW 1994 art. 5.
Verder WVW: art. 6 (ongeval met letsel), 7 (doorrijden na ongeval), 8 (onder invloed),
9 (rijden tijdens ontzegging), 122 (geldigheid rijbewijs), 160 (tonen van rijbewijs en
kentekenbewijs), 164 (invordering).

Dik gedrukt = de nummers die eerder fout stonden en systematisch zijn gecorrigeerd.

### Wat géén wetsartikel is

De twee-secondenregel, de anderhalve meter bij het inhalen van een fietser, de gele
medicijnsticker (dat is een KNMP-indeling) en de vier millimeter voor winterbanden zijn
vuistregels of adviezen. Die staan in de content als zodanig benoemd, niet als wetsartikel.

## Borden

`borden.js` wordt gegenereerd uit `borden-download/*.svg` door een script dat de metadata
(code, naam, uitleg) combineert met de gedownloade tekening. Dat script staat in
`tools/bouw-borden.js`.

Bron: Wikimedia Commons, bestandsnaam `Nederlands_verkeersbord_<code>.svg`, nagetekend uit
de RVV-publicatie van het ministerie.

**Licentie:** het RVV 1990 is wetgeving en daarop rust volgens artikel 11 van de Auteurswet
geen auteursrecht. De tekeningen mogen dus vrij gebruikt worden.

**Rate limiting:** Wikimedia blokkeert bij te veel verzoeken achter elkaar met HTTP 429, en
die blokkade houdt lang aan. Haal hooguit één bestand per tien seconden op en stop bij een
429 in plaats van door te proberen. Zoek geen spiegelservers om de limiet te omzeilen.

## Gevonden fouten (ter waarschuwing)

Een controleronde tegen de wettekst leverde ~103 correcties op. De leerzame:

- **B4 en B5 waren verwisseld.** B4 is zijweg **links**, B5 is zijweg **rechts**. Nagemeten
  aan de officiële tekening: bij B4 steekt de zijarm 51 eenheden naar links en 18 naar rechts.
- **C22e bestaat niet.** Milieuzone is C22a (art. 86d), nul-emissiezone is C22c (art. 86e).
  De nul-emissiezone geldt alleen voor bedrijfs- en vrachtauto's, niet voor personenauto's.
- **F10 is geen keerverbod** maar een stopteken-model uit art. 82. Keerverbod is **F7**.
- Het **kentekenbewijs moet je wél kunnen tonen** (art. 160 WVW).
- De J- en L-serie had verkeerde codes: J1/J8/J23/J24 en L2/L8 klopten niet.

Twee van die fouten zaten in materiaal dat alle geautomatiseerde validaties groen gaf. Ze
kwamen alleen boven door de inhoud tegen de bron te leggen.
