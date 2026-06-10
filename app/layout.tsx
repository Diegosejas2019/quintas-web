import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import ToastContainer from '@/components/ToastContainer'

export const metadata: Metadata = {
  title: 'Quintas App',
  description: 'Alquiler de quintas para fin de semana',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col bg-[#FAF5F0]">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}
