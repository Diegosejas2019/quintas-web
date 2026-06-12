'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getQuintasAdmin } from '@/api/admin/quintas'

export default function AdminQuintasPage() {
  const { data: quintas = [], isLoading } = useQuery({
    queryKey: ['admin-quintas'],
    queryFn: getQuintasAdmin,
  })

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#C4633A] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#2C1810]">Tus quintas</h1>
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
          <p className="font-semibold text-[#2C1810]">No tenés quintas todavía</p>
          <Link href="/admin/quintas/nueva" className="text-[#C4633A] text-sm mt-2 inline-block">Crear primera quinta →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {quintas.map(q => (
            <Link
              key={q.id}
              href={`/admin/quintas/${q.id}`}
              className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-semibold text-[#2C1810]">{q.nombre}</p>
                <p className="text-sm text-gray-500">{q.direccion ?? 'Sin dirección'} · 👥 {q.capacidad}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#C4633A]">${q.precioPorDia.toLocaleString('es-AR')}/día</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${q.activa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
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
