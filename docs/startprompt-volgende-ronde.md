# Startprompt voor de volgende ronde

Plak dit in een nieuwe Claude Code-sessie in `c:\dev\auto-theorie`.

---

Voer `docs/plan-volgende-ronde.md` uit. Lees eerst `CLAUDE.md` en daarna `docs/architectuur.md`,
`docs/content-en-bronnen.md` en `docs/publiceren.md` — daar staat hoe deze app in elkaar zit en
waar de valkuilen zitten.

Houd me onderweg op de hoogte van waar je staat, en laat het weten zodra er iets testbaars is.

## Werk in drie batches

**Batch 1 — parallel, drie agents.** Alle drie leveren een *nieuw bestand* of raken alleen
contentbestanden aan, zodat ze elkaar niet in de weg zitten. Geen van hen mag `index.html`
aanraken.

- *Agent "illustraties"* → nieuw bestand `illustraties.js` met `window.LES_ILL`, ongeveer 18
  herbruikbare taferelen als inline SVG, in de stijl van het bestaande `AFB`-object (viewBox,
  `currentColor`, werkt in licht en donker thema). De sterkste zijn diagrammen: `stopafstand`
  (balkdiagram reactieafstand + remweg), `tweeseconden`, `dodehoek`, `dimlicht`, `bandprofiel`,
  `dashboard`. Daarnaast situaties van bovenaf: `rotonde`, `snelweg`, `erf`, `spoorweg`,
  `tunnel`, `zebra`, en verder `slippen`, `mist`, `aanhanger`, `pech`, `gordel`, `alcohol`.
  Levert ook een voorstel welke van de 94 lessen welk tafereel krijgt.
- *Agent "lesvelden"* → voegt het optionele veld `ill` toe aan ongeveer 30 lessen in
  `content-modules.js` en `content-modules2.js`. Alleen waar beeld de uitleg echt sterker maakt;
  de rest blijft onveranderd. Lessen over één specifiek bord krijgen niets, want `elB()` toont
  dat bord al.
- *Agent "pokemon"* → haalt de Gen 1-sprites op (normaal en shiny) en bouwt `poke-assets.js`
  met `window.POKE_NAMEN` en de sprites als base64, plus de pools voor gewoon en zeldzaam.
  **Haal eerst één `.ogg` op en test of een relatief mediapad door de artifact-CSP komt,
  vóórdat je 151 cries ophaalt.** Wees netjes tegen raw.githubusercontent: hooguit één verzoek
  per paar seconden, en stop bij een 429 in plaats van door te proberen — dat is hier eerder
  flink misgegaan met Wikimedia.

**Batch 2 — één agent, strikt op volgorde.** Alles in `index.html`, door één agent, in deze
volgorde zodat latere stappen op eerdere kunnen bouwen:

1. `S.beloningen` + de tak in `schoon()` die **merget op `d`** in plaats van vervangt
2. `spriteBron` / `cryBron` / `synthCry` / `kenBeloningToe`, en de aanroep in `voltooiTaak()`
3. terugvullen van al afgeronde dagen, stil en zonder confetti
4. `TABS` herindelen: Vandaag · Leren · Examen · Collectie · Pass, plus `naarBorden()` voor de
   zes plekken die nu `TAB='borden'` zetten
5. `vLeren` als accordeon met segmentknop Modules/Borden
6. `vCollectie`
7. de illustratie in `startLes()`, tussen kop en tekst
8. CSS voor het bovenstaande

**Batch 3 — verificatie.** Zie hieronder.

## Harde randvoorwaarden

- **De artifact-CSP blokkeert externe afbeeldingen, media, fetch en XHR.** Detectie of een
  bestand bestaat moet via `new Image().onerror` of het `error`-event van `<audio>`, nooit via
  `fetch`.
- **Tekenen mag nooit opslaan.** Geen `bewaar()` in een renderpad. Dit heeft eerder in één klap
  alle voortgang gewist.
- **Elk nieuw veld in `S` moet in `schoon()`**, anders overleeft het geen herlaadbeurt.
- **Geen Pokémon-bestanden in de publieke repo.** De artifact en het offline bestand krijgen de
  sprites ingebed; de publieke site laadt ze van PokeAPI. De licentie zegt letterlijk "All image
  contents within are Copyright The Pokémon Company".
- **Safari en iOS spelen geen Ogg Vorbis** en falen daarbij stil. De synth-terugval is dus geen
  luxe maar de hoofdroute op de helft van de telefoons.
- Nieuw script betekent **drie plekken**: een `<script src>` in `index.html`, de kopieerlijst in
  `tools/bouw.js`, en de `files`-parameter bij het publiceren van de artifact. Eén vergeten geeft
  een stil kapotte variant — dat is al een keer gebeurd.
- Schrijfstijl: Nederlandse namen, ES5 (`var`, `function`), commentaar legt uit *waarom*.

## Verificatie, in deze volgorde

1. `node tools/controleer.js` — moet groen zijn. Breid hem uit met een controle dat elke
   `ill`-waarde in `window.LES_ILL` bestaat en elke `p` binnen 1–151 valt.
2. `node tools/bouw.js` — en controleer dat er geen externe verwijzingen overblijven.
3. Publiceer naar GitHub Pages en **test daar met de scripttool**; de artifact draait in een
   iframe waar je niet bij kunt. Zie `docs/publiceren.md` voor een voorbeeld.
4. Wat je in de browser moet zien, niet alleen in de code:
   - een dag afronden geeft precies één beloning, herladen behoudt hem, en een tweede afronding
     van dezelfde dag geeft er geen tweede
   - klikken op een beloning geeft geluid; met geluid uit blijft het stil
   - de acht modulerijen passen op 400 px breed zonder scrollen, en de zes oude sprongen naar
     Borden komen in het juiste segment uit
   - de lessen met `ill` tonen hun tekening in licht én donker thema
5. Console schoon, daarna publiceren naar alle drie de vormen.

Let op: de validatiescripts gaven bij de vorige ronde vier bugs groen die pas boven kwamen door
de app echt te gebruiken. Vertrouw de scripts niet als bewijs dat het werkt.

## Nog open van de vorige ronde

28 bordtekeningen ontbreken doordat Wikimedia ons blokkeerde. De lijst en het script staan in
`docs/status-en-openstaand.md`. Dit staat los van bovenstaand plan; pak het op als de blokkade
voorbij is.
