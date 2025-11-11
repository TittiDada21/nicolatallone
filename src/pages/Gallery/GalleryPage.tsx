import { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'

import { GlassPanel } from '@/components/common/GlassPanel'
import { hasSupabase, supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/providers/AuthProvider'
import type { GalleryItem } from '@/types/gallery'
import { AdminGalleryModal } from '@/components/gallery/AdminGalleryModal'

import styles from './GalleryPage.module.css'

const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: 'preview-1',
    title: 'Aggiungi qui le tue foto',
    type: 'image',
    url: 'https://placehold.co/600x400/111/FFF?text=Gallery',
  },
]

export function GalleryPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<GalleryItem | null>(null)

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

  const handleEdit = (item: GalleryItem) => {
    setEditing(item)
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

  return (
    <div className={styles.wrapper}>
      <GlassPanel size="wide" className={styles.panel}>
        <div className={styles.header}>
          <h1>Galleria</h1>
          <p>Foto e video aggiornati da Supabase Storage.</p>
          {!hasSupabase && <p className={styles.hint}>Collega Supabase per sostituire questo contenuto di esempio.</p>}
        </div>
        {loading ? (
          <p>Carico la galleria…</p>
        ) : error ? (
          <p className={styles.error}>Errore: {error}</p>
        ) : (
          <>
            <div className={styles.grid}>
              {items.map((item) => (
                <figure key={item.id} className={styles.card}>
                  <img
                    src={item.thumbnailUrl ?? item.url}
                    alt={item.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://placehold.co/400x300/333/FFF?text=Immagine+non+disponibile'
                    }}
                  />
                  <figcaption>{item.title}</figcaption>
                  {item.type === 'video' && (
                    <a href={item.url} target="_blank" rel="noreferrer" className={styles.videoLink}>
                      Guarda il video
                    </a>
                  )}
                  {user && (
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() => handleEdit(item)}
                      aria-label="Modifica"
                    >
                      Modifica
                    </button>
                  )}
                </figure>
              ))}
            </div>
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.addButton}
                onClick={handleCreate}
                aria-label="Aggiungi elemento"
              >
                <FiPlus aria-hidden />
              </button>
              {!user && hasSupabase && (
                <p className={styles.hint}>Accedi con la password admin per aggiungere foto.</p>
              )}
            </div>
          </>
        )}
      </GlassPanel>
      <AdminGalleryModal
        open={modalOpen}
        mode={editing ? 'edit' : 'create'}
        initialItem={editing}
        onClose={handleCloseModal}
        onSuccess={loadGallery}
        onDelete={editing ? handleDelete : undefined}
      />
    </div>
  )
}

