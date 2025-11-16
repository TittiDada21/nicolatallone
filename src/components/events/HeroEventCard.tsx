import { useEffect, useMemo } from 'react'
import { FiExternalLink, FiMapPin } from 'react-icons/fi'

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

export function HeroEventCard() {
  const { upcomingEvent, loading, error, refresh, isConfigured } = useEvents()

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
    }
  }, [upcomingEvent])

  return (
    <section className={styles.card}>
        <header className={styles.cardHeader}>
          <div>
            <span className={styles.cardLabel}>Prossimo evento</span>
            {formatted ? (
              <h1 className={styles.cardTitle}>{formatted.title}</h1>
            ) : (
              <h1 className={styles.cardTitle}>Nessun evento in programma</h1>
            )}
          </div>
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
      </section>
  )
}

