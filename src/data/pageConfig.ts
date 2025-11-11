export type PageContent = {
  title: string
  description: string
  body?: string[]
}

export const PAGE_CONFIG: Record<string, PageContent> = {
  'cv/generale': {
    title: 'Curriculum generale',
    description:
      'Panoramica sintetica della formazione, delle collaborazioni e dei riconoscimenti artistici di Nicola Raffaello Tallone.',
    body: [
      'Inserisci qui un testo breve che racconti la biografia generale.',
      'Puoi suddividere il contenuto in paragrafi per maggiore leggibilità.',
    ],
  },
  'cv/esecutore': {
    title: 'Curriculum da esecutore',
    description:
      'Repertorio, sale da concerto e festival in cui Nicola si è esibito come violoncellista.',
    body: [
      'Elenca gli highlight delle performance più importanti.',
      'Ricorda di citare eventuali registrazioni o streaming disponibili.',
    ],
  },
  'cv/organizzatore': {
    title: 'Curriculum da organizzatore',
    description:
      'Esperienze legate all’organizzazione di rassegne musicali, festival e progetti culturali.',
    body: [
      'Descrivi il ruolo di Nicola nei progetti organizzativi più rilevanti.',
      'Inserisci link esterni per approfondimenti se disponibili.',
    ],
  },
  'eventi/futuri': {
    title: 'Eventi futuri',
    description:
      'Elenco completo degli eventi futuri sincronizzati con Supabase, con maggiori dettagli rispetto alla card sulla home.',
  },
  'eventi/passati': {
    title: 'Eventi passati',
    description:
      'Archivio storico degli eventi passati, utile per stampa e promoter.',
  },
  'progetti/album': {
    title: 'Album',
    description:
      'Discografia di Nicola, con link allo streaming o all’acquisto.',
  },
  'progetti/duo-chitarra': {
    title: 'Duo Chitarra',
    description:
      'Descrizione del progetto in duo con chitarra, repertorio e contatti.',
  },
  'progetti/duo-clavicembalo': {
    title: 'Duo Clavicembalo',
    description:
      'Approfondimento sul duo con clavicembalo, concept e scalette.',
  },
  'progetti/duo-piano': {
    title: 'Duo Piano',
    description:
      'Informazioni sul duo piano e sugli eventi disponibili.',
  },
  'progetti/duo-voce': {
    title: 'Duo Voce',
    description:
      'Mood e repertorio del progetto voce e violoncello.',
  },
  'progetti/duo-viola': {
    title: 'Duo Viola',
    description:
      'Collaborazione con viola, programmi proposti e calendario.',
  },
  'progetti/solista': {
    title: 'Solista',
    description:
      'Programmi solistici disponibili e focus sul repertorio barocco e contemporaneo.',
  },
  'progetti/quartetti': {
    title: 'Quartetti',
    description:
      'Formazioni cameristiche e quartetti con cui Nicola collabora.',
  },
  'insegnamento/conservatorio-svizzera-italiana': {
    title: 'Conservatorio della Svizzera Italiana',
    description:
      'Dettagli sulla collaborazione didattica con il Conservatorio.',
  },
  'insegnamento/lezioni-private': {
    title: 'Lezioni private',
    description:
      'Informazioni pratiche sulle lezioni private (durata, disponibilità, requisiti).',
  },
  'insegnamento/iscrizioni-e-costi': {
    title: 'Iscrizioni e costi',
    description:
      'Tariffe, modalità di iscrizione e policy di disdetta.',
  },
  'insegnamento/metodo': {
    title: 'Metodo',
    description:
      'Approccio didattico e metodologia di insegnamento.',
  },
}

