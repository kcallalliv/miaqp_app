import { TruckIcon, ShieldIcon, ReturnIcon, BoltIcon } from "@/components/ui/icons";

const PROPS = [
  {
    icon: ShieldIcon,
    title: "100% originales",
    desc: "Solo productos auténticos de marcas oficiales.",
  },
  {
    icon: TruckIcon,
    title: "Envío nacional 24–72h",
    desc: "A todo el Perú. Gratis desde S/300.",
  },
  {
    icon: ReturnIcon,
    title: "Cambios 30 días",
    desc: "Cambios y devoluciones sin complicaciones.",
  },
  {
    icon: BoltIcon,
    title: "Asesoría experta",
    desc: "Te asesoramos por WhatsApp según tu objetivo.",
  },
];

export function ValueProps() {
  return (
    <section className="border-y border-[--color-graphite] bg-[--color-anthracite]">
      <div className="container-cavi grid grid-cols-1 gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {PROPS.map((p) => (
          <div key={p.title} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[--color-graphite] bg-[--color-surface] text-[--color-volt]">
              <p.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold text-[--color-ink]">
                {p.title}
              </h3>
              <p className="mt-0.5 text-sm text-[--color-muted]">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
