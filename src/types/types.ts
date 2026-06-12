export type EstadoReserva = 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Finalizada';
export type TipoSena = 'Fijo' | 'Porcentaje';

export interface Quinta {
  id: string;
  nombre: string;
  descripcion?: string;
  precioPorDia: number;
  capacidad: number;
  imagenes: string[];
  activa: boolean;
  pileta: boolean;
  parrilla: boolean;
  amenities?: string[];
  direccion?: string;
  latitud?: number;
  longitud?: number;
  horaInicio?: string;
  horaFin?: string;
}

export interface DisponibilidadResponse {
  fechasOcupadas: string[];
}

export interface EstefindeResponse {
  viernes: string;
  domingo: string;
  total: number;
  quintas: Quinta[];
}

export interface EstefindeFilters {
  capacidad?: number;
  precioMax?: number;
  pileta?: boolean;
  parrilla?: boolean;
  fechaInicio?: string; // ISO date string YYYY-MM-DD
  fechaFin?: string;    // ISO date string YYYY-MM-DD
}

export interface PerfilUsuario {
  id: string
  email: string
  nombre: string
  telefono?: string
  tipoUsuario: string
}

export interface MiReserva {
  id: string
  quintaId: string
  nombreQuinta: string
  fechaInicio: string
  fechaFin: string
  precioTotal: number
  estado: EstadoReserva
}

export interface FavoriteItem {
  id: string
  nombre: string
  precioPorDia: number
  direccion?: string
}

export interface Alerta {
  id: string;
  quintaId: string;
  quintaNombre: string;
  fechaInicio: string;
  fechaFin: string;
  email: string;
  notificado: boolean;
  createdAt: string;
}
