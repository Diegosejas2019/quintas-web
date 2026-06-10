'use client'

import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { getQuintas, getDisponiblesEnFechas } from '@/api/quintas'

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false })

const RADIOS = [
  { label: '5 km',      value: 5 },
  { label: '10 km',     value: 10 },
  { label: '20 km',     value: 20 },
  { label: 'Sin límite', value: 0 },
]

function proxFinde() {
  const today = new Date()
  const dow = today.getDay()
  const diffViernes = (5 - dow + 7) % 7 || 7
  const viernes = new Date(today)
  viernes.setDate(today.getDate() + diffViernes)
  const domingo = new Date(viernes)
  domingo.setDate(viernes.getDate() + 2)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  return { viernes: fmt(viernes), domingo: fmt(domingo) }
}

export default function MapaPage() {
  const { viernes, domingo } = proxFinde()
  const [fechaInicio, setFechaInicio] = useState(viernes)
  const [fechaFin,    setFechaFin]    = useState(domingo)
  const [radioKm,     setRadioKm]     = useState(10)

  const { data: todasQuintas = [] } = useQuery({
    queryKey: ['quintas'],
    queryFn:  getQuintas,
  })

  const { data: disponiblesData } = useQuery({
    queryKey: ['disponibles', fechaInicio, fechaFin],
    queryFn:  () => getDisponiblesEnFechas(fechaInicio, fechaFin),
    enabled:  !!fechaInicio && !!fechaFin,
  })

  const disponiblesIds = useMemo(
    () => new Set((disponiblesData?.quintas ?? []).map(q => q.id)),
    [disponiblesData]
  )

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 72px)' }}>
      {/* Panel de filtros */}
      <div className="bg-white border-b border-[#E8DDD4] px-4 py-3 flex flex-col gap-2 z-10">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[10px] font-bold text-[#7A6559] uppercase block mb-1">Desde</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              className="w-full border border-[#E8DDD4] rounded-xl px-3 py-2 text-sm text-[#2C1810] bg-[#FAF7F2]"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold text-[#7A6559] uppercase block mb-1">Hasta</label>
            <input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              className="w-full border border-[#E8DDD4] rounded-xl px-3 py-2 text-sm text-[#2C1810] bg-[#FAF7F2]"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {RADIOS.map(r => (
            <button
              key={r.value}
              onClick={() => setRadioKm(r.value)}
              className={`flex-1 py-1.5 rounded-full border text-xs font-semibold ${
                radioKm === r.value
                  ? 'bg-[#4A3020] border-[#4A3020] text-white'
                  : 'bg-white border-[#E8DDD4] text-[#7A6559]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div className="absolute bottom-20 left-4 z-20 bg-white/90 rounded-xl px-3 py-2 text-xs flex gap-3 shadow-sm border border-[#E8DDD4]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#4A7C59] inline-block" />
          Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#C0392B] inline-block" />
          Ocupada
        </span>
      </div>

      {/* Mapa */}
      <div className="flex-1">
        <LeafletMap
          quintas={todasQuintas}
          disponiblesIds={disponiblesIds}
          radioKm={radioKm}
        />
      </div>
    </div>
  )
}
