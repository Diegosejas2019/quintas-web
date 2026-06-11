'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { upsertUsuario } from '@/api/usuarios'
import { getFavoritos, syncFavoritos } from '@/api/favoritos'
import { getQuintaById } from '@/api/quintas'
import { useFavoritesStore } from '@/store/favoritesStore'

async function mergeFavoritosOnLogin() {
  try {
    const dbIds = await getFavoritos()
    const store = useFavoritesStore.getState()
    const localIds = store.items.map(i => i.id)

    // union of DB IDs + local IDs
    const allIds = Array.from(new Set([...dbIds, ...localIds]))

    // for IDs in DB that are not in local store, fetch quinta data
    const missingIds = dbIds.filter(id => !store.items.some(i => i.id === id))
    const fetched = await Promise.allSettled(missingIds.map(id => getQuintaById(id)))

    const newItems = [...store.items]
    fetched.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        const q = result.value
        newItems.push({ id: q.id, nombre: q.nombre, precioPorDia: q.precioPorDia, direccion: q.direccion })
      } else {
        // quinta not found — include ID with minimal data so ♡ state is preserved
        newItems.push({ id: missingIds[idx], nombre: '', precioPorDia: 0 })
      }
    })

    useFavoritesStore.setState({ items: newItems })

    // sync back to DB only if merged differs from what DB had
    if (allIds.length !== dbIds.length) {
      await syncFavoritos(allIds)
    }
  } catch {
    // non-fatal: favorites work from localStorage if DB sync fails
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const { setUser, setLoading, setPerfil } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
      if (data.session?.user) {
        upsertUsuario().then(setPerfil).catch(() => {})
        mergeFavoritosOnLogin()
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) {
        upsertUsuario().then(setPerfil).catch(() => {})
        if (_event === 'SIGNED_IN') {
          mergeFavoritosOnLogin()
        }
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
