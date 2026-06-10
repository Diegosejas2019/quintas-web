import { apiClient } from './client'

export interface Alerta {
  id: string
  quintaId: string
  fechaInicio: string
  fechaFin: string
  email: string
  notificado: boolean
  createdAt: string
}

export const crearAlerta = async (payload: {
  quintaId: string
  fechaInicio: string
  fechaFin: string
  email: string
}): Promise<void> => {
  await apiClient.post('/alertas', payload)
}

export const getAlertas = async (): Promise<Alerta[]> => {
  const { data } = await apiClient.get('/alertas')
  return data
}

export const eliminarAlerta = async (id: string): Promise<void> => {
  await apiClient.delete(`/alertas/${id}`)
}
