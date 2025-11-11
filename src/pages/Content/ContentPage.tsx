import { GlassPanel } from '@/components/common/GlassPanel'
import { PAGE_CONFIG } from '@/data/pageConfig'

import styles from './ContentPage.module.css'

type ContentPageProps = {
  pageKey: keyof typeof PAGE_CONFIG
}

export function ContentPage({ pageKey }: ContentPageProps) {
  const page = PAGE_CONFIG[pageKey]

  if (!page) {
    return (
      <div className={styles.wrapper}>
        <GlassPanel>
          <h1>Sezione in arrivo</h1>
          <p>Configura i contenuti per questa pagina nel file pageConfig.ts.</p>
        </GlassPanel>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <GlassPanel size="wide">
        <div className={styles.header}>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>
        {page.body && (
          <div className={styles.body}>
            {page.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  )
}

