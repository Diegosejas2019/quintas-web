'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { MessageCircle } from 'lucide-react'

export default function ConsultarButton({ quintaId }: { quintaId: string }) {
  const { user } = useAuthStore()
  if (!user) return null

  return (
    <Link
      href={`/quintas/${quintaId}/chat`}
      className="flex items-center gap-2 w-full justify-center bg-[#F5EFE9] text-[#6B4C35] font-semibold text-sm rounded-xl px-4 py-3 mb-5 hover:bg-[#EAE0D5] transition-colors border border-[#E8DDD4]"
    >
      <MessageCircle size={16} strokeWidth={1.8} />
      Consultar al propietario
    </Link>
  )
}
