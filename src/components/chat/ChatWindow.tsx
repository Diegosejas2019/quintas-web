'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMensajes, enviarMensaje, marcarLeida } from '@/api/conversaciones'
import type { Mensaje } from '@/types/types'
import { useAuthStore } from '@/store/authStore'

interface Props {
  conversacionId: string
  onBack?: () => void
}

export default function ChatWindow({ conversacionId, onBack }: Props) {
  const { user } = useAuthStore()
  const [texto, setTexto] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { data: mensajes = [], isLoading } = useQuery<Mensaje[]>({
    queryKey: ['mensajes', conversacionId],
    queryFn: () => getMensajes(conversacionId),
    refetchInterval: 5000,
  })

  const enviar = useMutation({
    mutationFn: (t: string) => enviarMensaje(conversacionId, t),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mensajes', conversacionId] })
      queryClient.invalidateQueries({ queryKey: ['misConversaciones'] })
    },
  })

  useEffect(() => {
    marcarLeida(conversacionId).catch(() => {})
    queryClient.invalidateQueries({ queryKey: ['misConversaciones'] })
  }, [conversacionId, queryClient])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = texto.trim()
    if (!t) return
    setTexto('')
    enviar.mutate(t)
  }

  if (isLoading) return <div className="flex-1 flex items-center justify-center text-[#7A6559]">Cargando mensajes...</div>

  return (
    <div className="flex flex-col h-full">
      {onBack && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E8DDD4] bg-[#FAF7F2]">
          <button onClick={onBack} className="text-[#7A6559] hover:text-[#4A3020]">←</button>
          <span className="text-sm font-semibold text-[#4A3020]">Conversación</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {mensajes.length === 0 && (
          <p className="text-center text-sm text-[#7A6559] py-8">
            Aún no hay mensajes. ¡Enviá el primero!
          </p>
        )}
        {mensajes.map(m => {
          const esMio = m.remitenteId === user?.id
          return (
            <div key={m.id} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                esMio
                  ? 'bg-[#6B4C35] text-white rounded-br-sm'
                  : 'bg-[#F0E9E1] text-[#4A3020] rounded-bl-sm'
              }`}>
                <p className="leading-5">{m.texto}</p>
                <p className={`text-[10px] mt-1 ${esMio ? 'text-white/60' : 'text-[#7A6559]'}`}>
                  {new Date(m.enviadoEn).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-[#E8DDD4] bg-[#FAF7F2]">
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Escribí un mensaje..."
          className="flex-1 bg-white border border-[#E8DDD4] rounded-full px-4 py-2 text-sm text-[#4A3020] focus:outline-none focus:border-[#6B4C35]"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={!texto.trim() || enviar.isPending}
          className="bg-[#6B4C35] text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-40 hover:bg-[#4A3020] transition-colors"
        >
          ↑
        </button>
      </form>
    </div>
  )
}
