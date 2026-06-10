'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

const TABS = [
  { href: '/',           icon: '🏠', label: 'Inicio' },
  { href: '/mapa',       icon: '🗺️', label: 'Mapa' },
  { href: '/mis-alertas', icon: '🔔', label: 'Alertas' },
  { href: '/cuenta',     icon: '👤', label: 'Cuenta' },
]

export default function BottomTabBar() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex bg-[#FAF7F2] border-t border-[#E8DDD4]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map((tab) => {
        const href = tab.href === '/cuenta' && !user ? '/auth/login' : tab.href
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={href}
            className="flex flex-1 flex-col items-center gap-0.5 py-2"
          >
            <span style={{ fontSize: 22, opacity: active ? 1 : 0.5 }}>{tab.icon}</span>
            <span
              className="text-[11px] font-semibold"
              style={{ color: active ? '#6B4C35' : '#7A6559' }}
            >
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
