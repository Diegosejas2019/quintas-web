'use client'

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { useState } from 'react'

interface Location {
  lat: number
  lng: number
  direccion: string
}

interface Props {
  value: Location
  onChange: (loc: Location) => void
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

export default function LocationPicker({ value, onChange }: Props) {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  const center = value.lat && value.lng
    ? { lat: value.lat, lng: value.lng }
    : { lat: -31.4135, lng: -64.1811 }

  const geocode = async () => {
    if (!query.trim()) return
    setSearching(true)
    setError('')
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${API_KEY}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.status !== 'OK' || !data.results.length) {
        setError('No se encontró la dirección')
        return
      }
      const r = data.results[0]
      onChange({
        lat: r.geometry.location.lat,
        lng: r.geometry.location.lng,
        direccion: r.formatted_address,
      })
    } catch {
      setError('Error al buscar')
    } finally {
      setSearching(false)
    }
  }

  const handleMapClick = async (e: { detail: { latLng: { lat: number; lng: number } | null } }) => {
    const latLng = e.detail.latLng
    if (!latLng) return
    const { lat, lng } = latLng
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
      const res = await fetch(url)
      const data = await res.json()
      const dir = data.results?.[0]?.formatted_address ?? `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      onChange({ lat, lng, direccion: dir })
    } catch {
      onChange({ lat, lng, direccion: `${lat.toFixed(6)}, ${lng.toFixed(6)}` })
    }
  }

  if (!API_KEY) {
    return (
      <p className="text-xs text-amber-600">⚠ Google Maps no configurado (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY faltante)</p>
    )
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="space-y-3">
        {/* Buscador de dirección */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), geocode())}
            placeholder="Buscar dirección..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4633A]/30"
          />
          <button
            type="button"
            onClick={geocode}
            disabled={searching}
            className="px-4 py-2.5 bg-[#C4633A] text-white rounded-xl text-sm font-semibold hover:bg-[#b05530] disabled:opacity-50 transition-colors"
          >
            {searching ? '...' : 'Buscar'}
          </button>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        {value.direccion && (
          <p className="text-xs text-gray-500 truncate">📍 {value.direccion}</p>
        )}

        {/* Mapa */}
        <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 260 }}>
          <Map
            defaultCenter={center}
            center={center}
            defaultZoom={13}
            mapId="quintas-location-picker"
            onClick={handleMapClick}
            gestureHandling="greedy"
            disableDefaultUI
          >
            {value.lat && value.lng && (
              <AdvancedMarker position={{ lat: value.lat, lng: value.lng }} />
            )}
          </Map>
        </div>

        <p className="text-xs text-gray-400">Hacé click en el mapa o buscá una dirección para fijar la ubicación</p>

        {value.lat && value.lng && (
          <p className="text-xs text-gray-400 font-mono">
            {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
          </p>
        )}
      </div>
    </APIProvider>
  )
}
