'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Home, CalendarDays, MessageCircle } from 'lucide-react'

const ACTIVE   = '#2C1810'
const INACTIVE = '#7A6559'

const TABS = [
  { href: '/admin',          label: 'Panel',    Icon: LayoutDashboard },
  { href: '/admin/quintas',  label: 'Quintas',  Icon: Home },
  { href: '/admin/reservas', label: 'Reservas', Icon: CalendarDays },
  { href: '/admin/mensajes', label: 'Mensajes', Icon: MessageCircle },
]

export default function AdminBottomTabBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex bg-[#FAF7F2] border-t border-[#E8DDD4]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = href === '/admin'
          ? pathname === '/admin'
          : pathname.startsWith(href)
        const color = active ? ACTIVE : INACTIVE

        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center gap-0.5 py-2"
          >
            <Icon size={22} color={color} strokeWidth={1.8} />
            <span className="text-[11px] font-semibold" style={{ color }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
