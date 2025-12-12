import { useEffect, useMemo, useState, type SVGProps } from 'react'

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

const LockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
)

const OpenLockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
)

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
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)

  const repertoireFallback = useMemo(() => page?.repertoire ?? [], [page])
  const cachetFallback = useMemo(() => page?.cachet ?? '', [page])

  useEffect(() => {
    setRepertoireModalOpen(false)
    setCachetModalOpen(false)
    setLoginModalOpen(false)
    setLogoutConfirmOpen(false)
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
            {isProjectPage && supabaseConfigured && (
              <>
                {!user ? (
                  <LockIcon
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
                ) : (
                  <OpenLockIcon
                    className={styles.adminIcon}
                    aria-label="Modalità admin attiva"
                    role="button"
                    tabIndex={0}
                    onClick={() => setLogoutConfirmOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setLogoutConfirmOpen(true)
                      }
                    }}
                  />
                )}
              </>
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
            onSuccess={() => setLoginModalOpen(false)}
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
          {logoutConfirmOpen && (
            <div
              className={styles.confirmBackdrop}
              role="presentation"
              onClick={() => setLogoutConfirmOpen(false)}
            >
              <div
                className={styles.confirmModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="logout-confirm-title"
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.confirmHeader}>
                  <h3 id="logout-confirm-title">Vuoi fare logout?</h3>
                  <button
                    type="button"
                    className={styles.closeButton}
                    aria-label="Chiudi avviso"
                    onClick={() => setLogoutConfirmOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <p className={styles.confirmText}>Scegli se uscire dalla modalità admin.</p>
                <div className={styles.confirmActions}>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => {
                      setRepertoireModalOpen(false)
                      setCachetModalOpen(false)
                      void signOut()
                      setLogoutConfirmOpen(false)
                    }}
                  >
                    SI, esci dalla modalità admin
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => setLogoutConfirmOpen(false)}
                  >
                    NO, continua a modificare
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
