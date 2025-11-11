/* eslint-disable react-refresh/only-export-components */
import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'

import { hasSupabase, supabase } from '@/lib/supabaseClient'

type SignInPayload = {
  email: string
  password: string
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  signIn: (payload: SignInPayload) => Promise<void>
  signOut: () => Promise<void>
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const client = supabase
    const initSession = async () => {
      const { data, error } = await client.auth.getSession()
      if (!error) {
        setUser(data.session?.user ?? null)
      }
      setLoading(false)
    }

    void initSession()

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async ({ email, password }: SignInPayload) => {
    if (!supabase) {
      throw new Error('Supabase non configurato')
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw error
    }
  }

  const signOut = async () => {
    if (!supabase) {
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signOut,
      isConfigured: hasSupabase,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve essere usato dentro AuthProvider')
  }
  return context
}

