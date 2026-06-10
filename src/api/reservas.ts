import { apiClient } from './client'

export const crearReserva = async (payload: {
  quintaId: string
  nombreCliente: string
  emailCliente: string
  telefonoCliente: string
  fechaInicio: string
  fechaFin: string
}): Promise<{ id: string }> => {
  const { data } = await apiClient.post('/reservas', payload)
  return data
}
