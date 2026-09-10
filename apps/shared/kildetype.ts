// Kildetypen i ressurskatalogen: hvilken art kilde en oppføring har, ikke hvilken
// etat eller leverandør den er. "regel" er den fjerde verdien, og den er poenget:
// en SJEKK-oppføring i katalogen er en regelvurdering og ingen dataeier, så den
// får denne verdien og ingen oppdiktet kilde. Kartet skal tegne dem som
// beslutningsnoder, ikke som kilder.
export const KILDETYPER = ["kommune", "statlig-register", "leverandoer", "regel"] as const;
export type Kildetype = (typeof KILDETYPER)[number];
