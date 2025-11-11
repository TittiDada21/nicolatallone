/* eslint-disable react-refresh/only-export-components */
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { hasSupabase, supabase } from '@/lib/supabaseClient'
import type { EventFormValues, EventRecord } from '@/types/event'

type EventContextValue = {
  futureEvents: EventRecord[]
  pastEvents: EventRecord[]
  upcomingEvent: EventRecord | null
  loading: boolean
  error?: string
  refresh: () => Promise<void>
  createEvent: (values: EventFormValues) => Promise<void>
  updateEvent: (eventId: string, values: EventFormValues) => Promise<void>
  deleteEvent: (eventId: string) => Promise<void>
  isConfigured: boolean
}

const EventContext = createContext<EventContextValue | undefined>(undefined)

const FALLBACK_EVENTS: EventRecord[] = [
  {
    id: 'preview-1',
    title: 'Concerto demo',
    description: 'Sostituisci questo contenuto collegando Supabase.',
    startsAt: new Date(Date.now() + 86_400_000).toISOString(),
    address: 'Milano, Teatro Demo',
    isFree: true,
    externalUrl: null,
  },
]

type EventRow = {
  id: string
  title: string
  description?: string | null
  starts_at?: string | null
  startsAt?: string | null
  address?: string | null
  is_free?: boolean | null
  isFree?: boolean | null
  price?: number | null
  external_url?: string | null
  externalUrl?: string | null
  location_url?: string | null
  locationUrl?: string | null
  created_at?: string | null
  updated_at?: string | null
}

const mapEvent = (raw: EventRow): EventRecord => ({
  id: raw.id,
  title: raw.title,
  description: raw.description,
  startsAt: raw.starts_at ?? raw.startsAt ?? new Date().toISOString(),
  address: raw.address,
  isFree: Boolean(raw.is_free ?? raw.isFree),
  price: raw.price,
  externalUrl: raw.external_url ?? raw.externalUrl,
  locationUrl: raw.location_url ?? raw.locationUrl,
  createdAt: raw.created_at ?? undefined,
  updatedAt: raw.updated_at ?? undefined,
})

const sortByDateAsc = (a: EventRecord, b: EventRecord) =>
  new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()

export function EventProvider({ children }: PropsWithChildren) {
  const [futureEvents, setFutureEvents] = useState<EventRecord[]>([])
  const [pastEvents, setPastEvents] = useState<EventRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()

  const loadEvents = useCallback(async () => {
    setLoading(true)

    if (!supabase) {
      setFutureEvents(FALLBACK_EVENTS)
      setPastEvents([])
      setError('Supabase non configurato. Mostro dati demo.')
      setLoading(false)
      return
    }

    const { data, error: queryError } = await supabase
      .from('events')
      .select('*')
      .order('starts_at', { ascending: true })

    if (queryError) {
      setError(queryError.message)
      setFutureEvents([])
      setPastEvents([])
      setLoading(false)
      return
    }

    const now = new Date()
    const mapped = data.map(mapEvent)
    const future = mapped
      .filter((event) => new Date(event.startsAt) >= now)
      .sort(sortByDateAsc)
    const past = mapped
      .filter((event) => new Date(event.startsAt) < now)
      .sort(sortByDateAsc)
      .reverse()

    setFutureEvents(future)
    setPastEvents(past)
    setError(undefined)
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadEvents()
  }, [loadEvents])

  const upcomingEvent = useMemo(() => futureEvents[0] ?? null, [futureEvents])

  const createEvent = useCallback(async (values: EventFormValues) => {
    if (!supabase) {
      throw new Error('Supabase non configurato')
    }
    const payload = {
      title: values.title,
      description: values.description,
      starts_at: new Date(values.startsAt).toISOString(),
      address: values.address,
      is_free: values.isFree,
      price: values.isFree ? null : values.price ?? null,
      external_url: values.externalUrl ?? null,
      location_url: values.locationUrl ?? null,
    }

    const { error: insertError } = await supabase.from('events').insert(payload)
    if (insertError) {
      throw insertError
    }
    await loadEvents()
  }, [loadEvents])

  const updateEvent = useCallback(
    async (eventId: string, values: EventFormValues) => {
      if (!supabase) {
        throw new Error('Supabase non configurato')
      }
      const payload = {
        title: values.title,
        description: values.description,
        starts_at: new Date(values.startsAt).toISOString(),
        address: values.address,
        is_free: values.isFree,
        price: values.isFree ? null : values.price ?? null,
        external_url: values.externalUrl ?? null,
        location_url: values.locationUrl ?? null,
      }

      const { error: updateError } = await supabase
        .from('events')
        .update(payload)
        .eq('id', eventId)

      if (updateError) {
        throw updateError
      }
      await loadEvents()
    },
    [loadEvents],
  )

  const deleteEvent = useCallback(
    async (eventId: string) => {
      if (!supabase) {
        throw new Error('Supabase non configurato')
      }
      const { error: deleteError } = await supabase.from('events').delete().eq('id', eventId)
      if (deleteError) {
        throw deleteError
      }
      await loadEvents()
    },
    [loadEvents],
  )

  const value = useMemo(
    () => ({
      futureEvents,
      pastEvents,
      upcomingEvent,
      loading,
      error,
      refresh: loadEvents,
      createEvent,
      updateEvent,
      deleteEvent,
      isConfigured: hasSupabase,
    }),
    [futureEvents, pastEvents, upcomingEvent, loading, error, loadEvents, createEvent, updateEvent, deleteEvent],
  )

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}

export const useEvents = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvents deve essere usato dentro EventProvider')
  }
  return context
}

