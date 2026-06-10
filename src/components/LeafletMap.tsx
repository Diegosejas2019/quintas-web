'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Quinta } from '@quintas-shared/types'

interface Props {
  quintas: Quinta[]
  disponiblesIds: Set<string>
  radioKm: number
}

function distanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function GeolocateAndFilter({
  quintas,
  disponiblesIds,
  radioKm,
}: Props) {
  const map = useMap()
  const [userPos, setUserPos] = useState<[number, number] | null>(null)

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 13 })
    map.on('locationfound', (e) => {
      setUserPos([e.latlng.lat, e.latlng.lng])
    })
    map.on('locationerror', () => {})
    return () => {
      map.off('locationfound')
      map.off('locationerror')
    }
  }, [map])

  const quintasFiltradas = quintas.filter(q => {
    if (q.latitud == null || q.longitud == null) return false
    if (!userPos || radioKm === 0) return true
    return distanciaKm(userPos[0], userPos[1], q.latitud, q.longitud) <= radioKm
  })

  return (
    <>
      {/* Marcador de posición del usuario */}
      {userPos && (
        <>
          <CircleMarker
            center={userPos}
            radius={8}
            pathOptions={{ color: '#2563EB', fillColor: '#3B82F6', fillOpacity: 0.9, weight: 2 }}
          />
          {radioKm > 0 && (
            <Circle
              center={userPos}
              radius={radioKm * 1000}
              pathOptions={{ color: '#6B4C35', fillColor: '#6B4C35', fillOpacity: 0.08, weight: 1.5 }}
            />
          )}
        </>
      )}

      {/* Marcadores de quintas */}
      {quintasFiltradas.map(q => {
        const disponible = disponiblesIds.has(q.id)
        const color = disponible ? '#4A7C59' : '#C0392B'
        return (
          <CircleMarker
            key={q.id}
            center={[q.latitud!, q.longitud!]}
            radius={10}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: 2 }}
          >
            <Popup>
              <div style={{ minWidth: 160 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#4A3020', margin: '0 0 4px' }}>{q.nombre}</p>
                <p style={{ fontSize: 13, color: '#6B4C35', margin: '0 0 4px' }}>
                  ${q.precioPorDia.toLocaleString('es-AR')}/noche
                </p>
                <p style={{ fontSize: 12, margin: '0 0 8px' }}>
                  {disponible
                    ? <span style={{ color: '#4A7C59', fontWeight: 600 }}>✅ Disponible</span>
                    : <span style={{ color: '#C0392B', fontWeight: 600 }}>❌ No disponible</span>
                  }
                </p>
                <a
                  href={`/quintas/${q.id}`}
                  style={{ fontSize: 12, color: '#6B4C35', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Ver detalle →
                </a>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </>
  )
}

export default function LeafletMap(props: Props) {
  return (
    <MapContainer
      center={[-31.4, -64.2]}
      zoom={9}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attributions">CARTO</a>'
      />
      <GeolocateAndFilter {...props} />
    </MapContainer>
  )
}
