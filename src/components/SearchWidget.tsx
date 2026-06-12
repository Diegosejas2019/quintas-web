'use client'

import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import type { DateRange } from 'react-day-picker'
import { es } from 'date-fns/locale'
import type { EstefindeFilters } from '@/types/types'

interface Props {
  onSearch: (filters: EstefindeFilters) => void
}

const CAPACIDADES = [
  { label: 'Cualquier tamaño', value: undefined },
  { label: '10+ personas',     value: 10 },
  { label: '20+ personas',     value: 20 },
  { label: '50+ personas',     value: 50 },
]

function formatRange(range: DateRange | undefined): string {
  if (!range?.from) return 'Seleccioná las fechas'
  const fmt = (d: Date) => d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
  if (!range.to) return fmt(range.from)
  return `${fmt(range.from)} — ${fmt(range.to)}`
}

function toIso(d: Date): string {
  return d.toISOString().split('T')[0]
}

export default function SearchWidget({ onSearch }: Props) {
  const [query, setQuery]       = useState('')
  const [range, setRange]       = useState<DateRange | undefined>(undefined)
  const [capIdx, setCapIdx]     = useState(0)
  const [showCal, setShowCal]   = useState(false)
  const calRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (calRef.current && !calRef.current.contains(e.target as Node)) {
        setShowCal(false)
      }
    }
    if (showCal) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showCal])

  const handleSearch = () => {
    onSearch({
      capacidad:   CAPACIDADES[capIdx].value,
      fechaInicio: range?.from ? toIso(range.from) : undefined,
      fechaFin:    range?.to   ? toIso(range.to)   : undefined,
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8DDD4] overflow-visible mb-4">
      {/* Fila 1: Destino */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E8DDD4]">
        <span className="text-base text-[#7A6559]">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="¿Dónde? Buscar por nombre o ciudad..."
          className="flex-1 text-sm text-[#2C1810] placeholder-[#7A6559] bg-transparent outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-[#7A6559] hover:text-[#4A3020] text-xs">✕</button>
        )}
      </div>

      {/* Fila 2: Fechas */}
      <div className="relative border-b border-[#E8DDD4]">
        <button
          type="button"
          onClick={() => setShowCal(v => !v)}
          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <span className="text-base text-[#7A6559]">📅</span>
          <span className={`text-sm ${range?.from ? 'text-[#2C1810]' : 'text-[#7A6559]'}`}>
            {formatRange(range)}
          </span>
          {range?.from && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setRange(undefined) }}
              className="ml-auto text-[#7A6559] hover:text-[#4A3020] text-xs"
            >✕</button>
          )}
        </button>

        {showCal && (
          <div
            ref={calRef}
            className="absolute top-full left-0 z-50 mt-1 bg-white rounded-2xl shadow-lg border border-[#E8DDD4] p-3"
          >
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              locale={es}
              disabled={{ before: new Date() }}
              numberOfMonths={1}
            />
          </div>
        )}
      </div>

      {/* Fila 3: Capacidad */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-base text-[#7A6559]">👥</span>
        <select
          value={capIdx}
          onChange={e => setCapIdx(Number(e.target.value))}
          className="flex-1 text-sm text-[#2C1810] bg-transparent outline-none cursor-pointer"
        >
          {CAPACIDADES.map((c, i) => (
            <option key={c.label} value={i}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Botón Buscar */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleSearch}
          className="w-full bg-[#6B4C35] hover:bg-[#4A3020] text-white font-bold py-3 rounded-xl text-sm transition-colors"
        >
          Buscar
        </button>
      </div>
    </div>
  )
}
