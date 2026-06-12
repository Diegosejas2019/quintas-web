import { apiClient } from '../client'
import type { EstadoReserva, TipoSena } from '@/types/types'

export interface ReservaAdmin {
  id: string
  quintaId: string
  nombreQuinta: string
  nombreCliente: string
  emailCliente: string
  telefonoCliente: string
  fechaInicio: string
  fechaFin: string
  cantidadDias: number
  precioPorDia: number
  precioTotal: number
  estado: EstadoReserva
  sena?: {
    id: string
    monto: number
    tipo: TipoSena
    porcentaje?: number
    fechaPago: string
    metodoPago: string
  }
  createdAt: string
}

export interface CreateReservaAdminDto {
  quintaId: string
  nombreCliente: string
  emailCliente: string
  telefonoCliente: string
  fechaInicio: string
  fechaFin: string
}

export interface RegistrarSenaDto {
  monto: number
  tipo: TipoSena
  porcentaje?: number
  fechaPago: string
  metodoPago: string
}

export const getReservasAdmin = async (estado?: EstadoReserva): Promise<ReservaAdmin[]> => {
  const params = estado ? { estado } : {}
  const { data } = await apiClient.get('/reservas', { params })
  return data
}

export const createReservaAdmin = async (body: CreateReservaAdminDto): Promise<{ id: string }> => {
  const { data } = await apiClient.post('/reservas', body)
  return data
}

export const confirmarReserva = async (id: string): Promise<void> => {
  await apiClient.put(`/reservas/${id}/confirmar`)
}

export const cancelarReserva = async (id: string): Promise<void> => {
  await apiClient.put(`/reservas/${id}/cancelar`)
}

export const finalizarReserva = async (id: string): Promise<void> => {
  await apiClient.put(`/reservas/${id}/finalizar`)
}

export const registrarSena = async (id: string, body: RegistrarSenaDto): Promise<void> => {
  await apiClient.post(`/reservas/${id}/sena`, body)
}
