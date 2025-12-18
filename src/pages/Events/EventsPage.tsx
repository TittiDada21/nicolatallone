import { useEffect, useMemo, useState } from 'react'
import { FiEdit2, FiExternalLink, FiMapPin, FiPlus } from 'react-icons/fi'
import { FaLock } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import { useAuth } from '@/providers/AuthProvider'
import { useEvents } from '@/providers/EventProvider'
import type { EventFormValues, EventRecord } from '@/types/event'

import { AdminEventModal } from '@/components/events/AdminEventModal'

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
  const { user, signOut } = useAuth()
  const { futureEvents, pastEvents, loading, error, isConfigured, createEvent, updateEvent, deleteEvent } = useEvents()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<EventRecord | null>(null)

  const events = useMemo(() => {
    return type === 'futuri' ? futureEvents : pastEvents
  }, [type, futureEvents, pastEvents])

  const title = type === 'futuri' ? 'Eventi futuri' : 'Eventi passati'

  useEffect(() => {
    setModalOpen(false)
    setEditing(null)
  }, [])

  const handleCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleOpenAdminLogin = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (event: EventRecord) => {
    setEditing(event)
    setModalOpen(true)
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
  }

  const handleDelete = async () => {
    if (!editing) return
    await deleteEvent(editing.id)
    handleCloseModal()
  }

  return (
    <div className={`${styles.wrapper} ${type === 'futuri' ? styles.futuri : styles.passati}`}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>{title}</h1>
          {isConfigured && !user && (
            <FaLock
              className={styles.adminIcon}
              onClick={handleOpenAdminLogin}
              aria-label="Accesso admin"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleOpenAdminLogin()
                }
              }}
            />
          )}
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
                <div className={styles.eventCardHeader}>
                  <div>
                    <h2 className={styles.eventTitle}>{event.title}</h2>
                    <p className={styles.eventDate}>{formatDateTime(event.startsAt)}</p>
                  </div>
                  {user && (
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() => handleEdit(event)}
                      aria-label="Modifica evento"
                    >
                      <FiEdit2 aria-hidden />
                    </button>
                  )}
                </div>

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
      </div>

      {isConfigured && user && (
        <button
          type="button"
          className={styles.fabButton}
          onClick={handleCreate}
          aria-label="Aggiungi evento"
        >
          <FiPlus aria-hidden />
        </button>
      )}

      <AdminEventModal
        open={modalOpen}
        mode={editing ? 'edit' : 'create'}
        initialEvent={editing}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={editing ? handleDelete : undefined}
      />
    </div>
  )
}

