import { useEffect } from 'react'

import { HeroEventCard } from '@/components/events/HeroEventCard'
import { hasSupabase, supabase } from '@/lib/supabaseClient'

import styles from './HomePage.module.css'

export function HomePage() {
  useEffect(() => {
    const loadMobileBackground = async () => {
      if (!hasSupabase || !supabase) {
        console.log('[HomePage] Supabase non configurato')
        return
      }

      const isMobile = window.innerWidth <= 768
      console.log('[HomePage] isMobile:', isMobile)
      
      const backgroundEl = document.querySelector('[data-background-element]') as HTMLElement
      console.log('[HomePage] backgroundEl trovato:', !!backgroundEl)
      
      if (!backgroundEl) {
        setTimeout(() => {
          void loadMobileBackground()
        }, 100)
        return
      }

      if (!isMobile) {
        backgroundEl.style.backgroundImage = ''
        return
      }

      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('url')
          .eq('type', 'image')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        console.log('[HomePage] Query risultato:', { data, error })

        if (error) {
          console.error('[HomePage] Errore query:', error)
          return
        }

        if (data?.url) {
          const bgImage = `linear-gradient(120deg, rgba(12, 12, 16, 0.4), rgba(28, 28, 36, 0.3)), url(${data.url})`
          console.log('[HomePage] Applicando background:', data.url)
          backgroundEl.style.backgroundImage = bgImage
          backgroundEl.style.backgroundPosition = 'center center'
          backgroundEl.style.backgroundSize = 'cover'
        } else {
          console.log('[HomePage] Nessuna immagine trovata nella galleria')
        }
      } catch (err) {
        console.error('[HomePage] Errore:', err)
      }
    }

    const timer = setTimeout(() => {
      void loadMobileBackground()
    }, 300)

    const handleResize = () => {
      void loadMobileBackground()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <HeroEventCard />
    </div>
  )
}

