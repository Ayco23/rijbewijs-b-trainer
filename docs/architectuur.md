# Architectuur

Alles zit in `index.html`: inline CSS in één `<style>`, daarna één `<script>` met de hele
app in een IIFE. Daarvoor worden vier contentbestanden geladen die elk een global zetten.
Geen build, geen framework, geen afhankelijkheden behalve Google Fonts.

## Opstarten

```
borden.js → window.SIGNS
content-modules.js → window.MODULES
content-modules2.js → window.MODULES2
content-extra.js → window.EXTRA
         ↓
MODULES = MODULES ++ MODULES2, gesorteerd op nr
EXTRA per module achter m.questions geplakt
bordvragen zonder beschikbaar bord eruit gefilterd
         ↓
initOpslag()  ← het enige startpunt
```

`initOpslag()` leest eerst localStorage, tekent, en probeert daarna de Claude-capabilities
`user` en `db`. Lukt dat, dan wordt de voortgang uit het account geladen en wint die als er
meer XP in zit. Lukt het niet (publieke site, offline bestand), dan blijft het bij localStorage.

> **Let op:** er staat bewust géén losse `teken()` vóór `initOpslag()`. Die stond er wel, en
> in combinatie met een `bewaar()` in `huidigeDag()` wiste dat bij elke herlaadbeurt de
> voortgang van de gebruiker. Renderpaden mogen niet opslaan.

## State

```js
var S = {
  xp, streak, laatsteDag, dagenGedaan:{},
  mod:{ <moduleId>: {goed, fout, les} },
  leitner:{ <bordcode>: bakje 1..5 },
  fout:[ vraag-id's ], examens:[ laatste 25 ], gezien:{},
  dag:{ datum, taken:{}, xp, goed, fout, dagnr },
  instel:{ geluid, animatie }
};
```

- `schoon(raw)` valideert elk veld apart bij het inlezen. **Onbekende velden worden genegeerd**,
  dus elk nieuw veld moet hier een tak krijgen.
- `bewaar()` schrijft naar localStorage en, als de db-capability er is, debounced (700 ms) naar
  `data/users/<id>/voortgang`. `S` wordt daarbij volledig geserialiseerd — hou het veld klein,
  geen base64 of lange teksten.

### Dag versus programma

Twee verschillende begrippen die makkelijk door elkaar lopen:

- `S.dag` is **vandaag** (kalenderdag). Wordt automatisch leeggemaakt zodra de datum wisselt.
- `S.dagenGedaan` is het **programma** (dag 1 t/m 14).

`huidigeDag()` koppelt die twee: het dagnummer wordt per kalenderdag vastgelegd in `S.dag.dagnr`
en schuift pas door als het echt een nieuwe dag is. Zonder dat sprong de app na het afronden van
dag 1 meteen naar dag 2 — op dezelfde dag, met de vinkjes van vandaag er al in.

`voltooiTaak(sleutel)` vinkt een taak af, en als daarmee alle taken van de dag klaar zijn
wordt `S.dagenGedaan[dag]=1` gezet plus 50 XP en confetti.

## Tekenen

```js
teken() → kopBij() + tekenNav() + view-functie op basis van TAB
```

Views: `vVandaag`, `vLeren`, `vBorden`, `vExamen`, `vPass`, `vInstel`.
`TABS` bevat er vijf; `instel` zit wel in de dispatch maar niet in de balk (tandwielknop).

Alles wordt bij elke `teken()` opnieuw opgebouwd met `el()` / `elB()`. Er is geen
virtual DOM en geen diffing; state leeft in `S` en in een paar module-variabelen.

## Hulpfuncties die je gaat hergebruiken

| functie | doet |
|---|---|
| `el(tag, cls, tekst)` | element maken |
| `elB(tag, cls, tekst)` | idem, maar bordcodes in de tekst worden het bord zelf |
| `metBorden(tekst)` | fragment waarin elke bekende bordcode een `bordChip` wordt |
| `bordSVG(s, maat)` | bord uit `window.SIGNS` als inline SVG op maat |
| `AFB.*` | eigen illustraties: `auto`, `rit`, `stoplicht`, `vlag`, `modIcoon` |
| `sceneSVG(sc, modus, volgorde)` | kruispunttekening voor de puzzels, met animatie |
| `vier(soort)` | confetti + geluid: `klein`, `groot`, `level`, `pass` |
| `tonen(reeks, vorm, volume)` | tonen opwekken met de Web Audio API |
| `toast(tekst)` | korte melding onderin |

## Geluid en animatie

Geluid wordt ter plekke opgewekt met de Web Audio API — geen geluidsbestanden, dus het werkt
ook offline. Confetti zijn SVG-vormen in bordvormen (cirkel, driehoek, ruit) die vallen of
vanuit het midden wegschieten.

Beide respecteren `S.instel` én `prefers-reduced-motion` (`GEEN_BEWEGING`). Animaties blijven
uit bij "verminder beweging", ook als de schakelaar aan staat.

## Borden

`window.SIGNS` is een array van `{c, n, b, svg}`: code, naam, uitleg, en de complete
officiële SVG als string. Die SVG's komen uit RVV bijlage 1 via Wikimedia Commons en zijn
genormaliseerd (vaste afmetingen eruit, `preserveAspectRatio` erin) door
`tools/bouw-borden.js` — zie `docs/content-en-bronnen.md`.

`CODE_RE` is een regex van alle bekende bordcodes, langste eerst. Die wordt gebruikt om in
lopende tekst elke code te vervangen door het bord zelf. Gecontroleerd over de hele content:
85 plaatsingen, 29 verschillende borden, geen valse treffers.
