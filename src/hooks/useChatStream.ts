'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Mensaje } from '@/types/types'

interface ChatStreamHandlers {
  onMensaje: (m: Mensaje) => void
  onLeido: (quien: string, timestamp: string) => void
}

export function useChatStream(conversacionId: string, handlers: ChatStreamHandlers) {
  useEffect(() => {
    if (!conversacionId) return

    let es: EventSource | null = null

    const connect = async () => {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) return

      const url = `${process.env.NEXT_PUBLIC_API_URL}/conversaciones/${conversacionId}/stream?token=${encodeURIComponent(token)}`
      es = new EventSource(url)

      es.addEventListener('mensaje', (e) => {
        try {
          const m = JSON.parse(e.data) as Mensaje
          handlers.onMensaje(m)
        } catch { }
      })

      es.addEventListener('leido', (e) => {
        try {
          const { quien, timestamp } = JSON.parse(e.data) as { quien: string; timestamp: string }
          handlers.onLeido(quien, timestamp)
        } catch { }
      })

      es.onerror = () => {
        // EventSource reconecta automáticamente — solo logueamos
        console.debug('[useChatStream] SSE error, reconnecting...')
      }
    }

    connect()

    return () => {
      es?.close()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversacionId])
}
