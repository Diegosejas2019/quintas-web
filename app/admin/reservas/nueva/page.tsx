'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getQuintasAdmin } from '@/api/admin/quintas'
import { createReservaAdmin } from '@/api/admin/reservas'
import type { CreateReservaAdminDto } from '@/api/admin/reservas'

export default function NuevaReservaPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const [step, setStep] = useState<1 | 2>(1)
  const [error, setError] = useState('')

  const [quintaId, setQuintaId] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')

  const { data: quintas = [], isLoading: loadingQuintas } = useQuery({
    queryKey: ['admin-quintas'],
    queryFn: getQuintasAdmin,
  })

  const mutation = useMutation({
    mutationFn: (body: CreateReservaAdminDto) => createReservaAdmin(body),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['admin-reservas'] })
      router.push(`/admin/reservas/${res.id}`)
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      setError(err.response?.data?.message ?? 'Error al crear la reserva')
    },
  })

  const quintaSeleccionada = quintas.find(q => q.id === quintaId)
  const dias = fechaInicio && fechaFin
    ? Math.ceil((new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / 86400000)
    : 0

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quintaId || !fechaInicio || !fechaFin || dias <= 0) {
      setError('Seleccioná una quinta y fechas válidas')
      return
    }
    setError('')
    setStep(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ quintaId, fechaInicio, fechaFin, nombreCliente: nombre, emailCliente: email, telefonoCliente: telefono })
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        {step === 2 && (
          <button onClick={() => setStep(1)} className="text-[#C4633A] text-sm">← Volver</button>
        )}
        <h1 className="text-2xl font-bold text-[#4A3020]">Nueva reserva</h1>
        <span className="ml-auto text-xs text-gray-400">Paso {step} de 2</span>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Quinta y fechas</p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Quinta</label>
              {loadingQuintas ? (
                <div className="text-sm text-gray-400">Cargando...</div>
              ) : (
                <select
                  value={quintaId}
                  onChange={e => setQuintaId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4633A]/30"
                >
                  <option value="">Seleccionar quinta</option>
                  {quintas.filter(q => q.activa).map(q => (
                    <option key={q.id} value={q.id}>{q.nombre}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha inicio</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={e => setFechaInicio(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4633A]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha fin</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={e => setFechaFin(e.target.value)}
                  min={fechaInicio || new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4633A]/30"
                />
              </div>
            </div>
          </div>

          {quintaSeleccionada && dias > 0 && (
            <div className="bg-[#F5EDD8] rounded-xl p-4">
              <p className="text-sm font-semibold text-[#2C1810]">{quintaSeleccionada.nombre}</p>
              <p className="text-sm text-[#7B5C3E]">{dias} día{dias !== 1 ? 's' : ''} · ${(quintaSeleccionada.precioPorDia * dias).toLocaleString('es-AR')} total</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!quintaId || !fechaInicio || !fechaFin}
            className="w-full bg-[#C4633A] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#b05530] disabled:opacity-50 transition-colors"
          >
            Continuar →
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#F5EDD8] rounded-xl p-4 mb-2">
            <p className="text-sm font-semibold text-[#2C1810]">{quintaSeleccionada?.nombre}</p>
            <p className="text-xs text-[#7B5C3E]">
              {new Date(fechaInicio).toLocaleDateString('es-AR')} → {new Date(fechaFin).toLocaleDateString('es-AR')}
              {' · '}{dias} día{dias !== 1 ? 's' : ''} · ${((quintaSeleccionada?.precioPorDia ?? 0) * dias).toLocaleString('es-AR')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Datos del cliente</p>
            {([
              ['Nombre completo *', nombre, setNombre, 'text', 'Juan Pérez'],
              ['Email *', email, setEmail, 'email', 'juan@ejemplo.com'],
              ['Teléfono *', telefono, setTelefono, 'tel', '+54 9 351 123 4567'],
            ] as [string, string, (v: string) => void, string, string][]).map(([label, val, set, type, ph]) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                <input
                  type={type}
                  value={val}
                  onChange={e => set(e.target.value)}
                  placeholder={ph}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4633A]/30"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending || !nombre || !email || !telefono}
            className="w-full bg-[#C4633A] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#b05530] disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? 'Creando...' : 'Crear reserva'}
          </button>
        </form>
      )}
    </div>
  )
}
