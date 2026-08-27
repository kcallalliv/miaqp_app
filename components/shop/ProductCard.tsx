"use client";

import type { Product } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";
import { ProductVisual } from "./ProductVisual";
import { Rating } from "@/components/ui/Rating";
import { CartIcon } from "@/components/ui/icons";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const off = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock <= 0;

  return (
    <article className="card group flex flex-col overflow-hidden transition-colors hover:border-[--color-volt]/50">
      {/* Visual */}
      <div className="relative aspect-square">
        <ProductVisual product={product} />

        {/* Insignias */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {off && (
            <span className="rounded-md bg-[--color-volt] px-2 py-0.5 text-xs font-bold text-[--color-carbon]">
              -{off}%
            </span>
          )}
          {product.badge && (
            <span className="rounded-md border border-[--color-graphite] bg-[--color-carbon]/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[--color-ink] backdrop-blur">
              {product.badge}
            </span>
          )}
        </div>

        {/* Disponibilidad */}
        <div className="absolute right-3 top-3">
          <span
            className={`metric-chip rounded-full border px-2 py-0.5 ${
              soldOut
                ? "border-[--color-graphite] text-[--color-muted]"
                : "border-[--color-volt]/40 text-[--color-volt]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                soldOut ? "bg-[--color-muted]" : "bg-[--color-volt]"
              }`}
            />
            {soldOut ? "Agotado" : "En stock"}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[--color-muted]">
            {product.brand}
          </span>
          <Rating value={product.rating} reviews={product.reviews} />
        </div>

        <h3 className="mt-1.5 font-display text-base font-semibold leading-tight text-[--color-ink]">
          {product.name}
        </h3>

        <div className="mt-3 flex items-end gap-2">
          <span className="font-display text-lg font-bold text-[--color-ink]">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="mb-0.5 text-sm text-[--color-muted] line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={soldOut}
          onClick={() =>
            add(product, {
              size: product.sizes[0],
              color: product.colors[0],
            })
          }
          className="btn-volt mt-4 w-full disabled:cursor-not-allowed disabled:bg-[--color-graphite] disabled:text-[--color-muted] disabled:shadow-none"
        >
          <CartIcon className="h-4 w-4" />
          {soldOut ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    </article>
  );
}
