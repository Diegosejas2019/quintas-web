'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { getQuintasAdmin } from '@/api/admin/quintas'
import { getConversacionesByQuinta } from '@/api/admin/conversaciones'
import { MessageCircle } from 'lucide-react'
import type { Quinta, Conversacion } from '@/types/types'

export default function AdminMensajesPage() {
  const router = useRouter()
  const [quintaId, setQuintaId] = useState<string | null>(null)

  const { data: quintas = [] } = useQuery<Quinta[]>({
    queryKey: ['admin-quintas'],
    queryFn: getQuintasAdmin,
  })

  const { data: conversaciones = [], isLoading } = useQuery<Conversacion[]>({
    queryKey: ['admin-conversaciones', quintaId],
    queryFn: () => getConversacionesByQuinta(quintaId!),
    enabled: !!quintaId,
    refetchOnWindowFocus: true,
  })

  const selectedQuinta = quintaId ?? (quintas[0]?.id ?? null)
  const quintaActiva = selectedQuinta ?? quintas[0]?.id

  return (
    <div className="max-w-lg mx-auto px-5 py-6">
      <h1 className="text-2xl font-bold text-[#4A3020] mb-4">Mensajes</h1>

      {quintas.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {quintas.map(q => (
            <button
              key={q.id}
              onClick={() => setQuintaId(q.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                (quintaId ?? quintas[0]?.id) === q.id
                  ? 'bg-[#2C1810] text-white border-[#2C1810]'
                  : 'bg-white text-[#2C1810] border-[#E8DDD4] hover:bg-[#FAF7F2]'
              }`}
            >
              {q.nombre}
            </button>
          ))}
        </div>
      )}

      {!quintaActiva && (
        <p className="text-sm text-[#7A6559]">No tenés quintas registradas aún.</p>
      )}

      {quintaActiva && isLoading && (
        <p className="text-sm text-[#7A6559]">Cargando conversaciones...</p>
      )}

      {quintaActiva && !isLoading && conversaciones.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle size={40} className="mx-auto text-[#C4A882] mb-3" strokeWidth={1.5} />
          <p className="text-sm text-[#7A6559]">No hay conversaciones para esta quinta.</p>
        </div>
      )}

      <div className="space-y-2">
        {conversaciones.map(c => (
          <button
            key={c.id}
            onClick={() => router.push(`/admin/mensajes/${c.id}`)}
            className="w-full text-left bg-white border border-[#E8DDD4] rounded-xl px-4 py-3 hover:bg-[#FAF7F2] transition-colors"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#2C1810]">{c.clienteNombre}</p>
              {c.mensajesNoLeidos > 0 && (
                <span className="bg-[#2C1810] text-white text-[10px] font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
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
  )
}
