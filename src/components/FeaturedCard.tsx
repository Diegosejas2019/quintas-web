import Link from 'next/link'
import type { Quinta } from '@/types/types'
import FavoriteButton from '@/components/FavoriteButton'

const EMOJIS = ['🌳', '🌿', '🏡', '🌲', '🏠']

export default function FeaturedCard({ quinta }: { quinta: Quinta }) {
  const emoji = EMOJIS[quinta.nombre.charCodeAt(0) % EMOJIS.length]

  return (
    <Link
      href={`/quintas/${quinta.id}`}
      className="flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      style={{ width: 220 }}
    >
      <div className="h-36 bg-[#6B4C35] flex items-center justify-center relative overflow-hidden">
        {quinta.imagenes?.[0]
          ? <img src={quinta.imagenes[0]} alt={quinta.nombre} className="absolute inset-0 w-full h-full object-cover" />
          : <span style={{ fontSize: 52 }}>{emoji}</span>
        }
        <FavoriteButton quinta={quinta} className="absolute top-2.5 right-2.5" />
      </div>
      <div className="p-3">
        <p className="text-sm font-bold text-[#4A3020] truncate">{quinta.nombre}</p>
        <p className="text-xs text-[#7A6559] mt-0.5 truncate">📍 {quinta.direccion ?? 'Córdoba, Argentina'}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm font-bold text-[#6B4C35]">
            ${quinta.precioPorDia.toLocaleString('es-AR')}
            <span className="text-[11px] font-normal text-[#7A6559]">/noche</span>
          </p>
        </div>
      </div>
    </Link>
  )
}
