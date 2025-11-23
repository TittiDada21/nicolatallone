import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { CONTENT_ROUTES } from '@/data/navigation'

import styles from './AppLayout.module.css'

const GENERIC_CONTENT_PATHS = CONTENT_ROUTES.filter(({ key }) => !key.startsWith('eventi/') && key !== 'progetti/album').map(
  ({ path }) => path,
)

export function AppLayout() {
  const location = useLocation()
  const isAlbumPage = location.pathname === '/progetti/album'
  const isGalleryPage = location.pathname === '/galleria'
  const isEventsPage = location.pathname.startsWith('/eventi')
  const isContentPage = GENERIC_CONTENT_PATHS.includes(location.pathname)

  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    if (isGalleryPage || isContentPage) {
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    } else if (isMobile) {
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
  }, [isGalleryPage, isContentPage])

  const isHomePage = location.pathname === '/'

  return (
    <div className={styles.app} data-home={isHomePage || undefined}>
      {!isAlbumPage && !isGalleryPage && !isEventsPage && !isContentPage && (
        <>
          <div className={styles.background} aria-hidden />
          <div className={styles.overlay} aria-hidden />
        </>
      )}
      <Header />
      <main
        className={`${styles.main} ${isAlbumPage ? styles.albumMain : ''} ${isGalleryPage ? styles.galleryMain : ''} ${
          isContentPage ? styles.contentMain : ''
        }`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

