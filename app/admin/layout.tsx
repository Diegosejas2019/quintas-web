'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import AdminBottomTabBar from '@/components/admin/AdminBottomTabBar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, perfil, signOut } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace('/admin/login'); return }
    if (perfil && perfil.tipoUsuario !== 'propietario') router.replace('/')
  }, [user, loading, perfil, router])

  if (loading) {
    return <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#6B4C35] border-t-transparent rounded-full animate-spin" />
    </div>
  }

  if (!user) return <div className="min-h-screen bg-[#FAF7F2]">{children}</div>

  if (!perfil) {
    return <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#6B4C35] border-t-transparent rounded-full animate-spin" />
    </div>
  }

  if (perfil.tipoUsuario !== 'propietario') return null

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-white border-b border-[#E8DDD4] px-5 py-3 flex items-center justify-between">
        <span className="text-xl font-bold text-[#4A3020] tracking-tight">QuintApp</span>
        <button
          onClick={signOut}
          className="text-sm text-[#7A6559] hover:text-[#4A3020] transition-colors"
        >
          Salir
        </button>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
      <AdminBottomTabBar />
    </div>
  )
}
