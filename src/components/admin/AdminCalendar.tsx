'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDisponibilidad } from '@/api/quintas'
import { getQuintasAdmin, bloquearFechas } from '@/api/admin/quintas'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function AdminCalendar({ quintaId }: { quintaId: string }) {
  const now = new Date()
  const [mes, setMes] = useState(now.getMonth() + 1)
  const [anio, setAnio] = useState(now.getFullYear())
  const [bloqueadas, setBloqueadas] = useState<Set<string>>(new Set())
  const [pendingChanges, setPendingChanges] = useState(false)
  const qc = useQueryClient()

  const { data: quintas } = useQuery({
    queryKey: ['admin-quintas'],
    queryFn: getQuintasAdmin,
  })

  const { data: disponibilidad, isLoading } = useQuery({
    queryKey: ['disponibilidad', quintaId, mes, anio],
    queryFn: () => getDisponibilidad(quintaId, mes, anio),
    enabled: !!quintaId,
  })

  useEffect(() => {
    const quinta = quintas?.find(q => q.id === quintaId)
    if (quinta) {
      setBloqueadas(new Set(quinta.fechasBloqueadas ?? []))
      setPendingChanges(false)
    }
  }, [quintas, quintaId])

  const saveMutation = useMutation({
    mutationFn: () => bloquearFechas(quintaId, [...bloqueadas]),
    onSuccess: () => {
      setPendingChanges(false)
      qc.invalidateQueries({ queryKey: ['admin-quintas'] })
    },
  })

  const reservadas = new Set(disponibilidad?.fechasOcupadas ?? [])
  const diasEnMes = new Date(anio, mes, 0).getDate()
  const primerDia = new Date(anio, mes - 1, 1).getDay()

  const prevMes = () => mes === 1 ? (setMes(12), setAnio(a => a - 1)) : setMes(m => m - 1)
  const nextMes = () => mes === 12 ? (setMes(1), setAnio(a => a + 1)) : setMes(m => m + 1)

  const toggleDia = (dateStr: string) => {
    if (reservadas.has(dateStr)) return
    setBloqueadas(prev => {
      const next = new Set(prev)
      if (next.has(dateStr)) next.delete(dateStr)
      else next.add(dateStr)
      return next
    })
    setPendingChanges(true)
  }

  return (
    <div>
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
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-4 border-[#6B4C35] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {Array.from({ length: primerDia }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: diasEnMes }, (_, i) => i + 1).map(dia => {
              const dateStr = `${anio}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`
              const esReservada = reservadas.has(dateStr)
              const esBloqueada = bloqueadas.has(dateStr)
              const hoy = new Date()
              const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() + 1 && anio === hoy.getFullYear()

              let cls = 'text-[#2C1810]'
              if (esReservada) cls = 'bg-red-100 text-red-600 font-semibold pointer-events-none'
              else if (esBloqueada) cls = 'bg-[#E8DDD4] text-[#6B4C35] font-semibold cursor-pointer'
              else if (esHoy) cls = 'bg-[#6B4C35] text-white font-bold cursor-pointer'
              else cls = 'text-[#2C1810] hover:bg-[#F5EFE9] cursor-pointer'

              return (
                <div key={dia}
                  onClick={() => toggleDia(dateStr)}
                  className={`aspect-square flex items-center justify-center rounded-lg text-xs ${cls}`}
                >
                  {dia}
                </div>
              )
            })}
          </div>
        )}

        {/* Leyenda */}
        <div className="flex gap-4 mt-3 flex-wrap">
          <span className="text-[10px] text-[#7A6559] flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded border border-[#E8DDD4]" /> Disponible
          </span>
          <span className="text-[10px] text-red-500 flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-red-100" /> Reservado
          </span>
          <span className="text-[10px] text-[#6B4C35] flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-[#E8DDD4]" /> Bloqueado por vos
          </span>
        </div>
      </div>

      {pendingChanges && (
        <div className="mt-4">
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="w-full py-3 rounded-2xl bg-[#4A3020] text-white font-semibold text-sm disabled:opacity-60"
          >
            {saveMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {saveMutation.isError && (
            <p className="text-red-500 text-sm mt-2 text-center">Error al guardar. Intentá de nuevo.</p>
          )}
        </div>
      )}

      <p className="text-xs text-[#7A6559] mt-3 text-center">
        Tocá un día para bloquearlo o desbloquearlo. Los días reservados por clientes no se pueden modificar.
      </p>
    </div>
  )
}
