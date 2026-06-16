'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getQuintasAdmin, updateQuinta, deleteQuinta } from '@/api/admin/quintas'
import { getOpiniones } from '@/api/opiniones'
import QuintaForm from '../_QuintaForm'
import StarRating from '@/components/StarRating'
import AdminCalendar from '@/components/admin/AdminCalendar'
import type { QuintaFormData } from '@/api/admin/quintas'

type Tab = 'datos' | 'opiniones' | 'disponibilidad'

export default function EditQuintaPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const qc = useQueryClient()
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('datos')

  const { data: quintas, isLoading } = useQuery({
    queryKey: ['admin-quintas'],
    queryFn: getQuintasAdmin,
  })

  const { data: opinionesData, isLoading: opinionesLoading } = useQuery({
    queryKey: ['opiniones', id],
    queryFn: () => getOpiniones(id),
    enabled: tab === 'opiniones',
  })

  const quinta = quintas?.find(q => q.id === id)

  const updateMutation = useMutation({
    mutationFn: (data: QuintaFormData) => updateQuinta(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-quintas'] })
      router.push('/admin/quintas')
    },
    onError: () => setError('Error al actualizar la quinta'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteQuinta(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-quintas'] })
      router.push('/admin/quintas')
    },
    onError: () => setError('Error al desactivar la quinta'),
  })

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#6B4C35] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!quinta) return (
    <div className="text-center py-20">
      <p className="text-[#7A6559]">Quinta no encontrada</p>
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#4A3020] mb-4">{quinta.nombre}</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#E8DDD4]">
        {(['datos', 'opiniones', 'disponibilidad'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-[#4A3020] text-[#4A3020]'
                : 'border-transparent text-[#7A6559] hover:text-[#4A3020]'
            }`}
          >
            {t === 'datos' ? 'Datos' : t === 'opiniones' ? 'Opiniones' : 'Disponibilidad'}
          </button>
        ))}
      </div>

      {/* Tab: Datos */}
      {tab === 'datos' && (
        <>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <QuintaForm
            initial={quinta}
            onSubmit={(data: QuintaFormData) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
            submitLabel="Guardar cambios"
            onDelete={() => {
              if (confirm('¿Desactivar esta quinta? Dejará de aparecer para los clientes.')) {
                deleteMutation.mutate()
              }
            }}
          />
        </>
      )}

      {/* Tab: Disponibilidad */}
      {tab === 'disponibilidad' && (
        <AdminCalendar quintaId={id} />
      )}

      {/* Tab: Opiniones */}
      {tab === 'opiniones' && (
        <div>
          {opinionesLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#6B4C35] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !opinionesData || opinionesData.opiniones.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <span className="text-4xl mb-3">💬</span>
              <p className="font-semibold text-[#4A3020]">Todavía no hay opiniones</p>
              <p className="text-sm text-[#7A6559] mt-1">Las opiniones de los clientes aparecerán acá.</p>
            </div>
          ) : (
            <>
              {/* Resumen de promedio */}
              <div className="bg-white rounded-2xl p-5 shadow-sm mb-4 flex items-center gap-4">
                <div>
                  <p className="text-3xl font-bold text-[#4A3020]">
                    {opinionesData.promedio.toFixed(1)}
                  </p>
                  <StarRating promedio={opinionesData.promedio * 2} size={18} />
                </div>
                <p className="text-sm text-[#7A6559]">
                  {opinionesData.opiniones.length} {opinionesData.opiniones.length === 1 ? 'opinión' : 'opiniones'}
                </p>
              </div>

              {/* Listado */}
              <div className="space-y-3">
                {opinionesData.opiniones.map(op => (
                  <div key={op.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-[#4A3020]">{op.nombreCliente}</p>
                      <p className="text-xs text-[#7A6559]">
                        {new Date(op.createdAt).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <StarRating promedio={op.calificacion * 2} size={14} />
                    {op.comentario && (
                      <p className="text-sm text-[#4A3020] mt-2 leading-relaxed">{op.comentario}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
