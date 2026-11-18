# Oorspronkelijk plan (uitgevoerd)

> **Dit plan is afgerond. Niet opnieuw uitvoeren.**
>
> Dit is de opdracht waaruit de app is ontstaan, bewaard als verantwoording. Wat ervan
> terecht is gekomen staat in [status-en-openstaand.md](status-en-openstaand.md); het plan
> voor de volgende ronde in [plan-volgende-ronde.md](plan-volgende-ronde.md).

Drie dingen zijn bewust anders gelopen dan hieronder staat:

- **Borden: 100 codes in plaats van ~120.** Alleen codes waarvan de betekenis tegen de
  officiele bron te verifieren was. Van die 100 zijn er 71 getekend; de rest hangt in een
  rate limit bij Wikimedia.
- **Geen natekeningen maar de echte borden.** Het plan ging uit van zelf natekenen in SVG.
  Dat bleek te onnauwkeurig om op te leren, dus zijn de officiele tekeningen uit RVV
  bijlage 1 gebruikt (publiek domein, artikel 11 Auteurswet).
- **Geen SVG-animaties bij losse vragen.** Wel bij de situatiepuzzels: voertuigen naderen
  het kruispunt en rijden na je antwoord de juiste volgorde af.

Daarnaast leverde de controleronde uit fase 4 ongeveer 103 correcties op, waaronder
verwisselde bordcodes en tientallen verkeerde artikelnummers. Zie
[content-en-bronnen.md](content-en-bronnen.md).

---
# Plan: Interactieve leer-app voor de autotheorie (CBR B, examen sinds april 2025)

## Context
De gebruiker wil leren voor het theorie-examen auto (B), op een leuke en interactieve manier, met gratis en betrouwbare bronnen. Uit het eerdere onderzoek blijkt:
- Het examen heeft 50 vragen in 30 minuten. Je slaagt bij 44 goed.
- Er is geen apart fotodeel meer. Wel zitten er animaties met situaties in de vragen.
- Het examen is gebaseerd op 8 onderwerpen uit het CBR-examenplan.
- De officiële stof staat vooral in het RVV 1990 (met bijlage 1 voor de borden), de WVW 1994, het Reglement rijbewijzen en de Regeling voertuigen.

De gebruiker kiest voor een **interactieve web-app (Artifact)** met deze onderdelen:
- een **battle pass**
- **quiz met XP en levels**
- **situatie-puzzels**
- **flashcards voor borden**
- een **proefexamen**

Het programma duurt **ongeveer 2 weken** (30–45 minuten per dag).

## Aanpak

### Fase 1: Theorie verzamelen (onderzoek, alleen lezen)
- Per onderwerp uit het examenplan de regels halen uit de officiële bronnen op wetten.overheid.nl. Dat zijn het RVV 1990, de WVW 1994, het Reglement rijbewijzen en de Regeling voertuigen. Daarnaast gebruik ik de CBR-pagina's (examenplan en 25 voorbeeldvragen) als controle op stijl en niveau.
- Wetteksten zijn niet auteursrechtelijk beschermd, dus die mogen we vrij gebruiken. Uit commerciële theorieboeken en oefensites neem ik **niets** over. Alle uitleg en vragen schrijf ik zelf.
- Dit werk verdeel ik over 2–3 parallelle subagents (elk een paar onderwerpen). Elk levert per onderwerp: de kernregels, uitzonderingen, getallen (snelheden, afstanden, promillages) en veelgemaakte fouten.
- Resultaat: een gestructureerd databestand `content.js` met lessen, vragen, borden en puzzels. Bij elke regel staat het wetsartikel, zodat je het kunt nalezen.

### Fase 2: Lesstof en vragenbank schrijven
De 8 modules volgen het examenplan:
1. Gebruik van de weg
2. Voorrang
3. Bijzondere wegen en manoeuvres
4. Veilig rijden en noodsituaties
5. Verkeerstekens
6. Verantwoord en milieubewust rijden
7. Wetgeving
8. Voertuigkennis (inclusief dashboardlampjes en rijhulpsystemen zoals ADAS)

Per module komen er:
- korte leskaartjes met één regel per kaartje, een voorbeeld en het wetsartikel
- **30–50 vragen**. In totaal zijn dat **circa 300–400**. Er komen dezelfde vraagvormen als op het examen: ja/nee, meerkeuze, meerdere antwoorden goed, sleepvraag (volgorde) en invulvraag.
- situatievragen bij een **getekend kruispunt of weg (SVG)**, en waar dat helpt een korte **SVG-animatie** zonder geluid. Die animaties lijken op de animaties in het nieuwe examen.

Verder:
- **Bordenset:** circa 120 belangrijke borden uit RVV-bijlage 1, door mij nagetekend als SVG, met code (bijv. B6) en betekenis.
- **Proefexamens:** willekeurige selectie van 50 vragen uit de vragenbank, verdeeld over alle onderwerpen.

### Fase 3: De app bouwen (één HTML-artifact)
- **Dagplanning van 14 dagen** (de battle pass):
  - Dag 1–10: elke dag een module of halve module. Je leest de leskaartjes, maakt een quiz en flashcards, en speelt een dagelijkse puzzel.
  - Dag 11–14: alles herhalen, met elke dag een proefexamen.
- **Battle pass:** 30 tiers die je vrijspeelt met XP. Beloningen zijn cosmetisch: titels ("Rotonde-ridder"), badges, kleurthema's voor de app en auto-avatars. Er komen ook dagelijkse en wekelijkse uitdagingen ("10 voorrangsvragen foutloos").
- **XP en levels:** je krijgt XP per goed antwoord, met een bonus voor reeksen goede antwoorden en voor elke dag dat je leert. Per module heb je een level (brons, zilver, goud) op basis van het percentage goed.
- **Situatie-puzzels:** je klikt op het kruispunt de volgorde aan waarin de verkeersdeelnemers mogen rijden, of het voertuig dat voorrang heeft. Daarna volgt uitleg met het wetsartikel.
- **Flashcards voor borden:** je herhaalt borden met tussenpozen die langer worden als je ze goed hebt (Leitner-systeem met 5 bakjes). Twee richtingen: van bord naar betekenis, en van betekenis naar bord kiezen.
- **Proefexamen:** precies als het echte examen. 50 vragen, een timer van 30 minuten, vragen markeren en terugbladeren, geen feedback tijdens het examen, en aan het eind de uitslag met grens 44. Daarna een analyse van je zwakke onderwerpen.
- **Foutenbak:** vragen die je fout had komen automatisch terug in je herhaling.
- **Voortgang opslaan:** XP, battle pass, Leitner-bakjes en examenresultaten. Hiervoor laad ik eerst de skill `artifact-capabilities` om te kiezen tussen een opslagmogelijkheid van het platform en localStorage. Alleen localStorage betekent dat je voortgang per apparaat en browser los staat. Op telefoon en laptop heb je dan elk een eigen voortgang.
- **Ontwerp:**
  - Voordat ik de pagina schrijf doe ik `Artifact` met `action: "quickstart"` en `intent: "other"`, en laad ik `artifact-design`.
  - De app moet goed werken op een telefoon en heeft een licht en een donker thema.
  - Er worden geen externe afbeeldingen gebruikt. Alles is SVG of CSS.
- **Bestanden:**
  - `index.html` bevat de app.
  - `content.js` bevat lessen, vragen, borden en puzzels, en wordt meegepubliceerd via `files`.
  - Beide staan in de map die de app voor deze sessie heeft gemaakt.

### Fase 4: Controle van de inhoud
- Een aparte subagent controleert elke vraag op juistheid tegen het genoemde wetsartikel. Vragen waar twijfel over is worden verbeterd of geschrapt.
- Ik check dat er in de app geen verouderde informatie staat, zoals de oude opzet van 65 vragen.

## Verificatie
- De app openen in de ingebouwde browser van de app (preview) en de volgende dingen doorlopen:
  - een les en een quiz
  - een puzzel
  - flashcards
  - een volledig proefexamen met de timer en de grens van 44
  - de voortgang van de battle pass
  - of de voortgang na herladen bewaard is
- Testen op telefoonformaat (375px breed) en in het donkere thema.
- In de console controleren dat er geen fouten zijn.
- Daarna publiceren als privé-artifact en de link geven.

## Kanttekeningen voor de gebruiker
- Het is zelfgemaakt lesmateriaal. Het is gebaseerd op de officiële bronnen, maar het is geen officieel CBR-materiaal. Ik raad aan om daarnaast de 25 voorbeeldvragen van het CBR te maken.
- Omvang: dit is flink wat werk. De vragenbank en de borden zijn het grootste deel. Ik bouw het eerst met 2 modules als proefversie, zodat je de vorm kunt beoordelen. Daarna vul ik de andere 6 modules aan.
