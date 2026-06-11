'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getDashboard } from '@/api/admin/dashboard'

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getDashboard,
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2C1810]">Bienvenido 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen de tu operación</p>
      </div>

      {/* Ingresos */}
      <div className="bg-[#2C1810] rounded-2xl p-6 mb-4">
        <p className="text-[#F5EDD8] text-xs font-semibold mb-1">INGRESOS ESTE MES</p>
        <p className="text-white text-3xl font-bold">
          {isLoading ? '—' : `$${(data?.ingresosEsteMes ?? 0).toLocaleString('es-AR')}`}
        </p>
        <p className="text-[#9E7E6E] text-sm mt-2">
          Total acumulado: ${(data?.ingresosTotales ?? 0).toLocaleString('es-AR')}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Quintas', value: data?.totalQuintas, color: '#2C1810' },
          { label: 'Pendientes', value: data?.reservasPendientes, color: '#D97706' },
          { label: 'Confirmadas', value: data?.reservasConfirmadas, color: '#059669' },
          { label: 'Finalizadas', value: data?.reservasFinalizadas, color: '#4F46E5' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold" style={{ color: s.color }}>
              {isLoading ? '—' : (s.value ?? 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <p className="text-base font-bold text-[#2C1810] mb-3">Acciones rápidas</p>
      <div className="flex gap-3">
        <Link
          href="/admin/reservas/nueva"
          className="flex-1 bg-[#C4633A] text-white rounded-xl py-3 text-sm font-semibold text-center hover:bg-[#b05530] transition-colors"
        >
          + Nueva Reserva
        </Link>
        <Link
          href="/admin/quintas/nueva"
          className="flex-1 bg-[#F5EDD8] text-[#C4633A] rounded-xl py-3 text-sm font-semibold text-center hover:bg-[#ede5cc] transition-colors"
        >
          + Nueva Quinta
        </Link>
      </div>
    </div>
  )
}
