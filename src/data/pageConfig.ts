export type PageContent = {
  title: string
  description: string
  body?: string[]
}

export const PAGE_CONFIG: Record<string, PageContent> = {
  'cv/generale': {
    title: 'BIO Nicola Raffaello Tallone',
    description: '',
    body: [
      'Nicola Tallone, violoncellista svizzero, si diploma in Violoncello al Conservatorio Giuseppe Verdi di Milano con Christian Bellisario e ottiene il Master of Arts in Music Pedagogy al Conservatorio della Svizzera Italiana di Lugano con Enrico Dindo, dopo aver seguito il corso di alto perfezionamento all\'Accademia "Fondazione Walter Stauffer" di Cremona con Rocco Filippini.',
      'Con il suo Quartetto d\'archi "Intime Voci" approfondisce le sue conoscenze della musica da camera alla Musikhochschule di Basilea con Rainer Schmidt (Quartetto Hagen). Dal 2014 è aggiunto presso l\'OSI (Orchestra della Svizzera italiana). Dal 2017 è Direttore Artistico della Primavera Musicale – festival musicale organizzato dall\'Associazione Silarte che riunisce artisti di generi diversi. Appassionato di cinema e in particolare di colonne sonore, Nicola inizia nel 2020 a comporre musica elettronica e pubblica l\'Album NiT SOLO (2023) su tutte le piattafrome musicali online.',
      'È membro attivo delle seguenti orchestre: Orchestra da Camera di Lugano (Dir. Stefano Bazzi); Orchestra Opera Viva (Dir. Andrea Cupia); Orchestra Vivace della Riviera (Dir. Daniele Giovannini); The Unated Soloists Orchestra (Dir. Arseniy Shkaptsov).',
      'Insegna con passione il violoncello alla Scuola di Musica del Conservatorio della Svizzera italiana (sezioni di Locarno e di Bellinzona) e presso la Scuola di Musica di Biasca e Alto Ticino.',
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

