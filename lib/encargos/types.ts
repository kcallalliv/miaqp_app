export interface EncargoItem {
  id: string;
  titulo: string;
  categoria: string;
  marca?: string | null;
  descripcion?: string | null;
  imagen_url?: string | null;
  /** Precio en la tienda de USA (USD). */
  precio_usa: number;
  /** Referencia: a cuánto se consigue en Perú (PEN). */
  precio_peru_aprox?: number | null;
  /** Comisión de CAVI (PEN). */
  comision: number;
  /** Lo que paga el cliente, total (PEN). */
  precio_final: number;
  cupos_total: number;
  cupos_disponibles: number;
  agotado: boolean;
  fecha_limite?: string | null;
  destacado?: boolean;
}
