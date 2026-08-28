import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { BoltIcon, ArrowRightIcon } from "@/components/ui/icons";

const FUELING = [
  {
    q: "¿Cuántos geles por hora?",
    a: "Apunta a 60–90 g de carbohidratos por hora. Son ~2–3 geles/h según la marca. En esfuerzos largos, entrena tu intestino subiendo de a poco.",
    metric: "60–90 g CHO /h",
  },
  {
    q: "¿Cuánta sal según tu sudoración?",
    a: "Repón 300–1500 mg de sodio por litro de sudor. Si sudas mucho o entrenas en altura y clima seco (Arequipa), ve al rango alto.",
    metric: "300–1500 mg Na /L",
  },
  {
    q: "¿Cuánto líquido por hora?",
    a: "Entre 400 y 800 ml/h según calor y ritmo. En altura la deshidratación es más silenciosa: bebe a sorbos, constante.",
    metric: "400–800 ml /h",
  },
];

const BRANDS = ["Maurten", "SiS", "Precision"];

export function NutritionGuide({ products }: { products: Product[] }) {
  const nutrition = products.filter((p) => p.sport === "nutricion").slice(0, 4);

  return (
    <section
      id="nutricion"
      className="scroll-mt-24 border-y border-[--color-graphite] bg-[--color-anthracite]"
    >
      <div className="container-cavi py-16 md:py-24">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="metric-chip mb-2 text-[--color-volt]">
              <BoltIcon className="h-3.5 w-3.5" />
              La especialidad de la casa
            </p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Nutrición y fueling
            </h2>
            <p className="mt-2 max-w-xl text-[--color-muted]">
              El combustible decide tu resultado. Te asesoramos según tu deporte,
              tu sudoración y la altura. Especialistas en{" "}
              <span className="text-[--color-ink]">{BRANDS.join(" · ")}</span>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((b) => (
              <span
                key={b}
                className="rounded-full border border-[--color-volt]/40 px-3 py-1 text-sm font-semibold text-[--color-volt]"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Mini-guía de fueling */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {FUELING.map((f) => (
            <div key={f.q} className="card p-5">
              <span className="metric-chip text-[--color-volt]">{f.metric}</span>
              <h3 className="mt-3 font-display text-base font-semibold text-[--color-ink]">
                {f.q}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[--color-muted]">
                {f.a}
              </p>
            </div>
          ))}
        </div>

        {/* Productos de nutrición destacados */}
        {nutrition.length > 0 && (
          <>
            <div className="mt-12 mb-5 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">
                Empieza por aquí
              </h3>
              <a
                href="#tienda"
                className="inline-flex items-center gap-1 text-sm font-medium text-[--color-muted] hover:text-[--color-volt]"
              >
                Ver toda la nutrición <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {nutrition.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
