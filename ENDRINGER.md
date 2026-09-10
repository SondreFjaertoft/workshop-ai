# Endringer i sandkassen

Denne filen er loggen over hva vi har endret i den opprinnelige sandkassen, atskilt fra
det vi har bygget oppå den. Forken vår ligger et stykke fra `ks-no/workshop-ai`, og uten
en slik logg er det ikke mulig å se hvilke endringer som er våre, hvilke som er verdt å
melde tilbake, og hva som må gjøres på nytt etter en fletting fra oppstrøms.

## Regelen

**Enhver endring i en fil som fantes fra før, skal føres opp her.** Nye filer som bare
hører til vår egen funksjonalitet trenger ingen oppføring, med ett unntak: hvis den nye
filen endrer oppførselen til noe som fantes fra før, hører den her.

Det gjelder oss og agentene likt. Står endringen ikke her, finnes den ikke for den som
leser dette senere.

Én oppføring har fem linjer:

- **Hva** endringen gjør, i én setning.
- **Hvor** den er, med fil og funksjon. Ikke linjenummer, de flytter seg.
- **Hvorfor**, altså hva som var galt eller manglet.
- **Sak** i sakssporeren, hvis den har en.
- **Oppstrøms**, om dette er noe de andre lagene også trenger. `ja`, `nei` eller
  `kanskje`, med en begrunnelse på samme linje.

Skriv nyeste øverst. Skriv på norsk, uten tankestrek, slik `AGENTS.md` sier.

---

## Endret oppførsel

### Revisjonsloggen binder subjektet, og en eierløs flyt nektes

- **Hva:** `GET /api/revisjonslogg/:sporingsId` nekter nå med 403 når den ikke får
  bundet flyten til den som spør. Ny valgfri egenskap `krevSubjekt` på ruter, og et
  tilsvarende valg i `requireTilgang`.
- **Hvor:** `apps/sandbox-backend/src/autentisering.ts` (`requireTilgang`),
  `apps/sandbox-backend/src/routes.ts` (`Rute`-typen, kallstedet i `handleRequest`, og
  ruten selv), `apps/demo-gui/src/client/stegvis.ts` (`hentLogg`),
  `scripts/test-revisjonsspor.ts` (ny sjekkblokk).
- **Hvorfor:** `finnPersonId` slo opp eieren i prosessøktene og deretter i søknadene.
  Fant den ingen, ble `pid` null, og en null `pid` hoppet over pid-bindingen i sin
  helhet. Hver flyt uten prosessøkt og uten søknad lå dermed åpen for enhver innlogget
  innbygger, om hvilken som helst person. Det gjelder alle KI-radene og hver flyt som
  ble til av et rent datakall, og radene bærer fødselsnummer og
  husstandssammensetning. Ruten hadde ingen test, og kommentaren over den beskrev
  oppførselen som en funksjon, så ingen som leste en diff ville stoppet den.

  To valg er verdt å kjenne. `krevSubjekt` er en egenskap per rute og ikke en ny
  hovedregel: en generell «null pid nekter» ville gjort hvert 404 på økt- og
  søknadsrutene til et 403, og dermed fortalt en kaller hvilke økt-id-er som finnes.
  Og ruten nekter nå også for den radene faktisk handler om, når flyten er eierløs.
  Alternativet var å utlede eieren fra radene, men `sporingsId` kommer fra klienten,
  så en angriper kunne hengt én egen rad på et offers flyt, blitt medeier og fått
  resten med på veien. Innbyggeren skal lese sine egne rader gjennom den
  subjektbundne ruten `/api/personer/:personId/revisjonslogg` i stedet.
- **Sak:** #4.
- **Oppstrøms:** ja. Dette er en tilgangskontrollfeil i referanseimplementasjonen, og
  hvert lag som bygger på den arver den.

---

## Nytt ved siden av sandkassen

Dette listes for oversiktens skyld. Ingenting her endrer oppførselen til noe som fantes
fra før.

- `presentasjon/index.html` - statussiden for innsynstjenesten, publisert som artefakt.
  Ligger utenfor `docs/`, så dokumentasjonssjekken plukker den ikke opp.
- `ENDRINGER.md` - denne filen.
- `.claude/agents/sandkasse-utvikler.md`, `sandkasse-gransker.md` og
  `sandkasse-sikkerhet.md` - agentdefinisjoner for arbeidslaget: én som implementerer
  en sak test først, én som gransker diffen mot reglene i `AGENTS.md`, og én som
  angriper den. Definisjonene bærer fellene som ikke gir utslag i en test, slik at en
  agent uten `AGENTS.md` i konteksten likevel kjenner dem.
