# Rijbewijs B Trainer

Oefenapp voor het Nederlandse auto-theorie-examen (rijbewijs B): lesstof,
quizzen, bordenflashcards, situatiepuzzels en een proefexamen.

Eén statisch bestand (`index.html`), zonder server, build of afhankelijkheden.
Openen kan door het bestand te dubbelklikken of door de map op een willekeurige
statische host te zetten.

## Bronnen en rechten

De verkeersborden zijn de officiële tekeningen uit bijlage 1 van het RVV 1990,
overgenomen via Wikimedia Commons. Het RVV 1990 is wetgeving en daarmee vrij van
auteursrecht op grond van artikel 11 van de Auteurswet.

De lesstof en de vragen zijn zelf geschreven op basis van het RVV 1990, de
Wegenverkeerswet 1994, het Reglement rijbewijzen en de Regeling voertuigen.
Bij elke vraag staat het wetsartikel, zodat je het kunt nalezen op
wetten.overheid.nl.

## Let op

Dit is geen officieel CBR-materiaal. Gebruik daarnaast de officiële
voorbeeldvragen van het CBR.

## Opbouw

- `index.html` — de volledige app als één bestand. Dit is wat GitHub Pages serveert.
- `src/` — de bronbestanden: de app zonder HTML-omhulsel plus de losse contentbestanden
  (`borden.js` voor de borden, `content-*.js` voor lesstof en vragen).

`index.html` in de hoofdmap wordt uit `src/` samengesteld; bewerk dus de bron en niet
het samengestelde bestand.

## Documentatie

Begin bij [CLAUDE.md](CLAUDE.md) — dat is het startpunt voor wie aan deze app gaat werken.

- [docs/architectuur.md](docs/architectuur.md) — opbouw van de app, state, tekenen, hulpfuncties
- [docs/content-en-bronnen.md](docs/content-en-bronnen.md) — datamodel en de geverifieerde tabel met wetsartikelen
- [docs/publiceren.md](docs/publiceren.md) — de drie publicatievormen en wat de CSP toestaat
- [docs/status-en-openstaand.md](docs/status-en-openstaand.md) — wat af is, wat niet, en de bugs die eruit kwamen
- [docs/plan-volgende-ronde.md](docs/plan-volgende-ronde.md) — het plan voor de volgende ronde

## Scripts


