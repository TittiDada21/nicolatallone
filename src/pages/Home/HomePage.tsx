import { useEffect } from 'react'

import { HeroEventCard } from '@/components/events/HeroEventCard'
import { hasSupabase, supabase } from '@/lib/supabaseClient'

import styles from './HomePage.module.css'

export function HomePage() {
  useEffect(() => {
    const loadMobileBackground = async () => {
      if (!hasSupabase || !supabase) return

      const isMobile = window.innerWidth <= 768
      const backgroundEl = document.querySelector('[data-background-element]') as HTMLElement
      
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

      const { data } = await supabase
        .from('gallery_items')
        .select('url')
        .eq('type', 'image')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data?.url) {
        backgroundEl.style.backgroundImage = `linear-gradient(120deg, rgba(12, 12, 16, 0.4), rgba(28, 28, 36, 0.3)), url(${data.url})`
        backgroundEl.style.backgroundPosition = 'center center'
        backgroundEl.style.backgroundSize = 'cover'
      }
    }

    const timer = setTimeout(() => {
      void loadMobileBackground()
    }, 200)

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

