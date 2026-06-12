'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useFavoritesStore } from '@/store/favoritesStore'
import { getOpiniones } from '@/api/opiniones'
import { getQuintaById } from '@/api/quintas'
import { checkDisponible } from '@/lib/checkDisponibilidad'
import FavoriteDatePickerModal from '@/components/FavoriteDatePickerModal'
import type { FavoriteItem } from '@/types/types'

interface Props {
  item: FavoriteItem
}

function formatRango(desde: string, hasta: string): string {
  const fmt = (s: string) => {
    const d = new Date(s + 'T12:00:00')
    return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
  }
  return `${fmt(desde)} – ${fmt(hasta)}`
}

export default function FavoritaCard({ item }: Props) {
  const router = useRouter()
  const { toggle } = useFavoritesStore()
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [disponible, setDisponible] = useState<boolean | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [checkingDisp, setCheckingDisp] = useState(false)

  const { data: opinionesData } = useQuery({
    queryKey: ['opiniones', item.id],
    queryFn: () => getOpiniones(item.id),
    staleTime: 5 * 60 * 1000,
  })

  const { data: quintaData } = useQuery({
    queryKey: ['quinta', item.id],
    queryFn: () => getQuintaById(item.id),
    staleTime: 10 * 60 * 1000,
    enabled: !imagenUrl,
  })

  const handleConfirmarFechas = async (d: string, h: string) => {
    setDesde(d)
    setHasta(h)
    setShowModal(false)
    setDisponible(null)
    setCheckingDisp(true)
    try {
      const ok = await checkDisponible(item.id, d, h)
      setDisponible(ok)
    } finally {
      setCheckingDisp(false)
    }
  }

  const handleCardClick = () => {
    if (desde && hasta) {
      router.push(`/quintas/${item.id}?desde=${desde}&hasta=${hasta}`)
    } else {
      router.push(`/quintas/${item.id}`)
    }
  }

  const imagenUrl = imagenUrl ?? quintaData?.imagenes?.[0]
  const promedio = opinionesData?.promedio ?? 0
  const totalOpiniones = opinionesData?.opiniones.length ?? 0

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8DDD4] overflow-hidden">
        {/* Info principal */}
        <div className="flex gap-3 p-3 cursor-pointer" onClick={handleCardClick}>
          {/* Thumbnail */}
          <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#E8DDD4]">
            {imagenUrl ? (
              <Image
                src={imagenUrl}
                alt={item.nombre}
                width={96}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#D4C4B8]" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-[#2C1810] text-sm leading-tight">{item.nombre}</p>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); toggle(item as any) }}
                aria-label="Quitar de favoritos"
                className="text-red-500 text-lg flex-shrink-0 leading-none mt-0.5"
              >
                ♥
              </button>
            </div>

            {promedio > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="bg-[#1e3a6e] text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  {promedio.toFixed(1)}
                </span>
                <span className="text-xs text-[#7A6559] truncate">
                  {totalOpiniones} reseñas
                </span>
              </div>
            )}

            {/* Estado disponibilidad */}
            {checkingDisp && (
              <p className="text-xs text-[#7A6559] mt-1">Verificando...</p>
            )}
            {!checkingDisp && disponible === true && (
              <p className="text-xs font-bold text-green-600 mt-1">Disponible</p>
            )}
            {!checkingDisp && disponible === false && (
              <p className="text-xs font-bold text-red-500 mt-1">Agotado</p>
            )}
          </div>
        </div>

        {/* Fila de fechas */}
        <div className="border-t border-[#E8DDD4] px-3 py-2.5">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-sm font-medium text-[#1e3a6e]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {desde && hasta ? formatRango(desde, hasta) : 'Seleccionar fechas'}
          </button>
        </div>
      </div>

      {showModal && (
        <FavoriteDatePickerModal
          quintaId={item.id}
          quintaNombre={item.nombre}
          imagenUrl={imagenUrl}
          promedio={promedio}
          totalOpiniones={totalOpiniones}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmarFechas}
        />
      )}
    </>
  )
}
