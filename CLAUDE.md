# Auto-theorie trainer

Oefenapp voor het Nederlandse theorie-examen auto (rijbewijs B). Statische web-app,
geen build-systeem, geen framework, geen afhankelijkheden.

**Begin hier als je een nieuwe sessie start.** De details staan in `docs/`.

## Wat het is

| | |
|---|---|
| Privéversie (de gebruiker zelf) | (privélink — staat in de lokale CLAUDE.md) |
| Publieke versie (om te delen) | https://ayco23.github.io/rijbewijs-b-trainer/ |
| Repo | https://github.com/Ayco23/rijbewijs-b-trainer |
| Los offline bestand | `rijbewijs-b-trainer.html` |

Inhoud: 8 modules, 94 leskaarten, 339 vragen, 71 officiële RVV-borden, 9 situatiepuzzels,
proefexamen, battle pass, Leitner-flashcards, 14-daags dagprogramma.

## Bestanden

```
index.html              de hele app: inline CSS + één IIFE (~1700 regels)
borden.js               window.SIGNS — 71 borden met officiële SVG uit RVV bijlage 1
content-modules.js      window.MODULES  — modules 2 (voorrang) en 5 (tekens)
content-modules2.js     window.MODULES2 — modules 1, 3, 4, 6, 7, 8
content-extra.js        window.EXTRA    — 127 extra vragen, per module aangehaakt
tools/controleer.js     validatiescript; draai dit na elke contentwijziging
borden-download/        ruwe gedownloade bord-SVG's (bron voor borden.js)
gh-repo/                de git-repo die naar GitHub Pages gaat
site/                   kant-en-klare map om naar een eigen domein te uploaden
docs/                   documentatie (lees die)
```

`content-signs.js` is **oud en ongebruikt** — de nagetekende borden van vóór de officiële set.
Niet laden, kan weg.

## Drie regels die je moet kennen

1. **De artifact-CSP blokkeert externe afbeeldingen, media, fetch en XHR.** Alleen scripts van
   een paar CDN's en bestanden die naast de pagina zijn gepubliceerd werken. Dit is de reden
   dat de borden ingebakken SVG zijn en niet van een URL komen.
2. **Tekenen mag nooit opslaan.** `teken()` draait vóórdat opgeslagen voortgang is ingelezen;
   een `bewaar()` in een renderpad wist de voortgang van de gebruiker. Dit is één keer echt
   misgegaan — zie `docs/status-en-openstaand.md`.
3. **Een nieuw veld in `S` moet ook in `schoon()`.** Die functie valideert veld voor veld en
   negeert alles wat hij niet kent, dus zonder die regel overleeft je veld geen herlaadbeurt.

## Schrijfstijl in de code

Nederlands voor functie- en variabelenamen (`voltooiTaak`, `dagState`, `bewaar`, `vier`),
ES5-stijl (`var`, `function`), geen pijlfuncties of `let`/`const` in `index.html`.
Commentaar legt uit *waarom*, niet *wat*.

## Inhoudelijke zorgvuldigheid

De vragen en lesstof zijn zelf geschreven op basis van het RVV 1990, de WVW 1994, het
Reglement rijbewijzen en de Regeling voertuigen. Bij elke vraag staat het wetsartikel.
Er zijn in een controleronde ~103 fouten uit gehaald, waaronder verwisselde bordcodes en
tientallen verkeerde artikelnummers.

**Verzin geen artikelnummers.** De geverifieerde tabel staat in `docs/content-en-bronnen.md`.
Kun je iets niet bevestigen in de wettekst, noem het dan geen wetsartikel.
