import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiLoader, FiTrash2 } from 'react-icons/fi'

import { useAuth } from '@/providers/AuthProvider'
import type { EventFormValues, EventRecord } from '@/types/event'

import styles from './AdminEventModal.module.css'

type AdminEventModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  initialEvent?: EventRecord | null
  onClose: () => void
  onSubmit: (values: EventFormValues) => Promise<void>
  onDelete?: () => Promise<void>
}

const toLocalInputValue = (value: string) => {
  const date = new Date(value)
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

const createEmptyForm = (): EventFormValues => ({
  title: '',
  description: '',
  startsAt: toLocalInputValue(new Date().toISOString()),
  address: '',
  isFree: true,
  price: undefined,
  externalUrl: '',
  locationUrl: '',
})

export function AdminEventModal({
  open,
  mode,
  initialEvent,
  onClose,
  onSubmit,
  onDelete,
}: AdminEventModalProps) {
  const { user, signIn, signOut, loading: authLoading, isConfigured } = useAuth()
  const [form, setForm] = useState<EventFormValues>(createEmptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginState, setLoginState] = useState({ password: '' })

  useEffect(() => {
    if (!open) {
      setForm(createEmptyForm())
      setError(null)
      return
    }

    if (initialEvent) {
      setForm({
        title: initialEvent.title,
        description: initialEvent.description ?? '',
        startsAt: toLocalInputValue(initialEvent.startsAt),
        address: initialEvent.address ?? '',
        isFree: initialEvent.isFree,
        price: initialEvent.price ?? undefined,
        externalUrl: initialEvent.externalUrl ?? '',
        locationUrl: initialEvent.locationUrl ?? '',
      })
    } else {
      setForm(createEmptyForm())
    }
  }, [open, initialEvent])

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  const modalTitle = useMemo(
    () => (mode === 'edit' ? 'Modifica evento' : 'Nuovo evento'),
    [mode],
  )

  if (!open) {
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        ...form,
        price: form.isFree ? undefined : form.price,
      })
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Errore imprevisto'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) {
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onDelete()
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : 'Errore imprevisto'
      setError(message)
      setSaving(false)
    }
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    try {
      await signIn(loginState)
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Accesso non riuscito'
      setError(message)
    }
  }

  const content = (
    <div className={styles.backdrop} role="presentation">
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
        <div className={styles.modalHeader}>
          <h2 id="admin-modal-title">{modalTitle}</h2>
          <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Chiudi modale">
            ×
          </button>
        </div>

        {!isConfigured ? (
          <div className={styles.message}>
            <p>Configura Supabase per utilizzare la gestione eventi.</p>
          </div>
        ) : user ? (
          <form className={styles.eventForm} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <label>
                Titolo
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  required
                />
              </label>

              <label>
                Data e ora
                <input
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
                  required
                />
              </label>

              <label className={styles.fullRow}>
                Descrizione
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </label>

              <label className={styles.fullRow}>
                Indirizzo
                <input
                  type="text"
                  value={form.address}
                  onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                />
              </label>

              <label className={styles.fullRow}>
                Link Google Maps
                <input
                  type="url"
                  value={form.locationUrl ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, locationUrl: event.target.value }))}
                />
              </label>

              <label>
                Evento libero?
                <div className={styles.toggleGroup}>
                  <button
                    type="button"
                    className={`${styles.toggleButton} ${form.isFree ? styles.toggleActive : ''}`}
                    onClick={() => setForm((prev) => ({ ...prev, isFree: true, price: undefined }))}
                  >
                    Sì
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleButton} ${!form.isFree ? styles.toggleActive : ''}`}
                    onClick={() => setForm((prev) => ({ ...prev, isFree: false }))}
                  >
                    No
                  </button>
                </div>
              </label>

              {!form.isFree && (
                <label>
                  Prezzo (€)
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.price ?? ''}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        price: event.target.value ? Number(event.target.value) : undefined,
                      }))
                    }
                  />
                </label>
              )}

              <label className={styles.fullRow}>
                Link esterno
                <input
                  type="url"
                  value={form.externalUrl ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      externalUrl: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button type="button" className={styles.secondaryButton} onClick={onClose}>
                Chiudi
              </button>
              {onDelete && (
                <button type="button" className={styles.deleteButton} onClick={handleDelete}>
                  <FiTrash2 aria-hidden />
                  Elimina
                </button>
              )}
              <button type="submit" className={styles.primaryButton} disabled={saving}>
                {saving ? 'Salvo…' : 'Salva'}
              </button>
            </div>

            <button type="button" className={styles.signOut} onClick={() => signOut()}>
              Esci
            </button>
          </form>
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
              />
            </label>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.primaryButton}>
              Accedi
            </button>
          </form>
        )}
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

