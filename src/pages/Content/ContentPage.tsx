import { useEffect, useMemo, useState } from 'react'

import { PAGE_CONFIG } from '@/data/pageConfig'
import { RepertoireTable } from '@/components/RepertoireTable/RepertoireTable'
import { useProjectRepertoire } from '@/hooks/useProjectRepertoire'
import { useAuth } from '@/providers/AuthProvider'

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
  const { user, signIn, signOut, loading: authLoading, isConfigured: supabaseConfigured } = useAuth()
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)

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
    fallback: page?.repertoire ?? [],
    enabled: isProjectPage,
  })

  const canEdit = Boolean(user) && supabaseConfigured && isProjectPage

  useEffect(() => {
    if (!canEdit) {
      setEditing(false)
    }
  }, [canEdit])

  const repertoireItems = isProjectPage ? repertoire : page?.repertoire ?? []
  const showRepertoire = isProjectPage || repertoireItems.length > 0

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
                  {repertoireSaving && <span className={styles.statusBadge}>Salvataggio…</span>}
                  <button
                    type="button"
                    className={editing ? styles.secondaryButton : styles.primaryButton}
                    onClick={() => setEditing((prev) => !prev)}
                  >
                    {editing ? 'Blocca modifiche' : 'Modifica repertorio'}
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      void signOut()
                      setEditing(false)
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {isProjectPage && (
              <div className={styles.adminBar}>
                {supabaseConfigured ? (
                  user ? (
                    <div className={styles.adminInfo}>
                      <p className={styles.adminTitle}>Area admin</p>
                      <p className={styles.adminSubtitle}>
                        {editing
                          ? 'Modifica inline attiva: ogni cambio viene salvato.'
                          : 'Clicca su “Modifica repertorio” per aggiornare i campi.'}
                      </p>
                    </div>
                  ) : (
                    <form
                      className={styles.adminForm}
                      onSubmit={async (event) => {
                        event.preventDefault()
                        setAuthError(null)
                        try {
                          await signIn({ password })
                          setPassword('')
                          setEditing(true)
                        } catch (error) {
                          const message = error instanceof Error ? error.message : 'Accesso non riuscito'
                          setAuthError(message)
                        }
                      }}
                    >
                      <label className={styles.adminLabel}>
                        Area admin
                        <input
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          className={styles.adminInput}
                          placeholder="Inserisci password"
                          disabled={authLoading}
                        />
                      </label>
                      <div className={styles.adminButtons}>
                        <button
                          type="submit"
                          className={styles.primaryButton}
                          disabled={authLoading || !password}
                        >
                          Accedi
                        </button>
                        {authError && <span className={styles.errorText}>{authError}</span>}
                      </div>
                    </form>
                  )
                ) : (
                  <p className={styles.adminSubtitle}>
                    Configura Supabase per abilitare la modifica del repertorio.
                  </p>
                )}
              </div>
            )}

            <RepertoireTable
              repertoire={repertoireItems}
              editable={canEdit && editing}
              loading={repertoireLoading}
              saving={repertoireSaving}
              error={repertoireError}
              onChange={canEdit ? updateField : undefined}
              onAddRow={canEdit ? addRow : undefined}
              onDeleteRow={canEdit ? deleteRow : undefined}
            />
          </section>
        )}

        {page.cachet && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Cachet</h2>
            <p className={styles.cachetText}>{page.cachet}</p>
          </section>
        )}
      </div>
    </div>
  )
}
