import { ArrowRightIcon, BoltIcon } from "@/components/ui/icons";

const METRICS = [
  { label: "Pace", value: "4:12", unit: "/km" },
  { label: "Potencia", value: "312", unit: "W" },
  { label: "FC", value: "148", unit: "bpm" },
  { label: "Distancia", value: "21.1", unit: "km" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-[--color-graphite]">
      {/* Fondo técnico */}
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div
        className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(184,255,50,0.14), transparent 65%)" }}
      />
      <div
        className="absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(92,124,250,0.10), transparent 65%)" }}
      />

      <div className="container-cavi relative grid gap-12 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* Texto */}
        <div>
          <p className="metric-chip mb-5 rounded-full border border-[--color-graphite] bg-[--color-anthracite] px-3 py-1 text-[--color-volt]">
            <BoltIcon className="h-3 w-3" />
            Endurance · Arequipa, Perú
          </p>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl xl:text-7xl">
            SALUD A TRAVÉS
            <br />
            DEL DEPORTE.
            <br />
            <span className="text-gradient-volt">ROMPE TUS LÍMITES.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-[--color-muted]">
            Nutrición, fueling y equipamiento para endurance — del principiante al
            atleta de élite. Cinco comunidades:{" "}
            <span className="text-[--color-ink]">
              Trail, Triatlón, Ruta, Aguas abiertas y Ciclismo.
            </span>{" "}
            Asesoría experta y despacho a todo el país.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#nutricion" className="btn-volt">
              Comprar nutrición
              <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a href="#comunidades" className="btn-ghost">
              Explorar por deporte
            </a>
          </div>

          {/* KPIs de confianza */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            <Stat value="5" label="Comunidades endurance" />
            <Stat value="Altura" label="Hidratación y sales" />
            <Stat value="24-72h" label="Envío nacional" />
          </div>
        </div>

        {/* Panel de métricas (detalle deportivo) */}
        <div className="relative">
          <div className="card relative overflow-hidden p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="metric-chip text-[--color-volt]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[--color-volt]" />
                Sesión en vivo
              </span>
              <span className="metric-chip">CAVI · TRACK</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {METRICS.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-[--color-graphite] bg-[--color-anthracite] p-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[--color-muted]">
                    {m.label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-[--color-ink]">
                    {m.value}
                    <span className="ml-1 text-sm font-medium text-[--color-muted]">
                      {m.unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Barra de elevación estilizada */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="metric-chip">Elevación</span>
                <span className="text-xs text-[--color-muted]">+842 m</span>
              </div>
              <svg viewBox="0 0 300 60" className="h-14 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="elevfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B8FF32" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#B8FF32" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 45 L30 40 L60 48 L90 30 L120 34 L150 18 L180 26 L210 12 L240 22 L270 8 L300 16 L300 60 L0 60 Z"
                  fill="url(#elevfill)"
                />
                <path
                  d="M0 45 L30 40 L60 48 L90 30 L120 34 L150 18 L180 26 L210 12 L240 22 L270 8 L300 16"
                  fill="none"
                  stroke="#B8FF32"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-xl font-bold text-[--color-ink]">{value}</p>
      <p className="text-xs text-[--color-muted]">{label}</p>
    </div>
  );
}
