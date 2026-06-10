'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAlertas, eliminarAlerta } from '@/api/alertas'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

export default function MisAlertasPage() {
  const { user, loading } = useAuthStore()
  const { addToast } = useUIStore()
  const router = useRouter()
  const qc = useQueryClient()

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading, router])

  const { data: alertas = [], isLoading } = useQuery({
    queryKey: ['alertas'],
    queryFn: getAlertas,
    enabled: !!user,
  })

  const deleteMutation = useMutation({
    mutationFn: eliminarAlerta,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alertas'] })
      addToast('Alerta eliminada', 'success')
    },
  })

  if (loading || !user) return null

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="text-2xl font-bold text-[#4A3020] mb-5">🔔 Mis alertas</h1>

      {isLoading ? (
        <div className="flex items-center gap-3 text-[#7A6559]">
          <div className="w-6 h-6 border-2 border-[#6B4C35] border-t-transparent rounded-full animate-spin" />
          Cargando…
        </div>
      ) : alertas.length === 0 ? (
        <p className="text-sm text-[#7A6559]">No tenés alertas activas.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {alertas.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#4A3020]">{a.quintaNombre}</p>
                <p className="text-xs text-[#7A6559] mt-0.5">{a.fechaInicio} → {a.fechaFin}</p>
                <p className="text-xs mt-1">
                  <span className={`font-semibold ${a.notificado ? 'text-[#4A7C59]' : 'text-[#7A6559]'}`}>
                    {a.notificado ? '✓ Notificado' : '⏳ Esperando'}
                  </span>
                </p>
              </div>
              <button
                onClick={() => deleteMutation.mutate(a.id)}
                disabled={deleteMutation.isPending}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
