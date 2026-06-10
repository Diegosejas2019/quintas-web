'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAlertas, eliminarAlerta } from '@/api/alertas'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { supabase } from '@/lib/supabase'

export default function MisAlertasPage() {
  const { user, loading } = useAuthStore()
  const { addToast } = useUIStore()
  const qc = useQueryClient()

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#6B4C35] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-5">
        <div className="bg-white rounded-3xl p-8 shadow-sm w-full max-w-sm text-center">
          <p className="text-4xl mb-4">🔔</p>
          <h2 className="text-xl font-bold text-[#4A3020] mb-2">Activá alertas</h2>
          <p className="text-sm text-[#7A6559] mb-8 leading-5">
            Iniciá sesión para recibir alertas cuando una quinta esté disponible.
          </p>
          <button
            onClick={() => supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: `${window.location.origin}/auth/callback` },
            })}
            className="w-full flex items-center justify-center gap-3 border border-[#E8DDD4] rounded-2xl py-3.5 text-sm font-semibold text-[#4A3020] hover:bg-[#FAF5F0] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>
        </div>
      </div>
    )
  }

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
