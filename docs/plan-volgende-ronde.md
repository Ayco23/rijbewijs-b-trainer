# Illustraties, een compacter Leren-overzicht en Pokémon-beloningen

## Context

De theorie-app is inhoudelijk klaar (8 modules, 339 vragen, 71 officiële borden), maar drie dingen staan het dagelijks gebruik in de weg.

De **lesstof is kale tekst**. Bij onderwerpen als stopafstand, de dode hoek en het verschil tussen dimlicht en groot licht doet een tekening meer dan een alinea. Niet overal — alleen waar beeld de uitleg echt sterker maakt.

Het **Leren-overzicht kost te veel scrollen**. Acht uitgeklapte kaarten onder elkaar betekent dat je nooit in één blik ziet hoe ver je met elke module bent. Dat is juist de vraag die je stelt als je dat tabblad opent.

En er is **geen reden om een dag af te maken** behalve de XP. Een tastbare beloning per afgeronde dag geeft het veertiendaagse programma een ritme: elke dag die je afrondt levert een willekeurige Pokémon op, met zijn cry, verzameld in een eigen tabblad.

## 1. Illustraties bij de lesstof

**Waar:** `startLes()` in `index.html` (~regel 1165), tussen de kop (`L.t`, regel 1176) en de tekst (`L.b`, regel 1177).

**Aanpak:** een nieuwe map `AFB.les` naast de bestaande `AFB.auto/rit/stoplicht/vlag/mod` (regel 369-429), met ongeveer 18 herbruikbare taferelen als inline SVG. De sterkste zijn diagrammen, geen plaatjes:

| Tafereel | Waarvoor |
|---|---|
| `stopafstand` | balkdiagram reactieafstand + remweg, met de verdubbeling bij dubbele snelheid |
| `tweeseconden` | twee auto's met de tussenruimte uitgelicht |
| `dodehoek` | auto met spiegelvelden en het onzichtbare gebied gearceerd |
| `dimlicht` | lichtbundel dim versus groot, met tegenligger |
| `bandprofiel` | doorsnede band met de 1,6 mm-groef |
| `dashboard` | drie lampjes rood/oranje/groen |
| `rotonde`, `snelweg`, `erf`, `spoorweg`, `tunnel`, `zebra` | situaties van bovenaf |
| `slippen`, `mist`, `aanhanger`, `pech`, `gordel`, `alcohol` | overige |

Lessen over één specifiek bord krijgen geen nieuwe tekening: daar doet de bestaande `bordChip` via `elB()` het werk al.

**Koppeling:** een nieuw optioneel veld `ill` op het lesobject in `content-modules.js` en `content-modules2.js` (lessen hebben nu exact `{t, b, a}`). Alleen de ~30 lessen die er baat bij hebben krijgen het veld; de rest blijft onveranderd en toont geen illustratie. Expliciet in de data, geen trefwoordherkenning — dat laatste gaat op termijn altijd mis.

## 2. Leren-overzicht compacter, Borden eronder

Het tabblad Borden verdwijnt uit de onderbalk en wordt een onderdeel van Leren, zodat Collectie erbij kan zonder dat de balk zes knoppen krijgt.

**Nieuwe TABS** (regel 900): Vandaag · Leren · Examen · Collectie · Pass.

**Leren krijgt een segmentknop** bovenin: `[ Modules | Borden ]`, met de stand in een variabele `LEER_SEG` ('modules' | 'borden'). `vLeren()` dispatcht naar de modulelijst of naar de bestaande `vBorden()`-inhoud.

**De modulelijst wordt een accordeon.** Acht compacte rijen van ~56 px passen samen op één telefoonscherm:

```
[icoon] Gebruik van de weg        ▓▓▓▓▓░░░ 68%  Zilver   ›
[icoon] Voorrang                  ░░░░░░░░  —            ›
```

Elke rij: modulepictogram (`AFB.modIcoon`), titel, dunne voortgangsbalk in de modulekleur, medaille, chevron. De module van vandaag krijgt een accent. Klikken klapt die rij open en toont wat er nu al staat — samenvatting, de `.pil`-chips (lesstof gelezen, score, medaille) en de knoppen Lesstof/Quiz/Puzzels. Eén rij tegelijk open; de stand in een variabele zodat `teken()` hem niet dichtklapt.

**Let op:** zes plekken springen nu naar `TAB='borden'` (regels 1034, 1370, 1377, 1415, 1422). Die worden één hulpfunctie `naarBorden()` die `TAB='leren'` en `LEER_SEG='borden'` zet.

## 3. Beloningen: een Pokémon per afgeronde dag

### Waar de plaatjes en geluiden vandaan komen

Dit is het lastigste deel, want de app bestaat in drie vormen met verschillende mogelijkheden. **De artifact-CSP blokkeert externe afbeeldingen, media én fetch** — daar kan de app dus niet zelf de PokéAPI aanroepen. De sprites worden daarom vooraf opgehaald en meegeleverd; de app kiest er willekeurig uit.

Gemeten: een sprite is 543–929 bytes, een cry 7–19 kB (OGG Vorbis). Er is geen ffmpeg, dus omzetten naar mp3 kan niet.

| | sprites | cries |
|---|---|---|
| **Artifact** (privé) | ingebed in `poke-assets.js` | losse `.ogg` naast de pagina, geladen bij klik |
| **Offline los bestand** | ingebed | geen — valt terug op synth |
| **GitHub Pages** (publiek) | niet meegeleverd, van PokeAPI geladen | idem |

Alle code kent alleen het Pokédex-nummer plus twee functies `spriteBron(id, shiny)` en `cryBron(id)`. Detectie bij start via `new Image().onerror` — **niet** via `fetch`, want dat is precies wat de CSP tegenhoudt.

Pool: **Gen 1, 151 Pokémon**. Sprites ingebed kosten ~300 kB base64 (inclusief shiny); de cries bepalen de rest en 151 losse bestanden blijft onder het limiet van 255 bestanden per publicatie.

### Datamodel

Eén nieuw veld in `S`, puur numeriek — `S` wordt bij elke wijziging volledig naar de database geserialiseerd, dus daar hoort geen base64 in:

```js
S.beloningen = [ {d:7, p:25, s:1, t:'2026-11-18'} ]   // dag, pokédex-id, shiny, datum
```

Namen in een losse constante `POKE_NAMEN`, niet in `S`. Sprite, cry en naam volgen allemaal uit `p`.

**Kritiek:** `schoon()` (regel 275) valideert veld voor veld en negeert onbekende velden. Zonder een tak voor `beloningen` overleeft de collectie geen herlaadbeurt. Die tak **merget** op `d` in plaats van te vervangen, anders wist een oudere server-versie de collectie bij het synchroniseren (`initOpslag` overschrijft `S` als de server meer XP heeft).

### Welke Pokémon je krijgt

Deterministisch uit het dagnummer, niet via `Math.random()` — dan levert herladen of synchroniseren nooit een andere uitkomst op.

- Gewone dag: trekking uit de gewone pool; al bezeten nummers worden doorgeschoven tot je een nieuwe hebt.
- **Mijlpaaldag** (elke 5e dag en de laatste): trekking uit een zeldzame pool van legendaries en starters.
- **Shiny** verdien je: een foutloze dag (`S.dag.fout === 0` bij minstens 10 vragen) geeft altijd shiny, daarnaast een kleine vaste kans. Zo is de "limited edition" een prestatie en geen loterij.

**Invoegpunt:** `voltooiTaak()` (regel 570), binnen het blok waar `S.dagenGedaan[dag]=1` wordt gezet, vóór `bewaar()`. De functie `kenBeloningToe(dag)` is zelf idempotent op `d`, naast de bestaande guard.

**Terugvullen:** bij de eerste start na deze wijziging krijgen al afgeronde dagen alsnog hun beloning, stil en zonder confetti. Anders is het overzicht leeg voor wie al dagen heeft gedaan.

### De cry afspelen

Safari en iOS spelen geen Ogg Vorbis, en falen daarbij stil. Daarom:

1. Bij start één keer `canPlayType('audio/ogg; codecs="vorbis"')`. Leeg → meteen synth.
2. Anders `<audio>` met `.catch()` op `play()`, een `onerror` en een korte timer; elke tak valt terug op synth.
3. `synthCry(id)` hergebruikt de bestaande `tonen()` (regel ~445) met een reeks die uit het id volgt, zodat elke Pokémon een eigen herkenbaar geluidje heeft. Respecteert automatisch `S.instel.geluid`.

Start het geluid kort na de klik, niet achter een lange `setTimeout` — iOS eist dat het binnen de gebruikersactie valt.

### Het Collectie-tabblad

Raster van 151 vakjes: verdiend toont de sprite, nog niet verdiend een silhouet. Tikken op een verdiende toont naam, dagnummer, datum en shiny-status, en speelt de cry. Bovenaan: hoeveel je er hebt, hoeveel shiny, en welke je op de eerstvolgende mijlpaaldag kunt krijgen.

## Auteursrecht — één ding om te weten

De licentie van PokeAPI/sprites zegt letterlijk: *"All image contents within are Copyright The Pokémon Company. This repository is distributed under CC0 1.0 Universal."* De CC0 dekt hun verzameling, niet de plaatjes.

Daarom levert dit plan **geen Pokémon-bestanden mee in je publieke repo**. De artifact (privé) en het offline bestand krijgen de sprites ingebed; de publieke GitHub Pages-versie laadt ze van PokeAPI. Dat is één `if` in `spriteBron`. Wil je het anders, dan is dat de plek om het aan te passen.

## Bestanden

- `index.html` — alle wijzigingen: `AFB.les`, `startLes`, `vLeren` + accordeon, `TABS`/`teken`/`naarBorden`, `S`/`schoon`, `kenBeloningToe`, `vCollectie`, `spriteBron`/`cryBron`/`synthCry`, CSS
- `content-modules.js`, `content-modules2.js` — veld `ill` op ~30 lessen
- `poke-assets.js` — nieuw: `POKE_NAMEN` + ingebedde sprites
- `poke/cry/{id}.ogg` — nieuw: de cries, alleen meegepubliceerd bij de artifact
- De build inlinet scripts naar `rijbewijs-b-trainer.html`, `site/index.html` en `gh-repo/`. Het nieuwe script moet op **drie** plekken worden opgenomen; vergeten in één geeft een stil kapotte variant.

## Verificatie

1. **Eerst het risico afdekken:** één `.ogg` en de sprite-aanpak publiceren naar de artifact en controleren dat de CSP een relatief mediapad doorlaat — vóórdat 151 cries worden opgehaald.
2. Node-controle: elke `ill`-waarde bestaat in `AFB.les`; elke `p` in de pools valt binnen 1–151; `schoon()` overleeft een rondje serialiseren met beloningen erin.
3. In de browser op de Pages-versie (daar kan ik scripten): een dag afronden en controleren dat er precies één beloning bij komt, dat herladen hem behoudt, en dat een tweede afronding van dezelfde dag er geen tweede geeft.
4. Collectie-tab: klikken op een verdiende beloning speelt geluid; met geluid uit in de instellingen blijft het stil.
5. Leren: de acht rijen passen op 400 px breed zonder scrollen, één rij open klapt de rest niet dicht, en de zes oude sprongen naar Borden komen in het juiste segment uit.
6. Lesstof: de ~30 kaarten met `ill` tonen hun tekening in licht én donker thema.
7. Console schoon, daarna publiceren naar artifact, Pages en het losse bestand.
