'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getQuintasAdmin, updateQuinta, deleteQuinta } from '@/api/admin/quintas'
import QuintaForm from '../_QuintaForm'
import type { QuintaFormData } from '@/api/admin/quintas'

export default function EditQuintaPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const qc = useQueryClient()
  const [error, setError] = useState('')

  const { data: quintas, isLoading } = useQuery({
    queryKey: ['admin-quintas'],
    queryFn: getQuintasAdmin,
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
      <div className="w-8 h-8 border-4 border-[#C4633A] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!quinta) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Quinta no encontrada</p>
    </div>
  )

  return (
    <div>
      <h1 className="text-xl font-bold text-[#2C1810] mb-6">Editar {quinta.nombre}</h1>
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
    </div>
  )
}
