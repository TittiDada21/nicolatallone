import { PAGE_CONFIG } from '@/data/pageConfig'

import styles from './ContentPage.module.css'

type ContentPageProps = {
  pageKey: keyof typeof PAGE_CONFIG
}

const getPageTheme = (pageKey: string): string => {
  if (pageKey.startsWith('progetti/duo-')) {
    return styles.themeDuo
  }
  if (pageKey === 'progetti/solista') {
    return styles.themeSolista
  }
  if (pageKey === 'progetti/quartetti' || pageKey === 'insegnamento/metodo') {
    return styles.themeBrown
  }
  if (pageKey === 'insegnamento/lezioni-private' || pageKey === 'insegnamento/iscrizioni-e-costi') {
    return styles.themeGreen
  }
  if (pageKey === 'insegnamento/conservatorio-svizzera-italiana') {
    return styles.themeBlue
  }
  if (pageKey.startsWith('cv/')) {
    return styles.themeCv
  }
  return ''
}

export function ContentPage({ pageKey }: ContentPageProps) {
  const page = PAGE_CONFIG[pageKey]
  const themeClass = getPageTheme(pageKey)

  if (!page) {
    return (
      <div className={`${styles.page} ${themeClass}`}>
        <div className={styles.inner}>
          <header className={styles.pageHeader}>
            <h1>Sezione in arrivo</h1>
            <p>Configura i contenuti per questa pagina nel file pageConfig.ts.</p>
          </header>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.page} ${themeClass}`}>
      <div className={styles.inner}>
        <header className={styles.pageHeader}>
          <h1>{page.title}</h1>
          <p className={styles.description}>{page.description}</p>
        </header>

        {page.body && (
          <section className={styles.body}>
            {page.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

