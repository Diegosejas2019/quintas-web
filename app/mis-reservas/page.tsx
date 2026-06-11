'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getMisReservas } from '@/api/reservas'
import { useAuthStore } from '@/store/authStore'
import type { MiReserva, EstadoReserva } from '@/types/types'

const MESES_CORTOS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function formatRango(inicio: string, fin: string) {
  const d1 = new Date(inicio + 'T12:00:00')
  const d2 = new Date(fin + 'T12:00:00')
  if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
    return `${d1.getDate()}–${d2.getDate()} ${MESES_CORTOS[d1.getMonth()]} ${d1.getFullYear()}`
  }
  return `${d1.getDate()} ${MESES_CORTOS[d1.getMonth()]} – ${d2.getDate()} ${MESES_CORTOS[d2.getMonth()]} ${d2.getFullYear()}`
}

const ESTADO_COLORS: Record<EstadoReserva, { bg: string; text: string }> = {
  Pendiente:  { bg: '#FEF3C7', text: '#92400E' },
  Confirmada: { bg: '#D1FAE5', text: '#065F46' },
  Finalizada: { bg: '#F3F4F6', text: '#374151' },
  Cancelada:  { bg: '#FEE2E2', text: '#991B1B' },
}

function isProxima(r: MiReserva): boolean {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fin = new Date(r.fechaFin + 'T12:00:00')
  return fin >= hoy && (r.estado === 'Pendiente' || r.estado === 'Confirmada')
}

function ReservaCard({ r }: { r: MiReserva }) {
  const est = ESTADO_COLORS[r.estado]
  return (
    <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between mb-1">
        <p className="text-sm font-semibold text-[#4A3020] flex-1 mr-3 truncate">{r.quintaNombre}</p>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ backgroundColor: est.bg, color: est.text }}
        >
          {r.estado}
        </span>
      </div>
      <p className="text-xs text-[#7A6559] mb-1">📅 {formatRango(r.fechaInicio, r.fechaFin)}</p>
      <p className="text-xs font-semibold text-[#6B4C35]">${r.precioTotal.toLocaleString('es-AR')}</p>
    </div>
  )
}

export default function MisReservasPage() {
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['mis-reservas'],
    queryFn: getMisReservas,
    enabled: !!user,
  })

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-5 py-16 flex flex-col items-center text-center">
        <span className="text-5xl mb-4">📋</span>
        <h1 className="text-xl font-bold text-[#4A3020] mb-2">Mis reservas</h1>
        <p className="text-sm text-[#7A6559] mb-6">Iniciá sesión para ver tu historial de reservas.</p>
        <Link href="/auth/login"
          className="bg-[#6B4C35] text-white font-bold px-8 py-3.5 rounded-2xl w-full text-center text-sm">
          Iniciar sesión
        </Link>
      </div>
    )
  }

  const proximas = (data ?? []).filter(isProxima)
  const historial = (data ?? []).filter(r => !isProxima(r))

  return (
    <div className="max-w-lg mx-auto px-5 py-6">
      <h1 className="text-2xl font-bold text-[#4A3020] mb-5">Mis reservas</h1>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-[#6B4C35] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (data ?? []).length === 0 ? (
        <div className="flex flex-col items-center text-center py-16">
          <span className="text-5xl mb-3">🏡</span>
          <p className="text-base font-semibold text-[#4A3020] mb-1">Todavía no tenés reservas</p>
          <p className="text-sm text-[#7A6559]">Explorá las quintas disponibles y hacé tu primera reserva.</p>
        </div>
      ) : (
        <>
          {proximas.length > 0 && (
            <section className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7A6559] mb-3">📅 Próximas</p>
              {proximas.map(r => <ReservaCard key={r.id} r={r} />)}
            </section>
          )}
          {historial.length > 0 && (
            <section>
              <p className="text-xs font-bold uppercase tracking-wider text-[#7A6559] mb-3">📋 Historial</p>
              {historial.map(r => <ReservaCard key={r.id} r={r} />)}
            </section>
          )}
        </>
      )}
    </div>
  )
}
