/**
 * Cliente ligero para la Store API de Medusa v2.
 *
 * Usamos `fetch` directo (sin SDK) para mantener el storefront sin dependencias
 * pesadas y para poder llamarlo cómodamente desde Server Components.
 *
 * Si las variables de entorno no están configuradas, `isMedusaEnabled()` es
 * false y la capa de catálogo (`lib/catalog.ts`) cae al catálogo mock. Así el
 * sitio sigue funcionando en local sin backend.
 */

export const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL?.replace(
  /\/$/,
  "",
);
export const MEDUSA_PUBLISHABLE_KEY = process.env.MEDUSA_PUBLISHABLE_KEY;
export const MEDUSA_REGION_ID = process.env.MEDUSA_REGION_ID;

export function isMedusaEnabled(): boolean {
  return Boolean(MEDUSA_BACKEND_URL && MEDUSA_PUBLISHABLE_KEY);
}

/**
 * GET contra la Store API. Devuelve `null` ante cualquier fallo (red, HTTP,
 * parseo) para que el llamador decida el fallback en vez de romper el render.
 */
export async function medusaFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  init?: RequestInit,
): Promise<T | null> {
  if (!isMedusaEnabled()) return null;

  const url = new URL(`${MEDUSA_BACKEND_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  try {
    const res = await fetch(url.toString(), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY as string,
        ...(init?.headers ?? {}),
      },
      // ISR: revalida cada 60 s cuando hay backend.
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.warn(`[medusa] ${path} → HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[medusa] ${path} → error`, err);
    return null;
  }
}
