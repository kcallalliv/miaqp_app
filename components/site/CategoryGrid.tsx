import { CATEGORIES } from "@/lib/categories";
import { ArrowRightIcon } from "@/components/ui/icons";

export function CategoryGrid() {
  return (
    <section id="categorias" className="container-cavi scroll-mt-24 py-16 md:py-24">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="metric-chip mb-2 text-[--color-volt]">
            <span className="h-1.5 w-1.5 rounded-full bg-[--color-volt]" />
            Disciplinas
          </p>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Elige tu terreno
          </h2>
        </div>
        <a
          href="#tienda"
          className="hidden items-center gap-1 text-sm font-medium text-[--color-muted] hover:text-[--color-volt] sm:flex"
        >
          Ver todo <ArrowRightIcon className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {CATEGORIES.map((c, i) => (
          <a
            key={c.id}
            href="#tienda"
            className={`group card relative flex flex-col justify-between overflow-hidden p-5 transition-all hover:border-[--color-volt]/50 ${
              i === 0 || i === 3 ? "md:row-span-2 md:min-h-[220px]" : "min-h-[150px]"
            }`}
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
