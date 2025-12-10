import { useEffect, useMemo, useState } from 'react'
import { FaLock } from 'react-icons/fa'

import { PAGE_CONFIG } from '@/data/pageConfig'
import { RepertoireTable } from '@/components/RepertoireTable/RepertoireTable'
import { AdminRepertoireModal } from '@/components/RepertoireTable/AdminRepertoireModal'
import { AdminCachetModal } from '@/components/Content/AdminCachetModal'
import { useProjectRepertoire } from '@/hooks/useProjectRepertoire'
import { useProjectCachet } from '@/hooks/useProjectCachet'
import { useAuth } from '@/providers/AuthProvider'
import { AdminLoginModal } from '@/components/common/AdminLoginModal'

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
  const { user, signOut, isConfigured: supabaseConfigured } = useAuth()
  const [repertoireModalOpen, setRepertoireModalOpen] = useState(false)
  const [cachetModalOpen, setCachetModalOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const repertoireFallback = useMemo(() => page?.repertoire ?? [], [page])
  const cachetFallback = useMemo(() => page?.cachet ?? '', [page])

  useEffect(() => {
    setRepertoireModalOpen(false)
    setCachetModalOpen(false)
    setLoginModalOpen(false)
  }, [pageKey])

  const isProjectPage = useMemo(
    () => pageKey.startsWith('progetti/') && pageKey !== 'progetti/album',
    [pageKey],
  )

  const {
    repertoire,
    loading: repertoireLoading,
    saving: repertoireSaving,
    error: repertoireError,
    updateField,
    addRow,
    deleteRow,
  } = useProjectRepertoire({
    pageKey,
    fallback: repertoireFallback,
    enabled: isProjectPage,
  })

  const {
    cachet,
    loading: cachetLoading,
    saving: cachetSaving,
    error: cachetError,
    updateCachet,
  } = useProjectCachet({
    pageKey,
    fallback: cachetFallback,
    enabled: isProjectPage,
  })

  const canEdit = Boolean(user) && supabaseConfigured && isProjectPage

  const repertoireItems = isProjectPage ? repertoire : page?.repertoire ?? []
  const showRepertoire = isProjectPage || repertoireItems.length > 0
  const displayCachet = isProjectPage ? cachet : page?.cachet

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
          <div className={styles.headerRow}>
            <div>
              <h1>{page.title}</h1>
              <p className={styles.description}>{page.description}</p>
            </div>
            {isProjectPage && !user && supabaseConfigured && (
              <FaLock
                className={styles.adminIcon}
                onClick={() => setLoginModalOpen(true)}
                aria-label="Accesso admin"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setLoginModalOpen(true)
                  }
                }}
              />
            )}
          </div>
        </header>

        {page.coverImage && (
          <section className={styles.section}>
            <img src={page.coverImage} alt={page.title} className={styles.coverImage} />
          </section>
        )}

        {page.body && (
          <section className={styles.body}>
            {page.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>
        )}

        {showRepertoire && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Repertorio</h2>
              {canEdit && (
                <div className={styles.sectionActions}>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => setRepertoireModalOpen(true)}
                  >
                    Modifica repertorio
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      void signOut()
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <RepertoireTable
              repertoire={repertoireItems}
              loading={repertoireLoading}
            />
          </section>
        )}

        {displayCachet && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Cachet</h2>
              {canEdit && (
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => setCachetModalOpen(true)}
                >
                  Modifica cachet
                </button>
              )}
            </div>
            <p className={styles.cachetText}>{displayCachet}</p>
          </section>
        )}
      </div>

      {isProjectPage && (
        <>
          <AdminLoginModal
            open={loginModalOpen}
            onClose={() => setLoginModalOpen(false)}
            onSuccess={() => setRepertoireModalOpen(true)}
          />
          <AdminRepertoireModal
            open={repertoireModalOpen}
            repertoire={repertoire}
            loading={repertoireLoading}
            saving={repertoireSaving}
            error={repertoireError}
            onClose={() => setRepertoireModalOpen(false)}
            onUpdateField={updateField}
            onAddRow={addRow}
            onDeleteRow={deleteRow}
          />
          <AdminCachetModal
            open={cachetModalOpen}
            cachet={cachet}
            loading={cachetLoading}
            saving={cachetSaving}
            error={cachetError}
            onClose={() => setCachetModalOpen(false)}
            onUpdateCachet={updateCachet}
          />
        </>
      )}
    </div>
  )
}
