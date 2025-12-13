import type { RepertoireItem } from '@/types/repertoire'

export type PageContent = {
  title: string
  description: string
  body?: string[]
  coverImage?: string
  sideImage?: string
  externalLink?: {
    label: string
    url: string
  }
  repertoire?: RepertoireItem[]
  cachet?: string
  packages?: Array<{
    title: string
    features: string[]
    price?: string
  }>
  termsWarning?: string
  pdfPreview?: {
    thumbnail: string
    title: string
    url: string
  }
  layout?: 'standard' | 'conservatorio' | 'private-lessons'
}

export const PAGE_CONFIG: Record<string, PageContent> = {
  'cv/musicista': {
    title: 'Curriculum Musicista',
    description: 'Violoncellista, esecutore e docente.',
    coverImage: '/media/cover-cv-musicista.png',
    body: [
      'Nicola Tallone, violoncellista svizzero, si diploma in Violoncello al Conservatorio Giuseppe Verdi di Milano con Christian Bellisario e ottiene il Master of Arts in Music Pedagogy al Conservatorio della Svizzera Italiana di Lugano con Enrico Dindo, dopo aver seguito il corso di alto perfezionamento all\'Accademia "Fondazione Walter Stauffer" di Cremona con Rocco Filippini.',
      'Con il suo Quartetto d\'archi "Intime Voci" approfondisce le sue conoscenze della musica da camera alla Musikhochschule di Basilea con Rainer Schmidt (Quartetto Hagen). Dal 2014 è aggiunto presso l\'OSI (Orchestra della Svizzera italiana). Dal 2017 è Direttore Artistico della Primavera Musicale – festival musicale organizzato dall\'Associazione Silarte che riunisce artisti di generi diversi. Appassionato di cinema e in particolare di colonne sonore, Nicola inizia nel 2020 a comporre musica elettronica e pubblica l\'Album NiT SOLO (2023) su tutte le piattafrome musicali online.',
      'È membro attivo delle seguenti orchestre: Orchestra da Camera di Lugano (Dir. Stefano Bazzi); Orchestra Opera Viva (Dir. Andrea Cupia); Orchestra Vivace della Riviera (Dir. Daniele Giovannini); The Unated Soloists Orchestra (Dir. Arseniy Shkaptsov).',
      'Insegna con passione il violoncello alla Scuola di Musica del Conservatorio della Svizzera italiana (sezioni di Locarno e di Bellinzona) e presso la Scuola di Musica di Biasca e Alto Ticino.',
    ],
  },
  'cv/organizzatore': {
    title: 'Curriculum da organizzatore',
    description:
      'Esperienze legate all’organizzazione di rassegne musicali, festival e progetti culturali.',
    coverImage: '/media/cover-cv-organizzatore.png',
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
      'Un dialogo intimo tra violoncello e chitarra, esplorando repertori dal barocco al contemporaneo con sonorità raffinate e arrangiamenti originali.',
    coverImage: '/media/placeholder-progetti-subpages.png',
    repertoire: [
      {
        composer: { firstName: 'Johann Sebastian', lastName: 'Bach', birthYear: 1685, deathYear: 1750 },
        pieceTitle: 'Suite per violoncello solo n. 1 in Sol maggiore, BWV 1007 (arr. per duo)',
        compositionYear: 1720,
      },
      {
        composer: { firstName: 'Astor', lastName: 'Piazzolla', birthYear: 1921, deathYear: 1992 },
        pieceTitle: 'Le Grand Tango',
        compositionYear: 1982,
      },
      {
        composer: { firstName: 'Manuel', lastName: 'de Falla', birthYear: 1876, deathYear: 1946 },
        pieceTitle: 'Suite Populaire Espagnole',
        compositionYear: 1914,
      },
    ],
    cachet:
      'Il cachet per concerti con il duo chitarra varia in base alla location e alla durata dell\'evento. Per informazioni dettagliate e preventivi personalizzati, si prega di contattare direttamente l\'artista.',
  },
  'progetti/duo-clavicembalo': {
    title: 'Duo Clavicembalo',
    description:
      'Un viaggio nel repertorio barocco con l\'eleganza del clavicembalo e la profondità del violoncello, riscoprendo capolavori del periodo aureo della musica antica.',
    coverImage: '/media/placeholder-progetti-subpages.png',
    repertoire: [
      {
        composer: { firstName: 'Georg Friedrich', lastName: 'Händel', birthYear: 1685, deathYear: 1759 },
        pieceTitle: 'Sonata in Sol minore per violoncello e basso continuo, HWV 364b',
        compositionYear: 1730,
      },
      {
        composer: { firstName: 'Antonio', lastName: 'Vivaldi', birthYear: 1678, deathYear: 1741 },
        pieceTitle: 'Sonata in Mi minore, RV 40',
      },
      {
        composer: { firstName: 'Francesco', lastName: 'Geminiani', birthYear: 1687, deathYear: 1762 },
        pieceTitle: 'Sonata per violoncello e basso continuo in La maggiore, Op. 5 No. 1',
        compositionYear: 1746,
      },
    ],
    cachet:
      'Tariffe competitive per concerti barocchi. Il duo offre programmi tematici personalizzabili. Contattare per ricevere un preventivo dettagliato in base alle esigenze specifiche.',
  },
  'progetti/duo-piano': {
    title: 'Duo Piano',
    description:
      'La fusione tra violoncello e pianoforte crea atmosfere intense e coinvolgenti, spaziando dal romanticismo al repertorio contemporaneo con interpretazioni appassionate.',
    coverImage: '/media/placeholder-progetti-subpages.png',
    repertoire: [
      {
        composer: { firstName: 'Ludwig van', lastName: 'Beethoven', birthYear: 1770, deathYear: 1827 },
        pieceTitle: 'Sonata per violoncello e pianoforte n. 3 in La maggiore, Op. 69',
        compositionYear: 1808,
      },
      {
        composer: { firstName: 'Johannes', lastName: 'Brahms', birthYear: 1833, deathYear: 1897 },
        pieceTitle: 'Sonata per violoncello e pianoforte n. 1 in Mi minore, Op. 38',
        compositionYear: 1865,
      },
      {
        composer: { firstName: 'Sergei', lastName: 'Rachmaninoff', birthYear: 1873, deathYear: 1943 },
        pieceTitle: 'Sonata per violoncello e pianoforte in Sol minore, Op. 19',
        compositionYear: 1901,
      },
    ],
    cachet:
      'Il duo piano e violoncello è disponibile per concerti, eventi privati e rassegne musicali. I costi variano in base alla durata e alla complessità del programma. Contattateci per maggiori informazioni.',
  },
  'progetti/duo-voce': {
    title: 'Duo Voce',
    description:
      'L\'incontro tra la voce umana e il violoncello genera emozioni profonde, attraverso lied romantici, canzoni d\'autore e composizioni contemporanee che esplorano la poetica del suono.',
    coverImage: '/media/placeholder-progetti-subpages.png',
    repertoire: [
      {
        composer: { firstName: 'Franz', lastName: 'Schubert', birthYear: 1797, deathYear: 1828 },
        pieceTitle: 'Der Hirt auf dem Felsen, D. 965 (arr. per voce e violoncello)',
        compositionYear: 1828,
      },
      {
        composer: { firstName: 'Gabriel', lastName: 'Fauré', birthYear: 1845, deathYear: 1924 },
        pieceTitle: 'Après un rêve, Op. 7 No. 1',
        compositionYear: 1878,
      },
      {
        composer: { firstName: 'Heitor', lastName: 'Villa-Lobos', birthYear: 1887, deathYear: 1959 },
        pieceTitle: 'Bachianas Brasileiras n. 5 (Aria)',
        compositionYear: 1938,
      },
    ],
    cachet:
      'Programmi su misura per eventi speciali, matrimoni e concerti da camera. Il repertorio può essere personalizzato in base alle preferenze. Per preventivi e disponibilità, contattateci direttamente.',
  },
  'progetti/duo-viola': {
    title: 'Duo Viola',
    description:
      'Un connubio perfetto tra due strumenti ad arco che dialogano in armonia, esplorando un repertorio che spazia dalla musica barocca alle composizioni moderne con timbri caldi e avvolgenti.',
    coverImage: '/media/placeholder-progetti-subpages.png',
    repertoire: [
      {
        composer: { firstName: 'Wolfgang Amadeus', lastName: 'Mozart', birthYear: 1756, deathYear: 1791 },
        pieceTitle: 'Duo in Sol maggiore per violino e viola, K. 423 (arr. per viola e violoncello)',
        compositionYear: 1783,
      },
      {
        composer: { firstName: 'Ludwig van', lastName: 'Beethoven', birthYear: 1770, deathYear: 1827 },
        pieceTitle: 'Duetto con due obbligati per viola e violoncello, WoO 32',
        compositionYear: 1796,
      },
      {
        composer: { firstName: 'Zoltán', lastName: 'Kodály', birthYear: 1882, deathYear: 1967 },
        pieceTitle: 'Duo per violino e violoncello, Op. 7 (arr. per viola e violoncello)',
        compositionYear: 1914,
      },
    ],
    cachet:
      'Il duo viola e violoncello offre programmi raffinati per concerti da camera e festival. Possibilità di personalizzare il repertorio in base al tema dell\'evento. Richiedete un preventivo personalizzato.',
  },
  'progetti/solista': {
    title: 'Solista',
    description:
      'Programmi solistici che esplorano la profondità espressiva del violoncello, dal repertorio barocco di Bach alle sperimentazioni contemporanee, in un viaggio musicale intimo e virtuosistico.',
    coverImage: '/media/placeholder-progetti-subpages.png',
    repertoire: [
      {
        composer: { firstName: 'Johann Sebastian', lastName: 'Bach', birthYear: 1685, deathYear: 1750 },
        pieceTitle: 'Suite per violoncello solo n. 1 in Sol maggiore, BWV 1007',
        compositionYear: 1720,
      },
      {
        composer: { firstName: 'Zoltán', lastName: 'Kodály', birthYear: 1882, deathYear: 1967 },
        pieceTitle: 'Sonata per violoncello solo, Op. 8',
        compositionYear: 1915,
      },
      {
        composer: { firstName: 'Benjamin', lastName: 'Britten', birthYear: 1913, deathYear: 1976 },
        pieceTitle: 'Suite per violoncello solo n. 1, Op. 72',
        compositionYear: 1964,
      },
    ],
    cachet:
      'Recital solistici disponibili per stagioni concertistiche, festival e eventi culturali. Programmi tematici su richiesta. Per informazioni su disponibilità e tariffe, si prega di contattare l\'artista.',
  },
  'progetti/quartetti': {
    title: 'Quartetti',
    description:
      'Collaborazioni cameristiche in formazioni di quartetto d\'archi, esplorando il grande repertorio classico e romantico con ensemble affiatati e interpretazioni di alto livello artistico.',
    coverImage: '/media/placeholder-progetti-subpages.png',
    repertoire: [
      {
        composer: { firstName: 'Wolfgang Amadeus', lastName: 'Mozart', birthYear: 1756, deathYear: 1791 },
        pieceTitle: 'Quartetto per archi n. 19 in Do maggiore, K. 465 "Delle dissonanze"',
        compositionYear: 1785,
      },
      {
        composer: { firstName: 'Ludwig van', lastName: 'Beethoven', birthYear: 1770, deathYear: 1827 },
        pieceTitle: 'Quartetto per archi n. 14 in Do diesis minore, Op. 131',
        compositionYear: 1826,
      },
      {
        composer: { firstName: 'Dmitri', lastName: 'Shostakovich', birthYear: 1906, deathYear: 1975 },
        pieceTitle: 'Quartetto per archi n. 8 in Do minore, Op. 110',
        compositionYear: 1960,
      },
    ],
    cachet:
      'Il quartetto è disponibile per concerti, residenze artistiche e progetti speciali. Repertorio vasto e possibilità di programmi tematici. Contattateci per ricevere informazioni dettagliate su costi e disponibilità.',
  },
  'insegnamento/conservatorio-svizzera-italiana': {
    title: 'Conservatorio della Svizzera Italiana',
    description:
      'Un polo di eccellenza per la formazione musicale nel cuore dell\'Europa, dove tradizione e innovazione si incontrano.',
    body: [
      'Il Conservatorio della Svizzera italiana (CSI) è molto più di una scuola di musica: è un centro culturale dinamico riconosciuto a livello internazionale. Parte della Scuola Universitaria Professionale della Svizzera Italiana (SUPSI), offre percorsi di alta formazione che spaziano dal Bachelor al Master, preparando le nuove generazioni di musicisti alle sfide del panorama artistico contemporaneo.',
      'All\'interno di questo ambiente stimolante, il mio ruolo di docente si focalizza sullo sviluppo tecnico ed espressivo degli studenti di violoncello. Il percorso didattico che propongo mira a fornire solidi fondamenti strumentali, ma soprattutto a stimolare la ricerca di una propria voce artistica. Attraverso lezioni individuali, musica da camera e progetti orchestrali, accompagno gli allievi in un viaggio di scoperta musicale che va oltre la semplice esecuzione.',
      'La struttura del Conservatorio, situata nella "Città della Musica" a Lugano, offre spazi acusticamente perfetti e tecnologie all\'avanguardia, creando l\'ecosistema ideale per lo studio e la performance. Qui, gli studenti hanno l\'opportunità di confrontarsi con maestri di fama mondiale e di partecipare a masterclass esclusive.',
      'Collaborare con un\'istituzione di tale prestigio mi permette di trasmettere non solo la tecnica violoncellistica, ma anche i valori di disciplina, passione e integrità artistica che sono fondamentali per una carriera professionale nel mondo della musica classica.',
    ],
    layout: 'conservatorio',
    sideImage: '/media/la-citta-della-musica.jpg',
    externalLink: {
      label: 'Visita il sito ufficiale del CSI',
      url: 'https://www.conservatorio.ch',
    },
  },
  'insegnamento/lezioni-private': {
    title: 'Lezioni private',
    description:
      'Percorsi personalizzati per imparare il violoncello o perfezionare la tecnica, adatti a ogni livello.',
    coverImage: '/media/mobile-hero-cover.jpg', // Placeholder for now
    layout: 'private-lessons',
    packages: [
      {
        title: 'Pacchetto Base',
        features: ['5 lezioni', 'Validità 2 mesi', 'Orari flessibili'],
        price: '300 CHF',
      },
      {
        title: 'Pacchetto Intermedio',
        features: ['10 lezioni', 'Validità 4 mesi', '1 lezione di musica d\'insieme'],
        price: '550 CHF',
      },
      {
        title: 'Pacchetto Avanzato',
        features: ['20 lezioni', 'Validità 9 mesi', 'Masterclass annuale riservata', 'Sconto su acquisto strumenti parter'],
        price: '1000 CHF',
      },
    ],
    termsWarning:
      'Attenzione: per garantire la continuità didattica, le lezioni annullate con meno di 24 ore di preavviso verranno addebitate interamente.',
    pdfPreview: {
      title: 'Termini e Condizioni',
      url: '/testi/termini-e-condizioni.pdf',
      thumbnail: '/media/official-logo-icon.png', // Fallback thumbnail
    },
  },
  'insegnamento/metodo': {
    title: 'Metodo',
    description:
      'Approccio didattico e metodologia di insegnamento.',
  },
}
