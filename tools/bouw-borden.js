/* Zet de gedownloade officiele RVV-SVG's om in een inline bordenbibliotheek voor de app.
   Bron: Wikimedia Commons, nagetekend uit de RVV-publicatie van het ministerie.
   Publiek domein: het RVV 1990 is wetgeving (Auteurswet art. 11). */
const fs = require('fs');
const SRC = 'c:/dev/auto-theorie/borden-download/';
const OUT = 'c:/dev/auto-theorie/borden.js';

/* Gecorrigeerde metadata. B4/B5 waren verwisseld; C22e bestond niet;
   C8/F11/C9/F19/E7/G12a/G1/G5/J6 hadden een onnauwkeurige omschrijving. */
const META = [
['A1','Maximumsnelheid','Je mag hier niet harder dan de aangegeven snelheid. Geldt tot bord A2, een bord met een andere snelheid of een komgrensbord.'],
['A2','Einde maximumsnelheid','Vanaf hier geldt weer de snelheid die bij dit soort weg hoort.'],
['A3','Maximumsnelheid op een matrixbord','Een elektronisch bord boven de rijstrook. Dit is een gewone maximumsnelheid waar je je aan moet houden.'],
['A4','Adviessnelheid','Een advies, geen gebod. Dit is de veilige snelheid voor dit weggedeelte.'],
['B1','Voorrangsweg','Jij rijdt op de voorrangsweg. Verkeer uit de zijwegen moet jou voor laten gaan.'],
['B2','Einde voorrangsweg','Vanaf hier gelden de gewone voorrangsregels weer, zoals verkeer van rechts.'],
['B3','Voorrangskruispunt','Je nadert een kruispunt waar jij voorrang hebt op al het verkeer uit de zijwegen.'],
['B4','Voorrangskruispunt met zijweg links','Jij hebt voorrang op het verkeer uit de zijweg links.'],
['B5','Voorrangskruispunt met zijweg rechts','Jij hebt voorrang op het verkeer uit de zijweg rechts.'],
['B6','Verleen voorrang aan bestuurders op de kruisende weg','Voorrang verlenen aan alle bestuurders op de kruisende weg. Stoppen hoeft niet als het vrij is.'],
['B7','Stop, verleen voorrang','Je moet altijd stoppen voor de stopstreep, ook als de weg leeg is. Daarna voorrang verlenen.'],
['C1','Gesloten in beide richtingen','Gesloten voor voertuigen, ruiters en geleiders van dieren, in beide richtingen.'],
['C2','Eenrichtingsweg, inrijden verboden','Hier mag je niet inrijden. Vanaf de andere kant is de weg wel open.'],
['C3','Eenrichtingsweg','Verkeer mag hier alleen in de richting van de pijl rijden.'],
['C6','Gesloten voor motorvoertuigen op meer dan twee wielen','Auto\u2019s en soortgelijke motorvoertuigen mogen hier niet in. Motoren wel.'],
['C7','Gesloten voor vrachtauto\u2019s','Geldt voor vrachtauto\u2019s. Let altijd op onderborden met uitzonderingen.'],
['C8','Gesloten voor landbouw- en bosbouwtrekkers, motorrijtuigen met beperkte snelheid en mobiele machines','Weert het langzame gemotoriseerde verkeer, zoals tractoren en werkmachines.'],
['C9','Gesloten voor ruiters, vee, wagens, motorvoertuigen met beperkte snelheid, brommobielen, fietsen, bromfietsen en gehandicaptenvoertuigen','Een brede geslotenverklaring voor langzaam verkeer. Staat vaak voor een doorgaande weg waar alleen snelverkeer welkom is.'],
['C10','Gesloten voor motorvoertuigen met een aanhangwagen','Met caravan of aanhanger mag je hier niet in.'],
['C11','Gesloten voor motorfietsen','Alleen motorfietsen worden geweerd; auto\u2019s mogen er wel in.'],
['C12','Gesloten voor alle motorvoertuigen','Geen enkel motorvoertuig mag hier in, ook geen motor of bromfiets.'],
['C14','Gesloten voor fietsen en gehandicaptenvoertuigen zonder motor','Fietsers moeten een andere route nemen.'],
['C15','Gesloten voor fietsen, bromfietsen en gehandicaptenvoertuigen','Staat bijvoorbeeld bij een tunnel of een drukke doorgaande weg.'],
['C16','Gesloten voor voetgangers','Lopen mag hier niet, bijvoorbeeld langs een autoweg.'],
['C17','Gesloten voor voertuigen langer dan aangegeven','De lengte geldt inclusief de lading en een eventuele aanhanger.'],
['C18','Gesloten voor voertuigen breder dan aangegeven','De breedte geldt inclusief de lading en de spiegels.'],
['C19','Gesloten voor voertuigen hoger dan aangegeven','Let hierop met een dakkoffer, fietsendrager of hoge lading.'],
['C22a','Milieuzone','Een zone waar vervuilende voertuigen niet in mogen. Het onderbord zegt welke voertuigen geweerd worden.'],
['C22c','Nul-emissiezone','Alleen voertuigen zonder uitstoot. Geldt voor bedrijfs- en vrachtauto\u2019s; het onderbord geeft de details.'],
['D1','Rotonde, verplichte rijrichting','Je moet de rotonde rechtsom volgen.'],
['D2','Gebod het bord voorbij te gaan aan de zijde die de pijl aangeeft','Hou het obstakel aan de aangegeven kant.'],
['D4','Gebod tot het volgen van de rijrichting','Je bent verplicht de richting van de pijl te volgen.'],
['D5','Gebod tot het volgen van de rijrichting','Je bent verplicht de richting van de pijl te volgen.'],
['D6','Gebod tot het volgen van een van de aangegeven rijrichtingen','Je kiest een van de richtingen die de pijlen aangeven.'],
['D7','Gebod tot het volgen van een van de aangegeven rijrichtingen','Je kiest een van de richtingen die de pijlen aangeven; andere richtingen mogen niet.'],
['E1','Parkeerverbod','Je mag hier niet parkeren. Stilstaan om in of uit te laten stappen of om te laden en lossen mag wel.'],
['E2','Verbod stil te staan','Je mag hier helemaal niet stilstaan, dus ook niet kort iemand laten uitstappen.'],
['E3','Verbod fietsen en bromfietsen te plaatsen','Hier mag je geen fiets of bromfiets neerzetten.'],
['E4','Parkeergelegenheid','Hier mag je parkeren. Een onderbord kan dit beperken tot bepaalde dagen of uren.'],
['E6','Gehandicaptenparkeerplaats','Alleen met een geldige gehandicaptenparkeerkaart.'],
['E7','Gelegenheid bestemd voor het onmiddellijk laden en lossen van goederen','Alleen om direct goederen te laden en lossen, niet om te parkeren.'],
['E9','Parkeergelegenheid alleen voor vergunninghouders','Zonder de juiste vergunning krijg je hier een bekeuring.'],
['E10','Parkeerschijfzone','In deze zone moet je een parkeerschijf gebruiken. Langer parkeren dan de aangegeven tijd mag niet.'],
['E12','Park and ride','Parkeren en verder met het openbaar vervoer.'],
['E13','Carpoolplaats','Bedoeld voor mensen die samen verder reizen in \u00e9\u00e9n auto.'],
['F1','Verbod voor motorvoertuigen om elkaar onderling in te halen','Motorvoertuigen mogen elkaar hier niet inhalen. Een fiets of bromfiets inhalen mag wel.'],
['F3','Verbod voor vrachtauto\u2019s om motorvoertuigen in te halen','Geldt alleen voor vrachtauto\u2019s.'],
['F5','Verbod door te gaan bij nadering van tegemoetkomend verkeer','Jij moet wachten. Het tegemoetkomende verkeer gaat voor.'],
['F6','Tegemoetkomend verkeer moet verkeer uit deze richting voor laten gaan','Jij mag doorrijden; de tegenligger wacht.'],
['F7','Keerverbod','Je mag hier niet keren om terug te rijden waar je vandaan kwam. Geldt voor alle motorvoertuigen.'],
['F11','Verplicht gebruik passeerstrook voor landbouw- en bosbouwtrekkers, motorrijtuigen met beperkte snelheid en mobiele machines','Langzaam gemotoriseerd verkeer moet deze strook gebruiken.'],
['F13','Busbaan of busstrook','Alleen voor lijnbussen. Als automobilist mag je hier niet rijden.'],
['F14','Einde busbaan of busstrook','Vanaf hier is het weer een gewone rijbaan.'],
['F15','Trambaan of tramstrook','Alleen voor trams.'],
['F17','Bus- en trambaan of -strook','Alleen voor lijnbussen en trams.'],
['F19','Rijstrook of -baan voor vrachtauto\u2019s en lijnbussen','Alleen voor vrachtauto\u2019s en lijnbussen.'],
['F21','Rijstrook of -baan voor vrachtauto\u2019s','Alleen voor vrachtauto\u2019s.'],
['G1','Autosnelweg','Alleen voor motorvoertuigen die minimaal 60 km/h kunnen en mogen rijden. Welke snelheid geldt, lees je af van de borden A1 langs de weg.'],
['G2','Einde autosnelweg','De regels van de autosnelweg stoppen hier.'],
['G3','Autoweg','Alleen voor motorvoertuigen die minimaal 50 km/h kunnen en mogen rijden.'],
['G5','Erf','Je mag niet sneller dan 15 km per uur rijden (RVV art. 45). Voetgangers mogen de hele breedte gebruiken en spelen is toegestaan. Parkeren alleen in de vakken.'],
['G6','Einde erf','Je verlaat het erf. Dat is een bijzondere manoeuvre: je laat al het verkeer voorgaan.'],
['G7','Voetpad','Alleen voor voetgangers en gehandicaptenvoertuigen.'],
['G11','Verplicht fietspad','Fietsers moeten hier rijden; andere voertuigen mogen er niet op.'],
['G12','Einde verplicht fietspad','De fietsplicht stopt hier.'],
['G12a','Fiets/bromfietspad','Zowel fietsers als bromfietsers moeten hier rijden.'],
['G13','Onverplicht fietspad','Fietsers mogen hier rijden, maar hoeven niet. Bromfietsers mogen er niet op.'],
['H1','Bebouwde kom','Vanaf hier geldt de bebouwde kom: standaard 50 km/h voor een personenauto of motor.'],
['H2','Einde bebouwde kom','Buiten de bebouwde kom geldt standaard 80 km/h.'],
['J2','Slag naar rechts','Pas je snelheid aan v\u00f3\u00f3r de bocht; remmen doe je ervoor, niet erin.'],
['J6','Steile helling opwaarts','Schakel op tijd terug zodat de motor het vol houdt.'],
['J8','Gevaarlijk kruispunt','Let extra op; de voorrang is hier niet vanzelfsprekend.'],
['J9','Rotonde','Je nadert een rotonde. Kijk op tijd naar de haaientanden en de borden.'],
['J10','Overweg met overwegbomen','Een spoorwegovergang met bomen. De trein gaat altijd voor.'],
['J11','Overweg zonder overwegbomen','Kijk zelf goed of er een trein aankomt. Steek alleen over als je er helemaal voorbij kunt komen.'],
['J15','Beweegbare brug','Je kunt voor een open brug komen te staan.'],
['J16','Werk in uitvoering','Let op wegwerkers, versmallingen en losse ondergrond.'],
['J17','Rijbaanversmalling','De weg wordt smaller. Pas je snelheid en je plaats op de weg aan.'],
['J20','Slipgevaar','De weg kan glad zijn. Rem rustig en stuur vloeiend.'],
['J21','Kinderen','Kinderen kunnen onverwacht oversteken. Matig je snelheid.'],
['J22','Voetgangersoversteekplaats','Je nadert een zebrapad. Voetgangers die oversteken laat je voorgaan.'],
['J25','Losliggende stenen','Hou afstand; opspattend grind beschadigt ruiten.'],
['J27','Overstekend wild','Vooral in de schemering. Rem en wijk niet abrupt uit.'],
['J29','Tegemoetkomend verkeer','Je krijgt verkeer uit de andere richting op dezelfde rijbaan.'],
['J31','Zijwind','Hou het stuur stevig vast, vooral op een brug of een open stuk.'],
['J32','Verkeerslichten','Verderop staan verkeerslichten. Let op remmend verkeer.'],
['J33','File','Rem op tijd en zet je alarmlichten aan als je aansluit achter een file.'],
['J34','Ongeval','Verderop is een ongeval. Rij rustig en maak ruimte voor hulpdiensten.'],
['J35','Slecht zicht door regen, sneeuw of mist','Bij zicht onder 50 meter mag je mistlicht achter gebruiken.'],
['J36','Sneeuw of ijzel','Rem en stuur zo rustig mogelijk; de remweg wordt veel langer.'],
['J37','Gevaar waarvoor geen apart bord bestaat','Het onderbord vertelt waar het gevaar uit bestaat.'],
['J38','Verkeersdrempel','Snelheid eruit; anders beschadig je je vering.'],
['L2','Voetgangersoversteekplaats','Hier steken voetgangers over. Je laat ze voorgaan.'],
['L3','Bushalte','Binnen de bebouwde kom laat je een lijnbus die vanaf een halte wegrijdt voorgaan.'],
['L8','Doodlopende weg','De weg heeft geen doorgaande verbinding.'],
['L13','Tunnel','Doe je dimlicht aan, zet je radio op de tunnelzender en hou afstand.'],
['L14','Vluchthaven','Een uitwijkplaats voor noodgevallen, niet om even te pauzeren.'],
['L19','Dichtstbijzijnde nooduitgang','Staat in tunnels, met de afstand en de richting erbij.'],
['L51','Fietsstraat','De fiets is hoofdgebruiker; auto\u2019s zijn te gast en rijden achter de fietsers.']
];

/* Maakt van een gedownload bestand een inline <svg> die meeschaalt. */
function normaliseer(raw){
  let t = raw.replace(/<\?xml[^>]*\?>/g,'')
             .replace(/<!DOCTYPE[\s\S]*?>/g,'')
             .replace(/<!--[\s\S]*?-->/g,'')
             .replace(/<script[\s\S]*?<\/script>/gi,'')
             .replace(/\son\w+="[^"]*"/gi,'')
             .trim();
  const open = t.match(/<svg\b[^>]*>/i);
  if(!open) return null;
  let kop = open[0];
  let vb = kop.match(/viewBox="([^"]+)"/i);
  if(!vb){
    const w = kop.match(/\swidth="([\d.]+)/i), h = kop.match(/\sheight="([\d.]+)/i);
    if(!w || !h) return null;
    vb = [null, '0 0 '+w[1]+' '+h[1]];
    kop = kop.replace(/<svg/i, '<svg viewBox="'+vb[1]+'"');
  }
  // Vaste afmetingen eruit, zodat CSS de maat bepaalt.
  kop = kop.replace(/\swidth="[^"]*"/i,'').replace(/\sheight="[^"]*"/i,'');
  if(!/preserveAspectRatio/i.test(kop)) kop = kop.replace(/<svg/i,'<svg preserveAspectRatio="xMidYMid meet"');
  return (kop + t.slice(open.index + open[0].length)).replace(/\s+/g,' ').trim();
}

const uit = [], ontbreekt = [];
for(const [code, naam, uitleg] of META){
  const f = SRC + code + '.svg';
  if(!fs.existsSync(f)){ ontbreekt.push(code); continue; }
  const svg = normaliseer(fs.readFileSync(f,'utf8'));
  if(!svg){ ontbreekt.push(code+' (onleesbaar)'); continue; }
  uit.push({c:code, n:naam, b:uitleg, svg:svg});
}

const kop = `/* Auto-theorie B — bordenset met de officiele RVV-tekeningen.
   Bron: Wikimedia Commons, nagetekend uit de RVV-publicatie van het ministerie.
   Publiek domein: het RVV 1990 is wetgeving, waarop volgens artikel 11 van de
   Auteurswet geen auteursrecht rust. Codes en betekenissen gecontroleerd
   tegen RVV 1990 bijlage 1. */
window.SIGNS = `;
fs.writeFileSync(OUT, kop + JSON.stringify(uit, null, 0) + ';\n');

console.log('borden ingebakken:', uit.length);
console.log('ontbreekt:', ontbreekt.length ? ontbreekt.join(' ') : 'niets');
console.log('bestandsgrootte:', (fs.statSync(OUT).size/1024).toFixed(0)+' kB');
