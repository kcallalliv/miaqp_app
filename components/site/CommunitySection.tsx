import { BoltIcon } from "@/components/ui/icons";

const RACES = [
  {
    name: "Misti Ultra Summit",
    place: "Arequipa · Volcán Misti",
    tag: "Trail · Ultra",
    accent: "#FF7A45",
  },
  {
    name: "Misti SkyRace",
    place: "Arequipa · Altura",
    tag: "Sky · Vertical",
    accent: "#4DABF7",
  },
  {
    name: "Tu próxima meta",
    place: "¿Corres una carrera? Cuéntanos",
    tag: "Comunidad",
    accent: "#B8FF32",
  },
];

const VOICES = [
  {
    quote:
      "Entreno en altura y las sales de Precision me cambiaron las salidas largas. Acá me asesoraron según mi sudoración.",
    who: "Rosa M. · Trail runner, Arequipa",
  },
  {
    quote:
      "Pedí mi trisuit bajo pedido y me ayudaron con la talla por WhatsApp. Llegó perfecto para mi primer 70.3.",
    who: "Diego C. · Triatleta",
  },
  {
    quote:
      "El fueling con Maurten en el Misti fue otro nivel. Buenísima la asesoría.",
    who: "Andrés P. · Ciclismo y trail",
  },
];

export function CommunitySection() {
  return (
    <section id="comunidad" className="container-cavi scroll-mt-24 py-16 md:py-24">
      <div className="mb-8">
        <p className="metric-chip mb-2 text-[--color-volt]">
          <BoltIcon className="h-3.5 w-3.5" />
          Comunidad CAVI
        </p>
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Entrenamos con objetivos, juntos
        </h2>
        <p className="mt-2 max-w-xl text-[--color-muted]">
          Somos atletas que rompen sus límites en la montaña, el asfalto y el
          agua. Base en Arequipa, presentes en las carreras que nos mueven.
        </p>
      </div>

      {/* Carreras locales */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {RACES.map((r) => (
          <div key={r.name} className="card relative overflow-hidden p-5">
            <div
              className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl"
              style={{ background: r.accent, opacity: 0.14 }}
            />
            <span
              className="metric-chip rounded-full border px-2 py-0.5"
              style={{ borderColor: `${r.accent}55`, color: r.accent }}
            >
              {r.tag}
            </span>
            <h3 className="mt-3 font-display text-lg font-bold text-[--color-ink]">
              {r.name}
            </h3>
            <p className="mt-0.5 text-sm text-[--color-muted]">{r.place}</p>
          </div>
        ))}
      </div>

      {/* Voces de la comunidad */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {VOICES.map((v) => (
          <figure key={v.who} className="card p-5">
            <blockquote className="text-sm leading-relaxed text-[--color-ink]">
              “{v.quote}”
            </blockquote>
            <figcaption className="mt-3 text-xs font-medium text-[--color-muted]">
              {v.who}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
