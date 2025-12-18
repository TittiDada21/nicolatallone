import { useEffect, useMemo, useState } from 'react'
import { FiExternalLink, FiMapPin, FiMinimize2, FiMaximize2 } from 'react-icons/fi'

import { useEvents } from '@/providers/EventProvider'

import styles from './HeroEventCard.module.css'

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const formatDateTimeCompact = (isoString: string) => {
  const date = new Date(isoString)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const diffDays = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const time = new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

  if (diffDays === 0) {
    return `Oggi ${time}`
  } else if (diffDays === 1) {
    return `Domani ${time}`
  } else if (diffDays > 1 && diffDays <= 7) {
    const weekday = new Intl.DateTimeFormat('it-IT', { weekday: 'short' }).format(date)
    return `${weekday} ${time}`
  } else {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'short',
    }).format(date) + ` ${time}`
  }
}

export function HeroEventCard() {
  const { upcomingEvent, loading, error, refresh, isConfigured } = useEvents()
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isConfigured) {
        void refresh()
      }
    }

    const handleFocus = () => {
      if (isConfigured) {
        void refresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [refresh, isConfigured])

  const formatted = useMemo(() => {
    if (!upcomingEvent) {
      return null
    }
    return {
      ...upcomingEvent,
      formattedDate: formatDateTime(upcomingEvent.startsAt),
      formattedDateCompact: formatDateTimeCompact(upcomingEvent.startsAt),
    }
  }, [upcomingEvent])

  if (isMinimized) {
    return (
      <section className={styles.minimizedBar}>
        <div className={styles.minimizedContent}>
          <div className={styles.minimizedInfo}>
            {formatted ? (
              <>
                <span className={styles.minimizedTime}>{formatted.formattedDateCompact}</span>
                {formatted.imageUrl && (
                  <img src={formatted.imageUrl} alt="" className={styles.minimizedIcon} />
                )}
                <span className={styles.minimizedTitle}>{formatted.title}</span>
              </>
            ) : (
              <span className={styles.minimizedTitle}>Nessun evento in programma</span>
            )}
          </div>
          <button
            className={styles.expandButton}
            onClick={() => setIsMinimized(false)}
            aria-label="Espandi card evento"
          >
            <FiMaximize2 />
          </button>
        </div>
      </section>
    )
  }

  return (
    <section
      className={`${styles.card} ${formatted?.imageUrl ? styles.hasImage : ''}`}
      style={formatted?.imageUrl ? { '--event-bg': `url(${formatted.imageUrl})` } as React.CSSProperties : {}}
    >
      <div className={styles.cardContent}>
        <header className={styles.cardHeader}>
          <div>
            <span className={styles.cardLabel}>Prossimo evento</span>
            {formatted ? (
              <h2 className={styles.cardTitle}>{formatted.title}</h2>
            ) : (
              <h2 className={styles.cardTitle}>Nessun evento in programma</h2>
            )}
          </div>
          <button
            className={styles.minimizeButton}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsMinimized(true)
            }}
            aria-label="Minimizza card evento"
            type="button"
          >
            <FiMinimize2 />
          </button>
        </header>

        <div className={styles.cardBody}>
          {loading && <p className={styles.placeholder}>Carico gli eventi…</p>}
          {!loading && error && <p className={styles.placeholder}>Errore: {error}</p>}
          {!loading && !formatted && !error && (
            <p className={styles.placeholder}>Aggiungi un evento per mostrare qui i dettagli.</p>
          )}
          {formatted && !loading && (
            <>
              <p className={styles.datetime}>{formatted.formattedDate}</p>

              {formatted.address && (
                <p className={styles.metaRow}>
                  <FiMapPin aria-hidden />
                  {formatted.locationUrl ? (
                    <a href={formatted.locationUrl} target="_blank" rel="noreferrer">
                      {formatted.address}
                    </a>
                  ) : (
                    formatted.address
                  )}
                </p>
              )}

              {formatted.externalUrl && (
                <a
                  href={formatted.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.externalLink}
                >
                  Dettagli evento
                  <FiExternalLink aria-hidden />
                </a>
              )}
            </>
          )}
        </div>

        <div className={styles.cardFooter}>
          {!isConfigured && (
            <p className={styles.configHint}>
              Collega Supabase per attivare la gestione eventi in tempo reale.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
