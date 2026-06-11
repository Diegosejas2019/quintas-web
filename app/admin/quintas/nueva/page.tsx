'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createQuinta } from '@/api/admin/quintas'
import QuintaForm from '../_QuintaForm'
import type { QuintaFormData } from '@/api/admin/quintas'

export default function NuevaQuintaPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: createQuinta,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-quintas'] })
      router.push('/admin/quintas')
    },
    onError: () => setError('Error al crear la quinta'),
  })

  return (
    <div>
      <h1 className="text-xl font-bold text-[#2C1810] mb-6">Nueva quinta</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <QuintaForm
        onSubmit={(data: QuintaFormData) => mutation.mutate(data)}
        isLoading={mutation.isPending}
        submitLabel="Crear quinta"
      />
    </div>
  )
}
