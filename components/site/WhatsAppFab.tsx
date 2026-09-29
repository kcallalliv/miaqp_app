"use client";

import { useEffect, useRef, useState } from "react";
import {
  whatsappUrl,
  supportMessage,
  advisoryMessage,
} from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";
import { track, EVENTS } from "@/lib/analytics";
import {
  EXPERIMENTS,
  getVariant,
  exposureAlreadyTracked,
  type Variant,
} from "@/lib/experiments";
import {
  isHighIntent,
  leansNutrition,
  getIntentScore,
  INTENT_EVENT,
} from "@/lib/intent";

/**
 * Botón flotante de WhatsApp con experimento A/B `wa_advisory_v1`.
 *
 * - control: comportamiento clásico (se expande al pasar el cursor).
 * - smart:   en sesiones de ALTA INTENCIÓN el CTA se abre solo, con copy de
 *   asesoría contextual (nutrición si el interés se inclina a fueling).
 *
 * Se mide `whatsapp_click` etiquetado con variante e intención → CTR por
 * variante en BigQuery (ver warehouse/queries/experimento_asesoria_whatsapp.sql).
 */
export function WhatsAppFab() {
  const [variant, setVariant] = useState<Variant>("control");
  const [proactive, setProactive] = useState(false);
  const [nutrition, setNutrition] = useState(false);
  const shownRef = useRef(false);

  // Asignación de variante + registro de exposición (una vez por sesión).
  useEffect(() => {
    const v = getVariant(EXPERIMENTS.WA_ADVISORY);
    setVariant(v);
    if (!exposureAlreadyTracked(EXPERIMENTS.WA_ADVISORY)) {
      track(EVENTS.EXPERIMENT_EXPOSURE, {
        experiment: EXPERIMENTS.WA_ADVISORY,
        variant: v,
      });
    }
  }, []);

  // Reacciona a la intención: sólo la variante "smart" se vuelve proactiva.
  useEffect(() => {
    if (variant !== "smart") return;

    const evaluate = () => {
      const high = isHighIntent();
      setProactive(high);
      setNutrition(leansNutrition());
      if (high && !shownRef.current) {
        shownRef.current = true;
        track(EVENTS.ADVISORY_SHOWN, {
          experiment: EXPERIMENTS.WA_ADVISORY,
          variant,
          intent: getIntentScore(),
        });
      }
    };

    evaluate();
    window.addEventListener(INTENT_EVENT, evaluate);
    return () => window.removeEventListener(INTENT_EVENT, evaluate);
  }, [variant]);

  const smartActive = variant === "smart" && proactive;
  const href = whatsappUrl(
    smartActive ? advisoryMessage(nutrition) : supportMessage(),
  );
  const label = smartActive
    ? nutrition
      ? "Asesoría de nutrición gratis"
      : "¿Te asesoramos? Es gratis"
    : "Chatea con nosotros";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      onClick={() =>
        track(EVENTS.WHATSAPP_CLICK, {
          source: "fab",
          experiment: EXPERIMENTS.WA_ADVISORY,
          variant,
          proactive: smartActive,
          isNutrition: smartActive && nutrition,
          intent: getIntentScore(),
        })
      }
      className={`group fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full border bg-[--color-surface] p-3 shadow-xl transition-all hover:pr-4 ${
        smartActive
          ? "border-[--color-volt] pr-4 shadow-[0_0_0_4px_rgba(184,255,50,0.12)]"
          : "border-[--color-graphite] hover:border-[--color-volt]"
      }`}
    >
      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-[#25D366] text-white">
        <WhatsAppIcon className="h-5 w-5" />
        {smartActive && (
          <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[--color-volt] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[--color-volt]" />
          </span>
        )}
      </span>
      <span
        className={`overflow-hidden whitespace-nowrap text-sm font-medium text-[--color-ink] transition-all duration-300 ${
          smartActive
            ? "max-w-[200px]"
            : "max-w-0 group-hover:max-w-[160px]"
        }`}
      >
        {label}
      </span>
    </a>
  );
}
