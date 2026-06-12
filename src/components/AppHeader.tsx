'use client'

import Link from 'next/link'
import { MessageCircle, Bell } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getMisConversaciones } from '@/api/conversaciones'
import { useAuthStore } from '@/store/authStore'
import type { Conversacion } from '@/types/types'

export default function AppHeader() {
  const { user } = useAuthStore()

  const { data: conversaciones = [] } = useQuery<Conversacion[]>({
    queryKey: ['misConversaciones'],
    queryFn: getMisConversaciones,
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  })

  const noLeidos = conversaciones.reduce((sum, c) => sum + c.mensajesNoLeidos, 0)

  return (
    <header className="flex items-center justify-between px-5 py-3 bg-[#FAF7F2] border-b border-[#E8DDD4]">
      <span className="text-xl font-bold text-[#4A3020] tracking-tight">QuintApp</span>
      <div className="flex items-center gap-4">
        <Link href="/mensajes" aria-label="Mensajes" className="relative text-[#7A6559] hover:text-[#4A3020] transition-colors">
          <MessageCircle size={20} strokeWidth={1.8} />
          {noLeidos > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#6B4C35] text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
              {noLeidos > 99 ? '99+' : noLeidos}
            </span>
          )}
        </Link>
        <Link href="/mis-alertas" aria-label="Notificaciones" className="text-[#7A6559] hover:text-[#4A3020] transition-colors">
          <Bell size={20} strokeWidth={1.8} />
        </Link>
      </div>
    </header>
  )
}
