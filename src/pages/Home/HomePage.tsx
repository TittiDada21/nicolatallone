import { HeroEventCard } from '@/components/events/HeroEventCard'

import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <div className={styles.wrapper}>
      <HeroEventCard />
    </div>
  )
}

