# Arbeidslaget

Hvordan agentene i `.claude/agents/` skal settes sammen, og hva den første runden
lærte oss. Dette er for den som **fordeler** arbeid. Hver agent har sin egen
rollebeskrivelse ved siden av; denne filen sier hvordan de spiller sammen.

## Runden

1. **`sandkasse-utvikler`** implementerer én sak, test først, på sin egen gren.
2. **`sandkasse-gransker`** granskar diffen mot reglene i `AGENTS.md`.
3. **`sandkasse-sikkerhet`** angriper den, med granskerens rapport som inndata.
4. Funnene tilbake til utvikleren. Gjenta til begge kommer tomhendte tilbake.
5. Flett, lukk saken, og oppdater `ENDRINGER.md` og statussiden.

Funnene hører som en kommentar på saken, ikke i en pull request. Det gir samme
varige spor uten en port som ikke måler noe: CI kjører ikke på denne forken før
noen har trykket på knappen i Actions-fanen.

## Kjør granskerne etter hverandre, ikke samtidig

Første runde kjørte dem parallelt, og de kom uavhengig fram til de samme tre
funnene. Det er ikke bortkastet - granskeren leste seg fram, sikkerhetsagenten
beviste det ved å kjøre et angrep, og beviset er verdt mer enn slutningen. Men det
er dyrt å oppdage samme feil to ganger.

Gi derfor granskerens rapport til sikkerhetsagenten som inndata. Da bruker den
budsjettet sitt på å bevise eller avvise navngitte påstander, pluss sine egne fem
flater, framfor å finne tre av dem på nytt fra kaldt. Å bevise en navngitt påstand
er billigere enn å finne den.

## Ikke kjør hele laget på hver sak

`sandkasse-sikkerhet` sier selv hva den er til: hjemmel, samtykke, persondata eller
KI-laget. Rører ikke saken noen av de fire, hopp over den. En demo-seed eller en
testplan trenger ingen angrepsrunde.

Granskeren kan tilsvarende gå lettere på en sak som ikke rører delt tilstand,
samtykkeporten eller en kontrakt mellom tjenester. Full dybde koster rundt en halv
million tokens per sak, og det skalerer ikke over femten saker på to dager. Behold
dybden der den første runden viste at den lønte seg.

## Når laget er feil verktøy

**En sak der leveransen er faktapåstander i prosa, egner seg ikke.** Sak #3 tok tre
runder. Laget fanget hver enkelt feil, men klarte ikke å slutte å produsere dem:
agenten skrev setninger som var plausible framfor sporede, om hvor opplysninger
lagres. Bedre instruksjoner hjalp målbart - steg 4 i utviklerdefinisjonen kom av
nettopp denne runden, og runde to sporet påstandene sine - men klassen ble stående
til den ble rettet for hånd.

Kjennetegnet: hvis riktig svar avgjøres av å lese kode og skrive en setning, og
ingen test kan skille en sann setning fra en plausibel, så gjør det selv. Laget er
sterkt der korrektheten er kjørbar.

Og det som varer, er ikke rettelsen: det er sjekken som gjør klassen
selvkontrollerende. Sak #18 finnes av den grunnen.

## Praktisk

- **Ingenting av dette trenger Docker.** `pnpm test:*` starter sine egne servere.
  Bare nettleserdemoen og `./start.sh` trenger en kjørende stack.
- **To agenter skal ikke kjøre samme testskript samtidig.** Portene er faste.
- **Agentdefinisjonene registreres når en økt starter.** Legger du til eller endrer
  en fil i `.claude/agents/`, gjelder den først i neste økt. I mellomtiden kan en
  agent få beskjed om å lese definisjonsfilen selv.
- **Arbeid på egen gren.** Rører to saker samme fil, kjør dem etter hverandre framfor
  å flette to halve endringer.

## Avgjort, og skal ikke tas opp igjen

- **Innbyggeren vil ha dette.** Premisset er avgjort av teamet. Bruk tiden på å gjøre
  tjenesten god framfor å utrede om den bør finnes.
- **Sikkerhetsfunn som ikke stopper demoen, er notert og ikke prioritert.** De ligger
  i sakssporeren med rettelse og test beskrevet. Ikke ta dem foran demo-veien uten at
  noen ber om det.
- **Modellen formulerer, den avgjør ingenting.** Rettighetsvurderinger og
  vilkårsvurderinger regnes ut i kode og sendes inn som fakta modellen skal skrive
  om. Denne linjen flyttes ikke.
