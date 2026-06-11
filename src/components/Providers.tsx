'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { upsertUsuario } from '@/api/usuarios'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const { setUser, setLoading, setPerfil } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
      if (data.session?.user) {
        upsertUsuario().then(setPerfil).catch(() => {})
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) {
        upsertUsuario().then(setPerfil).catch(() => {})
      } else {
        setPerfil(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading, setPerfil])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
