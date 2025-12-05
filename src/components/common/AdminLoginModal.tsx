import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiLoader } from 'react-icons/fi'

import { useAuth } from '@/providers/AuthProvider'

import styles from './AdminLoginModal.module.css'

type AdminLoginModalProps = {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AdminLoginModal({ open, onClose, onSuccess }: AdminLoginModalProps) {
  const { user, signIn, loading: authLoading, isConfigured } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setPassword('')
      setError(null)
      return
    }
  }, [open])

  useEffect(() => {
    if (user && open) {
      onSuccess?.()
      onClose()
    }
  }, [user, open, onClose, onSuccess])

  useEffect(() => {
    if (!open || typeof document === 'undefined' || !document.body) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      if (document.body) {
        document.body.style.overflow = original
      }
    }
  }, [open])

  if (!open || typeof document === 'undefined') {
    return null
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    try {
      await signIn({ password })
      setPassword('')
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Accesso non riuscito'
      setError(message)
    }
  }

  const content = (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="admin-login-title" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 id="admin-login-title">Accesso admin</h2>
          <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Chiudi modale">
            ×
          </button>
        </div>

        {!isConfigured ? (
          <div className={styles.message}>
            <p>Configura Supabase per utilizzare la modifica del repertorio.</p>
          </div>
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
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoFocus
                placeholder="Inserisci password"
              />
            </label>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.primaryButton} disabled={authLoading || !password}>
              Accedi
            </button>
          </form>
        )}
      </div>
    </div>
  )

  if (!document.body) {
    return null
  }

  return createPortal(content, document.body)
}

