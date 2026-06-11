'use client'

import Link from 'next/link'
import { useFavoritesStore } from '@/store/favoritesStore'
import ShareButton from '@/components/ShareButton'

export default function FavoritosPage() {
  const { items, toggle } = useFavoritesStore()

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
    <div className="max-w-lg mx-auto px-5 py-6">
      <h1 className="text-2xl font-bold text-[#4A3020] mb-5">♡ Mis favoritos</h1>

      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <Link href={`/quintas/${item.id}`} className="flex-1 min-w-0">
              <p className="font-semibold text-[#4A3020] truncate">{item.nombre}</p>
              <p className="text-xs text-[#7A6559] mt-0.5 truncate">
                📍 {item.direccion ?? 'Córdoba, Argentina'}
              </p>
              <p className="text-sm font-bold text-[#6B4C35] mt-1">
                ${item.precioPorDia.toLocaleString('es-AR')}
                <span className="text-xs font-normal text-[#7A6559]"> / noche</span>
              </p>
            </Link>
            <div className="flex gap-2 flex-shrink-0">
              <ShareButton quintaId={item.id} quintaNombre={item.nombre} />
              <button
                type="button"
                onClick={() => toggle(item)}
                aria-label="Quitar de favoritos"
                className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-red-500 text-sm hover:bg-red-100"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
