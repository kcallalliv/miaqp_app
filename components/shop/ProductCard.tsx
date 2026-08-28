"use client";

import type { Product } from "@/lib/types";
import { needsAdvice, isNutrition } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";
import { ProductVisual } from "./ProductVisual";
import { Rating } from "@/components/ui/Rating";
import { CartIcon, WhatsAppIcon } from "@/components/ui/icons";
import { whatsappUrl, adviceMessage, preorderMessage } from "@/lib/whatsapp";
import { track, EVENTS } from "@/lib/analytics";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const off = discountPercent(product.price, product.compareAtPrice);
  const preorder = product.fulfillment === "preorder";
  const nutrition = isNutrition(product);

  function trackWhatsApp(kind: "advice" | "preorder") {
    track(kind === "preorder" ? EVENTS.PREORDER_REQUEST : EVENTS.WHATSAPP_CLICK, {
      productId: product.id,
      community: product.sport,
      isNutrition: nutrition,
      brand: product.brand,
      source: "product",
      value: product.price,
    });
  }

  const preorderHref = whatsappUrl(preorderMessage(product.brand, product.name));
  const adviceHref = whatsappUrl(adviceMessage(product.brand, product.name));

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

        {/* Modelo de venta: stock / pre-orden */}
        <div className="absolute right-3 top-3">
          <span
            className={`metric-chip rounded-full border px-2 py-0.5 ${
              preorder
                ? "border-[#FFD43B]/50 text-[#FFD43B]"
                : "border-[--color-volt]/40 text-[--color-volt]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                preorder ? "bg-[#FFD43B]" : "bg-[--color-volt]"
              }`}
            />
            {preorder ? "Pre-orden" : "En stock"}
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

        {preorder && (
          <p className="mt-2 text-xs leading-snug text-[--color-muted]">
            Bajo pedido · te asesoramos la talla por WhatsApp · entrega estimada
            2–4 semanas.
          </p>
        )}

        {/* CTA principal */}
        <div className="mt-4 flex flex-col gap-2">
          {preorder ? (
            <a
              href={preorderHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsApp("preorder")}
              className="btn-volt w-full"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Pedir / consultar por WhatsApp
            </a>
          ) : (
            <button
              type="button"
              onClick={() =>
                add(product, {
                  size: product.sizes[0],
                  color: product.colors[0],
                })
              }
              className="btn-volt w-full"
            >
              <CartIcon className="h-4 w-4" />
              Agregar al carrito
            </button>
          )}

          {/* Asesoría para equipamiento caro en stock */}
          {!preorder && needsAdvice(product) && (
            <a
              href={adviceHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsApp("advice")}
              className="btn-ghost w-full text-sm"
            >
              <WhatsAppIcon className="h-4 w-4 text-[--color-volt]" />
              Consultar asesoría
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
