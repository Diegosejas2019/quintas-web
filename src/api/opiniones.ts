import { apiClient } from './client'

export interface Opinion {
  id: string
  nombreCliente: string
  calificacion: number
  comentario?: string
  createdAt: string
}

export interface OpinionesResult {
  opiniones: Opinion[]
  promedio: number
}

export const getOpiniones = async (quintaId: string): Promise<OpinionesResult> => {
  const { data } = await apiClient.get(`/opiniones/${quintaId}`)
  return data
}

export const crearOpinion = async (payload: {
  quintaId: string
  nombreCliente: string
  calificacion: number
  comentario?: string
}): Promise<void> => {
  await apiClient.post('/opiniones', payload)
}
