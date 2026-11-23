# Examenstijl: hoe een vraag eruit moet zien

Dit is het ijkpunt voor elke vraag in de app. Een vraag die hier niet aan voldoet is
een leerboekvraag, geen examenvraag — en dan oefent de gebruiker het verkeerde.

## Het examen anno 2025/2026

Per **7 april 2025** is het theorie-examen auto ingrijpend veranderd. Veel oefensites
beschrijven nog de oude opzet; die is niet meer geldig.

| | |
|---|---|
| Vragen | 50 scorende + 2 testvragen die niet meetellen en niet herkenbaar zijn |
| Tijd | 30 minuten voor het geheel (45 bij extra tijd, tolk of begeleiding) |
| Cesuur | minimaal 44 van de 50 goed |
| Onderdelen | **geen** — de oude scheiding kennis / inzicht / gevaarherkenning is vervallen |
| Tijd per vraag | **geen** — de oude 8 seconden per gevaarherkenningsfoto bestaat niet meer |
| Terugbladeren | mag, binnen de 30 minuten; antwoorden wijzigen en markeren ook |
| Gevaarherkenning | de fototoets *remmen / gas loslaten / niets* is **vervallen**, vervangen door korte animatiesituaties; gevaarherkenning zit nu verweven in het geheel |
| Taalniveau | B1, veel beeld en weinig tekst |

De `EXAM`-instelling in `index.html` (50 vragen, 30 minuten, grens 44) komt hiermee
overeen en hoeft niet aangepast.

**ADAS:** vanaf **1 oktober 2026** kunnen er vragen komen over de uitgangspunten en
algemene richtlijnen voor wenselijk gebruik van rijhulpsystemen volgens Rijprocedure B,
hoofdstuk 1 en 2. Het aantal examenvragen verandert daardoor niet.

## De acht onderwerpen

Letterlijk zoals het CBR ze noemt. De acht modules van de app volgen deze indeling.

1. Gebruik van de weg (plaats op de weg, voorsorteren, inhalen, maximumsnelheid, stilstaan en parkeren)
2. Voorrang en voor laten gaan
3. Bijzondere wegen, weggedeelten, weggebruikers en manoeuvres
4. Veilig rijden met het voertuig en reageren in noodsituaties
5. Verkeerstekens en aanwijzingen
6. Verantwoorde verkeersdeelname en milieubewust rijden
7. Wetgeving
8. Voertuigkennis

## De vraagvormen van het CBR

| vorm | in de app | let op |
|---|---|---|
| Ja/nee | `jn` | de grootste categorie; vaak paren met bijna gelijke tekst en ander beeld |
| Meerkeuze | `mc` | twee of meer opties, meestal A/B/C — dus **drie**, niet vier |
| Multiple response | `multi` | alleen goed als álle juiste zijn aangetikt; dat moet op het scherm staan |
| Sleepvraag (volgorde) | `order` | cijfers 1, 2, 3 naar de weggebruikers in volgorde van voor laten gaan |
| Single-sleep | `sleep` | één vinkje naar de juiste plek in de afbeelding |
| Invulvraag | `fill` | **altijd een getal**, getypt op een schermtoetsenbord |
| Hotspot | `hotspot` | de juiste plek of het juiste object aantikken in de afbeelding |
| Animatievraag | beeldveld `b` | kort filmpje, daarna voorspellen of handelen |

Bijna elke vraag heeft beeld vanuit het perspectief achter het stuur. De tekst is kort
en verwijst ernaar.

## De tien stijlregels

1. **Altijd "je".** Nooit "men", "u" of "de bestuurder".
2. **Situatie eerst, vraag daarna, in twee korte zinnen.** *"Je parkeert hier. Mag dat?"*
   Niet één lange zin met bijzinnen.
3. **Verwijs met "hier" of "deze situatie" naar het beeld.** Beschrijf de situatie niet
   uit in woorden. Een vraag met "hier" en zonder beeld is onbeantwoordbaar.
4. **Vraag naar handelen, niet naar kennis.** "Wat moet je doen?" of "Wat kun je hier het
   beste doen?" — niet "Welke regel geldt hier?"
5. **Geen wetsartikel in de vraag of in een antwoordoptie.** Het artikel hoort in `u` en
   `art`, die pas ná het antwoord verschijnen.
6. **Geen bordcodes in de vraagtekst.** "Bij bord A", niet "bord B6". Het bord staat in beeld.
7. **Taalniveau B1.** Korte zinnen, alledaagse woorden. "Voor laten gaan" naast
   "voorrang verlenen"; geen juridische formuleringen.
8. **Het antwoord is een handeling of een oordeel, geen definitie.** "Je mindert vaart en
   stopt zo nodig" — niet "Dit is een voorrangsweg".
9. **Afleiders zijn plausibel, en "altijd" en "nooit" horen in de foute opties.**
   Een afleider die je zonder kennis kunt wegstrepen ("Claxonneren") maakt de vraag
   makkelijker dan het examen.
10. **Concrete getallen, namen en details.** *"Ivet is 12 jaar en 1 meter 60"*,
    *"je rijdt 70 km per uur"*, *"de A16"* — nooit een abstracte "weggebruiker X".

## Voorbeelden van echte examenvragen

Ter ijking. Woordelijk uit oefenbanken; de meeste horen bij een afbeelding.

**Ja/nee**
- "Je laat hier een passagier uitstappen, mag dat?"
- "Je parkeert hier. Mag dat?"
- "Mag je hier even stoppen om de kaart te raadplegen?"
- "Je rijdt met een aanhangwagen. Mag je gaan inhalen?"
- "Je rijdt 70 km per uur. Houd je voldoende afstand?"
- "Ivet is 12 jaar oud en 1 meter 60 groot. Mag ze zo met je meerijden?"

**Meerkeuze**
- "Wat moet je doen als je hier gaat parkeren?"
  A. Een geldige gehandicaptenparkeerkaart goed leesbaar achter de voorruit leggen.
  B. Weer wegrijden. Je mag hier niet staan!
  C. Deze plaats is bestemd voor invalidenvoertuigen. Wegrijden dus!
- "Wat is de beste volgafstand bij 30 km/u?" — A. Ongeveer 5 meter / B. Ongeveer 17 meter
  / C. Ongeveer 30 meter
- "Er lopen voetgangers in het donker aan de kant van de rijbaan buiten de bebouwde kom.
  Wat moet je doen als er een voertuig je tegemoet komt en jou verblindt?"
  A. Je mindert vaart en stopt eventueel / B. Je zet het groot licht aan en rijdt langzamer
  verder / C. Je gaat harder rijden zodat je er maar kort last van hebt
- "Wat is het belangrijkste bij het invoegen?" — A. Richting aangeven / B. Veel gas geven
  / C. Snelheid aanpassen

Let op de derde: de foute opties zijn allebei plausibel voor wie het niet weet, en het
juiste antwoord is een handeling.

**Vervallen vorm — niet meer gebruiken**
- "Wat zou je in deze situatie doen?" — A. Remmen / B. Gas los laten / C. Niets

Deze staat nog in vrijwel elke oefenbank, maar is per 7 april 2025 van het examen verdwenen.

## Valkuilen die het CBR gebruikt

- "Heeft alle verkeer van rechts voorrang?" → nee; voetgangers zijn verkeer maar hebben
  geen voorrang van rechts.
- Rechtdoor op dezelfde weg gaat voor: sla je af en steekt er een voetganger over op die
  weg, dan laat je hem voorgaan.
- Absolute woorden zijn zelden juist. "Moet je altijd stoppen voor een voetganger bij een
  zebrapad?" → alleen als hij wil oversteken.
- Mistachterlicht mag niet bij regen — alleen bij zicht onder 50 meter.
- Parkeren op een voorrangsweg: binnen de bebouwde kom mag, buiten de kom niet.
- 130 km/u geldt alleen op autosnelwegen; met aanhangwagen maximaal 80.
- Rood kruis boven een rijstrook: pas weer gebruiken als het kruis weg is.
- Uit een uitrit: ál het verkeer voor laten gaan, ook voetgangers.
- Een tram heeft alleen voorrang als er geen borden staan.
- Haaientanden gelden ook zonder bord.
- Multiple response: één vergeten vinkje maakt de hele vraag fout.

## Terugkerende thema's

Voorrang en voor laten gaan · stilstaan en parkeren (de grootste ja/nee-categorie) ·
verkeersborden, markering en aanwijzingen · snelheid (waar, met aanhanger, bij
elektronische borden) · verlichting (dimlicht, mist, dagrijlicht, verblinding) ·
volgafstand, remweg en reactietijd · alcohol, medicijnen en vermoeidheid ·
voertuigkennis (kentekenbewijs, massa's, lading, dashboardsymbolen) · milieubewust
rijden en ADAS · kinderen, gordels en zitjes (de 1,35 m-grens) · bijzondere manoeuvres.

## Bronnen

- https://www.cbr.nl/nl/rijbewijs-halen/auto/theorie-examen-auto/hoe-gaat-het-theorie-examen-auto
- https://www.cbr.nl/nl/rijbewijs-halen/auto/theorie-examen-auto/soort-vragen-tijdens-theorie
- https://www.cbr.nl/nl/rijbewijs-halen/auto/theorie-examen-auto/onderwerpen-in-het-theorie-examen
- https://www.cbr.nl/nl/rijbewijs-halen/auto/theorie-examen-auto/leren-en-oefenen/voorbeeldvragen-theorie-examen-auto
- https://www.cbr.nl/nl/over-het-cbr/over/laatste-nieuws/nieuws/aanvullende-leerstofexamenstof-over-rijhulpsystemen-in-het-theorie-examen-auto
- https://www.theorie.nl/examenvoorbereiding/auto-theorie-examen-b/strikvragen-theorie-auto

**Dit is geen officieel CBR-materiaal.** Dat staat in de app en in de README, en hoort
daar te blijven.
