'use client'

import type { QuintaFormData } from '@/api/admin/quintas'
import type { Quinta } from '@/types/types'
import { useState } from 'react'
import ImageUploader from '@/components/admin/ImageUploader'
import { AMENITY_MAP } from '@/lib/amenities'
import dynamic from 'next/dynamic'
const LocationPicker = dynamic(() => import('@/components/admin/LocationPicker'), { ssr: false })

interface Props {
  initial?: Quinta
  onSubmit: (data: QuintaFormData) => void
  isLoading: boolean
  submitLabel: string
  onDelete?: () => void
}

export default function QuintaForm({ initial, onSubmit, isLoading, submitLabel, onDelete }: Props) {
  const [nombre, setNombre] = useState(initial?.nombre ?? '')
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? '')
  const [precio, setPrecio] = useState(String(initial?.precioPorDia ?? ''))
  const [capacidad, setCapacidad] = useState(String(initial?.capacidad ?? ''))
  const [imagenes, setImagenes] = useState<string[]>(initial?.imagenes ?? [])
  const [amenitiesSet, setAmenitiesSet] = useState<Set<string>>(new Set(initial?.amenities ?? []))
  const toggleAmenity = (key: string) => setAmenitiesSet(prev => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })
  const [pileta, setPileta] = useState(initial?.pileta ?? false)
  const [parrilla, setParrilla] = useState(initial?.parrilla ?? false)
  const [horaInicio, setHoraInicio] = useState(initial?.horaInicio ?? '')
  const [horaFin, setHoraFin] = useState(initial?.horaFin ?? '')
  const [location, setLocation] = useState({
    lat: initial?.latitud ?? 0,
    lng: initial?.longitud ?? 0,
    direccion: initial?.direccion ?? '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      nombre,
      descripcion: descripcion || undefined,
      precioPorDia: Number(precio),
      capacidad: Number(capacidad),
      imagenes,
      amenities: Array.from(amenitiesSet),
      direccion: location.direccion || undefined,
      pileta,
      parrilla,
      latitud: location.lat || undefined,
      longitud: location.lng || undefined,
      horaInicio: horaInicio || undefined,
      horaFin: horaFin || undefined,
    })
  }

  const field = (label: string, value: string, set: (v: string) => void, opts?: { type?: string; placeholder?: string }) => (
    <div key={label}>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <input
        type={opts?.type ?? 'text'}
        value={value}
        onChange={e => set(e.target.value)}
        placeholder={opts?.placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4633A]/30"
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Información básica</p>
        {field('Nombre *', nombre, setNombre, { placeholder: 'Quinta Los Álamos' })}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#C4633A]/30"
            placeholder="Descripción opcional..."
          />
        </div>
        {field('Precio por día ($) *', precio, setPrecio, { type: 'number', placeholder: '15000' })}
        {field('Capacidad (personas) *', capacidad, setCapacidad, { type: 'number', placeholder: '10' })}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Imágenes</p>
        <ImageUploader value={imagenes} onChange={setImagenes} />
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Amenities y servicios</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#2C1810]">Pileta</span>
          <button
            type="button"
            onClick={() => setPileta(!pileta)}
            className={`w-12 h-6 rounded-full transition-colors ${pileta ? 'bg-[#C4633A]' : 'bg-gray-200'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${pileta ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#2C1810]">Parrilla</span>
          <button
            type="button"
            onClick={() => setParrilla(!parrilla)}
            className={`w-12 h-6 rounded-full transition-colors ${parrilla ? 'bg-[#C4633A]' : 'bg-gray-200'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${parrilla ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
        {Object.entries(AMENITY_MAP).map(([key, { emoji, label }]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#2C1810]">{emoji} {label}</span>
            <button
              type="button"
              onClick={() => toggleAmenity(key)}
              className={`w-12 h-6 rounded-full transition-colors ${amenitiesSet.has(key) ? 'bg-[#C4633A]' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${amenitiesSet.has(key) ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Horario de ocupación (opcional)</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Hora de ingreso</label>
            <input
              type="time"
              value={horaInicio}
              onChange={e => setHoraInicio(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4633A]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Hora de salida</label>
            <input
              type="time"
              value={horaFin}
              onChange={e => setHoraFin(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4633A]/30"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400">Si no se especifica, se mostrará el horario default (10:00 – 19:00)</p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Ubicación (opcional)</p>
        <LocationPicker value={location} onChange={setLocation} />
      </div>

      <button
        type="submit"
        disabled={isLoading || !nombre || !precio || !capacidad}
        className="w-full bg-[#C4633A] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#b05530] disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'Guardando...' : submitLabel}
      </button>

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="w-full bg-red-50 text-red-600 rounded-xl py-3 font-semibold text-sm hover:bg-red-100 transition-colors"
        >
          Desactivar quinta
        </button>
      )}
    </form>
  )
}
