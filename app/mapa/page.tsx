'use client'

import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'
import { getQuintas } from '@/api/quintas'

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false })

export default function MapaPage() {
  const { data: quintas = [], isLoading } = useQuery({
    queryKey: ['quintas'],
    queryFn: getQuintas,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 text-[#7A6559]">
        <div className="w-8 h-8 border-2 border-[#6B4C35] border-t-transparent rounded-full animate-spin mr-3" />
        Cargando mapa…
      </div>
    )
  }

  const quintasConCoordenadas = quintas.filter(q => q.latitud != null && q.longitud != null)

  return <LeafletMap quintas={quintasConCoordenadas} />
}
