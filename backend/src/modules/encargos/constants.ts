/** Encargos desde el extranjero (personal shopper / traer bajo pedido en un viaje). */

export const CATEGORIAS_ENCARGO = [
  "running",
  "triatlon",
  "natacion",
  "ciclismo",
  "zapatillas",
  "ropa",
  "tecnologia",
  "nutricion",
  "otro",
] as const;

export type CategoriaEncargo = (typeof CATEGORIAS_ENCARGO)[number];
