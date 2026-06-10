'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuthStore()

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/mapa', label: 'Mapa' },
    { href: '/mis-alertas', label: 'Mis alertas' },
  ]

  return (
    <nav className="bg-white border-b border-[#E8DDD4] px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="text-lg font-bold text-[#4A3020]">🏡 Quintas</span>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`text-sm font-medium ${
              pathname === l.href ? 'text-[#6B4C35]' : 'text-[#7A6559] hover:text-[#4A3020]'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/cuenta">
              <div className="w-9 h-9 rounded-full bg-[#6B4C35] flex items-center justify-center text-white font-bold text-sm cursor-pointer">
                {user.email?.[0].toUpperCase()}
              </div>
            </Link>
            <button
              onClick={async () => { await signOut(); router.push('/') }}
              className="text-xs text-[#7A6559] hover:text-[#4A3020]"
            >
              Salir
            </button>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="bg-[#6B4C35] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#4A3020]"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  )
}
