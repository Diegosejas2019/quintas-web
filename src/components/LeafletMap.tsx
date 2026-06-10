'use client'

import { useEffect, useRef } from 'react'
import type { Quinta } from '@quintas-shared/types'

interface Props {
  quintas: Quinta[]
}

export default function LeafletMap({ quintas }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css')

      const map = L.map(mapRef.current!).setView([-31.4, -64.2], 9)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })

      quintas.forEach((q) => {
        if (q.latitud == null || q.longitud == null) return
        L.marker([q.latitud, q.longitud], { icon })
          .addTo(map)
          .bindPopup(`<b>${q.nombre}</b><br><a href="/quintas/${q.id}">Ver detalle →</a>`)
      })
    })

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
    }
  }, [quintas])

  return <div ref={mapRef} style={{ height: 'calc(100vh - 56px)', width: '100%' }} />
}
