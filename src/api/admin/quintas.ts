import { apiClient } from '../client'
import type { Quinta } from '@/types/types'

export interface QuintaFormData {
  nombre: string
  descripcion?: string
  precioPorDia: number
  capacidad: number
  imagenes?: string[]
  direccion?: string
  pileta?: boolean
  parrilla?: boolean
  amenities?: string[]
  latitud?: number
  longitud?: number
  horaInicio?: string
  horaFin?: string
}

export const getQuintasAdmin = async (): Promise<Quinta[]> => {
  const { data } = await apiClient.get('/quintas')
  return data
}

export const createQuinta = async (body: QuintaFormData): Promise<{ id: string }> => {
  const { data } = await apiClient.post('/quintas', body)
  return data
}

export const updateQuinta = async (id: string, body: QuintaFormData): Promise<void> => {
  await apiClient.put(`/quintas/${id}`, body)
}

export const deleteQuinta = async (id: string): Promise<void> => {
  await apiClient.delete(`/quintas/${id}`)
}
