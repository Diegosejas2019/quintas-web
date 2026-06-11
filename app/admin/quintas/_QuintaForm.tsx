'use client'

import type { QuintaFormData } from '@/api/admin/quintas'
import type { Quinta } from '@/types/types'
import { useState } from 'react'

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
  const [direccion, setDireccion] = useState(initial?.direccion ?? '')
  const [imagenesRaw, setImagenesRaw] = useState((initial?.imagenes ?? []).join('\n'))
  const [amenitiesRaw, setAmenitiesRaw] = useState((initial?.amenities ?? []).join(', '))
  const [pileta, setPileta] = useState(initial?.pileta ?? false)
  const [parrilla, setParrilla] = useState(initial?.parrilla ?? false)
  const [latitud, setLatitud] = useState(String(initial?.latitud ?? ''))
  const [longitud, setLongitud] = useState(String(initial?.longitud ?? ''))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      nombre,
      descripcion: descripcion || undefined,
      precioPorDia: Number(precio),
      capacidad: Number(capacidad),
      imagenes: imagenesRaw.split('\n').map(s => s.trim()).filter(Boolean),
      amenities: amenitiesRaw.split(',').map(s => s.trim()).filter(Boolean),
      direccion: direccion || undefined,
      pileta,
      parrilla,
      latitud: latitud ? Number(latitud) : undefined,
      longitud: longitud ? Number(longitud) : undefined,
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
        {field('Dirección', direccion, setDireccion, { placeholder: 'Av. Colón 1234, Córdoba' })}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Imágenes</p>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">URLs de imágenes (una por línea)</label>
          <textarea
            value={imagenesRaw}
            onChange={e => setImagenesRaw(e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#C4633A]/30 font-mono text-xs"
            placeholder="https://ejemplo.com/foto1.jpg&#10;https://ejemplo.com/foto2.jpg"
          />
        </div>
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
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Otros amenities (separados por coma)</label>
          <input
            type="text"
            value={amenitiesRaw}
            onChange={e => setAmenitiesRaw(e.target.value)}
            placeholder="WiFi, Estacionamiento, Quincho cubierto"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4633A]/30"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Ubicación (opcional)</p>
        <div className="grid grid-cols-2 gap-3">
          {field('Latitud', latitud, setLatitud, { type: 'number', placeholder: '-31.4135' })}
          {field('Longitud', longitud, setLongitud, { type: 'number', placeholder: '-64.1811' })}
        </div>
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
