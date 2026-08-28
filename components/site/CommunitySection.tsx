import { BoltIcon } from "@/components/ui/icons";
import { EventsAgenda } from "@/components/events/EventsAgenda";
import type { EventItem } from "@/lib/events/types";

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

export function CommunitySection({
  events,
  eventsDemo,
}: {
  events: EventItem[];
  eventsDemo?: boolean;
}) {
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

      {/* Voces de la comunidad */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

      {/* Agenda de eventos de endurance (Perú) */}
      <EventsAgenda events={events} demo={eventsDemo} />
    </section>
  );
}
