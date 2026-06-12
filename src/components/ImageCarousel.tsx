'use client'

import { useState } from 'react'

interface Props {
  imagenes: string[]
  nombre: string
  fallback: React.ReactNode
}

export default function ImageCarousel({ imagenes, nombre, fallback }: Props) {
  const [current, setCurrent] = useState(0)

  if (!imagenes.length) {
    return <>{fallback}</>
  }

  const prev = () => setCurrent(i => (i - 1 + imagenes.length) % imagenes.length)
  const next = () => setCurrent(i => (i + 1) % imagenes.length)

  return (
    <>
      <img
        src={imagenes[current]}
        alt={`${nombre} ${current + 1}`}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {imagenes.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors"
            aria-label="Anterior"
          >‹</button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors"
            aria-label="Siguiente"
          >›</button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imagenes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/50'}`}
                aria-label={`Imagen ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}
