import type { Product } from "@/lib/types";

/**
 * Visual de producto tipo "estudio" mientras no hay fotografía real.
 * En la Etapa 2 se sustituye por <Image> con las fotos del catálogo.
 */
export function ProductVisual({ product }: { product: Product }) {
  const initials = product.brand.slice(0, 2).toUpperCase();
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(120% 120% at 50% 0%, ${product.accent}1f 0%, #202529 45%, #15191C 100%)`,
      }}
    >
      {/* Grid técnico sutil */}
      <div className="bg-grid absolute inset-0 opacity-40" />
      {/* Halo de marca */}
      <div
        className="absolute h-40 w-40 rounded-full blur-3xl"
        style={{ background: product.accent, opacity: 0.16 }}
      />
      <div className="relative flex flex-col items-center">
        <span
          className="font-display text-4xl font-bold tracking-tight"
          style={{ color: product.accent }}
        >
          {initials}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[--color-muted]">
          {product.brand}
        </span>
      </div>
    </div>
  );
}
