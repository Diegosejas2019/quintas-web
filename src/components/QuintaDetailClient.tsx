'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { getDisponibilidad } from '@/api/quintas'
import { useAuthStore } from '@/store/authStore'
import ReservaModal from '@/components/ReservaModal'
import AlertaModal from '@/components/AlertaModal'
import OpinionModal from '@/components/OpinionModal'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

interface Props {
  quintaId: string
  quintaNombre: string
  precioPorDia: number
}

export default function QuintaDetailClient({ quintaId, quintaNombre, precioPorDia }: Props) {
  const { user } = useAuthStore()
  const router = useRouter()

  const now = new Date()
  const [mes, setMes]   = useState(now.getMonth() + 1)
  const [anio, setAnio] = useState(now.getFullYear())

  const [showReserva, setShowReserva] = useState(false)
  const [showAlerta,  setShowAlerta]  = useState(false)
  const [showOpinion, setShowOpinion] = useState(false)
  const [fechaInicio, setFechaInicio] = useState('')

  const { data } = useQuery({
    queryKey: ['disponibilidad', quintaId, mes, anio],
    queryFn:  () => getDisponibilidad(quintaId, mes, anio),
    enabled:  !!quintaId,
  })

  const diasOcupados = new Set(data?.fechasOcupadas ?? [])
  const diasEnMes    = new Date(anio, mes, 0).getDate()
  const primerDia    = new Date(anio, mes - 1, 1).getDay()

  const prevMes = () => mes === 1 ? (setMes(12), setAnio(a => a - 1)) : setMes(m => m - 1)
  const nextMes = () => mes === 12 ? (setMes(1), setAnio(a => a + 1)) : setMes(m => m + 1)

  const requireAuth = (action: () => void) => {
    if (!user) { router.push('/auth/login'); return }
    action()
  }

  const handleDayClick = (dateStr: string, ocupado: boolean) => {
    if (ocupado) return
    requireAuth(() => {
      setFechaInicio(dateStr)
      setShowReserva(true)
    })
  }

  return (
    <>
      {/* Calendario */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
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
            const pasado = new Date(dateStr + 'T12:00:00') < hoy && !esHoy
            return (
              <button
                key={dia}
                onClick={() => !pasado && handleDayClick(dateStr, ocupado)}
                disabled={pasado}
                className={`aspect-square flex items-center justify-center rounded-lg text-xs transition-colors ${
                  ocupado ? 'bg-red-100 text-red-600 font-semibold cursor-not-allowed' :
                  pasado  ? 'text-[#C5B8B0] cursor-not-allowed' :
                  esHoy   ? 'bg-[#6B4C35] text-white font-bold cursor-pointer' :
                            'text-[#2C1810] hover:bg-[#F5EFE9] cursor-pointer'
                }`}
              >
                {dia}
              </button>
            )
          })}
        </div>
        <div className="flex gap-4 mt-3">
          <span className="text-[10px] text-[#7A6559]">⬜ Disponible — tocá para reservar</span>
          <span className="text-[10px] text-red-500">🟥 Ocupado</span>
        </div>
      </div>

      {/* Alerta CTA */}
      <div className="mx-0 mb-5 bg-[#E8F0EB] rounded-2xl p-4 border border-[#B7D9C2]">
        <p className="text-sm font-bold text-[#4A7C59] mb-1">🔔 ¿Fecha ocupada?</p>
        <p className="text-xs text-[#3A6B4A] leading-5 mb-3">
          Activá una alerta y te avisamos cuando se libere.
        </p>
        <button
          onClick={() => requireAuth(() => setShowAlerta(true))}
          className="w-full bg-[#4A7C59] text-white py-3 rounded-xl font-semibold text-sm"
        >
          Activar alerta
        </button>
      </div>

      {/* Escribir reseña */}
      <div className="mb-5">
        <button
          onClick={() => requireAuth(() => setShowOpinion(true))}
          className="w-full border-2 border-dashed border-[#E8DDD4] rounded-2xl py-4 text-sm text-[#7A6559] hover:border-[#6B4C35]"
        >
          ✍️ Escribir una reseña
        </button>
      </div>

      {/* Sticky reserve bar */}
      <div className="fixed left-0 right-0 z-40 bg-white/95 border-t border-[#E8DDD4] px-5 py-3 flex items-center justify-between" style={{ bottom: 'calc(60px + env(safe-area-inset-bottom))' }}>
        <div>
          <p className="text-xl font-bold text-[#4A3020]">
            ${precioPorDia.toLocaleString('es-AR')}
            <span className="text-sm font-normal text-[#7A6559]"> / noche</span>
          </p>
        </div>
        <button
          onClick={() => requireAuth(() => { setFechaInicio(''); setShowReserva(true) })}
          className="bg-[#6B4C35] text-white font-bold px-7 py-3.5 rounded-2xl"
        >
          Reservar
        </button>
      </div>

      {showReserva && (
        <ReservaModal
          quintaId={quintaId}
          quintaNombre={quintaNombre}
          precioPorDia={precioPorDia}
          fechaInicioDefault={fechaInicio}
          onClose={() => setShowReserva(false)}
        />
      )}
      {showAlerta  && <AlertaModal  quintaId={quintaId} onClose={() => setShowAlerta(false)} />}
      {showOpinion && <OpinionModal quintaId={quintaId} onClose={() => setShowOpinion(false)} />}
    </>
  )
}
