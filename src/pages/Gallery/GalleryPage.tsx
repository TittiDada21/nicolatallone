import { useEffect, useState } from 'react'

import { GlassPanel } from '@/components/common/GlassPanel'
import { hasSupabase, supabase } from '@/lib/supabaseClient'
import type { GalleryItem } from '@/types/gallery'

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
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

    void loadGallery()
  }, [])

  return (
    <div className={styles.wrapper}>
      <GlassPanel size="wide" className={styles.panel}>
        <div className={styles.header}>
          <h1>Galleria</h1>
          <p>
            Foto e video aggiornati da Supabase Storage. Usa la modalità admin per caricare nuovi contenuti direttamente
            dal pannello MCP.
          </p>
          {!hasSupabase && <p className={styles.hint}>Collega Supabase per sostituire questo contenuto di esempio.</p>}
        </div>
        {loading ? (
          <p>Carico la galleria…</p>
        ) : error ? (
          <p className={styles.error}>Errore: {error}</p>
        ) : (
          <div className={styles.grid}>
            {items.map((item) => (
              <figure key={item.id} className={styles.card}>
                <img src={item.thumbnailUrl ?? item.url} alt={item.title} />
                <figcaption>{item.title}</figcaption>
                {item.type === 'video' && (
                  <a href={item.url} target="_blank" rel="noreferrer" className={styles.videoLink}>
                    Guarda il video
                  </a>
                )}
              </figure>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  )
}

