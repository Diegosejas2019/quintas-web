import { apiClient } from '../client'
import type { Conversacion, Mensaje } from '@/types/types'

export const getConversacionesByQuinta = async (quintaId: string): Promise<Conversacion[]> => {
  const { data } = await apiClient.get('/conversaciones', { params: { quintaId } })
  return data
}

export const getMensajes = async (conversacionId: string): Promise<Mensaje[]> => {
  const { data } = await apiClient.get(`/conversaciones/${conversacionId}/mensajes`)
  return data
}

export const enviarMensaje = async (conversacionId: string, texto: string): Promise<Mensaje> => {
  const { data } = await apiClient.post(`/conversaciones/${conversacionId}/mensajes`, { texto })
  return data
}

export const marcarLeida = async (conversacionId: string): Promise<void> => {
  await apiClient.patch(`/conversaciones/${conversacionId}/leer`)
}
