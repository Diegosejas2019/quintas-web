'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, perfil, signOut } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace('/admin/login'); return }
    if (perfil && perfil.tipoUsuario !== 'propietario') router.replace('/')
  }, [user, loading, perfil, router])

  // Mientras carga, mostrar spinner solo si ya hay user (evita loop en /admin/login)
  if (loading) {
    return <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#C4633A] border-t-transparent rounded-full animate-spin" />
    </div>
  }

  // Sin sesión: el useEffect redirige a /admin/login, renderizar children en blanco mientras
  if (!user) return <div className="min-h-screen bg-[#FAF7F2]">{children}</div>

  // Con sesión pero sin perfil cargado aún
  if (!perfil) {
    return <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#C4633A] border-t-transparent rounded-full animate-spin" />
    </div>
  }

  if (perfil.tipoUsuario !== 'propietario') return null

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link href="/admin" className="text-sm font-bold text-[#2C1810]">Mi panel</Link>
          <Link href="/admin/quintas" className="text-sm text-gray-500 hover:text-[#2C1810]">Quintas</Link>
          <Link href="/admin/reservas" className="text-sm text-gray-500 hover:text-[#2C1810]">Reservas</Link>
        </nav>
        <button
          onClick={signOut}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          Salir
        </button>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
