import Link from 'next/link'
import type { Quinta } from '@/types/types'
import { AMENITY_MAP } from '@/lib/amenities'

const EMOJIS = ['🌳', '🌿', '🏡', '🌲', '🏠']

export default function QuintaCard({ quinta }: { quinta: Quinta }) {
  const emoji = EMOJIS[quinta.nombre.charCodeAt(0) % EMOJIS.length]

  return (
    <Link href={`/quintas/${quinta.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-44 bg-[#6B4C35] flex items-center justify-center relative">
        <span style={{ fontSize: 56 }}>{emoji}</span>
        <span className="absolute top-3 left-3 bg-[#4A7C59] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
          ✓ Disponible
        </span>
        <div className="absolute top-3 right-3 flex gap-1.5">
          {quinta.pileta   && <AmenityBadge label="🏊" />}
          {quinta.parrilla && <AmenityBadge label="🔥" />}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-3">
            <p className="font-bold text-[#4A3020] truncate">{quinta.nombre}</p>
            <p className="text-xs text-[#7A6559] mt-0.5 truncate">📍 {quinta.direccion ?? 'Córdoba, Argentina'}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[#6B4C35]">${quinta.precioPorDia.toLocaleString('es-AR')}</p>
            <p className="text-[11px] text-[#7A6559]">/ noche</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <Tag label={`👥 ${quinta.capacidad} personas`} />
          {quinta.pileta   && <Tag label="🏊 Pileta" green />}
          {quinta.parrilla && <Tag label="🔥 Parrilla" green />}
          {quinta.amenities?.map(a => {
            const info = AMENITY_MAP[a]
            return info
              ? <Tag key={a} label={`${info.emoji} ${info.label}`} green />
              : <Tag key={a} label={a} green />
          })}
        </div>
      </div>
    </Link>
  )
}

function AmenityBadge({ label }: { label: string }) {
  return (
    <div className="bg-white/90 w-8 h-8 rounded-full flex items-center justify-center text-base">
      {label}
    </div>
  )
}

function Tag({ label, green }: { label: string; green?: boolean }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${green ? 'bg-[#E8F0EB] text-[#4A7C59]' : 'bg-[#F5EFE9] text-[#7A6559]'}`}>
      {label}
    </span>
  )
}
