'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getDisponibilidad } from '@/api/quintas'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function AvailabilityCalendar({ quintaId }: { quintaId: string }) {
  const now = new Date()
  const [mes, setMes]   = useState(now.getMonth() + 1)
  const [anio, setAnio] = useState(now.getFullYear())

  const { data } = useQuery({
    queryKey: ['disponibilidad', quintaId, mes, anio],
    queryFn:  () => getDisponibilidad(quintaId, mes, anio),
    enabled:  !!quintaId,
  })

  const diasOcupados  = new Set(data?.fechasOcupadas ?? [])
  const diasEnMes     = new Date(anio, mes, 0).getDate()
  const primerDia     = new Date(anio, mes - 1, 1).getDay()

  const prevMes = () => mes === 1 ? (setMes(12), setAnio(a => a - 1)) : setMes(m => m - 1)
  const nextMes = () => mes === 12 ? (setMes(1), setAnio(a => a + 1)) : setMes(m => m + 1)

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <button onClick={prevMes} className="text-xl px-2 text-[#7A6559] hover:text-[#4A3020]">‹</button>
        <span className="font-bold text-[#4A3020]">{MESES[mes - 1]} {anio}</span>
        <button onClick={nextMes} className="text-xl px-2 text-[#7A6559] hover:text-[#4A3020]">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {['D','L','M','X','J','V','S'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-[#7A6559] uppercase py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: primerDia }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: diasEnMes }, (_, i) => i + 1).map(dia => {
          const dateStr = `${anio}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`
          const ocupado = diasOcupados.has(dateStr)
          const hoy = new Date()
          const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() + 1 && anio === hoy.getFullYear()
          return (
            <div key={dia}
              className={`aspect-square flex items-center justify-center rounded-lg text-xs ${
                ocupado ? 'bg-red-100 text-red-600 font-semibold' :
                esHoy   ? 'bg-[#6B4C35] text-white font-bold'     : 'text-[#2C1810]'
              }`}
            >
              {dia}
            </div>
          )
        })}
      </div>
      <div className="flex gap-4 mt-3">
        <span className="text-[10px] text-[#7A6559]">⬜ Disponible</span>
        <span className="text-[10px] text-red-500">🟥 Ocupado</span>
      </div>
    </div>
  )
}
