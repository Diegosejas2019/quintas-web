import { apiClient } from './client'

export const getFavoritos = async (): Promise<string[]> => {
  const { data } = await apiClient.get('/usuarios/me/favoritos')
  return data
}

export const syncFavoritos = async (quintaIds: string[]): Promise<string[]> => {
  const { data } = await apiClient.post('/usuarios/me/favoritos/sync', { quintaIds })
  return data
}
