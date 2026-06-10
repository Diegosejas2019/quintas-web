'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function CuentaPage() {
  const { user, loading, signOut } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading, router])

  if (loading || !user) return null

  return (
    <div className="max-w-lg mx-auto px-5 py-6">
      <h1 className="text-2xl font-bold text-[#4A3020] mb-5">👤 Mi cuenta</h1>
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <div className="w-14 h-14 rounded-full bg-[#6B4C35] flex items-center justify-center text-white font-bold text-xl mb-3">
          {user.email?.[0].toUpperCase()}
        </div>
        <p className="font-semibold text-[#4A3020]">{user.user_metadata?.full_name ?? 'Usuario'}</p>
        <p className="text-sm text-[#7A6559]">{user.email}</p>
      </div>

      <Link href="/mis-alertas" className="block bg-white rounded-2xl p-4 shadow-sm mb-3 text-sm font-medium text-[#4A3020] hover:shadow-md">
        🔔 Mis alertas
      </Link>

      <button
        onClick={async () => { await signOut(); router.push('/') }}
        className="w-full bg-red-50 border border-red-200 text-red-600 font-semibold py-3 rounded-2xl text-sm hover:bg-red-100"
      >
        Cerrar sesión
      </button>
    </div>
  )
}
