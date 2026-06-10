'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { crearAlerta } from '@/api/alertas'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

interface Props {
  quintaId: string
  onClose: () => void
}

export default function AlertaModal({ quintaId, onClose }: Props) {
  const { user } = useAuthStore()
  const { addToast } = useUIStore()
  const qc = useQueryClient()
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin,    setFechaFin]    = useState('')
  const [email,       setEmail]       = useState(user?.email ?? '')
  const [error,       setError]       = useState('')

  const mutation = useMutation({
    mutationFn: crearAlerta,
    onSuccess: () => {
      addToast('¡Alerta activada!', 'success')
      qc.invalidateQueries({ queryKey: ['alertas'] })
      onClose()
    },
    onError: (e: Error) => setError(e.message),
  })

  const handleSubmit = () => {
    if (!fechaInicio || !fechaFin || !email) {
      setError('Completá todos los campos')
      return
    }
    setError('')
    mutation.mutate({ quintaId, fechaInicio, fechaFin, email })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-40" onClick={onClose}>
      <div className="bg-white rounded-t-3xl p-5 w-full max-w-lg pb-10" onClick={(e) => e.stopPropagation()}>
        <div className="w-9 h-1 bg-[#E8DDD4] rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-bold text-[#4A3020] mb-4">🔔 Activar alerta</h2>

        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-[#7A6559] uppercase block mb-1.5">Fecha inicio</label>
            <input value={fechaInicio} onChange={e => setFechaInicio(e.target.value)}
              placeholder="YYYY-MM-DD"
              className="border border-[#E8DDD4] rounded-xl px-3 py-3 w-full bg-[#FAF5F0] text-sm" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-[#7A6559] uppercase block mb-1.5">Fecha fin</label>
            <input value={fechaFin} onChange={e => setFechaFin(e.target.value)}
              placeholder="YYYY-MM-DD"
              className="border border-[#E8DDD4] rounded-xl px-3 py-3 w-full bg-[#FAF5F0] text-sm" />
          </div>
        </div>

        <label className="text-xs font-bold text-[#7A6559] uppercase block mb-1.5">Email para notificaciones</label>
        <input value={email} onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com" type="email"
          className="border border-[#E8DDD4] rounded-xl px-3 py-3 w-full bg-[#FAF5F0] mb-4 text-sm" />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button onClick={handleSubmit} disabled={mutation.isPending}
          className="w-full bg-[#4A7C59] text-white font-bold py-4 rounded-2xl disabled:opacity-60">
          {mutation.isPending ? 'Activando…' : 'Activar alerta'}
        </button>
        <button onClick={onClose} className="w-full text-[#7A6559] text-sm mt-3">Cancelar</button>
      </div>
    </div>
  )
}
