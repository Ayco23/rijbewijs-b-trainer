# Status en openstaande punten

Laatst bijgewerkt: 18 november 2026.

## Wat af is

- 8 modules volgens het CBR-examenplan, 94 leskaarten, **339 vragen** in alle examenvormen
  (meerkeuze, ja/nee, meerdere goed, bordvragen, invulvragen, volgordevragen)
- **71 officiële RVV-borden** met de tekening uit bijlage 1
- 9 situatiepuzzels met animatie: voertuigen naderen het kruispunt, en na je antwoord rijden
  ze de situatie af in de juiste volgorde
- Proefexamen: 50 vragen, 30 minuten, grens 44, markeren en terugbladeren, zwakke-puntenanalyse
- Battle pass (30 tiers), XP, levels, streak, Leitner-flashcards, foutenbak
- Dagvoortgang: taken vinken zichzelf af, de dag rondt zichzelf af, strip met 14 dagen
- Geluid en SVG-confetti, uit te zetten in de instellingen
- Bordcodes in lopende tekst worden het bord zelf
- Voortgang in het account (db-capability) met terugval op localStorage

## Openstaand

### De laatste 28 bordtekeningen

`borden.js` heeft er 71 van de 100 codes waarvoor metadata bestaat. Deze ontbreken nog:

```
C22a C22c J8 J9 J10 J11 J15 J16 J17 J20 J22 J25 J27 J29 J31
J32 J33 J34 J35 J36 J37 J38 L2 L3 L13 L14 L19 L51
```

Dat is vrijwel de hele waarschuwings- en informatieserie. Oorzaak: Wikimedia blokkeert ons
met HTTP 429 na te veel verzoeken. Het script `haal-rest.sh` koelt 45 minuten af en haalt
daarna hooguit één bestand per twaalf seconden op; draai dat opnieuw als de blokkade voorbij is.

`C22a` en `C22c` bestaan mogelijk niet onder die naam op Commons — die moeten apart uitgezocht.

De app gaat er netjes mee om: bordvragen over een ontbrekend bord worden eruit gefilterd, en
in lopende tekst blijft dan gewoon de code staan.

### Bewust afgeweken van het oorspronkelijke plan

Het plan vroeg om ~120 borden. Het zijn er 100 waarvoor de betekenis tegen de officiële bron
te verifiëren was. De overige twintig zouden alleen gehaald worden door codes toe te voegen
waarvan de betekenis niet hard te maken is — precies de fout die er drie keer is uitgehaald.
Exactheid gaat hier voor aantal.

### Volgende ronde

Zie `plan-volgende-ronde.md`: illustraties bij de lesstof, een compacter Leren-overzicht met
accordeon, en Pokémon-beloningen per afgeronde dag met een eigen Collectie-tabblad.

## Bugs die er zijn uitgekomen (en hoe)

Alle vier gaven de validatiescripts groen. Ze kwamen boven door de app echt te gebruiken.

| bug | gevolg | gevonden door |
|---|---|---|
| `content-extra.js` had geen `<script src>` | 127 vragen laadden nergens | modulekaarten in de browser tellen |
| Dag sprong na afronden door naar morgen | dag 2 stond meteen op "3 van 4 klaar" | een hele dag doorlopen |
| **`huidigeDag()` riep `bewaar()` aan** | **de eerste render wiste alle voortgang** | herladen ná de vorige fix |
| Invulvragen stripten cijfers | "50" en "1,6" werden met elk antwoord goed gerekend | de normalisatie nalezen |

De derde is de belangrijkste les: `teken()` draaide vóórdat `initOpslag()` de opgeslagen data
had ingelezen, dus de lege beginstand overschreef de echte voortgang. **Renderpaden mogen
nooit opslaan.**

## Testvoortgang in het account

Tijdens het ontwikkelen is er met het account van de gebruiker getest, wat XP en afgeronde
dagen oplevert die niet van de gebruiker zijn. Via het tandwiel → *Voortgang wissen* staat een
reset in twee stappen. Ruim dit op of meld het expliciet; het is hun data, niet die van de
ontwikkelaar.

## Bekende beperkingen

- **OGG in Safari en op iOS**: WebKit speelt geen Ogg Vorbis en faalt daarbij stil. Relevant
  zodra er audiobestanden bij komen (zie het plan voor de volgende ronde).
- **Offline**: de app heeft internet nodig, behalve het losse HTML-bestand.
- **Geen officieel CBR-materiaal.** Dat staat in de app en in de README, en hoort daar te blijven.
