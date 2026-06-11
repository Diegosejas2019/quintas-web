import { apiClient } from '../client'

export interface DashboardData {
  totalQuintas: number
  reservasPendientes: number
  reservasConfirmadas: number
  reservasFinalizadas: number
  ingresosTotales: number
  ingresosEsteMes: number
}

export const getDashboard = async (): Promise<DashboardData> => {
  const { data } = await apiClient.get('/dashboard')
  return data
}
