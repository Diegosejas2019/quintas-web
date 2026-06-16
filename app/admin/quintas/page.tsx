'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getQuintasAdmin } from '@/api/admin/quintas'

const EMOJIS = ['🌳', '🌿', '🏡', '🌲', '🏠']
const getEmoji = (nombre: string) => EMOJIS[nombre.charCodeAt(0) % EMOJIS.length]

export default function AdminQuintasPage() {
  const { data: quintas = [], isLoading } = useQuery({
    queryKey: ['admin-quintas'],
    queryFn: getQuintasAdmin,
  })

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#6B4C35] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#4A3020]">Tus quintas</h1>
        <Link
          href="/admin/quintas/nueva"
          className="bg-[#C4633A] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#b05530] transition-colors"
        >
          + Nueva
        </Link>
      </div>

      {quintas.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🏡</p>
          <p className="font-semibold text-[#4A3020]">No tenés quintas todavía</p>
          <Link href="/admin/quintas/nueva" className="text-[#C4633A] text-sm mt-2 inline-block">Crear primera quinta →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {quintas.map(q => (
            <Link
              key={q.id}
              href={`/admin/quintas/${q.id}`}
              className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#F5EFE9] flex items-center justify-center text-2xl">
                {q.imagenes?.[0]
                  ? <img src={q.imagenes[0]} alt={q.nombre} className="w-full h-full object-cover" />
                  : getEmoji(q.nombre)
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#4A3020] truncate">{q.nombre}</p>
                <p className="text-sm text-[#7A6559] truncate">{q.direccion ?? 'Sin dirección'} · 👥 {q.capacidad}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-[#6B4C35]">${q.precioPorDia.toLocaleString('es-AR')}/día</p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={q.activa
                    ? { backgroundColor: '#D1FAE5', color: '#065F46' }
                    : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                  }
                >
                  {q.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
