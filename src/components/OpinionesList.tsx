import type { Opinion } from '@/api/opiniones'

export default function OpinionesList({ opiniones }: { opiniones: Opinion[] }) {
  if (opiniones.length === 0) {
    return <p className="text-sm text-[#7A6559]">Sin reseñas todavía.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {opiniones.map((o) => (
        <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-[#6B4C35] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {o.nombreCliente[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#4A3020]">{o.nombreCliente}</p>
              <p className="text-xs text-[#7A6559]">{new Date(o.createdAt).toLocaleDateString('es-AR')}</p>
            </div>
          </div>
          <p className="text-xs mb-1">{'⭐'.repeat(o.calificacion)}</p>
          {o.comentario && <p className="text-sm text-[#7A6559] leading-5">{o.comentario}</p>}
        </div>
      ))}
    </div>
  )
}
