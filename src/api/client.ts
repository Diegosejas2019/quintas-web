import axios from 'axios'
import { supabase } from '@/lib/supabase'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})
