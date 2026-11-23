# Beeldsleutels

De afgesproken namenlijst tussen de vragen en het beeld. Een vraag verwijst met het veld
`b` naar een sleutel; `situaties.js` levert die sleutel als inline SVG.

`tools/controleer.js` controleert beide kanten: een vraag met een onbekende sleutel is een
**fout**, en een situatie die door geen enkele vraag gebruikt wordt een waarschuwing.

## Hoe een situatie eruitziet

Vanuit de bestuurdersstoel, tenzij de sleutel met `bo-` begint — dan van bovenaf, zoals de
bestaande puzzels. Afspraken staan in `situaties.js` zelf en volgen `illustraties.js`:
viewBox 320 breed, `currentColor` voor lijnwerk, `var(--surface-2)` en `var(--line)` voor
vlakken, echte verkeerskleuren hard gecodeerd.

De tekening moet het antwoord **kunnen dragen**: als de vraag is "Mag je hier parkeren?",
dan moet het bord, de streep of de stoeprand die dat bepaalt daadwerkelijk zichtbaar zijn.
Een sfeerplaatje maakt de vraag onbeantwoordbaar.

## 1. Gebruik van de weg (`weg`)

| sleutel | wat erop staat |
|---|---|
| `weg-binnenkom` | straat binnen de bebouwde kom, komborden zichtbaar |
| `weg-buitenkom` | tweebaansweg buiten de kom, bord 80 |
| `weg-autosnelweg` | autosnelweg, drie rijstroken, bord G1 |
| `weg-autoweg` | autoweg, bord G3 |
| `weg-30zone` | woonstraat met 30-zonebord en drempel |
| `weg-inhalen-streep` | doorgetrokken streep naast onderbroken streep |
| `weg-inhalen-vrij` | onderbroken streep, tegenligger in de verte |
| `weg-voorsorteren` | voorsorteervakken met pijlen op het wegdek |
| `weg-parkeren-blauw` | blauwe zone met parkeerschijfbord |
| `weg-parkeren-stoep` | auto half op de stoep geparkeerd |
| `weg-parkeren-uitrit` | uitrit met auto ervoor |
| `weg-stilstaan-bocht` | stilstaan vlak voor een onoverzichtelijke bocht |
| `weg-gehandicapt` | gehandicaptenparkeerplaats met bord E6 |
| `weg-rijstrook-kruis` | rood kruis boven een rijstrook |
| `weg-invoegen` | invoegstrook naar de snelweg |
| `weg-busstrook` | busstrook met opschrift LIJNBUS |

## 2. Voorrang (`voorrang`)

| sleutel | wat erop staat |
|---|---|
| `bo-gelijk-kruis` | gelijkwaardig kruispunt van bovenaf, drie naderende voertuigen |
| `bo-haaientanden` | kruispunt met haaientanden op jouw tak |
| `bo-rotonde` | rotonde met haaientanden bij de opritten |
| `voorrang-b6` | kruispunt vanuit de auto met bord B6 |
| `voorrang-b7` | stopbord B7 met stopstreep |
| `voorrang-voorrangsweg` | bord B1, gele ruit |
| `voorrang-tram` | tram nadert van links |
| `voorrang-zebra` | zebrapad met wachtende voetganger |
| `voorrang-afslaan-voet` | jij slaat af, voetganger steekt over op die weg |
| `voorrang-uitrit` | je rijdt een uitrit uit, fietser op het fietspad |
| `voorrang-bus` | lijnbus wil wegrijden van de halte, binnen de kom |
| `voorrang-hulpdienst` | ambulance met zwaailicht van achteren |
| `voorrang-smalweg` | smalle weg met bord F5, tegenligger |

## 3. Bijzondere wegen en manoeuvres (`bijzonder`)

| sleutel | wat erop staat |
|---|---|
| `bijz-erf` | erf met bord G5, spelende kinderen |
| `bijz-erf-uit` | einde erf, bord G6 |
| `bijz-overweg-and` | onbewaakte overweg met alleen een andreaskruis |
| `bijz-overweg-licht` | overweg met rode knipperlichten en bomen |
| `bijz-tunnel` | tunnel met bord en verlichting |
| `bijz-fietsstrook` | fietsstrook met onderbroken streep |
| `bijz-keren` | keren op een brede weg |
| `bijz-achteruit` | achteruitrijden uit een parkeervak |
| `bijz-file` | file op de snelweg, redding-strook |
| `bijz-wegwerk` | wegwerkzaamheden met versmalling |

## 4. Veilig rijden (`veilig`)

| sleutel | wat erop staat |
|---|---|
| `veilig-volgafstand` | twee auto's met de tussenruimte uitgelicht |
| `veilig-mist` | mist, zicht korter dan 50 meter |
| `veilig-regen` | natte weg met spatwater |
| `veilig-gladheid` | besneeuwde weg |
| `veilig-verblinding` | tegenligger met groot licht in het donker |
| `veilig-pech` | pech op de vluchtstrook met gevarendriehoek |
| `veilig-ongeval` | ongeval verderop, naderend verkeer |
| `veilig-dodehoek` | vrachtwagen met de dode hoek gearceerd |
| `veilig-kind-bal` | bal rolt tussen geparkeerde auto's de weg op |
| `veilig-fietser-inhalen` | fietser inhalen met de zijafstand zichtbaar |

## 5. Verkeerstekens (`tekens`)

Bordvragen gebruiken het bestaande type `sign` met `signCode`; die hebben géén beeldsleutel
nodig. Hier alleen situaties waarin een bord in context staat.

| sleutel | wat erop staat |
|---|---|
| `tekens-regelaar` | verkeersregelaar met stopteken, licht op groen |
| `tekens-licht-geel` | driekleurig licht op geel |
| `tekens-knipper-geel` | geel knipperlicht bij een gevaarlijk punt |
| `tekens-markering-blok` | blokmarkering voor een puntstuk |
| `tekens-bus-licht` | buslicht met witte balk |
| `tekens-matrix` | matrixbord boven de snelweg met 90 |
| `tekens-bord-onderbord` | bord met onderbord eronder |

## 6. Milieu en verantwoord rijden (`milieu`)

| sleutel | wat erop staat |
|---|---|
| `milieu-toerenteller` | toerenteller met het zuinige gebied gemarkeerd |
| `milieu-bandenspanning` | bandenspanningsmeter |
| `milieu-cruise` | stuurknoppen voor cruise control |
| `milieu-zone` | milieuzonebord bij een stadsingang |
| `milieu-stilstaan` | stilstaande auto met draaiende motor |

## 7. Wetgeving (`wet`)

| sleutel | wat erop staat |
|---|---|
| `wet-rijbewijs` | rijbewijs met de geldigheidsdatum uitgelicht |
| `wet-kenteken` | kentekenbewijs met de massavelden uitgelicht |
| `wet-alcohol` | glas en sleutels naast elkaar |
| `wet-telefoon` | telefoon vasthouden achter het stuur |
| `wet-gordel-kind` | kind in een zitje, de 1,35 m-grens aangegeven |

## 8. Voertuigkennis (`voertuig`)

| sleutel | wat erop staat |
|---|---|
| `voert-dashboard` | dashboardlampjes rood, oranje en groen |
| `voert-bandprofiel` | doorsnede band met de 1,6 mm-groef |
| `voert-aanhanger` | auto met aanhangwagen, koppeling zichtbaar |
| `voert-lading` | lading die buiten de auto uitsteekt |
| `voert-apk` | APK-sticker of -datum |
| `voert-verlichting` | achterkant met de lichten benoemd |
| `voert-remweg` | balkdiagram reactieafstand plus remweg |

## Animatiesituaties

Het vernieuwde examen gebruikt korte filmpjes. Deze sleutels bewegen via `animateMotion`
en moeten `GEEN_BEWEGING` respecteren, net als `sceneSVG()` in `index.html` — met animatie
uit staat alles stil op het beslismoment.

`bo-gelijk-kruis` · `bo-rotonde` · `veilig-kind-bal` · `voorrang-bus` ·
`voorrang-hulpdienst` · `bijz-file` · `weg-invoegen` · `veilig-fietser-inhalen`
