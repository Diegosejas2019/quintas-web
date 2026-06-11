'use client'

import { useFavoritesStore } from '@/store/favoritesStore'
import type { Quinta } from '@/types/types'

interface Props {
  quinta: Quinta
  className?: string
}

export default function FavoriteButton({ quinta, className = '' }: Props) {
  const { toggle, isFavorite } = useFavoritesStore()
  const saved = isFavorite(quinta.id)

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(quinta) }}
      aria-label={saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      className={`w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm transition-colors hover:bg-white ${className}`}
    >
      {saved ? '♥' : '♡'}
    </button>
  )
}
