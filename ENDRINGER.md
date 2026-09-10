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

### Beslutningssperren foldes, og hele listen er dekket av test

- **Hva:** Mønstrene i `BESLUTNINGSMONSTRE` foldes nå på samme måte som inndataene,
  listen er eksportert, og testen går gjennom hver enkelt oppføring i begge stavemåter.
  Antallet mønstre er pinnet.
- **Hvor:** `apps/ai-gateway/src/sporsmaalsperrer.ts` (`findDecisionLanguage`, og
  eksporten av listen), `scripts/test-sporsmaalsperrer.ts`.
- **Hvorfor:** To feil i samme mekanisme, funnet ved å prøve.

  `UTFORTMONSTRE` og `INJEKSJONSMONSTRE` foldet mønsteret sitt før sammenligningen.
  `BESLUTNINGSMONSTRE` gjorde det ikke: inndataene ble foldet, mønsteret gikk inn rått.
  Dermed ville en oppføring skrevet med æ/ø/å aldri truffet, og en «retting» av
  stavemåten på en oppføring som fantes, ville stoppet sperren i stillhet. Foldingen
  er en ren utvidelse: alle oppføringene er alt skrevet uten disse bokstavene, så
  endringen gjør ingenting i dag, men fjerner fellen.

  Og av femten mønstre var bare to dekket av en test. Vi prøvde å «rette»
  `vilkarene` til `vilkårene`, og hele suiten ble grønn. Nå kjøres hver oppføring,
  i begge stavemåter. En sletting fanges av at antallet er pinnet: løkken alene ville
  bare gitt én runde mindre og ingen rød sjekk.
- **Sak:** ingen egen sak. Funnet under gjennomgangen før agentarbeidet.
- **Oppstrøms:** ja. Både asymmetrien i foldingen og den manglende dekningen gjelder
  oppstrøms uendret, og sperren er den samme alle lagene bygger på.

### AGENTS.md: rettet foreldet leverandørliste, og skrevet ned tre ting som manglet

- **Hva:** Fire tillegg og to rettelser i `AGENTS.md`. Leverandørlisten for
  `ai-gateway` manglet `telenor-ai-factory`, og env-listen manglet de fire
  `TELENOR_AI_FACTORY_*`-variablene. I tillegg er `krevSubjekt` skrevet inn som en
  invariant, sperren `utenIdentifikatorer` er dokumentert, og det er lagt inn en peker
  til denne filen.
- **Hvor:** `AGENTS.md`, seksjonene `## Service map`,
  `## Process-engine behavior to preserve`, `## Integration edges and env vars` og
  `## Project conventions you must follow`.
- **Hvorfor:** Leverandøren og variablene fantes i koden og i `docker-compose.yml`,
  men ikke i dokumentet, og hele KI-delen av det vi bygger hviler på dem.

  De to viktigste tilleggene er likevel de som manglet helt. `krevSubjekt` er en
  invariant om motorens tilgangskontroll, og den seksjonen finnes nettopp for slike.
  Og `utenIdentifikatorer` sto ikke nevnt noe sted i `AGENTS.md`, selv om den er
  porten hvert `/ai/*`-kall går gjennom. Det var villedende ved utelatelse: en agent
  som bare leste KI-avsnittet, ville enten trodd at ingenting filtreres og bygget sin
  egen halve sperre, eller trodd at alt filtreres og sendt en hel revisjonsrad inn i
  konteksten. Sperren er en nektliste på feltnavn og fanger ikke et fødselsnummer
  under nøkkelen `id`.

  Pekeren til denne filen ligger der fordi `AGENTS.md` leses direkte av Codex, Cursor,
  Copilot og de andre verktøyene `CLAUDE.md` navngir. De ser verken saksbeskrivelsene
  eller filene under `.claude/agents/`, så for dem er `AGENTS.md` den eneste kanalen.

  `CLAUDE.md` er ikke rørt, og skal ikke røres: den er en ren import med en kommentar
  som forklarer hvorfor, og sier selv at instruksjonene ikke skal kopieres inn i den.
- **Sak:** ingen egen sak. Følger av #4 og av gjennomgangen før agentarbeidet.
- **Oppstrøms:** delvis. Leverandørlisten og env-variablene er rene rettelser som
  oppstrøms også trenger. `krevSubjekt`-avsnittet hører sammen med rettelsen i #4.
  Pekeren til `ENDRINGER.md` er vår egen og hører ikke oppstrøms.

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
