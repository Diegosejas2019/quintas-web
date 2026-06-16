'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { iniciarConversacion } from '@/api/conversaciones'
import { useAuthStore } from '@/store/authStore'
import ChatWindow from '@/components/chat/ChatWindow'
import type { Conversacion } from '@/types/types'

export default function ChatPage() {
  const { id: quintaId } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const router = useRouter()
  const [conversacion, setConversacion] = useState<Conversacion | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    iniciarConversacion(quintaId)
      .then(setConversacion)
      .catch(() => setError('No se pudo cargar la conversación.'))
  }, [quintaId, user, router])

  if (error) return <div className="p-6 text-center text-sm text-red-500">{error}</div>
  if (!conversacion) return <div className="p-6 text-center text-sm text-[#7A6559]">Cargando...</div>

  return (
    <div className="flex flex-col h-[calc(100dvh-56px)]">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E8DDD4] bg-[#FAF7F2]">
        <button onClick={() => router.back()} className="text-[#7A6559] hover:text-[#4A3020]">←</button>
        <div>
          <p className="text-sm font-bold text-[#4A3020]">{conversacion.quintaNombre}</p>
          <p className="text-xs text-[#7A6559]">Consulta al propietario</p>
        </div>
      </div>
      <ChatWindow conversacionId={conversacion.id} ultimoLeidoPorPropietario={conversacion.ultimoLeidoPorPropietario} />
    </div>
  )
}
