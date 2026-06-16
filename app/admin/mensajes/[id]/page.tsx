'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getMensajes, enviarMensaje, marcarLeida } from '@/api/admin/conversaciones'
import { useChatStream } from '@/hooks/useChatStream'
import type { Mensaje } from '@/types/types'

export default function AdminConversacionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [texto, setTexto] = useState('')
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [leidoHasta, setLeidoHasta] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoading(true)
    getMensajes(id).then(ms => {
      setMensajes(ms)
      setIsLoading(false)
    })
    marcarLeida(id).catch(() => {})
    queryClient.invalidateQueries({ queryKey: ['admin-conversaciones'] })
  }, [id, queryClient])

  const onMensaje = useCallback((m: Mensaje) => {
    setMensajes(prev => {
      if (prev.some(x => x.id === m.id)) return prev
      return [...prev, m]
    })
    marcarLeida(id).catch(() => {})
    queryClient.invalidateQueries({ queryKey: ['admin-conversaciones'] })
  }, [id, queryClient])

  const onLeido = useCallback((_quien: string, timestamp: string) => {
    setLeidoHasta(timestamp)
  }, [])

  useChatStream(id, { onMensaje, onLeido })

  const enviar = useMutation({
    mutationFn: (t: string) => enviarMensaje(id, t),
    onSuccess: (nuevo) => {
      setMensajes(prev => prev.some(x => x.id === nuevo.id) ? prev : [...prev, nuevo])
      queryClient.invalidateQueries({ queryKey: ['admin-conversaciones'] })
    },
  })

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

  const getTilde = (m: Mensaje): string => {
    if (m.remitenteRol !== 'Propietario') return ''
    if (!leidoHasta) return ' ✓'
    return new Date(m.enviadoEn) <= new Date(leidoHasta) ? ' ✓✓' : ' ✓'
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
          const tilde = getTilde(m)
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
                  {tilde && <span className={tilde === ' ✓✓' ? 'text-blue-300' : ''}>{tilde}</span>}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
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
