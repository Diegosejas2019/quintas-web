'use client'

import { usePathname } from 'next/navigation'

export default function AdminAwarePadding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <main
      className="flex-1"
      style={isAdmin ? undefined : { paddingBottom: 'calc(72px + env(safe-area-inset-bottom))' }}
    >
      {children}
    </main>
  )
}
