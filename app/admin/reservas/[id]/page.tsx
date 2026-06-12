'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReservasAdmin, cancelarReserva, confirmarReserva, finalizarReserva, registrarSena } from '@/api/admin/reservas'
import type { RegistrarSenaDto } from '@/api/admin/reservas'

const ESTADO_COLORS: Record<string, string> = {
  Pendiente: 'bg-yellow-100 text-yellow-700',
  Confirmada: 'bg-green-100 text-green-700',
  Finalizada: 'bg-blue-100 text-blue-700',
  Cancelada: 'bg-gray-100 text-gray-500',
}

export default function ReservaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const qc = useQueryClient()
  const [showSena, setShowSena] = useState(false)
  const [error, setError] = useState('')

  const [senaMonto, setSenaMonto] = useState('')
  const [senaTipo, setSenaTipo] = useState<'Fijo' | 'Porcentaje'>('Fijo')
  const [senaPorcentaje, setSenaPorcentaje] = useState('')
  const [senaFecha, setSenaFecha] = useState(new Date().toISOString().split('T')[0])
  const [senaMetodo, setSenaMetodo] = useState('Transferencia')

  const { data: reservas = [], isLoading } = useQuery({
    queryKey: ['admin-reservas'],
    queryFn: () => getReservasAdmin(),
  })

  const reserva = reservas.find(r => r.id === id)

  const confirmarMutation = useMutation({
    mutationFn: () => confirmarReserva(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-reservas'] }),
    onError: () => setError('Error al confirmar'),
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelarReserva(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-reservas'] }); router.push('/admin/reservas') },
    onError: () => setError('Error al cancelar'),
  })

  const finalizarMutation = useMutation({
    mutationFn: () => finalizarReserva(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-reservas'] }),
    onError: () => setError('Error al finalizar'),
  })

  const senaMutation = useMutation({
    mutationFn: (body: RegistrarSenaDto) => registrarSena(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-reservas'] })
      setShowSena(false)
    },
    onError: () => setError('Error al registrar seña'),
  })

  const handleSena = (e: React.FormEvent) => {
    e.preventDefault()
    senaMutation.mutate({
      monto: Number(senaMonto),
      tipo: senaTipo,
      porcentaje: senaTipo === 'Porcentaje' ? Number(senaPorcentaje) : undefined,
      fechaPago: senaFecha,
      metodoPago: senaMetodo,
    })
  }

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#C4633A] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!reserva) return (
    <div className="text-center py-20"><p className="text-gray-500">Reserva no encontrada</p></div>
  )

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-[#C4633A] text-sm">← Volver</button>
        <h1 className="text-xl font-bold text-[#2C1810]">Reserva</h1>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-[#2C1810]">{reserva.nombreCliente}</p>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${ESTADO_COLORS[reserva.estado]}`}>{reserva.estado}</span>
        </div>
        <p className="text-sm text-gray-500">{reserva.nombreQuinta}</p>
        <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
          <p><span className="text-gray-400">Email:</span> {reserva.emailCliente}</p>
          <p><span className="text-gray-400">Tel:</span> {reserva.telefonoCliente}</p>
          <p><span className="text-gray-400">Fechas:</span> {new Date(reserva.fechaInicio).toLocaleDateString('es-AR')} → {new Date(reserva.fechaFin).toLocaleDateString('es-AR')}</p>
          <p><span className="text-gray-400">Días:</span> {reserva.cantidadDias}</p>
          <p><span className="text-gray-400">Total:</span> <span className="font-bold text-[#C4633A]">${reserva.precioTotal.toLocaleString('es-AR')}</span></p>
        </div>
      </div>

      {/* Seña */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Seña</p>
        {reserva.sena ? (
          <div className="space-y-1 text-sm">
            <p><span className="text-gray-400">Monto:</span> ${reserva.sena.monto.toLocaleString('es-AR')} ({reserva.sena.tipo})</p>
            <p><span className="text-gray-400">Método:</span> {reserva.sena.metodoPago}</p>
            <p><span className="text-gray-400">Fecha:</span> {new Date(reserva.sena.fechaPago).toLocaleDateString('es-AR')}</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-400 mb-3">No hay seña registrada</p>
            {(reserva.estado === 'Pendiente' || reserva.estado === 'Confirmada') && (
              <button
                onClick={() => setShowSena(true)}
                className="text-sm font-semibold text-[#C4633A] hover:underline"
              >
                + Registrar seña
              </button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {reserva.estado === 'Pendiente' && (
        <div className="space-y-3 mb-3">
          <button
            onClick={() => confirmarMutation.mutate()}
            disabled={confirmarMutation.isPending}
            className="w-full bg-green-50 text-green-700 rounded-xl py-3 font-semibold text-sm hover:bg-green-100 transition-colors"
          >
            {confirmarMutation.isPending ? 'Aceptando...' : '✓ Aceptar reserva'}
          </button>
          <button
            onClick={() => confirm('¿Cancelar esta reserva?') && cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
            className="w-full bg-red-50 text-red-600 rounded-xl py-3 font-semibold text-sm hover:bg-red-100 transition-colors"
          >
            Cancelar reserva
          </button>
        </div>
      )}
      {reserva.estado === 'Confirmada' && (
        <div className="space-y-3">
          <button
            onClick={() => finalizarMutation.mutate()}
            disabled={finalizarMutation.isPending}
            className="w-full bg-blue-50 text-blue-700 rounded-xl py-3 font-semibold text-sm hover:bg-blue-100 transition-colors"
          >
            {finalizarMutation.isPending ? 'Finalizando...' : 'Marcar finalizada'}
          </button>
          <button
            onClick={() => confirm('¿Liberar fecha y cancelar esta reserva?') && cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
            className="w-full bg-red-50 text-red-600 rounded-xl py-3 font-semibold text-sm hover:bg-red-100 transition-colors"
          >
            Liberar fecha / Cancelar
          </button>
        </div>
      )}

      {/* Seña modal */}
      {showSena && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowSena(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <p className="text-base font-bold text-[#2C1810]">Registrar seña</p>
            <form onSubmit={handleSena} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo</label>
                <select
                  value={senaTipo}
                  onChange={e => setSenaTipo(e.target.value as 'Fijo' | 'Porcentaje')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
                >
                  <option value="Fijo">Monto fijo</option>
                  <option value="Porcentaje">Porcentaje</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Monto ($)</label>
                <input type="number" value={senaMonto} onChange={e => setSenaMonto(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
              </div>
              {senaTipo === 'Porcentaje' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Porcentaje (%)</label>
                  <input type="number" value={senaPorcentaje} onChange={e => setSenaPorcentaje(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Método de pago</label>
                <input type="text" value={senaMetodo} onChange={e => setSenaMetodo(e.target.value)}
                  placeholder="Transferencia, Efectivo..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha de pago</label>
                <input type="date" value={senaFecha} onChange={e => setSenaFecha(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
              </div>
              <button
                type="submit"
                disabled={senaMutation.isPending || !senaMonto}
                className="w-full bg-[#C4633A] text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-50"
              >
                {senaMutation.isPending ? 'Guardando...' : 'Registrar seña'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
