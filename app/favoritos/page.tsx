'use client'

import Link from 'next/link'
import { useFavoritesStore } from '@/store/favoritesStore'
import FavoritaCard from '@/components/FavoritaCard'

export default function FavoritosPage() {
  const { items } = useFavoritesStore()

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-5 py-16 flex flex-col items-center text-center">
        <span className="text-5xl mb-4">♡</span>
        <h1 className="text-xl font-bold text-[#4A3020] mb-2">Sin favoritos todavía</h1>
        <p className="text-sm text-[#7A6559] mb-6">
          Tocá el ♡ en cualquier quinta para guardarla acá y compartirla fácilmente.
        </p>
        <Link
          href="/"
          className="bg-[#6B4C35] text-white font-bold px-8 py-3.5 rounded-2xl w-full text-center text-sm"
        >
          Explorar quintas
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-[#2C1810] mb-1">Alojamiento</h1>
      <p className="text-sm text-[#7A6559] mb-4">{items.length} alojamiento{items.length !== 1 ? 's' : ''} guardado{items.length !== 1 ? 's' : ''}</p>

      <div className="flex flex-col gap-3">
        {items.map(item => (
          <FavoritaCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
