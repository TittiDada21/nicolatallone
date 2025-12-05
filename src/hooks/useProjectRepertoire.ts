import { useCallback, useEffect, useState } from 'react'

import { hasSupabase, supabase } from '@/lib/supabaseClient'
import type { RepertoireEntry, RepertoireField, RepertoireItem } from '@/types/repertoire'

type UseProjectRepertoireArgs = {
  pageKey: string
  fallback?: RepertoireItem[]
  enabled?: boolean
}

type UseProjectRepertoireResult = {
  repertoire: RepertoireEntry[]
  loading: boolean
  saving: boolean
  error?: string
  isConfigured: boolean
  refresh: () => Promise<void>
  updateField: (index: number, field: RepertoireField, value: string | number | undefined) => Promise<void>
  addRow: () => Promise<void>
  deleteRow: (index: number) => Promise<void>
}

type ProjectRepertoireRow = {
  id: string
  page_key: string
  composer_first_name: string
  composer_last_name: string
  composer_birth_year?: number | null
  composer_death_year?: number | null
  piece_title: string
  composition_year?: number | null
  sort_order?: number | null
  created_at?: string | null
  updated_at?: string | null
}

const mapRowToEntry = (row: ProjectRepertoireRow): RepertoireEntry => ({
  id: row.id,
  sortOrder: row.sort_order ?? undefined,
  composer: {
    firstName: row.composer_first_name,
    lastName: row.composer_last_name,
    birthYear: row.composer_birth_year ?? undefined,
    deathYear: row.composer_death_year ?? undefined,
  },
  pieceTitle: row.piece_title,
  compositionYear: row.composition_year ?? undefined,
  createdAt: row.created_at ?? undefined,
  updatedAt: row.updated_at ?? undefined,
})

const toPayload = (entry: RepertoireEntry, pageKey: string, sortOrder: number) => ({
  page_key: pageKey,
  composer_first_name: entry.composer.firstName,
  composer_last_name: entry.composer.lastName,
  composer_birth_year: entry.composer.birthYear ?? null,
  composer_death_year: entry.composer.deathYear ?? null,
  piece_title: entry.pieceTitle,
  composition_year: entry.compositionYear ?? null,
  sort_order: sortOrder,
})

const normalizeFallback = (fallback?: RepertoireItem[]): RepertoireEntry[] =>
  (fallback ?? []).map((item, index) => ({
    ...item,
    sortOrder: index,
  }))

export function useProjectRepertoire({
  pageKey,
  fallback = [],
  enabled = true,
}: UseProjectRepertoireArgs): UseProjectRepertoireResult {
  const [repertoire, setRepertoire] = useState<RepertoireEntry[]>(normalizeFallback(fallback))
  const [loading, setLoading] = useState<boolean>(enabled)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>()

  const refresh = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    if (!supabase) {
      setRepertoire(normalizeFallback(fallback))
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error: queryError } = await supabase
      .from('project_repertoire')
      .select('*')
      .eq('page_key', pageKey)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (queryError) {
      setError(queryError.message)
      setRepertoire(normalizeFallback(fallback))
      setLoading(false)
      return
    }

    if (!data || data.length === 0) {
      setRepertoire(normalizeFallback(fallback))
      setError(undefined)
      setLoading(false)
      return
    }

    setRepertoire(data.map(mapRowToEntry))
    setError(undefined)
    setLoading(false)
  }, [enabled, fallback, pageKey])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      setRepertoire(normalizeFallback(fallback))
      return
    }
    setRepertoire((prev) => {
      if (prev.length === 0) {
        return normalizeFallback(fallback)
      }
      return prev
    })
  }, [enabled, fallback, pageKey])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const updateField = useCallback(
    async (index: number, field: RepertoireField, value: string | number | undefined) => {
      setError(undefined)
      let updatedEntry: RepertoireEntry | null = null
      setRepertoire((prev) => {
        const next = [...prev]
        const current = { ...next[index] }
        current.composer = { ...current.composer }

        if (field === 'composer.firstName') {
          current.composer.firstName = String(value ?? '')
        } else if (field === 'composer.lastName') {
          current.composer.lastName = String(value ?? '')
        } else if (field === 'composer.birthYear') {
          current.composer.birthYear = value ? Number(value) : undefined
        } else if (field === 'composer.deathYear') {
          current.composer.deathYear = value ? Number(value) : undefined
        } else if (field === 'pieceTitle') {
          current.pieceTitle = String(value ?? '')
        } else if (field === 'compositionYear') {
          current.compositionYear = value ? Number(value) : undefined
        }

        current.sortOrder = index
        next[index] = current
        updatedEntry = current
        return next
      })

      if (!updatedEntry || !enabled) {
        return
      }

      const entryToPersist = updatedEntry as RepertoireEntry

      if (!supabase) {
        return
      }

      setSaving(true)
      try {
        if (entryToPersist.id) {
          const { error: updateError } = await supabase
            .from('project_repertoire')
            .update(toPayload(entryToPersist, pageKey, index))
            .eq('id', entryToPersist.id)
          if (updateError) {
            setError(updateError.message)
          }
        } else {
          const { data, error: insertError } = await supabase
            .from('project_repertoire')
            .insert(toPayload(entryToPersist, pageKey, index))
            .select()
            .single()

          if (insertError) {
            setError(insertError.message)
          } else if (data) {
            setRepertoire((prev) =>
              prev.map((item, itemIndex) =>
                itemIndex === index ? mapRowToEntry(data) : item,
              ),
            )
          }
        }
      } finally {
        setSaving(false)
      }
    },
    [enabled, pageKey],
  )

  const addRow = useCallback(async () => {
    setError(undefined)
    const newEntry: RepertoireEntry = {
      composer: { firstName: '', lastName: '' },
      pieceTitle: '',
      compositionYear: undefined,
      sortOrder: repertoire.length,
    }

    const newIndex = repertoire.length
    setRepertoire((prev) => [...prev, newEntry])

    if (!enabled || !supabase) {
      return
    }

    setSaving(true)
    try {
      const { data, error: insertError } = await supabase
        .from('project_repertoire')
        .insert(toPayload(newEntry, pageKey, newIndex))
        .select()
        .single()

      if (insertError) {
        setError(insertError.message)
        return
      }

      if (data) {
        setRepertoire((prev) =>
          prev.map((item, index) => (index === newIndex ? mapRowToEntry(data) : item)),
        )
      }
    } finally {
      setSaving(false)
    }
  }, [enabled, pageKey, repertoire.length])

  const deleteRow = useCallback(
    async (index: number) => {
      setError(undefined)
      let deletedId: string | undefined
      setRepertoire((prev: RepertoireEntry[]) => {
        const target = prev[index]
        deletedId = target?.id
        const next = prev.filter((_, itemIndex) => itemIndex !== index)
        return next.map((item, itemIndex) => ({
          ...item,
          sortOrder: itemIndex,
        }))
      })

      if (!enabled || !supabase || !deletedId) {
        return
      }

      setSaving(true)
      try {
        const { error: deleteError } = await supabase
          .from('project_repertoire')
          .delete()
          .eq('id', deletedId)
        if (deleteError) {
          setError(deleteError.message)
        }
      } finally {
        setSaving(false)
      }
    },
    [enabled],
  )

  return {
    repertoire,
    loading,
    saving,
    error,
    isConfigured: hasSupabase,
    refresh,
    updateField,
    addRow,
    deleteRow,
  }
}
