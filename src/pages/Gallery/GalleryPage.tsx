import { useEffect, useState, useRef } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { FaLock } from 'react-icons/fa'

import { hasSupabase, supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/providers/AuthProvider'
import type { GalleryItem } from '@/types/gallery'
import { AdminGalleryModal } from '@/components/gallery/AdminGalleryModal'
import { GallerySlideshow } from '@/components/gallery/GallerySlideshow'

import styles from './GalleryPage.module.css'

type LazyImageProps = {
  src: string
  alt: string
  index: number
  isMobile: boolean
  className?: string
  onClick?: () => void
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

function LazyImage({ src, alt, index, isMobile, className, onClick, onError }: LazyImageProps) {
  const [isInView, setIsInView] = useState(index < (isMobile ? 4 : 8))
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (isInView) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: isMobile ? '200px' : '400px',
        threshold: 0.01,
      },
    )

    const currentRef = imgRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [isInView, isMobile])

  if (!isInView) {
    return <div className={styles.imagePlaceholder} ref={imgRef} />
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      loading={index < (isMobile ? 4 : 8) ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={(e) => {
        const target = e.target as HTMLImageElement
        target.classList.add(styles.loaded)
      }}
      onClick={onClick}
      onError={onError}
    />
  )
}

const getOptimizedImageUrl = (url: string) => {
  if (!url) return url
  // Only optimize Supabase Storage URLs
  if (url.includes('storage.supabase.co') && !/\.(mp4|mov|webm|avi|mkv)$/i.test(url)) {
    // Check if the URL already has query parameters
    const separator = url.includes('?') ? '&' : '?'
    // Request a resized WebP image with width 800px (good balance for grid)
    return `${url}${separator}width=800&format=webp&quality=80`
  }
  return url
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
  const { user } = useAuth()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [slideshowOpen, setSlideshowOpen] = useState(false)
  const [slideshowIndex, setSlideshowIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Admin state is handled by the modal and user state from provider


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
            {!user && (
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
          <h2 className={styles.subtitle}>L'angolo visuale si allargherà, l'attimo si dilaterà: la sua galleria fotografica divenne una galleria artistica.</h2>
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
                    <LazyImage
                      src={getOptimizedImageUrl(item.thumbnailUrl ?? item.url)}
                      alt={item.title}
                      index={index}
                      isMobile={isMobile}
                      className={styles.clickableImage}
                      onClick={() => handleImageClick(index)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://placehold.co/400x300/333/FFF?text=Immagine+non+disponibile'
                      }}
                    />
                  ) : (
                    <LazyImage
                      src={getOptimizedImageUrl(item.thumbnailUrl ?? item.url)}
                      alt={item.title}
                      index={index}
                      isMobile={isMobile}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://placehold.co/400x300/333/FFF?text=Immagine+non+disponibile'
                      }}
                    />
                  )}
                  {user && (
                    <div className={styles.captionRow}>
                      <button
                        type="button"
                        className={styles.deleteIconButton}
                        onClick={() => handleDeleteItem(item)}
                        aria-label="Elimina"
                      >
                        <FiTrash2 aria-hidden />
                      </button>
                    </div>
                  )}
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

      {user && (
        <button
          type="button"
          className={styles.fabButton}
          onClick={handleCreate}
          aria-label="Aggiungi elemento"
        >
          <FiPlus aria-hidden />
        </button>
      )}

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

