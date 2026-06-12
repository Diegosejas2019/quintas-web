'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { getEsteFinde } from '@/api/quintas'
import QuintaCard from '@/components/QuintaCard'
import FeaturedCard from '@/components/FeaturedCard'
import AppHeader from '@/components/AppHeader'
import SearchWidget from '@/components/SearchWidget'
import type { EstefindeFilters } from '@/types/types'

const PRECIOS = [
  { label: 'Cualquier precio', value: undefined },
  { label: 'Hasta $40.000',    value: 40000 },
  { label: 'Hasta $60.000',    value: 60000 },
  { label: 'Hasta $100.000',   value: 100000 },
]

export default function HomePage() {
  const [filters, setFilters]     = useState<EstefindeFilters>({})
  const [pileta, setPileta]       = useState(false)
  const [parrilla, setParrilla]   = useState(false)
  const [quincho, setQuincho]     = useState(false)
  const [paraChicos, setParaChicos] = useState(false)
  const [fiestas, setFiestas]     = useState(false)
  const [eventos, setEventos]     = useState(false)
  const [pxIdx, setPxIdx]         = useState(0)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['esteFinde', filters],
    queryFn:  () => getEsteFinde(filters),
  })

  const filteredQuintas = useMemo(() => {
    if (!data?.quintas) return []
    return data.quintas.filter(quinta => {
      if (pileta     && !quinta.pileta)                                      return false
      if (parrilla   && !quinta.parrilla)                                    return false
      if (quincho    && !quinta.amenities?.includes('quincho'))               return false
      if (paraChicos && !quinta.amenities?.includes('juegos_jardin'))         return false
      if (fiestas    && !quinta.amenities?.includes('fiestas'))               return false
      if (eventos    && !quinta.amenities?.includes('eventos'))               return false
      const px = PRECIOS[pxIdx].value
      if (px != null && quinta.precioPorDia > px)                            return false
      return true
    })
  }, [data?.quintas, pileta, parrilla, quincho, paraChicos, fiestas, eventos, pxIdx])

  const featured = filteredQuintas.slice(0, 4)

  const clearAllFilters = () => {
    setPileta(false); setParrilla(false); setQuincho(false)
    setParaChicos(false); setFiestas(false); setEventos(false)
    setPxIdx(0)
  }

  return (
    <>
      <AppHeader />
      <div className="max-w-4xl mx-auto px-5 py-4">
        <SearchWidget onSearch={setFilters} />

        {/* Chips secundarios de amenities y precio */}
        <div className="flex gap-2 overflow-x-auto mb-6 pb-1" style={{ scrollbarWidth: 'none' }}>
          <ToggleChip label="🏊 Pileta"      active={pileta}      onClick={() => setPileta(v => !v)} />
          <ToggleChip label="🔥 Parrilla"    active={parrilla}    onClick={() => setParrilla(v => !v)} />
          <ToggleChip label="🏠 Quincho"     active={quincho}     onClick={() => setQuincho(v => !v)} />
          <ToggleChip label="🛝 Para chicos" active={paraChicos}  onClick={() => setParaChicos(v => !v)} />
          <ToggleChip label="🎉 Fiestas"     active={fiestas}     onClick={() => setFiestas(v => !v)} />
          <ToggleChip label="📅 Eventos"     active={eventos}     onClick={() => setEventos(v => !v)} />
          <div className="w-px bg-[#E8DDD4] mx-1 self-stretch" />
          {PRECIOS.map((p, i) => (
            <SelectChip key={p.label} label={p.label} active={pxIdx === i} onClick={() => setPxIdx(i)} />
          ))}
        </div>

        {/* Resultados */}
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
            <p className="text-5xl">😔</p>
            <p className="font-bold text-[#4A3020]">Sin quintas disponibles</p>
            <p className="text-sm text-[#7A6559] text-center max-w-xs">
              Todas las quintas están reservadas con esos filtros.
            </p>
            <button
              onClick={clearAllFilters}
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
              <span className="text-xs font-semibold text-[#4A7C59]">✓ Disponibles</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuintas.map(q => <QuintaCard key={q.id} quinta={q} />)}
            </div>
          </>
        )}
      </div>
    </>
  )
}

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-1.5 rounded-full border text-sm font-semibold whitespace-nowrap ${
        active ? 'bg-[#4A3020] border-[#4A3020] text-white' : 'bg-white border-[#E8DDD4] text-[#7A6559]'
      }`}
    >{label}</button>
  )
}

function SelectChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap ${
        active ? 'bg-[#6B4C35] border-[#6B4C35] text-white' : 'bg-white border-[#E8DDD4] text-[#7A6559]'
      }`}
    >{label}</button>
  )
}
