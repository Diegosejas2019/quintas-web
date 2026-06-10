'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { crearOpinion } from '@/api/opiniones'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

interface Props {
  quintaId: string
  onClose: () => void
}

export default function OpinionModal({ quintaId, onClose }: Props) {
  const { user } = useAuthStore()
  const { addToast } = useUIStore()
  const qc = useQueryClient()
  const [calificacion, setCalificacion] = useState(5)
  const [comentario, setComentario]     = useState('')

  const mutation = useMutation({
    mutationFn: crearOpinion,
    onSuccess: () => {
      addToast('¡Reseña publicada!', 'success')
      qc.invalidateQueries({ queryKey: ['opiniones', quintaId] })
      onClose()
    },
    onError: (e: Error) => addToast(e.message, 'error'),
  })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-40" onClick={onClose}>
      <div className="bg-white rounded-t-3xl p-5 w-full max-w-lg pb-10" onClick={(e) => e.stopPropagation()}>
        <div className="w-9 h-1 bg-[#E8DDD4] rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-bold text-[#4A3020] mb-4">✍️ Dejar reseña</h2>

        <label className="text-xs font-bold text-[#7A6559] uppercase block mb-2">Calificación</label>
        <div className="flex gap-2 mb-4">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setCalificacion(n)}
              style={{ fontSize: 32, opacity: n <= calificacion ? 1 : 0.3 }}>⭐</button>
          ))}
        </div>

        <label className="text-xs font-bold text-[#7A6559] uppercase block mb-1.5">Comentario (opcional)</label>
        <textarea value={comentario} onChange={e => setComentario(e.target.value)}
          placeholder="Contá tu experiencia…" rows={3}
          className="border border-[#E8DDD4] rounded-xl px-3 py-3 w-full bg-[#FAF5F0] mb-4 text-sm resize-none" />

        <button
          onClick={() => mutation.mutate({
            quintaId,
            nombreCliente: user?.user_metadata?.full_name || user?.email || 'Anónimo',
            calificacion,
            comentario: comentario || undefined,
          })}
          disabled={mutation.isPending}
          className="w-full bg-[#6B4C35] text-white font-bold py-4 rounded-2xl disabled:opacity-60"
        >
          {mutation.isPending ? 'Publicando…' : 'Publicar reseña'}
        </button>
        <button onClick={onClose} className="w-full text-[#7A6559] text-sm mt-3">Cancelar</button>
      </div>
    </div>
  )
}
