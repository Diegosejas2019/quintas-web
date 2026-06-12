'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Home, Map, Heart, CalendarDays, User } from 'lucide-react'

const ACTIVE   = '#6B4C35'
const INACTIVE = '#7A6559'

const TABS = [
  { href: '/',           label: 'Inicio',    Icon: Home },
  { href: '/mapa',       label: 'Mapa',      Icon: Map },
  { href: '/favoritos',  label: 'Favoritos', Icon: Heart },
  { href: '/mis-reservas', label: 'Reservas', Icon: CalendarDays },
  { href: '/cuenta',     label: 'Cuenta',    Icon: User },
]

export default function BottomTabBar() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  if (pathname.startsWith('/admin')) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex bg-[#FAF7F2] border-t border-[#E8DDD4]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const dest   = href === '/cuenta' && !user ? '/auth/login' : href
        const active = pathname === href
        const color  = active ? ACTIVE : INACTIVE
        const isFav  = href === '/favoritos'

        return (
          <Link
            key={href}
            href={dest}
            className="flex flex-1 flex-col items-center gap-0.5 py-2"
          >
            <Icon
              size={22}
              color={color}
              fill={isFav && active ? color : 'none'}
              strokeWidth={1.8}
            />
            <span className="text-[11px] font-semibold" style={{ color }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
