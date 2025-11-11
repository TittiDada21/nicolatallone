import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

import styles from './AppLayout.module.css'

export function AppLayout() {
  const location = useLocation()
  const isAlbumPage = location.pathname === '/progetti/album'
  const isGalleryPage = location.pathname === '/galleria'
  const isEventsPage = location.pathname.startsWith('/eventi')

  useEffect(() => {
    if (isGalleryPage) {
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    } else {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isGalleryPage])

  return (
    <div className={styles.app}>
      {!isAlbumPage && !isGalleryPage && !isEventsPage && (
        <>
          <div className={styles.background} aria-hidden />
          <div className={styles.overlay} aria-hidden />
        </>
      )}
      <Header />
      <main className={`${styles.main} ${isAlbumPage ? styles.albumMain : ''} ${isGalleryPage ? styles.galleryMain : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

