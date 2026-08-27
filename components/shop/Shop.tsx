"use client";

import { useMemo, useState } from "react";
import type { Product, Sport } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { ProductCard } from "./ProductCard";
import { SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const PRICE_BANDS = [
  { id: "all", label: "Todos" },
  { id: "0-300", label: "Hasta S/300" },
  { id: "300-800", label: "S/300 – S/800" },
  { id: "800-1500", label: "S/800 – S/1500" },
  { id: "1500+", label: "S/1500+" },
] as const;

type PriceBand = (typeof PRICE_BANDS)[number]["id"];

function inBand(price: number, band: PriceBand): boolean {
  switch (band) {
    case "0-300":
      return price <= 300;
    case "300-800":
      return price > 300 && price <= 800;
    case "800-1500":
      return price > 800 && price <= 1500;
    case "1500+":
      return price > 1500;
    default:
      return true;
  }
}

export function Shop({
  products,
  demo = false,
}: {
  products: Product[];
  demo?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState<Sport | "all">("all");
  const [brand, setBrand] = useState<string>("all");
  const [size, setSize] = useState<string>("all");
  const [band, setBand] = useState<PriceBand>("all");

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products],
  );
  const sizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.sizes))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (sport !== "all" && p.sport !== sport) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (size !== "all" && !p.sizes.includes(size)) return false;
      if (!inBand(p.price, band)) return false;
      if (q && !`${p.name} ${p.brand}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, search, sport, brand, size, band]);

  const activeSelect =
    "rounded-lg border border-[--color-graphite] bg-[--color-surface] px-3 py-2 text-sm text-[--color-ink] outline-none focus:border-[--color-volt]";

  return (
    <section id="tienda" className="container-cavi scroll-mt-24 py-16 md:py-24">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="metric-chip mb-2 text-[--color-volt]">
            <span className="h-1.5 w-1.5 rounded-full bg-[--color-volt]" />
            Catálogo
          </p>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Equípate por deporte
          </h2>
        </div>
        <p className="text-sm text-[--color-muted]">
          {filtered.length} de {products.length} productos
        </p>
      </div>

      {demo && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[--color-graphite] bg-[--color-anthracite] px-3 py-1.5 text-xs text-[--color-muted]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD43B]" />
          Catálogo de demostración · conéctate a Medusa para datos reales
        </p>
      )}

      {/* Chips de deporte */}
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSport("all")}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            sport === "all"
              ? "border-[--color-volt] bg-[--color-volt] text-[--color-carbon]"
              : "border-[--color-graphite] text-[--color-muted] hover:border-[--color-volt]/50 hover:text-[--color-ink]",
          )}
        >
          Todo
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSport(c.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              sport === c.id
                ? "border-[--color-volt] bg-[--color-volt] text-[--color-carbon]"
                : "border-[--color-graphite] text-[--color-muted] hover:border-[--color-volt]/50 hover:text-[--color-ink]",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Barra de filtros */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 md:min-w-[240px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[--color-muted]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto o marca…"
            className="w-full rounded-lg border border-[--color-graphite] bg-[--color-surface] py-2 pl-9 pr-3 text-sm text-[--color-ink] outline-none placeholder:text-[--color-muted] focus:border-[--color-volt]"
          />
        </div>

        <select value={brand} onChange={(e) => setBrand(e.target.value)} className={activeSelect}>
          <option value="all">Marca</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select value={size} onChange={(e) => setSize(e.target.value)} className={activeSelect}>
          <option value="all">Talla</option>
          {sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select value={band} onChange={(e) => setBand(e.target.value as PriceBand)} className={activeSelect}>
          {PRICE_BANDS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-16 text-center text-[--color-muted]">
          No encontramos productos con esos filtros.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
