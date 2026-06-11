import type { Metadata } from 'next'
import Link from 'next/link'
import { getQuintaById } from '@/api/quintas'
import { getOpiniones } from '@/api/opiniones'
import OpinionesList from '@/components/OpinionesList'
import QuintaDetailClient from '@/components/QuintaDetailClient'
import { AMENITY_MAP } from '@/lib/amenities'

const EMOJIS = ['🌳', '🌿', '🏡', '🌲', '🏠']

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  try {
    const q = await getQuintaById(id)
    return {
      title: `${q.nombre} — Quintas App`,
      description: `${q.capacidad} personas · $${q.precioPorDia.toLocaleString('es-AR')}/noche${q.descripcion ? ' · ' + q.descripcion.slice(0, 120) : ''}`,
      openGraph: {
        title: q.nombre,
        description: `${q.capacidad} personas · $${q.precioPorDia.toLocaleString('es-AR')}/noche`,
        type: 'website',
      },
    }
  } catch {
    return { title: 'Quinta — Quintas App' }
  }
}

export default async function QuintaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [quinta, opinionesData] = await Promise.all([
    getQuintaById(id),
    getOpiniones(id).catch(() => ({ opiniones: [], promedio: 0 })),
  ])

  const emoji = EMOJIS[quinta.nombre.charCodeAt(0) % EMOJIS.length]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero */}
      <div className="h-64 bg-[#6B4C35] flex items-center justify-center relative">
        <span style={{ fontSize: 80 }}>{emoji}</span>
        <Link href="/"
          className="absolute top-4 left-4 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center text-lg hover:bg-white"
        >←</Link>
      </div>

      <div className="px-5 pt-5 pb-24">
        {/* Info */}
        <h1 className="text-2xl font-bold text-[#4A3020]">{quinta.nombre}</h1>
        <div className="flex justify-between items-center mt-1.5 mb-4">
          <p className="text-sm text-[#7A6559]">📍 {quinta.direccion ?? 'Córdoba, Argentina'}</p>
          <p className="text-sm font-semibold text-[#2C1810]">
            ⭐ {opinionesData.promedio > 0 ? opinionesData.promedio.toFixed(1) : '—'}
            {' '}({opinionesData.opiniones.length})
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="bg-[#E8F0EB] text-[#4A7C59] text-xs font-semibold px-3 py-1.5 rounded-full">
            👥 {quinta.capacidad} personas
          </span>
          <span className="bg-[#E8F0EB] text-[#4A7C59] text-xs font-semibold px-3 py-1.5 rounded-full">
            💰 ${quinta.precioPorDia.toLocaleString('es-AR')}/día
          </span>
        </div>

        {/* Servicios */}
        {(quinta.pileta || quinta.parrilla || (quinta.amenities?.length ?? 0) > 0) && (
          <>
            <h2 className="text-base font-bold text-[#4A3020] mb-3">Servicios</h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {quinta.pileta   && <ServiceBadge emoji="🏊" label="Pileta" />}
              {quinta.parrilla && <ServiceBadge emoji="🔥" label="Parrilla" />}
              {quinta.amenities?.map(a => {
                const info = AMENITY_MAP[a]
                return info
                  ? <ServiceBadge key={a} emoji={info.emoji} label={info.label} />
                  : <ServiceBadge key={a} emoji="•" label={a} />
              })}
            </div>
          </>
        )}

        {quinta.descripcion && (
          <>
            <h2 className="text-base font-bold text-[#4A3020] mb-2">Descripción</h2>
            <p className="text-sm text-[#7A6559] leading-6 mb-5">{quinta.descripcion}</p>
          </>
        )}

        {/* Disponibilidad + acciones — client component unificado */}
        <h2 className="text-base font-bold text-[#4A3020] mb-3">Disponibilidad</h2>
        <QuintaDetailClient
          quintaId={id}
          quintaNombre={quinta.nombre}
          precioPorDia={quinta.precioPorDia}
        />

        {/* Reseñas */}
        <h2 className="text-base font-bold text-[#4A3020] mb-3">
          Reseñas ({opinionesData.opiniones.length})
        </h2>
        <OpinionesList opiniones={opinionesData.opiniones} />
      </div>
    </div>
  )
}

function ServiceBadge({ emoji, label }: { emoji: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 bg-[#F5EFE9] text-[#4A3020] text-xs font-semibold px-3 py-2 rounded-xl">
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  )
}
