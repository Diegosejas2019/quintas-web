'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import ReservaModal from '@/components/ReservaModal'
import AlertaModal from '@/components/AlertaModal'
import OpinionModal from '@/components/OpinionModal'

interface Props {
  quintaId: string
  quintaNombre: string
  precioPorDia: number
}

export default function QuintaDetailActions({ quintaId, quintaNombre, precioPorDia }: Props) {
  const { user } = useAuthStore()
  const router = useRouter()
  const [showReserva, setShowReserva]   = useState(false)
  const [showAlerta,  setShowAlerta]    = useState(false)
  const [showOpinion, setShowOpinion]   = useState(false)

  const requireAuth = (action: () => void) => {
    if (!user) { router.push('/auth/login'); return }
    action()
  }

  return (
    <>
      {/* Alerta CTA */}
      <div className="mx-5 mb-5 bg-[#E8F0EB] rounded-2xl p-4 border border-[#B7D9C2]">
        <p className="text-sm font-bold text-[#4A7C59] mb-1">🔔 ¿Fecha ocupada?</p>
        <p className="text-xs text-[#3A6B4A] leading-5 mb-3">
          Activá una alerta y te avisamos cuando se libere.
        </p>
        <button
          onClick={() => requireAuth(() => setShowAlerta(true))}
          className="w-full bg-[#4A7C59] text-white py-3 rounded-xl font-semibold text-sm"
        >
          Activar alerta
        </button>
      </div>

      {/* Escribir reseña */}
      <div className="mx-5 mb-5">
        <button
          onClick={() => requireAuth(() => setShowOpinion(true))}
          className="w-full border-2 border-dashed border-[#E8DDD4] rounded-2xl py-4 text-sm text-[#7A6559] hover:border-[#6B4C35]"
        >
          ✍️ Escribir una reseña
        </button>
      </div>

      {/* Sticky reserve bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-[#E8DDD4] px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-xl font-bold text-[#4A3020]">
            ${precioPorDia.toLocaleString('es-AR')}
            <span className="text-sm font-normal text-[#7A6559]"> / noche</span>
          </p>
        </div>
        <button
          onClick={() => requireAuth(() => setShowReserva(true))}
          className="bg-[#6B4C35] text-white font-bold px-7 py-3.5 rounded-2xl"
        >
          Reservar
        </button>
      </div>

      {showReserva && (
        <ReservaModal
          quintaId={quintaId}
          quintaNombre={quintaNombre}
          precioPorDia={precioPorDia}
          onClose={() => setShowReserva(false)}
        />
      )}
      {showAlerta  && <AlertaModal  quintaId={quintaId} onClose={() => setShowAlerta(false)} />}
      {showOpinion && <OpinionModal quintaId={quintaId} onClose={() => setShowOpinion(false)} />}
    </>
  )
}
