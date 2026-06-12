import { getDisponibilidad } from '@/api/quintas'

function getMesesEnRango(desde: string, hasta: string): { mes: number; anio: number }[] {
  const start = new Date(desde + 'T12:00:00')
  const end = new Date(hasta + 'T12:00:00')
  const meses: { mes: number; anio: number }[] = []
  const cur = new Date(start.getFullYear(), start.getMonth(), 1)
  while (cur <= end) {
    meses.push({ mes: cur.getMonth() + 1, anio: cur.getFullYear() })
    cur.setMonth(cur.getMonth() + 1)
  }
  return meses
}

function getFechasEnRango(desde: string, hasta: string): string[] {
  const fechas: string[] = []
  const cur = new Date(desde + 'T12:00:00')
  const end = new Date(hasta + 'T12:00:00')
  while (cur <= end) {
    fechas.push(cur.toISOString().split('T')[0])
    cur.setDate(cur.getDate() + 1)
  }
  return fechas
}

export async function checkDisponible(quintaId: string, desde: string, hasta: string): Promise<boolean> {
  const meses = getMesesEnRango(desde, hasta)
  const results = await Promise.all(meses.map(m => getDisponibilidad(quintaId, m.mes, m.anio)))
  const ocupadas = new Set(results.flatMap(r => r.fechasOcupadas))
  return !getFechasEnRango(desde, hasta).some(f => ocupadas.has(f))
}
