'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Quinta, FavoriteItem } from '@/types/types'

interface FavoritesState {
  items: FavoriteItem[]
  toggle: (quinta: Pick<Quinta, 'id' | 'nombre' | 'precioPorDia' | 'direccion'>) => void
  isFavorite: (id: string) => boolean
  clear: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (quinta) => {
        const exists = get().items.some(i => i.id === quinta.id)
        if (exists) {
          set(s => ({ items: s.items.filter(i => i.id !== quinta.id) }))
        } else {
          set(s => ({
            items: [...s.items, {
              id: quinta.id,
              nombre: quinta.nombre,
              precioPorDia: quinta.precioPorDia,
              direccion: quinta.direccion,
            }],
          }))
        }
      },
      isFavorite: (id) => get().items.some(i => i.id === id),
      clear: () => set({ items: [] }),
    }),
    { name: 'quintas-favoritos' }
  )
)
