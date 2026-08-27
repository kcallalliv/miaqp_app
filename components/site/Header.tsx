"use client";

import { useCart } from "@/components/cart/CartProvider";
import { Logo } from "@/components/ui/Logo";
import { CartIcon, SearchIcon } from "@/components/ui/icons";
import { CATEGORIES } from "@/lib/categories";

const NAV = CATEGORIES.slice(0, 5);

export function Header() {
  const { count, open } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-[--color-graphite] bg-[--color-carbon]/85 backdrop-blur-md">
      {/* Barra superior de anuncio */}
      <div className="border-b border-[--color-graphite] bg-[--color-anthracite]">
        <div className="container-cavi flex items-center justify-center gap-2 py-1.5 text-center text-[11px] tracking-wide text-[--color-muted]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[--color-volt]" />
          Envío gratis en compras sobre S/300 · Despacho a todo el Perú
        </div>
      </div>

      <div className="container-cavi flex items-center justify-between gap-6 py-4">
        <a href="#top" aria-label="CAVI STORE inicio">
          <Logo />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((c) => (
            <a
              key={c.id}
              href="#tienda"
              className="text-sm font-medium text-[--color-muted] transition-colors hover:text-[--color-ink]"
            >
              {c.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#tienda"
            className="hidden rounded-lg p-2.5 text-[--color-muted] hover:bg-[--color-surface] hover:text-[--color-ink] sm:block"
            aria-label="Buscar"
          >
            <SearchIcon className="h-5 w-5" />
          </a>
          <button
            onClick={open}
            className="relative rounded-lg p-2.5 text-[--color-ink] hover:bg-[--color-surface]"
            aria-label="Abrir carrito"
          >
            <CartIcon className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[--color-volt] px-1 text-[10px] font-bold text-[--color-carbon]">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
