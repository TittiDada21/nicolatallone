import { Outlet, useLocation } from 'react-router-dom'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

import styles from './AppLayout.module.css'

export function AppLayout() {
  const location = useLocation()
  const isAlbumPage = location.pathname === '/progetti/album'

  return (
    <div className={styles.app}>
      {!isAlbumPage && (
        <>
          <div className={styles.background} aria-hidden />
          <div className={styles.overlay} aria-hidden />
        </>
      )}
      <Header />
      <main className={`${styles.main} ${isAlbumPage ? styles.albumMain : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

