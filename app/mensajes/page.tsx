'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { getMisConversaciones } from '@/api/conversaciones'
import { useAuthStore } from '@/store/authStore'
import { MessageCircle } from 'lucide-react'
import type { Conversacion } from '@/types/types'

export default function MensajesPage() {
  const { user } = useAuthStore()
  const router = useRouter()

  const { data: conversaciones = [], isLoading } = useQuery<Conversacion[]>({
    queryKey: ['misConversaciones'],
    queryFn: getMisConversaciones,
    enabled: !!user,
    refetchOnWindowFocus: true,
  })

  if (!user) {
    router.push('/auth/login')
    return null
  }

  if (isLoading) return <div className="p-6 text-center text-sm text-[#7A6559]">Cargando...</div>

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <div className="px-5 py-4">
        <h1 className="text-xl font-bold text-[#4A3020] mb-4">Mensajes</h1>

        {conversaciones.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle size={40} className="mx-auto text-[#C4A882] mb-3" strokeWidth={1.5} />
            <p className="text-sm text-[#7A6559]">No tenés conversaciones aún.</p>
            <p className="text-xs text-[#7A6559] mt-1">Consultá a un propietario desde el detalle de una quinta.</p>
          </div>
        )}

        <div className="space-y-2">
          {conversaciones.map(c => (
            <button
              key={c.id}
              onClick={() => router.push(`/quintas/${c.quintaId}/chat`)}
              className="w-full text-left bg-white border border-[#E8DDD4] rounded-xl px-4 py-3 hover:bg-[#FAF7F2] transition-colors"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#4A3020]">{c.quintaNombre}</p>
                {c.mensajesNoLeidos > 0 && (
                  <span className="bg-[#6B4C35] text-white text-[10px] font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {c.mensajesNoLeidos}
                  </span>
                )}
              </div>
              {c.ultimoMensaje && (
                <p className="text-xs text-[#7A6559] mt-0.5 truncate">{c.ultimoMensaje}</p>
              )}
              <p className="text-[10px] text-[#C4A882] mt-1">
                {new Date(c.ultimoMensajeEn).toLocaleDateString('es-AR')}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
