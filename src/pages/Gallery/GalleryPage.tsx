import { useEffect, useState, useRef } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { FaLock } from 'react-icons/fa'

import { hasSupabase, supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/providers/AuthProvider'
import type { GalleryItem } from '@/types/gallery'
import { AdminGalleryModal } from '@/components/gallery/AdminGalleryModal'
import { GallerySlideshow } from '@/components/gallery/GallerySlideshow'

import styles from './GalleryPage.module.css'

type EditableTitleProps = {
  title: string
  onUpdate: (newTitle: string) => void
  canEdit: boolean
}

function EditableTitle({ title, onUpdate, canEdit }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(title)
  }, [title])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onUpdate(value)
      setIsEditing(false)
    } else if (e.key === 'Escape') {
      setValue(title)
      setIsEditing(false)
    }
  }

  const handleBlur = () => {
    if (value.trim() && value !== title) {
      onUpdate(value)
    } else {
      setValue(title)
    }
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={styles.editableTitleInput}
      />
    )
  }

  return (
    <figcaption
      className={canEdit ? styles.editableTitle : undefined}
      onClick={canEdit ? () => setIsEditing(true) : undefined}
      title={canEdit ? 'Clicca per modificare' : undefined}
      style={canEdit ? undefined : { cursor: 'default' }}
    >
      {title}
    </figcaption>
  )
}

const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: 'preview-1',
    title: 'Aggiungi qui le tue foto',
    type: 'image',
    url: 'https://placehold.co/600x400/111/FFF?text=Gallery',
  },
]

export function GalleryPage() {
  const { user, signOut } = useAuth()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [slideshowOpen, setSlideshowOpen] = useState(false)
  const [slideshowIndex, setSlideshowIndex] = useState(0)

  useEffect(() => {
    const adminMode = sessionStorage.getItem('gallery_admin_mode')
    if (adminMode === 'true') {
      sessionStorage.removeItem('gallery_admin_mode')
      void signOut()
    } else if (user) {
      void signOut()
    }
  }, [])

  const loadGallery = async () => {
    if (!supabase) {
      setItems(FALLBACK_GALLERY)
      setError('Configura Supabase Storage per mostrare la galleria reale.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false })
    if (error) {
      setError(error.message)
      setItems([])
    } else {
      setItems(
        data.map((item) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          url: item.url,
          thumbnailUrl: item.thumbnail_url ?? undefined,
          createdAt: item.created_at ?? undefined,
        })),
      )
    }
    setLoading(false)
  }

  useEffect(() => {
    void loadGallery()
  }, [])

  const handleCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditing(null)
  }

  const handleDelete = async () => {
    if (!editing || !supabase) return
    const { error } = await supabase.from('gallery_items').delete().eq('id', editing.id)
    if (error) throw error
  }

  const handleDeleteItem = async (item: GalleryItem) => {
    if (!supabase) return
    if (item.url.includes('storage.supabase.co')) {
      const filePath = item.url.split('/').pop()?.split('?')[0]
      if (filePath) {
        await supabase.storage.from('gallery').remove([filePath])
      }
    }
    const { error } = await supabase.from('gallery_items').delete().eq('id', item.id)
    if (error) {
      console.error('Errore eliminazione:', error)
      return
    }
    void loadGallery()
  }

  const handleTitleUpdate = async (item: GalleryItem, newTitle: string) => {
    if (!supabase || !newTitle.trim()) return
    const { error } = await supabase
      .from('gallery_items')
      .update({ title: newTitle.trim() })
      .eq('id', item.id)
    if (error) {
      console.error('Errore aggiornamento titolo:', error)
      return
    }
    void loadGallery()
  }

  const handleImageClick = (index: number) => {
    if (items[index]?.type === 'image') {
      setSlideshowIndex(index)
      setSlideshowOpen(true)
    }
  }

  const handleSlideshowNavigate = (index: number) => {
    setSlideshowIndex(index)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <h1>Galleria</h1>
            {user ? (
              <button
                type="button"
                className={styles.addButton}
                onClick={handleCreate}
                aria-label="Aggiungi elemento"
              >
                <FiPlus aria-hidden />
              </button>
            ) : (
              <FaLock
                className={styles.adminIcon}
                onClick={() => {
                  setEditing(null)
                  setModalOpen(true)
                }}
                aria-label="Admin"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setEditing(null)
                    setModalOpen(true)
                  }
                }}
              />
            )}
          </div>
          <p>Collezione di foto e video.</p>
          {!hasSupabase && <p className={styles.hint}>Collega Supabase per sostituire questo contenuto di esempio.</p>}
        </div>
        {loading ? (
          <p>Carico la galleria…</p>
        ) : error ? (
          <p className={styles.error}>Errore: {error}</p>
        ) : (
          <>
            <div className={styles.grid}>
              {items.map((item, index) => (
                <figure key={item.id} className={styles.card}>
                  {item.type === 'image' ? (
                    <img
                      src={item.thumbnailUrl ?? item.url}
                      alt={item.title}
                      className={styles.clickableImage}
                      loading={index < 8 ? 'eager' : 'lazy'}
                      decoding="async"
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement
                        target.classList.add(styles.loaded)
                      }}
                      onClick={() => handleImageClick(index)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://placehold.co/400x300/333/FFF?text=Immagine+non+disponibile'
                      }}
                    />
                  ) : (
                    <img
                      src={item.thumbnailUrl ?? item.url}
                      alt={item.title}
                      loading={index < 8 ? 'eager' : 'lazy'}
                      decoding="async"
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement
                        target.classList.add(styles.loaded)
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://placehold.co/400x300/333/FFF?text=Immagine+non+disponibile'
                      }}
                    />
                  )}
                  <div className={styles.captionRow}>
                    <EditableTitle
                      title={item.title}
                      onUpdate={(newTitle) => handleTitleUpdate(item, newTitle)}
                      canEdit={!!user}
                    />
                    {user && (
                      <button
                        type="button"
                        className={styles.deleteIconButton}
                        onClick={() => handleDeleteItem(item)}
                        aria-label="Elimina"
                      >
                        <FiTrash2 aria-hidden />
                      </button>
                    )}
                  </div>
                  {item.type === 'video' && (
                    <a href={item.url} target="_blank" rel="noreferrer" className={styles.videoLink}>
                      Guarda il video
                    </a>
                  )}
                </figure>
              ))}
            </div>
          </>
        )}
      </div>
      <AdminGalleryModal
        open={modalOpen}
        mode={editing ? 'edit' : 'create'}
        initialItem={editing}
        onClose={handleCloseModal}
        onSuccess={loadGallery}
        onDelete={editing ? handleDelete : undefined}
      />
      <GallerySlideshow
        open={slideshowOpen}
        items={items}
        currentIndex={slideshowIndex}
        onClose={() => setSlideshowOpen(false)}
        onNavigate={handleSlideshowNavigate}
      />
    </div>
  )
}

