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
