import { useCallback, useEffect, useState } from 'react'

import { hasSupabase, supabase } from '@/lib/supabaseClient'

type UseProjectCachetArgs = {
  pageKey: string
  fallback?: string
  enabled?: boolean
}

type UseProjectCachetResult = {
  cachet: string
  loading: boolean
  saving: boolean
  error?: string
  isConfigured: boolean
  refresh: () => Promise<void>
  updateCachet: (value: string) => Promise<void>
}

export function useProjectCachet({
  pageKey,
  fallback = '',
  enabled = true,
}: UseProjectCachetArgs): UseProjectCachetResult {
  const [cachet, setCachet] = useState<string>(fallback)
  const [loading, setLoading] = useState<boolean>(enabled)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>()

  const refresh = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    if (!supabase) {
      setCachet(fallback)
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error: queryError } = await supabase
      .from('project_cachet')
      .select('*')
      .eq('page_key', pageKey)
      .maybeSingle()

    if (queryError) {
      setError(queryError.message)
      setCachet(fallback)
      setLoading(false)
      return
    }

    if (!data) {
      setCachet(fallback)
      setError(undefined)
      setLoading(false)
      return
    }

    setCachet(data.cachet_text || fallback)
    setError(undefined)
    setLoading(false)
  }, [enabled, fallback, pageKey])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      setCachet(fallback)
      return
    }
    setCachet((prev) => {
      if (prev === '' && fallback) {
        return fallback
      }
      return prev
    })
  }, [enabled, fallback, pageKey])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const updateCachet = useCallback(
    async (value: string) => {
      setError(undefined)
      setCachet(value)

      if (!enabled || !supabase) {
        return
      }

      setSaving(true)
      try {
        const { data: existing, error: selectError } = await supabase
          .from('project_cachet')
          .select('id')
          .eq('page_key', pageKey)
          .maybeSingle()

        if (selectError && selectError.code !== 'PGRST116') {
          setError(selectError.message)
          setSaving(false)
          return
        }

        if (existing) {
          const { error: updateError } = await supabase
            .from('project_cachet')
            .update({ cachet_text: value })
            .eq('id', existing.id)

          if (updateError) {
            setError(updateError.message)
          }
        } else {
          const { error: insertError } = await supabase
            .from('project_cachet')
            .insert({ page_key: pageKey, cachet_text: value })

          if (insertError) {
            setError(insertError.message)
          }
        }
      } finally {
        setSaving(false)
      }
    },
    [enabled, pageKey],
  )

  return {
    cachet,
    loading,
    saving,
    error,
    isConfigured: hasSupabase,
    refresh,
    updateCachet,
  }
}
