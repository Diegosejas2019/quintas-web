import type { Metadata, Viewport } from 'next'
import './globals.css'
import 'react-day-picker/style.css'
import Providers from '@/components/Providers'
import BottomTabBar from '@/components/BottomTabBar'
import ToastContainer from '@/components/ToastContainer'

export const metadata: Metadata = {
  title: 'Quintas App',
  description: 'Alquiler de quintas para fin de semana',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Quintas App',
  },
}

export const viewport: Viewport = {
  themeColor: '#6B4C35',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col">
        <Providers>
          <main className="flex-1" style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom))' }}>{children}</main>
          <BottomTabBar />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}
