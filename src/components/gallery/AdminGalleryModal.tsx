import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiLoader, FiTrash2, FiUpload } from 'react-icons/fi'

import { useAuth } from '@/providers/AuthProvider'
import { supabase } from '@/lib/supabaseClient'
import type { GalleryItem } from '@/types/gallery'

import styles from './AdminGalleryModal.module.css'

type AdminGalleryModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  initialItem?: GalleryItem | null
  onClose: () => void
  onSuccess: () => void
  onDelete?: () => Promise<void>
}

const createEmptyForm = () => ({
  title: '',
  file: null as File | null,
  type: 'image' as 'image' | 'video',
})

export function AdminGalleryModal({
  open,
  mode,
  initialItem,
  onClose,
  onSuccess,
  onDelete,
}: AdminGalleryModalProps) {
  const { user, signIn, signOut, loading: authLoading, isConfigured } = useAuth()
  const [form, setForm] = useState(createEmptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginState, setLoginState] = useState({ password: '' })
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setForm(createEmptyForm())
      setError(null)
      setPreview(null)
      return
    }

    if (initialItem) {
      setForm({
        title: initialItem.title,
        file: null,
        type: initialItem.type,
      })
      setPreview(initialItem.url)
    } else {
      setForm(createEmptyForm())
      setPreview(null)
    }
  }, [open, initialItem])

  useEffect(() => {
    if (form.file) {
      const url = URL.createObjectURL(form.file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [form.file])

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

  const modalTitle = useMemo(() => (mode === 'edit' ? 'Modifica elemento' : 'Nuovo elemento'), [mode])

  if (!open || typeof document === 'undefined') {
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase || !user) return

    setSaving(true)
    setUploading(true)
    setError(null)

    try {
      let fileUrl = initialItem?.url

      if (form.file) {
        const fileExt = form.file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, form.file, {
          cacheControl: '3600',
          upsert: false,
        })

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('gallery').getPublicUrl(filePath)
        fileUrl = data.publicUrl

        if (initialItem?.url && initialItem.url.includes('storage.supabase.co')) {
          const oldPath = initialItem.url.split('/').pop()?.split('?')[0]
          if (oldPath) {
            await supabase.storage.from('gallery').remove([oldPath])
          }
        }
      }

      if (!fileUrl) {
        throw new Error('URL file mancante')
      }

      const itemData = {
        title: form.title,
        type: form.type,
        url: fileUrl,
        thumbnail_url: form.type === 'image' ? fileUrl : null,
      }

      if (mode === 'edit' && initialItem) {
        const { error: updateError } = await supabase
          .from('gallery_items')
          .update(itemData)
          .eq('id', initialItem.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from('gallery_items').insert(itemData)

        if (insertError) throw insertError
      }

      onSuccess()
      onClose()
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Errore imprevisto'
      setError(message)
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete || !supabase || !initialItem) return

    setSaving(true)
    setError(null)

    try {
      if (initialItem.url.includes('storage.supabase.co')) {
        const filePath = initialItem.url.split('/').pop()?.split('?')[0]
        if (filePath) {
          await supabase.storage.from('gallery').remove([filePath])
        }
      }

      await onDelete()
      onSuccess()
      onClose()
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
      sessionStorage.setItem('gallery_admin_mode', 'true')
      onClose()
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Accesso non riuscito'
      setError(message)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      if (!isImage && !isVideo) {
        setError('File non supportato. Usa immagini o video.')
        return
      }
      setForm((prev) => ({
        ...prev,
        file,
        type: isImage ? 'image' : 'video',
      }))
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
            <p>Configura Supabase per utilizzare la gestione galleria.</p>
          </div>
        ) : authLoading ? (
          <div className={styles.message}>
            <FiLoader className={styles.spinner} aria-hidden />
            <p>Verifico la sessione…</p>
          </div>
        ) : !user ? (
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
        ) : (
          <form className={styles.galleryForm} onSubmit={handleSubmit}>
            <label className={styles.fullRow}>
              Titolo
              <input
                type="text"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </label>

            <label className={styles.fullRow}>
              File {mode === 'edit' && '(lascia vuoto per mantenere quello esistente)'}
              <div className={styles.fileUpload}>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  required={mode === 'create'}
                />
                <FiUpload className={styles.uploadIcon} />
                <span>{form.file?.name || (initialItem ? 'File esistente' : 'Scegli file')}</span>
              </div>
            </label>

            {preview && (
              <div className={styles.preview}>
                {form.type === 'image' ? (
                  <img src={preview} alt="Preview" />
                ) : (
                  <video src={preview} controls />
                )}
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button type="button" className={styles.secondaryButton} onClick={onClose}>
                Chiudi
              </button>
              {onDelete && (
                <button type="button" className={styles.deleteButton} onClick={handleDelete} disabled={saving}>
                  <FiTrash2 aria-hidden />
                  Elimina
                </button>
              )}
              <button type="submit" className={styles.primaryButton} disabled={saving || uploading}>
                {uploading ? 'Carico…' : saving ? 'Salvo…' : 'Salva'}
              </button>
            </div>

            <button
              type="button"
              className={styles.signOut}
              onClick={() => {
                sessionStorage.removeItem('gallery_admin_mode')
                signOut()
              }}
            >
              Esci
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

