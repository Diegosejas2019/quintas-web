'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getEsteFinde } from '@/api/quintas'
import QuintaCard from '@/components/QuintaCard'
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

function formatFinde(viernes: string, domingo: string) {
  const v = new Date(viernes + 'T12:00:00')
  const d = new Date(domingo + 'T12:00:00')
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
  return `${v.getDate()} al ${d.getDate()} de ${meses[d.getMonth()]}`
}

export default function HomePage() {
  const [pileta, setPileta]     = useState(false)
  const [parrilla, setParrilla] = useState(false)
  const [capIdx, setCapIdx]     = useState(0)
  const [pxIdx, setPxIdx]       = useState(0)

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

  return (
    <div className="max-w-4xl mx-auto px-5 py-6">
      <div className="mb-5">
        <p className="text-sm text-[#7A6559]">Próximo fin de semana</p>
        <h1 className="text-2xl font-bold text-[#4A3020]">
          {data ? formatFinde(data.viernes, data.domingo) : '…'}
        </h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <ToggleChip label="🏊 Pileta"   active={pileta}   onClick={() => setPileta(v => !v)} />
        <ToggleChip label="🔥 Parrilla" active={parrilla} onClick={() => setParrilla(v => !v)} />
        <div className="w-px bg-[#E8DDD4] mx-1" />
        {CAPACIDADES.map((c, i) => (
          <SelectChip key={c.label} label={c.label} active={capIdx === i} onClick={() => setCapIdx(i)} />
        ))}
        <div className="w-px bg-[#E8DDD4] mx-1" />
        {PRECIOS.map((p, i) => (
          <SelectChip key={p.label} label={p.label} active={pxIdx === i} onClick={() => setPxIdx(i)} />
        ))}
      </div>

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
      ) : data?.quintas.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <p className="text-5xl">😔</p>
          <p className="font-bold text-[#4A3020]">Sin quintas disponibles</p>
          <p className="text-sm text-[#7A6559] text-center max-w-xs">
            Todas las quintas están reservadas con esos filtros.
          </p>
          <button
            onClick={() => { setPileta(false); setParrilla(false); setCapIdx(0); setPxIdx(0) }}
            className="border border-[#E8DDD4] bg-white text-[#4A3020] px-5 py-2 rounded-xl text-sm font-semibold"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs font-semibold text-[#7A6559] mb-4">
            {data!.total} {data!.total === 1 ? 'quinta disponible' : 'quintas disponibles'} &middot;{' '}
            <span className="text-[#4A7C59]">&#x2713; Viernes a domingo</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data!.quintas.map((q) => <QuintaCard key={q.id} quinta={q} />)}
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
