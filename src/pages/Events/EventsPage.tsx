import { useMemo } from 'react'
import { FiExternalLink, FiMapPin } from 'react-icons/fi'
import { useParams } from 'react-router-dom'

import { GlassPanel } from '@/components/common/GlassPanel'
import { useEvents } from '@/providers/EventProvider'

import styles from './EventsPage.module.css'

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function EventsPage() {
  const { type } = useParams<{ type: 'futuri' | 'passati' }>()
  const { futureEvents, pastEvents, loading, error } = useEvents()

  const events = useMemo(() => {
    return type === 'futuri' ? futureEvents : pastEvents
  }, [type, futureEvents, pastEvents])

  const title = type === 'futuri' ? 'Eventi futuri' : 'Eventi passati'
  const description =
    type === 'futuri'
      ? 'Elenco completo degli eventi futuri sincronizzati con Supabase, con maggiori dettagli rispetto alla card sulla home.'
      : 'Archivio storico degli eventi passati, utile per stampa e promoter.'

  return (
    <div className={`${styles.wrapper} ${type === 'futuri' ? styles.futuri : styles.passati}`}>
      <GlassPanel size="wide">
        <div className={styles.header}>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {loading && <p className={styles.placeholder}>Carico gli eventi…</p>}
        {!loading && error && <p className={styles.placeholder}>Errore: {error}</p>}
        {!loading && !error && events.length === 0 && (
          <p className={styles.placeholder}>Nessun evento disponibile.</p>
        )}

        {!loading && !error && events.length > 0 && (
          <div className={styles.eventsList}>
            {events.map((event) => (
              <article key={event.id} className={styles.eventCard}>
                <h2 className={styles.eventTitle}>{event.title}</h2>
                <p className={styles.eventDate}>{formatDateTime(event.startsAt)}</p>

                {event.description && (
                  <p className={styles.eventDescription}>{event.description}</p>
                )}

                <div className={styles.eventMeta}>
                  {event.address && (
                    <p className={styles.metaRow}>
                      <FiMapPin aria-hidden />
                      {event.locationUrl ? (
                        <a href={event.locationUrl} target="_blank" rel="noreferrer">
                          {event.address}
                        </a>
                      ) : (
                        event.address
                      )}
                    </p>
                  )}

                  {event.isFree ? (
                    <span className={styles.badge}>Offerta libera</span>
                  ) : (
                    event.price && <span className={styles.badge}>€ {event.price}</span>
                  )}
                </div>

                {event.externalUrl && (
                  <a
                    href={event.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.externalLink}
                  >
                    Dettagli evento
                    <FiExternalLink aria-hidden />
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  )
}

