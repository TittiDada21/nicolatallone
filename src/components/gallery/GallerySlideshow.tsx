import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import type { GalleryItem } from '@/types/gallery'

import styles from './GallerySlideshow.module.css'

type GallerySlideshowProps = {
  open: boolean
  items: GalleryItem[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function GallerySlideshow({ open, items, currentIndex, onClose, onNavigate }: GallerySlideshowProps) {
  const currentItem = items[currentIndex]
  const imageItems = items.filter((item) => item.type === 'image')
  const imageIndex = imageItems.findIndex((item) => item.id === currentItem?.id)

  const handlePrevious = useCallback(() => {
    if (imageItems.length === 0) return
    const prevIndex = imageIndex > 0 ? imageIndex - 1 : imageItems.length - 1
    const prevItem = imageItems[prevIndex]
    const originalIndex = items.findIndex((item) => item.id === prevItem.id)
    onNavigate(originalIndex)
  }, [imageItems, imageIndex, items, onNavigate])

  const handleNext = useCallback(() => {
    if (imageItems.length === 0) return
    const nextIndex = imageIndex < imageItems.length - 1 ? imageIndex + 1 : 0
    const nextItem = imageItems[nextIndex]
    const originalIndex = items.findIndex((item) => item.id === nextItem.id)
    onNavigate(originalIndex)
  }, [imageItems, imageIndex, items, onNavigate])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handlePrevious, handleNext, onClose])

  if (!open || !currentItem || currentItem.type !== 'image') return null

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Chiudi">
          <FiX />
        </button>

        {imageItems.length > 1 && (
          <>
            <button
              type="button"
              className={styles.navButton}
              style={{ left: '1.5rem' }}
              onClick={handlePrevious}
              aria-label="Immagine precedente"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              className={styles.navButton}
              style={{ right: '1.5rem' }}
              onClick={handleNext}
              aria-label="Immagine successiva"
            >
              <FiChevronRight />
            </button>
          </>
        )}

        <div className={styles.imageContainer}>
          <img src={currentItem.url} alt={currentItem.title} className={styles.image} />
          <div className={styles.caption}>{currentItem.title}</div>
          {imageItems.length > 1 && (
            <div className={styles.counter}>
              {imageIndex + 1} / {imageItems.length}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

