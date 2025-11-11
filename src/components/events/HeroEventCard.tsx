import { useMemo, useState } from 'react'
import { FiExternalLink, FiMapPin, FiPlus, FiRefreshCw } from 'react-icons/fi'

import { useAuth } from '@/providers/AuthProvider'
import { useEvents } from '@/providers/EventProvider'
import type { EventFormValues, EventRecord } from '@/types/event'

import { AdminEventModal } from './AdminEventModal'

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
  const { upcomingEvent, loading, error, refresh, isConfigured, createEvent, updateEvent, deleteEvent } = useEvents()
  const { user } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<EventRecord | null>(null)

  const formatted = useMemo(() => {
    if (!upcomingEvent) {
      return null
    }
    return {
      ...upcomingEvent,
      formattedDate: formatDateTime(upcomingEvent.startsAt),
    }
  }, [upcomingEvent])

  const handleCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = () => {
    if (upcomingEvent) {
      setEditing(upcomingEvent)
      setModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditing(null)
  }

  const handleSubmit = async (values: EventFormValues) => {
    if (editing) {
      await updateEvent(editing.id, values)
    } else {
      await createEvent(values)
    }
    handleCloseModal()
  }

  const handleDelete = async () => {
    if (!editing) return
    await deleteEvent(editing.id)
    handleCloseModal()
  }

  return (
    <>
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

          <div className={styles.actions}>
            {isConfigured && (
              <button type="button" className={styles.refreshButton} onClick={() => refresh()}>
                <FiRefreshCw aria-hidden />
              </button>
            )}
            {user && formatted && (
              <button type="button" className={styles.editButton} onClick={handleEdit}>
                Modifica
              </button>
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
              {formatted.description && <p className={styles.description}>{formatted.description}</p>}

              <div className={styles.meta}>
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

                {formatted.isFree ? (
                  <span className={styles.badge}>Offerta libera</span>
                ) : (
                  formatted.price && <span className={styles.badge}>€ {formatted.price}</span>
                )}
              </div>

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
          <button
            type="button"
            className={styles.addButton}
            onClick={handleCreate}
            aria-label="Aggiungi evento"
          >
            <FiPlus aria-hidden />
          </button>
          {!isConfigured && (
            <p className={styles.configHint}>
              Collega Supabase per attivare la gestione eventi in tempo reale.
            </p>
          )}
          {!user && isConfigured && (
            <p className={styles.configHint}>
              Accedi con le credenziali admin per aggiungere o modificare gli eventi.
            </p>
          )}
        </div>
      </section>

      <AdminEventModal
        open={modalOpen}
        mode={editing ? 'edit' : 'create'}
        initialEvent={editing}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={editing ? handleDelete : undefined}
      />
    </>
  )
}

