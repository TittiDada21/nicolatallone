import type { RepertoireItem } from '@/types/repertoire'

export type BodyItem =
  | string
  | { type: 'heading'; content: string }
  | { type: 'list'; items: string[] }

export type PageContent = {
  title: string
  description: string
  body?: BodyItem[]
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
  subtitle?: string
}

export const PAGE_CONFIG: Record<string, PageContent> = {
  'cv/musicista': {
    title: 'Curriculum Musicista',
    description: 'Violoncellista, esecutore e docente.',
    coverImage: '/media/cover-cv-musicista.png',
    body: [
      'Nicola Tallone, violoncellista svizzero, si diploma in Violoncello al Conservatorio Giuseppe Verdi di Milano con Christian Bellisario e ottiene il Master of Arts in Music Pedagogy al Conservatorio della Svizzera Italiana di Lugano con Enrico Dindo, dopo aver seguito il corso di alto perfezionamento all\'Accademia "Fondazione Walter Stauffer" di Cremona con Rocco Filippini.',
      { type: 'heading', content: 'Generale' },
      {
        type: 'list', items: [
          'Data di nascita 29 novembre 1984',
          'Luogo di nascita Zurigo, Svizzera',
          'Nazionalità Svizzera',
          'Indirizzo Via Cantonale 56, 6719 Aquila, Svizzera',
          'Natel 0041 79 401 60 15',
          'E-mail nitcellist@gmail.com',
          'Strumento Violoncello',
        ]
      },
      { type: 'heading', content: 'Esperienza professionale' },
      {
        type: 'list', items: [
          'Dal 2023 Docente presso la Scuola di Musica del Conservatorio della Svizzera italiana',
          'Dal 2023 Docente di teoria e solfeggio e di musica d\'insieme presso la Scuola di Musica Biaschese - Tre Valli',
          'Dal 2020 Compositore di musica elettronica - Album NiT Solo (pubblicato su tutte le piattaforme online)',
          'Dal 2017 - 2023 Docente presso l\'Accademia Vivaldi di Muralto',
          '2016 - 2017 Supplente presso l\'Accademia Vivaldi di Muralto',
          '2015 - 2016 Docente presso la SMaRT Academy di Balerna',
          'Dal 2015 Docente presso la Scuola di Musica Biaschese - Tre Valli',
          '2013 - 2021 Docente presso l\'Atelier della Musica di Taverne',
          '2012 - 2016 Docente presso la Scuola di Musica di Capriasca dell\'Associazione Chopin',
          'Dal 2008 Attività professionale concertistica nelle seguenti formazioni: solista, duo, quartetto, orchestra e altre',
        ]
      },
      { type: 'heading', content: 'Formazione' },
      {
        type: 'list', items: [
          '2015 - 2017 Accademia di Musica di Basilea - Post-formazione per quartetti d\'archi - Rainer Schmidt, Maestro',
          '2012 - 2014 Conservatorio della Svizzera italiana - Scuola universitaria professionale di Musica, Via Soldino 9, 6900 Lugano, Svizzera - Master of Arts in Music Pedagogy, violoncello - Enrico Dindo, Maestro / Cristina Bellu, Didattica',
          '2008 – 2011 Conservatorio Giuseppe Verdi di Milano - Scuola universitaria di Musica, Via Conservatorio 12, 20122 Milano, Italia - Diploma di Primo livello (Bachelor), violoncello - Christian Bellisario, Maestro',
        ]
      },
      { type: 'heading', content: 'Educazione musicale' },
      {
        type: 'list', items: [
          '2011 – 2013 Accademia Walter Stauffer - Cremona, Italia - Corso di Alto Perfezionamento, violoncello - Rocco Filippini, Maestro',
          '2000 – 2008 Conservatorio della Svizzera italiana - Via Soldino 9, 6900 Lugano, Svizzera - Pre-professionale e Professionale studio del violoncello - Taisuke Yamashita, Maestro',
          '1996 – 2000 Lezioni private di violoncello - Taisuke Yamashita, Maestro',
          '1989 – 1996 Accademia Vivaldi - Locarno, Svizzera - Scuola di Musica, violoncello - Daniele Bogni, Maestro',
        ]
      },
      { type: 'heading', content: 'Masterclass di violoncello e di musica da camera effettuate' },
      {
        type: 'list', items: [
          'Agosto 2015 Rainer Schmidt - International Summer Academy del Mozarteum, Salisburgo, Austria',
          'Agosto 2013 Enrico Dindo - 51. Academy of Music, Sion, Svizzera',
          'Luglio 2013 Rocco Filippini - Campus internazionale di musica, Castello Caetani di Sermoneta, Italia',
          'Agosto 2011 Elizabeth Wilson - Masterclass internazionale Clara Wieck Schumann, Cerreto D\'Asti, Italia',
          'Luglio 2011 Christine Walevska - Masterclass di violoncello, Lugano, Svizzera',
          'Luglio 2011 Enrico Dindo - Ticino Musica, Lugano, Svizzera',
          'Agosto 2010 Christian Bellisario - The Art of Cello, Lugano, Svizzera',
          'Luglio 2009 Robert Cohen - Euro Music Festival 2009, Lipsia, Germania',
          'Novembre 2008 Mattia Zappa - Musica nel Mendrisiotto, Mendrisio, Svizzera',
          'Agosto 2008 Christian Bellisario - The Art of Cello, Lugano, Svizzera',
          'Luglio 2008 Johannes Goritzki - Ticino Musica, Lugano, Svizzera',
          'Luglio 2001 Johannes Goritzki - Ticino Musica, Lugano, Svizzera',
        ]
      },
      { type: 'heading', content: 'Educazione ed esperienze orchestrali' },
      {
        type: 'list', items: [
          'Dal 2025 UNATED SOLOISTS ORCHESTRA - Direttore: Arseniy Shkaptsov',
          'Dal 2024 Orchestra Vivace della Riviera - Direttore: Daniele Giovannini',
          'Agosto 2024 Amman Opera Festival International Orchestra - Sotto il Patrocinio della Principessa HRH Muna AL-HUSSEIN di Giordania; Raccolta Fondi per GAZA ORPHANED CHILDREN. AIDA (prima) di G. VERDI (primo violoncello) - Solista: Zeina Barhoum, Direttore: Claudio Morbo, Direttore esecutivo: Fabio Buonocore',
          'Aprile 2024 Aggiunto OSI (Orchestra della Svizzera italiana) per Tournée in Germania + LAC 09 - Direttore: Markus Poschner, Solista: Anna Vinnitskaya, dal 03.04.2024 - 20-04.2024',
          'Dal 2021 Orchestra Opera Viva - Direttore: Andrea Cupia',
          'Febbraio 2017 Camerata dei Castelli e Quintetto Bislacco - Teatro Sociale di Bellinzona, Direttore: Andreas Laake',
          'Gennaio 2017 Camerata dei Castelli - Teatro Sociale di Bellinzona, Direttore: Andreas Laake',
          'Dal 2016 Orchestra da Camera di Lugano - Direttore: Stefano Bazzi',
          'Luglio 2016 Orchestra da Camera di Lugano per "LongLake Festival" - Direttore: Stefano Bazzi, Solisti: Lugano Quartet (Zhen Xu, Maria Grazia Corino, Martino Laffranchini, Nicola Tallone)',
          'Maggio 2016 Camerata dei Castelli - Teatro Sociale di Bellinzona, Direttore: Andreas Laake',
          'Dal 2014 Aggiunto presso Orchestra della Svizzera italiana (OSI) per « Lugano Estival Jazz » - Mendrisio, Svizzera, Direttore: Gast Waltzing',
          'Luglio 2014 Orchestra da Camera del LongLake Festival - Lugano, Svizzera, Direttore: Christian Bellisario',
          '2005 – 2008 Orchestra sinfonica della Scuola universitaria del Conservatorio della Svizzera italiana - Lugano, Svizzera, Direttori: Lü Ja, Robert Cohen, Johannes Goritzky',
          'Settembre 2004 « 4. Internationalen Orchester-akademie mannheimer Schule des Nationaltheaters Mannheim » - Mannheim, Germania, Adam Fischer, Enrico Dovico, Christoph Spering, Direttori ospiti',
          'Estate 2002 Orchestra professionale del Conservatorio della Svizzera italiana per il concerto d\'apertura del Festival musicale in Val Gardena/Gröden - Italia, Norbert Brainin, Robert Cohen, Direttori, Robert Cohen, Solista',
          '1999 – 2002 Orchestra sinfonica giovanile - Lugano, Svizzera, Anna Modesti, Direttore',
        ]
      },
      { type: 'heading', content: 'Educazione generale' },
      {
        type: 'list', items: [
          'Giugno 2004 Maturità linguistica - Istituto Santa Caterina, 6600 Locarno, Svizzera',
        ]
      },
      { type: 'heading', content: 'Lingue parlate' },
      {
        type: 'list', items: [
          'Italiano Madrelingua',
          'Francese e Inglese Conoscenza molto buona',
          'Tedesco Conoscenza buona',
        ]
      },
    ],
  },
  'cv/organizzatore': {
    title: 'Curriculum da organizzatore',
    description:
      'Esperienze legate all\'organizzazione di rassegne musicali, festival e progetti culturali.',
    coverImage: '/media/cover-cv-organizzatore.png',
    body: [
      { type: 'heading', content: 'Esperienza in Direzione Artistica, Organizzazione Eventi, Raccolta Fondi, Hostess' },
      {
        type: 'list', items: [
          'Da Marzo 2025 Presidente Associazione Silarte',
          'Luglio 2023 Co-Organizzatore, Direttore Artistico e Docente della The Locarno Masterclass - Masterclass Internazionale presso l\'Istituto Sant\'Eugenio di Locarno con la partecipazione attiva di 22 studenti provenienti da Shanghai (Cina)',
          'Dal 2021 Responsabile Raccolta Fondi presso Associazione Silarte di Cevio',
          'Estate 2018 Hostess per Locarno Film Festival 2018 - Accoglienza degli Artisti e varie mansioni organizzative',
          'Dal 2017 Direttore Artistico presso Associazione Silarte di Cevio - Primavera Musicale - Edizioni: 2018/2019/2020/2021/2022/2023/2024',
        ]
      },
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
    body: [
      'Il duo formato da violoncello e chitarra rappresenta una delle combinazioni più affascinanti e versatili del panorama cameristico. La profondità e il lirismo del violoncello si fondono con la ricchezza armonica e la trasparenza della chitarra, creando un amalgama sonoro unico, capace di spaziare dal vigore ritmico alla più delicata introspezione.',
      { type: 'heading', content: 'Un Viaggio tra i Generi' },
      'Il nostro programma esplora secoli di storia musicale, partendo dalle trascrizioni barocche dove il violoncello canta su un tappeto armonico finemente intrecciato, passando per il romanticismo europeo, fino ad approdare alle calde atmosfere del Sud America. Autori come Astor Piazzolla e Manuel de Falla trovano in questa formazione una dimensione ideale, dove la danza e il canto si fondono in un unico respiro.',
      { type: 'heading', content: 'Eleganza e Versatilità' },
      'Ogni concerto è concepito come un racconto. Amiamo instaurare un contatto diretto con il pubblico, introducendo i brani e condividendo curiosità storiche o aneddoti personali legati alle composizioni. La nostra proposta è adatta sia a stagioni concertistiche formali che a eventi privati d\'élite, dove la musica diviene cornice di rara eleganza.',
    ],
    cachet:
      'Il cachet per concerti con il duo chitarra varia in base alla location e alla durata dell\'evento. Per informazioni dettagliate e preventivi personalizzati, si prega di contattare direttamente l\'artista.',
  },
  'progetti/duo-clavicembalo': {
    title: 'Duo Clavicembalo',
    description:
      'Un viaggio nel repertorio barocco con l\'eleganza del clavicembalo e la profondità del violoncello, riscoprendo capolavori del periodo aureo della musica antica.',
    coverImage: '/media/placeholder-progetti-subpages2.png',
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
    body: [
      'Il duo violoncello e pianoforte è una delle formazioni classiche per eccellenza, capace di esprimere la massima gamma dinamica e timbrica. In questa collaborazione, i due strumenti non sono semplicemente solista e accompagnatore, ma partner paritetici in un dialogo serrato, virtuostico e profondamente emozionante.',
      { type: 'heading', content: 'Il Grande Repertorio' },
      'Il nucleo della nostra proposta si concentra sui capolavori del XIX e XX secolo. Dalla solarità della Terza Sonata di Beethoven, opera di perfetto equilibrio classico-romantico, alle profonde tensioni della musica di Brahms e Rachmaninoff, esploriamo la ricchezza del repertorio dove il pianoforte stende ampie campiture armoniche su cui il violoncello può dispiegare tutto il suo potenziale espressivo.',
      { type: 'heading', content: 'Passione e Rigore' },
      'La nostra ricerca si focalizza sulla fedeltà al testo unita a una visione interpretativa moderna e vibrante. Ogni esecuzione mira a restituire all\'ascoltatore l\'intensità del pensiero compositivo, trasformando il concerto in un\'esperienza immersiva e indimenticabile.',
    ],
    cachet:
      'Il duo piano e violoncello è disponibile per concerti, eventi privati e rassegne musicali. I costi variano in base alla durata e alla complessità del programma. Contattateci per maggiori informazioni.',
  },
  'progetti/duo-voce': {
    title: 'Duo Voce',
    description:
      'L\'incontro tra la voce umana e il violoncello genera emozioni profonde, attraverso lied romantici, canzoni d\'autore e composizioni contemporanee che esplorano la poetica del suono.',
    coverImage: '/media/placeholder-progetti-subpages2.png',
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
    coverImage: '/media/placeholder-progetti-subpages2.png',
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
    body: [
      'Il recital per violoncello solo è una sfida artistica e umana, un momento di assoluta vicinanza tra l\'interprete, lo strumento e l\'ascoltatore. Senza il sostegno di altri strumenti, il violoncello si rivela nella sua interezza: polifonico, melodico, percussivo, in un monologo che diventa dialogo interiore.',
      { type: 'heading', content: 'Dalle Suite di Bach alla Modernità' },
      'Il programma solistico propone un arco temporale che parte dalle fondamenta della letteratura violoncellistica: le Suite di J.S. Bach, microcosmi di perfezione formale e spirituale. Il viaggio prosegue verso il Novecento di Kodály, che esplora le radici popolari e le possibilità virtuosistiche estreme, e Britten, che con le sue Suite rende omaggio alla tradizione russa infondendovi un linguaggio colto e innovativo.',
      { type: 'heading', content: 'Solitudine Creativa' },
      'In questi programmi, il silenzio tra le note acquista la stessa importanza del suono. La performance solistica è ideale per contesti che richiedono un\'atmosfera di raccoglimento e concentrazione, dove ogni sfumatura timbrica può essere apprezzata nella sua purezza.',
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
      { type: 'heading', content: 'Perché la SMUS' },
      'Eccellenza musicale. Dal 1985 offriamo una formazione musicale eccellente sia sotto il profilo tecnico-individuale sia sotto quello collettivo. Da 40 anni proponiamo un progetto pedagogico globale di educazione musicale che mette al centro la crescita artistica e culturale, personale e sociale dei nostri allievi. Ogni anno elaboriamo un progetto educativo che risponda, in modo costruttivo e tempestivo, ai cambiamenti culturali e sociali.',
      'Eccellenza pedagogica. Scegliamo con cura i nostri docenti. Ognuno di loro dispone di diplomi artistici e pedagogici riconosciuti e collabora per redigere e aggiornare costantemente i programmi didattici della Scuola, riservando particolare attenzione al corretto sviluppo creativo e umano degli allievi.',
      'Garanzia di qualità. Grazie all’ampia offerta di elevata qualità didattica, rappresentiamo da sempre l’istituzione di riferimento dell’educazione musicale per le famiglie ticinesi. Offriamo una formazione musicale a 360°, in tutti i repertori e generi musicali, accessibile a chiunque desideri avvicinarsi alla musica, indipendentemente dall’età e dalle proprie abilità.',
      'Didattica progressiva. Accompagniamo il nostro allievo nel suo percorso di crescita. Dai primi passi di esplorazione della musica, all’apprendimento e perfezionamento strumentale e vocale, offrendo la possibilità di condividere il piacere di fare musica insieme, negli ensemble, in coro o in orchestra. Arricchiamo la nostra offerta con corsi di composizione, corsi teorici e molteplici attività formative complementari.',
      'I nostri numeri. Siamo presenti in tutto il Cantone. Con le sedi di Mendrisio, Lugano, Bellinzona e Locarno, e le succursali di Breganzona, Pura e Alta Leventina, raggiungiamo oltre 1’000 allievi che frequentano 2’000 corsi musicali: circa 700 ore di lezione a settimana e più di 100 appuntamenti l’anno tra saggi, piccoli e grandi concerti, co-produzioni sul territorio cantonale, nazionale e internazionale, che valorizzano l’impegno, la dedizione e la passione di ogni allievo.',
      'Le nostre collaborazioni. Contiamo su una collaborazione sistematica con il Pre-College e la Scuola universitaria di Musica del Conservatorio e con diversi enti tra cui: l’Associazione Svizzera delle Scuole di Musica ASSM, la Federazione delle scuole di musica ticinesi FeSMuT, la Federazione Bandistica Ticinese FeBaTi, il Concorso Svizzero di musica per la gioventù SJMW, LAC Edu, Musica nel Mendrisiotto, MusicalinsiEME, l’lstituto Von Mentlen Bellinzona, La Filanda Mendrisio, la Parrocchia Sant\'Antonio Locarno, il Salone Olimpia Airolo, il Teatro Casvegno Mendrisio, il Teatro del Gatto Ascona, il Teatro Paravento Locarno, il Teatro Sociale Arogno, e il Teatro Sociale Bellinzona.',
      'La SMUS è riconosciuta dal Cantone.',
    ],
    layout: 'conservatorio',
    sideImage: '/media/la-citta-della-musica.jpg',
    externalLink: {
      label: 'Visita il sito ufficiale del CSI',
      url: 'https://www.conservatorio.ch',
    },
    subtitle: 'Il docente Nicola Tallone insegna presso la scuola di musica del Conservatorio della Svizzera Italiana, nelle sedi di Locarno e Bellinzona. Il mercoledì pomeriggio dirige gli Archi di Bellinzona, corso imprescindibile per sviluppare le competenze della musica d’insieme.',
  },
  'insegnamento/lezioni-private': {
    title: 'Lezioni private',
    description:
      'Percorsi personalizzati per imparare il violoncello o perfezionare la tecnica, adatti a ogni livello.',
    coverImage: '/media/cover-lezioni-private.png',
    layout: 'private-lessons',
    subtitle: 'percorsi personalizzati in particolare per quegli adulti che non riescono a seguire un ritmo accademico o per quei giovani talenti che hanno bisogno di approfondire oltre le lezioni regolari di conservatorio.',
    packages: [
      {
        title: 'Pacchetto 1 ("Hobby")',
        features: ['per un’ora al mese 150chf', 'se piu di una (al mese) 100chf a lezione'],
      },
      {
        title: 'Pacchetto 2 ("Passione")',
        features: ['minimo 1 a settimana', '80 chf all’ora'],
      },
      {
        title: 'Pacchetto 3 ("Master")',
        features: ['per più di un’ora di lezione', '100chf a settimana', '(senza guardare l’orologio)'],
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
      'L\'insegnamento del violoncello come percorso di scoperta sonora, equilibrio tecnico e consapevolezza espressiva.',
    coverImage: '/media/placeholder-progetti-subpages.png',
    body: [
      'La mia metodologia didattica affonda le radici nella grande tradizione violoncellistica italiana, perfezionata attraverso gli insegnamenti di maestri come Enrico Dindo e Rocco Filippini, e si arricchisce delle competenze acquisite nel Master of Arts in Music Pedagogy presso il Conservatorio della Svizzera italiana.',
      { type: 'heading', content: 'Filosofia Didattica' },
      'Credo che ogni allievo sia un universo unico. Il mio obiettivo non è imporre un modello predefinito, ma aiutare ogni studente a trovare la propria "voce" attraverso lo strumento. L\'insegnamento è per me un dialogo costante tra tecnica e intuizione, dove la disciplina diventa il mezzo per liberare l\'espressività.',
      { type: 'heading', content: 'Tecnica e Consapevolezza Corporea' },
      'Il violoncello deve essere un\'estensione naturale del corpo. Dedico particolare attenzione alla postura e all\'uso consapevole del peso del braccio, ispirandomi ai principi della fisiologia del movimento applicata alla musica. Una tecnica sana è la base imprescindibile per una longevità artistica e per la prevenzione di tensioni muscolari.',
      { type: 'heading', content: 'Interpretazione e Linguaggio Musicale' },
      'Lo studio di un brano non si ferma alla corretta esecuzione delle note. Approfondiamo insieme l\'analisi formale, il contesto storico e le scelte retoriche per dare vita a un\'interpretazione consapevole. Dalla musica barocca (studiata anche attraverso la collaborazione con specialisti) fino alla musica contemporanea ed elettronica, ogni genere richiede un vocabolario sonoro specifico.',
      { type: 'heading', content: 'Personalizzazione del Percorso' },
      'Che si tratti di un bambino che si accosta per la prima volta allo strumento, di un amatore adulto o di uno studente universitario in cerca di perfezionamento, il percorso viene cucito su misura. Utilizzo metodi consolidati del repertorio didattico classico integrati da esercizi personalizzati, incoraggiando fin da subito la pratica della musica d\'insieme.',
    ],
  },
}
