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

const ESTADO_COLORS: Record<EstadoReserva, string> = {
  Pendiente: 'bg-yellow-100 text-yellow-700',
  Confirmada: 'bg-green-100 text-green-700',
  Finalizada: 'bg-blue-100 text-blue-700',
  Cancelada: 'bg-gray-100 text-gray-500',
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
        <h1 className="text-xl font-bold text-[#2C1810]">Reservas</h1>
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
                ? 'bg-[#2C1810] text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-[#C4633A]'
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#C4633A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reservas.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📅</p>
          <p className="font-semibold text-[#2C1810]">No hay reservas</p>
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
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ESTADO_COLORS[r.estado]}`}>{r.estado}</span>
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
