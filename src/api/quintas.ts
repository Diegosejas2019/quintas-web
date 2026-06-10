import { apiClient } from './client'
import type { Quinta, DisponibilidadResponse, EstefindeResponse, EstefindeFilters } from '@quintas-shared/types'

export const getQuintas = async (): Promise<Quinta[]> => {
  const { data } = await apiClient.get('/quintas')
  return data
}

export const getQuintaById = async (id: string): Promise<Quinta> => {
  const { data } = await apiClient.get(`/quintas/${id}`)
  return data
}

export const getEsteFinde = async (filters: EstefindeFilters = {}): Promise<EstefindeResponse> => {
  const params: Record<string, string> = {}
  if (filters.capacidad != null) params.capacidad = String(filters.capacidad)
  if (filters.precioMax  != null) params.precioMax  = String(filters.precioMax)
  if (filters.pileta     != null) params.pileta     = String(filters.pileta)
  if (filters.parrilla   != null) params.parrilla   = String(filters.parrilla)
  const { data } = await apiClient.get('/quintas/este-finde', { params })
  return data
}

export const getDisponibilidad = async (quintaId: string, mes: number, anio: number): Promise<DisponibilidadResponse> => {
  const { data } = await apiClient.get('/reservas/disponibilidad', { params: { quintaId, mes, anio } })
  return data
}

export const getDisponiblesEnFechas = async (fechaInicio: string, fechaFin: string): Promise<EstefindeResponse> => {
  const { data } = await apiClient.get('/quintas/disponibles', { params: { fechaInicio, fechaFin } })
  return data
}
