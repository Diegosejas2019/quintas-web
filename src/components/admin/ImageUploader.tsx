'use client'

import { useRef, useState } from 'react'

interface Props {
  value: string[]
  onChange: (urls: string[]) => void
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export default function ImageUploader({ value, onChange }: Props) {
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    const newErrors: string[] = []
    const uploads = Array.from(files).map(async (file) => {
      const key = file.name + file.size
      setUploading(u => ({ ...u, [key]: true }))
      try {
        const form = new FormData()
        form.append('file', file)
        form.append('upload_preset', UPLOAD_PRESET!)
        form.append('folder', 'quintas')
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: form,
        })
        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()
        return data.secure_url as string
      } catch {
        newErrors.push(`Error subiendo ${file.name}`)
        return null
      } finally {
        setUploading(u => { const next = { ...u }; delete next[key]; return next })
      }
    })
    const results = await Promise.all(uploads)
    const urls = results.filter((u): u is string => u !== null)
    if (urls.length) onChange([...value, ...urls])
    if (newErrors.length) setErrors(newErrors)
  }

  const remove = (url: string) => onChange(value.filter(u => u !== url))

  const isUploading = Object.keys(uploading).length > 0

  return (
    <div className="space-y-3">
      {/* Miniaturas */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(url => (
            <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/80"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botón agregar */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading || !CLOUD_NAME || !UPLOAD_PRESET}
        className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 hover:border-[#C4633A] hover:text-[#C4633A] disabled:opacity-50 transition-colors w-full justify-center"
      >
        {isUploading ? (
          <>
            <span className="w-4 h-4 border-2 border-[#C4633A] border-t-transparent rounded-full animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <span className="text-lg">📷</span>
            Agregar fotos
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />

      {(!CLOUD_NAME || !UPLOAD_PRESET) && (
        <p className="text-xs text-amber-600">⚠ Cloudinary no configurado (variables de entorno faltantes)</p>
      )}
      {errors.map((e, i) => (
        <p key={i} className="text-xs text-red-500">{e}</p>
      ))}
    </div>
  )
}
