'use client'

import Link from 'next/link'
import { useUIStore } from '@/store/uiStore'

export default function AppHeader() {
  const { addToast } = useUIStore()

  return (
    <header className="flex items-center justify-between px-5 py-3 bg-[#FAF7F2] border-b border-[#E8DDD4]">
      <span className="text-xl font-bold text-[#4A3020] tracking-tight">QuintApp</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Mensajes"
          onClick={() => addToast('Mensajes — próximamente', 'info')}
          className="text-[#7A6559] hover:text-[#4A3020] transition-colors text-xl"
        >
          💬
        </button>
        <Link href="/mis-alertas" aria-label="Notificaciones" className="text-[#7A6559] hover:text-[#4A3020] transition-colors text-xl">
          🔔
        </Link>
      </div>
    </header>
  )
}
