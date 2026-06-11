import { apiClient } from './client'
import type { PerfilUsuario } from '@/types/types'

export const upsertUsuario = async (): Promise<PerfilUsuario> => {
  const { data } = await apiClient.post('/usuarios')
  return data
}

export const getPerfilUsuario = async (): Promise<PerfilUsuario> => {
  const { data } = await apiClient.get('/usuarios/me')
  return data
}

export const actualizarPerfil = async (payload: { nombre?: string; telefono?: string }): Promise<PerfilUsuario> => {
  const { data } = await apiClient.patch('/usuarios/me', payload)
  return data
}
