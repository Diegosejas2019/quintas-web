'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { crearReserva } from '@/api/reservas'
import { actualizarPerfil } from '@/api/usuarios'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import DateRangePicker from '@/components/DateRangePicker'

interface Props {
  quintaId: string
  quintaNombre: string
  precioPorDia: number
  fechaInicioDefault?: string
  fechaFinDefault?: string
  onClose: () => void
}

export default function ReservaModal({ quintaId, quintaNombre, precioPorDia, fechaInicioDefault = '', fechaFinDefault = '', onClose }: Props) {
  const { user, perfil, setPerfil } = useAuthStore()
  const { addToast } = useUIStore()
  const queryClient = useQueryClient()
  const [nombre,      setNombre]      = useState(perfil?.nombre ?? user?.user_metadata?.full_name ?? '')
  const [telefono,    setTelefono]    = useState(perfil?.telefono ?? '')
  const [fechaInicio, setFechaInicio] = useState(fechaInicioDefault)
  const [fechaFin,    setFechaFin]    = useState(fechaFinDefault)
  const [error,       setError]       = useState('')

  const mutation = useMutation({
    mutationFn: crearReserva,
    onSuccess: async () => {
      addToast('¡Reserva creada con éxito!', 'success')
      await queryClient.refetchQueries({ queryKey: ['disponibilidad', quintaId] })
      queryClient.invalidateQueries({ queryKey: ['mis-reservas'] })
      if (telefono && telefono !== perfil?.telefono) {
        actualizarPerfil({ telefono }).then(setPerfil).catch(() => {})
      }
      onClose()
    },
    onError: (e: Error) => setError(e.message),
  })

  const handleSubmit = () => {
    if (!nombre || !telefono || !fechaInicio || !fechaFin) {
      setError('Completá todos los campos')
      return
    }
    setError('')
    mutation.mutate({
      quintaId,
      nombreCliente: nombre,
      emailCliente: user?.email ?? '',
      telefonoCliente: telefono,
      fechaInicio,
      fechaFin,
      usuarioId: perfil?.id,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-40" onClick={onClose}>
      <div className="bg-white rounded-t-3xl p-5 w-full max-w-lg pb-10" onClick={(e) => e.stopPropagation()}>
        <div className="w-9 h-1 bg-[#E8DDD4] rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-bold text-[#4A3020] mb-1">{quintaNombre}</h2>
        <p className="text-2xl font-bold text-[#6B4C35] mb-4">
          ${precioPorDia.toLocaleString('es-AR')}{' '}
          <span className="text-sm font-normal text-[#7A6559]">/ noche</span>
        </p>

        <DateRangePicker
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          onChangeFechaInicio={setFechaInicio}
          onChangeFechaFin={setFechaFin}
        />

        <label className="text-xs font-bold text-[#7A6559] uppercase block mb-1.5">Tu nombre</label>
        <input value={nombre} onChange={e => setNombre(e.target.value)}
          placeholder="Nombre completo"
          className="border border-[#E8DDD4] rounded-xl px-3 py-3 w-full bg-[#FAF5F0] mb-3 text-[#2C1810] text-sm" />

        <label className="text-xs font-bold text-[#7A6559] uppercase block mb-1.5">Teléfono</label>
        <input value={telefono} onChange={e => setTelefono(e.target.value)}
          placeholder="+54 9 351…" type="tel"
          className="border border-[#E8DDD4] rounded-xl px-3 py-3 w-full bg-[#FAF5F0] mb-4 text-[#2C1810] text-sm" />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button onClick={handleSubmit} disabled={mutation.isPending}
          className="w-full bg-[#6B4C35] text-white font-bold py-4 rounded-2xl disabled:opacity-60">
          {mutation.isPending ? 'Reservando…' : 'Confirmar reserva'}
        </button>
        <button onClick={onClose} className="w-full text-[#7A6559] text-sm mt-3">Cancelar</button>
      </div>
    </div>
  )
}
