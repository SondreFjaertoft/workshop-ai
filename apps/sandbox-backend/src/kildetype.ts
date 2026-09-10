// Denne filen lå i apps/shared fram til gjennomgang 2 av sak #3. Flyttet til
// sandbox-backend fordi leserkretsen er nøyaktig den vilkaar.ts har -
// AGENTS.md sier vilkaar.ts blir i sandbox-backend "fordi bare backend og
// porten leser den", og KILDETYPER har samme to lesere: ressurser.ts her, og
// scripts/valider-data.ts og scripts/sjekk-openapi-dekning.ts (begge "porten"
// i AGENTS.md-forstand). Den forrige begrunnelsen for å la filen ligge i
// apps/shared var at pnpm test:kodeverk bare skanner apps/shared/ etter
// kodeverk å telle - sant, men den kjøretidssjekken i scripts/valider-data.ts
// (som slår hver ressurs' kildetype opp mot KILDETYPER direkte, uavhengig av
// hvilken mappe filen ligger i) beviser akkurat det samme, sterkere: den
// sjekker den faktiske verdien på hver oppføring, ikke bare at feltet er lest
// et sted. Flyttingen mister test:kodeverks generiske dekning av dette
// kodeverket, men den mer presise sjekken som alt fantes veier opp for det.
//
// Kildetypen i ressurskatalogen: hvilken art kilde en oppføring har, ikke hvilken
// etat eller leverandør den er. "regel" er en av de faste verdiene, og den er
// poenget: en SJEKK-oppføring i katalogen er en regelvurdering og ingen
// dataeier, så den får denne verdien og ingen oppdiktet kilde. Kartet skal
// tegne dem som beslutningsnoder, ikke som kilder.
//
// "framvist-dokument" er den andre faste verdien: et dokument innbyggeren selv
// framviser til kommunen, uten at kommunen kan slå det opp noe sted -
// politiattesten og legeerklæringen, se apps/politiattest-mock/README.md og
// apps/pasientjournal-mock/README.md. Å gi dem "statlig-register" eller
// "leverandoer" ville påstått et oppslag som ikke finnes.
export const KILDETYPER = [
  "kommune",
  "statlig-register",
  "leverandoer",
  "regel",
  "framvist-dokument"
] as const;
export type Kildetype = (typeof KILDETYPER)[number];
