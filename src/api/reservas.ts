import { apiClient } from './client'
import type { MiReserva } from '@/types/types'

export const crearReserva = async (payload: {
  quintaId: string
  nombreCliente: string
  emailCliente: string
  telefonoCliente: string
  fechaInicio: string
  fechaFin: string
  usuarioId?: string
}): Promise<{ id: string }> => {
  const { data } = await apiClient.post('/reservas', payload)
  return data
}

export const getMisReservas = async (): Promise<MiReserva[]> => {
  const { data } = await apiClient.get('/reservas/mias')
  return data
}
