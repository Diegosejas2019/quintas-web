'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { getEsteFinde } from '@/api/quintas'
import QuintaCard from '@/components/QuintaCard'
import FeaturedCard from '@/components/FeaturedCard'
import { useAuthStore } from '@/store/authStore'
import type { EstefindeFilters } from '@quintas-shared/types'

const CAPACIDADES = [
  { label: 'Cualquier tamaño', value: undefined },
  { label: '10+ personas', value: 10 },
  { label: '20+ personas', value: 20 },
  { label: '50+ personas', value: 50 },
]

const PRECIOS = [
  { label: 'Cualquier precio', value: undefined },
  { label: 'Hasta $40.000', value: 40000 },
  { label: 'Hasta $60.000', value: 60000 },
  { label: 'Hasta $100.000', value: 100000 },
]

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días 👋'
  if (h < 20) return 'Buenas tardes 👋'
  return 'Buenas noches 👋'
}

export default function HomePage() {
  const { user } = useAuthStore()
  const [query, setQuery]         = useState('')
  const [pileta, setPileta]       = useState(false)
  const [parrilla, setParrilla]   = useState(false)
  const [quincho, setQuincho]     = useState(false)
  const [paraChicos, setParaChicos] = useState(false)
  const [capIdx, setCapIdx]       = useState(0)
  const [pxIdx, setPxIdx]         = useState(0)

  const filters: EstefindeFilters = {
    capacidad: CAPACIDADES[capIdx].value,
    precioMax: PRECIOS[pxIdx].value,
    pileta:    pileta   || undefined,
    parrilla:  parrilla || undefined,
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['esteFinde', filters],
    queryFn:  () => getEsteFinde(filters),
  })

  const filteredQuintas = useMemo(() => {
    if (!data?.quintas) return []
    return data.quintas.filter(quinta => {
      const q = query.toLowerCase().trim()
      if (q && !quinta.nombre.toLowerCase().includes(q) && !(quinta.direccion ?? '').toLowerCase().includes(q)) return false
      if (quincho    && !quinta.amenities?.includes('quincho'))       return false
      if (paraChicos && !quinta.amenities?.includes('juegos_jardin')) return false
      return true
    })
  }, [data?.quintas, query, quincho, paraChicos])

  const featured = filteredQuintas.slice(0, 4)

  return (
    <div className="max-w-4xl mx-auto px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm text-[#7A6559]">{getGreeting()}</p>
          <h1 className="text-2xl font-bold text-[#4A3020]">Explorá quintas</h1>
        </div>
        {user && (
          <div className="w-10 h-10 rounded-full bg-[#6B4C35] flex items-center justify-center text-white font-bold">
            {user.email?.[0].toUpperCase()}
          </div>
        )}
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 bg-white rounded-2xl px-4 h-11 mb-4 shadow-sm">
        <span className="text-base">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nombre o ciudad..."
          className="flex-1 text-sm text-[#2C1810] placeholder-[#7A6559] bg-transparent outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-[#7A6559] hover:text-[#4A3020] text-sm">✕</button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-1" style={{ scrollbarWidth: 'none' }}>
        <ToggleChip label="🏊 Pileta"    active={pileta}    onClick={() => setPileta(v => !v)} />
        <ToggleChip label="🔥 Parrilla"  active={parrilla}  onClick={() => setParrilla(v => !v)} />
        <ToggleChip label="🏠 Quincho"   active={quincho}   onClick={() => setQuincho(v => !v)} />
        <ToggleChip label="🛝 Para chicos" active={paraChicos} onClick={() => setParaChicos(v => !v)} />
        <div className="w-px bg-[#E8DDD4] mx-1 self-stretch" />
        {CAPACIDADES.map((c, i) => (
          <SelectChip key={c.label} label={c.label} active={capIdx === i} onClick={() => setCapIdx(i)} />
        ))}
        <div className="w-px bg-[#E8DDD4] mx-1 self-stretch" />
        {PRECIOS.map((p, i) => (
          <SelectChip key={p.label} label={p.label} active={pxIdx === i} onClick={() => setPxIdx(i)} />
        ))}
      </div>

      {/* Contenido */}
      {isLoading ? (
        <div className="flex flex-col items-center py-20 gap-3 text-[#7A6559]">
          <div className="w-8 h-8 border-2 border-[#6B4C35] border-t-transparent rounded-full animate-spin" />
          Buscando disponibilidad…
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <p className="text-4xl">⚠️</p>
          <p className="font-bold text-[#4A3020]">No se pudo conectar</p>
          <button onClick={() => refetch()} className="bg-[#6B4C35] text-white px-5 py-2 rounded-xl text-sm font-semibold">
            Reintentar
          </button>
        </div>
      ) : filteredQuintas.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <p className="text-5xl">{query ? '🔍' : '😔'}</p>
          <p className="font-bold text-[#4A3020]">
            {query ? 'Sin resultados' : 'Sin quintas disponibles'}
          </p>
          <p className="text-sm text-[#7A6559] text-center max-w-xs">
            {query
              ? `No hay quintas que coincidan con "${query}".`
              : 'Todas las quintas están reservadas con esos filtros.'}
          </p>
          <button
            onClick={() => { setQuery(''); setPileta(false); setParrilla(false); setQuincho(false); setParaChicos(false); setCapIdx(0); setPxIdx(0) }}
            className="border border-[#E8DDD4] bg-white text-[#4A3020] px-5 py-2 rounded-xl text-sm font-semibold"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          {/* Destacadas */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[17px] font-bold text-[#4A3020]">Destacadas</h2>
            <span className="text-xs text-[#7A6559]">
              {filteredQuintas.length} {filteredQuintas.length === 1 ? 'quinta' : 'quintas'}
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
            {featured.map(q => <FeaturedCard key={q.id} quinta={q} />)}
          </div>

          {/* Todas */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[17px] font-bold text-[#4A3020]">Todas</h2>
            <span className="text-xs font-semibold text-[#4A7C59]">✓ Disponibles este finde</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuintas.map(q => <QuintaCard key={q.id} quinta={q} />)}
          </div>
        </>
      )}
    </div>
  )
}

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-1.5 rounded-full border text-sm font-semibold ${
        active ? 'bg-[#4A3020] border-[#4A3020] text-white' : 'bg-white border-[#E8DDD4] text-[#7A6559]'
      }`}
    >{label}</button>
  )
}

function SelectChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1 rounded-full border text-xs font-medium ${
        active ? 'bg-[#6B4C35] border-[#6B4C35] text-white' : 'bg-white border-[#E8DDD4] text-[#7A6559]'
      }`}
    >{label}</button>
  )
}
