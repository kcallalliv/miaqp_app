/** Configuración de Culqi en el cliente. */

export const CULQI_PUBLIC_KEY = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;

/** ¿Hay clave pública configurada? Si no, el checkout corre en modo demo. */
export function isCulqiEnabled(): boolean {
  return Boolean(CULQI_PUBLIC_KEY);
}

/** Culqi maneja montos en céntimos (enteros). S/ 199.90 -> 19990. */
export function toCulqiAmount(soles: number): number {
  return Math.round(soles * 100);
}
