'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getReservasAdmin } from '@/api/admin/reservas'
import type { EstadoReserva } from '@/types/types'

const ESTADOS: { label: string; value?: EstadoReserva }[] = [
  { label: 'Todas' },
  { label: 'Pendientes', value: 'Pendiente' },
  { label: 'Confirmadas', value: 'Confirmada' },
  { label: 'Finalizadas', value: 'Finalizada' },
  { label: 'Canceladas', value: 'Cancelada' },
]

const ESTADO_COLORS: Record<EstadoReserva, { bg: string; text: string }> = {
  Pendiente:  { bg: '#FEF3C7', text: '#92400E' },
  Confirmada: { bg: '#D1FAE5', text: '#065F46' },
  Finalizada: { bg: '#F3F4F6', text: '#374151' },
  Cancelada:  { bg: '#FEE2E2', text: '#991B1B' },
}

export default function AdminReservasPage() {
  const [filtro, setFiltro] = useState<EstadoReserva | undefined>()

  const { data: reservas = [], isLoading } = useQuery({
    queryKey: ['admin-reservas', filtro],
    queryFn: () => getReservasAdmin(filtro),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#4A3020]">Reservas</h1>
        <Link
          href="/admin/reservas/nueva"
          className="bg-[#C4633A] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#b05530] transition-colors"
        >
          + Nueva
        </Link>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {ESTADOS.map(e => (
          <button
            key={e.label}
            onClick={() => setFiltro(e.value)}
            className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              filtro === e.value
                ? 'bg-[#4A3020] text-white'
                : 'bg-white text-[#7A6559] border border-[#E8DDD4] hover:border-[#4A3020]'
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#6B4C35] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reservas.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📅</p>
          <p className="font-semibold text-[#4A3020]">No hay reservas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservas.map(r => (
            <Link
              key={r.id}
              href={`/admin/reservas/${r.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-[#2C1810]">{r.nombreCliente}</p>
                  <p className="text-sm text-gray-500">{r.nombreQuinta}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.fechaInicio).toLocaleDateString('es-AR')} → {new Date(r.fechaFin).toLocaleDateString('es-AR')}
                    {' · '}{r.cantidadDias} día{r.cantidadDias !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-sm font-bold text-[#C4633A]">${r.precioTotal.toLocaleString('es-AR')}</p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: ESTADO_COLORS[r.estado].bg, color: ESTADO_COLORS[r.estado].text }}
                  >{r.estado}</span>
                  {r.sena && <span className="text-xs text-green-600">Seña ✓</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
