'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Quinta, FavoriteItem } from '@/types/types'

interface FavoritesState {
  items: FavoriteItem[]
  toggle: (quinta: Pick<Quinta, 'id' | 'nombre' | 'precioPorDia' | 'direccion' | 'imagenes'>) => void
  isFavorite: (id: string) => boolean
  hydrate: (ids: string[]) => void
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
              imagenUrl: quinta.imagenes?.[0],
            }],
          }))
        }
      },
      isFavorite: (id) => get().items.some(i => i.id === id),
      hydrate: (ids) => {
        // Merge backend IDs with existing local items, adding stubs for unknown IDs
        set(s => {
          const existing = new Map(s.items.map(i => [i.id, i]))
          const merged = ids.map(id => existing.get(id) ?? { id, nombre: '', precioPorDia: 0, direccion: undefined })
          // Keep local items not in backend (not yet synced) merged in
          const localOnly = s.items.filter(i => !ids.includes(i.id))
          return { items: [...merged, ...localOnly] }
        })
      },
      clear: () => set({ items: [] }),
    }),
    { name: 'quintas-favoritos' }
  )
)
