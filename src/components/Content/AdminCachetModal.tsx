import type { FormEvent, ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiLoader } from 'react-icons/fi'

import { useAuth } from '@/providers/AuthProvider'

import styles from './AdminCachetModal.module.css'

type AdminCachetModalProps = {
  open: boolean
  cachet: string
  loading: boolean
  saving: boolean
  error?: string
  onClose: () => void
  onUpdateCachet: (value: string) => Promise<void>
}

export function AdminCachetModal({
  open,
  cachet,
  loading,
  saving,
  error,
  onClose,
  onUpdateCachet,
}: AdminCachetModalProps) {
  const { user, signIn, loading: authLoading, isConfigured } = useAuth()
  const [loginState, setLoginState] = useState({ password: '' })
  const [loginError, setLoginError] = useState<string | null>(null)
  const [cachetValue, setCachetValue] = useState(cachet)

  useEffect(() => {
    if (!open) {
      setLoginState({ password: '' })
      setLoginError(null)
      return
    }
    setCachetValue(cachet)
  }, [open, cachet])

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCachetValue(event.target.value)
  }

  const handleSave = async () => {
    await onUpdateCachet(cachetValue)
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
          <h2 id="admin-modal-title">Modifica cachet</h2>
          <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Chiudi modale">
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {!isConfigured ? (
            <div className={styles.message}>
              <p>Configura Supabase per utilizzare la modifica cachet.</p>
            </div>
          ) : user ? (
            <>
              {loading ? (
                <div className={styles.message}>
                  <FiLoader className={styles.spinner} aria-hidden />
                  <p>Carico il cachet…</p>
                </div>
              ) : (
                <>
                  <label className={styles.textareaLabel}>
                    Testo cachet
                    <textarea
                      value={cachetValue}
                      onChange={handleChange}
                      placeholder="Inserisci il testo del cachet..."
                      rows={8}
                      className={styles.textarea}
                    />
                  </label>

                  {error && <p className={styles.error}>{error}</p>}

                  <div className={styles.actions}>
                    {saving && <span className={styles.savingText}>Salvataggio…</span>}
                    <button type="button" onClick={handleSave} className={styles.primaryButton} disabled={saving}>
                      Salva
                    </button>
                    <button type="button" onClick={onClose} className={styles.secondaryButton}>
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
