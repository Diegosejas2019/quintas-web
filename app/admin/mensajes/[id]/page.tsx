'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMensajes, enviarMensaje, marcarLeida } from '@/api/admin/conversaciones'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import type { Mensaje } from '@/types/types'

export default function AdminConversacionPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [texto, setTexto] = useState('')

  const { data: mensajes = [], isLoading } = useQuery<Mensaje[]>({
    queryKey: ['admin-mensajes', id],
    queryFn: () => getMensajes(id),
    refetchInterval: 5000,
  })

  const enviar = useMutation({
    mutationFn: (t: string) => enviarMensaje(id, t),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-mensajes', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-conversaciones'] })
    },
  })

  useEffect(() => {
    marcarLeida(id).catch(() => {})
    queryClient.invalidateQueries({ queryKey: ['admin-conversaciones'] })
  }, [id, queryClient])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = texto.trim()
    if (!t) return
    setTexto('')
    enviar.mutate(t)
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100dvh-64px-56px)]">
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[#E8DDD4] bg-white">
        <button onClick={() => router.back()} className="text-[#7A6559] hover:text-[#2C1810]">←</button>
        <span className="text-sm font-semibold text-[#2C1810]">Conversación</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {isLoading && <p className="text-center text-sm text-[#7A6559]">Cargando...</p>}
        {mensajes.map(m => {
          const esMio = m.remitenteRol === 'Propietario'
          return (
            <div key={m.id} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                esMio
                  ? 'bg-[#2C1810] text-white rounded-br-sm'
                  : 'bg-[#F5F0EB] text-[#2C1810] rounded-bl-sm'
              }`}>
                <p className="leading-5">{m.texto}</p>
                <p className={`text-[10px] mt-1 ${esMio ? 'text-white/60' : 'text-[#7A6559]'}`}>
                  {new Date(m.enviadoEn).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-6 py-3 border-t border-[#E8DDD4] bg-white">
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Responder..."
          className="flex-1 bg-[#FAF7F2] border border-[#E8DDD4] rounded-full px-4 py-2 text-sm text-[#2C1810] focus:outline-none focus:border-[#2C1810]"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={!texto.trim() || enviar.isPending}
          className="bg-[#2C1810] text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-40 hover:bg-[#4A3020] transition-colors"
        >
          ↑
        </button>
      </form>
    </div>
  )
}
