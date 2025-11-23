import { useEffect } from 'react'

import { HeroEventCard } from '@/components/events/HeroEventCard'
import { hasSupabase, supabase } from '@/lib/supabaseClient'

import styles from './HomePage.module.css'

export function HomePage() {
  useEffect(() => {
    const loadMobileBackground = async () => {
      if (!hasSupabase || !supabase) return

      const isMobile = window.innerWidth <= 768
      if (!isMobile) {
        document.documentElement.style.setProperty('--mobile-bg-image', '')
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
        document.documentElement.style.setProperty('--mobile-bg-image', `url(${data.url})`)
      } else {
        document.documentElement.style.setProperty('--mobile-bg-image', '')
      }
    }

    void loadMobileBackground()

    const handleResize = () => {
      void loadMobileBackground()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      document.documentElement.style.setProperty('--mobile-bg-image', '')
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <HeroEventCard />
    </div>
  )
}

