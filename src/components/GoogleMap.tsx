'use client'

import { useEffect, useState } from 'react'
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import type { Quinta } from '@/types/types'

interface Props {
  quintas: Quinta[]
  disponiblesIds: Set<string>
  radioKm: number
}

const DEFAULT_CENTER = { lat: -31.4, lng: -64.2 }
const DEFAULT_ZOOM = 9

function distanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function CirclePin({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: color,
        border: '2px solid white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }}
    />
  )
}

export default function GoogleMap({ quintas, disponiblesIds, radioKm }: Props) {
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserPos(loc)
        setCenter(loc)
        setZoom(12)
      },
      () => {},
    )
  }, [])

  const quintasFiltradas = quintas.filter((q) => {
    if (q.latitud == null || q.longitud == null) return false
    if (!userPos || radioKm === 0) return true
    return distanciaKm(userPos.lat, userPos.lng, q.latitud, q.longitud) <= radioKm
  })

  const selectedQuinta = selectedId ? quintasFiltradas.find((q) => q.id === selectedId) : null

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId="quintas-map"
        style={{ width: '100%', height: '100%' }}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        {/* Marcador de posición del usuario */}
        {userPos && (
          <AdvancedMarker position={userPos}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                border: '3px solid white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
              }}
            />
          </AdvancedMarker>
        )}

        {/* Marcadores de quintas */}
        {quintasFiltradas.map((q) => {
          const disponible = disponiblesIds.has(q.id)
          const color = disponible ? '#4A7C59' : '#C0392B'
          return (
            <AdvancedMarker
              key={q.id}
              position={{ lat: q.latitud!, lng: q.longitud! }}
              onClick={() => setSelectedId(q.id)}
            >
              <CirclePin color={color} />
            </AdvancedMarker>
          )
        })}

        {/* InfoWindow */}
        {selectedQuinta && selectedQuinta.latitud != null && selectedQuinta.longitud != null && (
          <InfoWindow
            position={{ lat: selectedQuinta.latitud, lng: selectedQuinta.longitud }}
            onCloseClick={() => setSelectedId(null)}
          >
            <div style={{ minWidth: 160, fontFamily: 'sans-serif' }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#4A3020', margin: '0 0 4px' }}>
                {selectedQuinta.nombre}
              </p>
              <p style={{ fontSize: 13, color: '#6B4C35', margin: '0 0 4px' }}>
                ${selectedQuinta.precioPorDia.toLocaleString('es-AR')}/día
              </p>
              <p style={{ fontSize: 12, margin: '0 0 8px' }}>
                {disponiblesIds.has(selectedQuinta.id) ? (
                  <span style={{ color: '#4A7C59', fontWeight: 600 }}>✅ Disponible</span>
                ) : (
                  <span style={{ color: '#C0392B', fontWeight: 600 }}>❌ No disponible</span>
                )}
              </p>
              <a
                href={`/quintas/${selectedQuinta.id}`}
                style={{ fontSize: 12, color: '#6B4C35', fontWeight: 600, textDecoration: 'underline' }}
              >
                Ver detalle →
              </a>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  )
}
