import { COMMUNITIES } from "@/lib/categories";
import { ArrowRightIcon } from "@/components/ui/icons";

export function CategoryGrid() {
  return (
    <section id="comunidades" className="container-cavi scroll-mt-24 py-16 md:py-24">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="metric-chip mb-2 text-[--color-volt]">
            <span className="h-1.5 w-1.5 rounded-full bg-[--color-volt]" />
            Comunidades endurance
          </p>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Elige tu comunidad
          </h2>
        </div>
        <a
          href="#tienda"
          className="hidden items-center gap-1 text-sm font-medium text-[--color-muted] hover:text-[--color-volt] sm:flex"
        >
          Ver todo <ArrowRightIcon className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {COMMUNITIES.map((c) => (
          <a
            key={c.id}
            href="#tienda"
            className="group card relative flex min-h-[160px] flex-col justify-between overflow-hidden p-5 transition-all hover:border-[--color-volt]/50"
          >
            <div
              className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl transition-opacity group-hover:opacity-100"
              style={{ background: c.accent, opacity: 0.12 }}
            />
            <div className="relative flex items-start justify-between">
              <span
                className="metric-chip rounded-full border px-2 py-0.5"
                style={{ borderColor: `${c.accent}55`, color: c.accent }}
              >
                {c.metric}
              </span>
            </div>
            <div className="relative">
              <h3 className="font-display text-lg font-bold text-[--color-ink]">
                {c.name}
              </h3>
              <p className="mt-0.5 text-sm text-[--color-muted]">{c.tagline}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[--color-volt] opacity-0 transition-opacity group-hover:opacity-100">
                Comprar <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
