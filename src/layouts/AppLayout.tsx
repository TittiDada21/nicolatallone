import { Outlet } from 'react-router-dom'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

import styles from './AppLayout.module.css'

export function AppLayout() {
  return (
    <div className={styles.app}>
      <div className={styles.background} aria-hidden />
      <div className={styles.overlay} aria-hidden />
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

