import { PAGE_CONFIG } from './pageConfig'

export type NavigationItem = {
  label: string
  path?: string
  pageKey?: keyof typeof PAGE_CONFIG
  externalHref?: string
  children?: NavigationItem[]
}

const buildPath = (key: keyof typeof PAGE_CONFIG) => `/${key}`

export const NAV_ITEMS: NavigationItem[] = [
  {
    label: 'CV',
    children: [
      {
        label: 'Generale',
        path: buildPath('cv/generale'),
        pageKey: 'cv/generale',
      },
      {
        label: 'Esecutore',
        path: buildPath('cv/esecutore'),
        pageKey: 'cv/esecutore',
      },
      {
        label: 'Organizzatore',
        path: buildPath('cv/organizzatore'),
        pageKey: 'cv/organizzatore',
      },
    ],
  },
  {
    label: 'Eventi',
    children: [
      {
        label: 'Futuri',
        path: buildPath('eventi/futuri'),
        pageKey: 'eventi/futuri',
      },
      {
        label: 'Passati',
        path: buildPath('eventi/passati'),
        pageKey: 'eventi/passati',
      },
    ],
  },
  {
    label: 'Progetti',
    children: [
      {
        label: 'Album',
        path: buildPath('progetti/album'),
        pageKey: 'progetti/album',
      },
      {
        label: 'Duo Chitarra',
        path: buildPath('progetti/duo-chitarra'),
        pageKey: 'progetti/duo-chitarra',
      },
      {
        label: 'Duo Clavicembalo',
        path: buildPath('progetti/duo-clavicembalo'),
        pageKey: 'progetti/duo-clavicembalo',
      },
      {
        label: 'Duo Piano',
        path: buildPath('progetti/duo-piano'),
        pageKey: 'progetti/duo-piano',
      },
      {
        label: 'Duo Voce',
        path: buildPath('progetti/duo-voce'),
        pageKey: 'progetti/duo-voce',
      },
      {
        label: 'Duo Viola',
        path: buildPath('progetti/duo-viola'),
        pageKey: 'progetti/duo-viola',
      },
      {
        label: 'Solista',
        path: buildPath('progetti/solista'),
        pageKey: 'progetti/solista',
      },
      {
        label: 'Quartetti',
        path: buildPath('progetti/quartetti'),
        pageKey: 'progetti/quartetti',
      },
    ],
  },
  {
    label: 'Insegnamento',
    children: [
      {
        label: 'Conservatorio Svizzera Italiana',
        path: buildPath('insegnamento/conservatorio-svizzera-italiana'),
        pageKey: 'insegnamento/conservatorio-svizzera-italiana',
      },
      {
        label: 'Lezioni private',
        path: buildPath('insegnamento/lezioni-private'),
        pageKey: 'insegnamento/lezioni-private',
      },
      {
        label: 'Iscrizioni e costi',
        path: buildPath('insegnamento/iscrizioni-e-costi'),
        pageKey: 'insegnamento/iscrizioni-e-costi',
      },
      {
        label: 'Metodo',
        path: buildPath('insegnamento/metodo'),
        pageKey: 'insegnamento/metodo',
      },
    ],
  },
  {
    label: 'Galleria',
    path: '/galleria',
  },
  {
    label: 'Silarte',
    path: '/silarte',
    externalHref: 'https://silarte.org',
  },
]

export const CONTENT_ROUTES = Object.keys(PAGE_CONFIG).map((key) => ({
  key: key as keyof typeof PAGE_CONFIG,
  path: buildPath(key as keyof typeof PAGE_CONFIG),
}))

