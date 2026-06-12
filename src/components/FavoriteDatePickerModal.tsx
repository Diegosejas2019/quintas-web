'use client'

import { useState, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import type { DateRange } from 'react-day-picker'
import { es } from 'date-fns/locale'
import Image from 'next/image'

interface Props {
  quintaId: string
  quintaNombre: string
  imagenUrl?: string
  promedio?: number
  totalOpiniones?: number
  onClose: () => void
  onConfirm: (desde: string, hasta: string) => void
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function promedioLabel(p: number): string {
  if (p >= 9) return 'Fantástico'
  if (p >= 8) return 'Muy bien'
  if (p >= 7) return 'Bien'
  if (p >= 6) return 'Aceptable'
  return 'Regular'
}

export default function FavoriteDatePickerModal({ quintaNombre, imagenUrl, promedio, totalOpiniones, onClose, onConfirm }: Props) {
  const [range, setRange] = useState<DateRange | undefined>(undefined)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleConfirm = () => {
    if (!range?.from || !range?.to) return
    onConfirm(toIso(range.from), toIso(range.to))
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#E8DDD4]">
        <button onClick={onClose} className="text-[#7A6559] text-lg font-bold px-1">←</button>
        <span className="text-sm font-semibold text-[#2C1810]">Seleccionar fechas</span>
        <div className="w-8" />
      </div>

      {/* Calendar scrollable */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          locale={es}
          disabled={{ before: new Date() }}
          numberOfMonths={2}
          style={{
            '--rdp-accent-color': '#1e3a6e',
            '--rdp-accent-background-color': '#dbe8f5',
          } as React.CSSProperties}
        />
      </div>

      {/* Ficha de la quinta fija al pie */}
      <div className="border-t border-[#E8DDD4] bg-white px-5 py-3">
        <div className="flex items-center gap-3 mb-3">
          {imagenUrl ? (
            <Image
              src={imagenUrl}
              alt={quintaNombre}
              width={56}
              height={56}
              className="rounded-xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-[#E8DDD4] flex-shrink-0" />
          )}
          <div className="min-w-0">
            <p className="font-semibold text-[#2C1810] text-sm truncate">{quintaNombre}</p>
            {promedio && promedio > 0 ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="bg-[#1e3a6e] text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  {promedio.toFixed(1)}
                </span>
                <span className="text-xs text-[#7A6559]">
                  {promedioLabel(promedio)}{totalOpiniones ? ` · ${totalOpiniones} reseñas` : ''}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <p className="text-xs text-[#7A6559] mb-3">Indica las fechas para el alojamiento guardado</p>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!range?.from || !range?.to}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-colors disabled:bg-[#D1C4B8] disabled:text-white bg-[#1e3a6e] text-white hover:bg-[#162e5a]"
        >
          Seleccionar fechas
        </button>
      </div>
    </div>
  )
}
