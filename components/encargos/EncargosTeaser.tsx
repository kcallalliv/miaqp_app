import Link from "next/link";

/** Franja promocional de "Encargos USA" para la home. Enlaza a /encargos. */
export function EncargosTeaser() {
  return (
    <section className="container-cavi py-10">
      <div className="relative overflow-hidden rounded-3xl border border-[--color-graphite] bg-[--color-anthracite] p-8 sm:p-10">
        {/* Glow de acento */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--color-volt)" }}
        />
        <div className="relative grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[--color-graphite] px-3 py-1 text-xs text-[--color-muted]">
              ✈️ Viaje de diciembre · cupos limitados
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-[--color-ink] sm:text-3xl">
              Encargos desde <span className="text-[--color-volt]">USA</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[--color-muted]">
              Traemos bajo pedido lo que no se consigue fácil en Perú — zapatillas,
              relojes, triatlón, natación y tecnología — a mejor precio. Reservas con
              el 50% y pagas el resto al recibir.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-[--color-muted]">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[--color-volt]" /> Precio con comisión transparente
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[--color-volt]" /> Cupos limitados por viaje
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[--color-volt]" /> 50% adelanto / 50% entrega
              </span>
            </div>
          </div>

          <div className="flex lg:justify-end">
            <Link
              href="/encargos"
              className="inline-flex items-center gap-2 rounded-xl bg-[--color-volt] px-6 py-3 text-sm font-semibold text-[--color-carbon] transition-colors hover:bg-[--color-volt-hover]"
            >
              Ver productos con cupo →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
