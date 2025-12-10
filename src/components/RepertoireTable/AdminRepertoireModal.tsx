import type { FormEvent, ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiLoader, FiTrash2, FiPlus } from 'react-icons/fi'

import { useAuth } from '@/providers/AuthProvider'
import type { RepertoireEntry, RepertoireField } from '@/types/repertoire'

import styles from './AdminRepertoireModal.module.css'

type AdminRepertoireModalProps = {
  open: boolean
  repertoire: RepertoireEntry[]
  loading: boolean
  saving: boolean
  error?: string
  onClose: () => void
  onUpdateField: (index: number, field: RepertoireField, value: string | number | undefined) => Promise<void>
  onAddRow: () => Promise<void>
  onDeleteRow: (index: number) => Promise<void>
}

const toNumberOrUndefined = (value: string): number | undefined => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

export function AdminRepertoireModal({
  open,
  repertoire,
  loading,
  saving,
  error,
  onClose,
  onUpdateField,
  onAddRow,
  onDeleteRow,
}: AdminRepertoireModalProps) {
  const { user, signIn, loading: authLoading, isConfigured } = useAuth()
  const [loginState, setLoginState] = useState({ password: '' })
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setLoginState({ password: '' })
      setLoginError(null)
      return
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  const handleChange = (index: number, field: RepertoireField) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (field === 'composer.birthYear' || field === 'composer.deathYear' || field === 'compositionYear') {
      void onUpdateField(index, field, value ? toNumberOrUndefined(value) : undefined)
    } else {
      void onUpdateField(index, field, value)
    }
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError(null)
    try {
      await signIn(loginState)
    } catch (loginErr) {
      const message = loginErr instanceof Error ? loginErr.message : 'Accesso non riuscito'
      setLoginError(message)
    }
  }

  if (!open) {
    return null
  }

  const content = (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 id="admin-modal-title">Gestione repertorio</h2>
          <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Chiudi modale">
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {!isConfigured ? (
            <div className={styles.message}>
              <p>Configura Supabase per utilizzare la gestione repertorio.</p>
            </div>
          ) : user ? (
            <>
              {loading ? (
                <div className={styles.message}>
                  <FiLoader className={styles.spinner} aria-hidden />
                  <p>Carico il repertorio…</p>
                </div>
              ) : (
                <>
                  <div className={styles.repertoireList}>
                    {repertoire.length === 0 ? (
                      <p className={styles.emptyMessage}>Nessun brano inserito.</p>
                    ) : (
                      repertoire.map((item, index) => (
                        <div key={item.id ?? index} className={styles.repertoireItem}>
                          <div className={styles.itemHeader}>
                            <span className={styles.itemNumber}>{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => void onDeleteRow(index)}
                              className={styles.deleteButton}
                              aria-label="Elimina riga"
                            >
                              <FiTrash2 aria-hidden />
                            </button>
                          </div>

                          <div className={styles.formGrid}>
                            <label>
                              Cognome compositore
                              <input
                                type="text"
                                value={item.composer.lastName}
                                onChange={handleChange(index, 'composer.lastName')}
                                placeholder="Cognome"
                              />
                            </label>

                            <label>
                              Nome compositore
                              <input
                                type="text"
                                value={item.composer.firstName}
                                onChange={handleChange(index, 'composer.firstName')}
                                placeholder="Nome"
                              />
                            </label>

                            <label>
                              Anno di nascita
                              <input
                                type="number"
                                value={item.composer.birthYear ?? ''}
                                onChange={handleChange(index, 'composer.birthYear')}
                                placeholder="Anno"
                              />
                            </label>

                            <label>
                              Anno di morte
                              <input
                                type="number"
                                value={item.composer.deathYear ?? ''}
                                onChange={handleChange(index, 'composer.deathYear')}
                                placeholder="Anno"
                              />
                            </label>

                            <label className={styles.fullRow}>
                              Titolo del brano
                              <input
                                type="text"
                                value={item.pieceTitle}
                                onChange={handleChange(index, 'pieceTitle')}
                                placeholder="Titolo del brano"
                              />
                            </label>

                            <label>
                              Anno di composizione
                              <input
                                type="number"
                                value={item.compositionYear ?? ''}
                                onChange={handleChange(index, 'compositionYear')}
                                placeholder="Anno"
                              />
                            </label>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {error && <p className={styles.error}>{error}</p>}

                  <div className={styles.actions}>
                    <button type="button" onClick={() => void onAddRow()} className={styles.addButton}>
                      <FiPlus aria-hidden />
                      Aggiungi brano
                    </button>
                    {saving && <span className={styles.savingText}>Salvataggio…</span>}
                    <button type="button" onClick={onClose} className={styles.primaryButton}>
                      Chiudi
                    </button>
                  </div>
                </>
              )}
            </>
          ) : authLoading ? (
            <div className={styles.message}>
              <FiLoader className={styles.spinner} aria-hidden />
              <p>Verifico la sessione…</p>
            </div>
          ) : (
            <form className={styles.loginForm} onSubmit={handleLogin}>
              <label>
                Password admin
                <input
                  type="password"
                  value={loginState.password}
                  onChange={(event) => setLoginState((prev) => ({ ...prev, password: event.target.value }))}
                  required
                  autoFocus
                  placeholder="Inserisci password"
                />
              </label>
              {loginError && <p className={styles.error}>{loginError}</p>}
              <button type="submit" className={styles.primaryButton}>
                Accedi
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
