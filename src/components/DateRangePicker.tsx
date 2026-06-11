'use client'

import { useState } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { es } from 'react-day-picker/locale'

interface Props {
  fechaInicio: string
  fechaFin: string
  onChangeFechaInicio: (v: string) => void
  onChangeFechaFin: (v: string) => void
}

function toDate(str: string): Date | undefined {
  if (!str) return undefined
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toStr(d: Date | undefined): string {
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function DateRangePicker({ fechaInicio, fechaFin, onChangeFechaInicio, onChangeFechaFin }: Props) {
  const [open, setOpen] = useState(false)

  const from = toDate(fechaInicio)
  const to   = toDate(fechaFin)

  const range: DateRange = { from, to }

  const handleSelect = (r: DateRange | undefined) => {
    onChangeFechaInicio(toStr(r?.from))
    onChangeFechaFin(toStr(r?.to))
    if (r?.from && r?.to) setOpen(false)
  }

  const label = fechaInicio && fechaFin
    ? `${fechaInicio}  →  ${fechaFin}`
    : fechaInicio
    ? `${fechaInicio}  →  …`
    : 'Seleccioná las fechas'

  return (
    <div className="relative mb-3">
      <label className="text-xs font-bold text-[#7A6559] uppercase block mb-1.5">Fechas</label>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="border border-[#E8DDD4] rounded-xl px-3 py-3 w-full bg-[#FAF5F0] text-left text-sm text-[#2C1810]"
      >
        {label}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 bg-white rounded-2xl shadow-xl border border-[#E8DDD4] p-3 left-1/2 -translate-x-1/2">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            locale={es}
            disabled={{ before: new Date() }}
            numberOfMonths={1}
            style={{
              '--rdp-accent-color': '#6B4C35',
              '--rdp-accent-background-color': '#F5EFE9',
            } as React.CSSProperties}
          />
          {(fechaInicio || fechaFin) && (
            <button
              type="button"
              onClick={() => { onChangeFechaInicio(''); onChangeFechaFin(''); }}
              className="w-full text-xs text-[#7A6559] mt-1 py-1"
            >
              Limpiar
            </button>
          )}
        </div>
      )}
    </div>
  )
}
