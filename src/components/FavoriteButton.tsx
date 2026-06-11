'use client'

import { useRef } from 'react'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { syncFavoritos } from '@/api/favoritos'
import type { Quinta } from '@/types/types'

interface Props {
  quinta: Quinta
  className?: string
}

export default function FavoriteButton({ quinta, className = '' }: Props) {
  const { toggle, isFavorite } = useFavoritesStore()
  const { user } = useAuthStore()
  const { addToast } = useUIStore()
  const saved = isFavorite(quinta.id)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const adding = !saved
    toggle(quinta)
    addToast(adding ? 'Agregado a favoritos' : 'Eliminado de favoritos', adding ? 'success' : 'info')

    if (user) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const ids = useFavoritesStore.getState().items.map(i => i.id)
        syncFavoritos(ids).catch(() => {})
      }, 300)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      className={`w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm transition-colors hover:bg-white ${className}`}
    >
      {saved ? '♥' : '♡'}
    </button>
  )
}
