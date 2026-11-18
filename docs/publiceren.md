# Bouwen en publiceren

De app bestaat in drie vormen. Alle drie komen uit dezelfde bron; alleen de verpakking
verschilt. **Publiceer ze samen**, anders lopen ze uiteen.

| vorm | waar | opslag voortgang |
|---|---|---|
| Artifact (privé) | (privélink) | account, dus op elk apparaat |
| GitHub Pages (publiek) | ayco23.github.io/rijbewijs-b-trainer | browser van de bezoeker |
| Los bestand (offline) | `rijbewijs-b-trainer.html`, `site/index.html` | browser |

## De bouwstap

Er is geen build-systeem. Het losse bestand wordt gemaakt door de `<script src>`-regels te
vervangen door de inhoud van die bestanden, en er een compleet HTML-omhulsel omheen te zetten
(`<!doctype>`, charset, viewport, de basis-reset die het artifact-platform normaal toevoegt).

```bash
node tools/bouw.js
```

Dat schrijft `rijbewijs-b-trainer.html`, `site/index.html` en `gh-repo/index.html`, en
kopieert de bronbestanden naar `gh-repo/src/`.

> Komt er een nieuw contentbestand bij, dan moet dat op **drie** plekken: een `<script src>` in
> `index.html`, de kopieerlijst in `tools/bouw.js`, en de `files`-parameter bij het publiceren
> van de artifact. Eén vergeten geeft een stil kapotte variant — dat is één keer gebeurd met
> `content-extra.js`, waardoor 127 vragen nergens verschenen.

## Artifact publiceren

Met de Artifact-tool, `file_path` op `index.html`, `root` op de projectmap en de
contentbestanden in `files`:

```
files: { "borden.js": "borden.js",
         "content-modules.js": "content-modules.js",
         "content-modules2.js": "content-modules2.js",
         "content-extra.js": "content-extra.js" }
```

Capabilities `db` en `user` staan al opgeslagen en worden bij een herpublicatie meegenomen;
alleen meesturen als je ze wilt wijzigen. Dezelfde `file_path` houdt dezelfde URL.

## GitHub Pages

```bash
cd gh-repo && git add -A && git commit -m "…" && git push
```

Pages bouwt vanaf `main`, map `/`. Een deploy duurt één tot vijf minuten. Wachten tot het
echt live is:

```bash
until curl -s https://ayco23.github.io/rijbewijs-b-trainer/ | grep -q "<zoekterm>"; do sleep 15; done
```

De git-identiteit in `gh-repo` staat bewust op `Ayco23@users.noreply.github.com` en niet op
het werkadres: in een publieke repo staat het e-mailadres van elke commit permanent openbaar.

## Eigen domein

Upload `site/index.html` naar de webmap. Eén bestand, verder niets nodig.

## Wat wel en niet mag in de artifact

De CSP van het artifact-platform blokkeert:

- externe afbeeldingen, audio en video
- `fetch`, `XHR`, websockets
- stylesheets van andere hosts dan Google Fonts
- `window.print()`, `alert`/`confirm`/`prompt`, downloads, iframes

Wel toegestaan: scripts van een paar CDN's, en bestanden die náást de pagina zijn gepubliceerd
via een relatief pad. Dat laatste is de enige route voor binaire assets.

Detectie of een bestand bestaat moet dus via `new Image().onerror` of het `error`-event van
`<audio>` — **niet** via `fetch`, want dat is precies wat geblokkeerd wordt.

## Testen in de browser

De artifact draait in een iframe op claude.ai, dus de scripttool van de browser bereikt hem
niet. De Pages-versie is wel gewoon een pagina op zijn eigen origin: **test daar**, dan kun je
met JavaScript door de app klikken in plaats van met losse muisklikken.

```js
// voorbeeld: alle juiste antwoorden aanklikken
const alle = [].concat(...(window.MODULES||[]).concat(window.MODULES2||[]).map(m => m.questions));
const q = alle.find(x => x.v === document.querySelector('.card h3').textContent);
[...document.querySelectorAll('.opt')][q.a].click();
```

Let op dat je eigen tests voortgang wegschrijven. Op de artifact is dat het account van de
gebruiker — ruim op wat je achterlaat, of waarschuw erover.
