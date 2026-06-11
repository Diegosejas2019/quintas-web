'use client'

import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { PerfilUsuario } from '@/types/types'

interface AuthState {
  user: User | null
  loading: boolean
  perfil: PerfilUsuario | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setPerfil: (perfil: PerfilUsuario | null) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  perfil: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setPerfil: (perfil) => set({ perfil }),
  signOut: async () => {
    const { supabase } = await import('@/lib/supabase')
    await supabase.auth.signOut()
    set({ user: null, perfil: null })
  },
}))
