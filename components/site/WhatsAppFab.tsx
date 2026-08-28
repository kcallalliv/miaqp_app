"use client";

import { whatsappUrl, supportMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";
import { track, EVENTS } from "@/lib/analytics";

/** Botón flotante de WhatsApp (canal de venta asistida y soporte). */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappUrl(supportMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: "fab" })}
      className="group fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full border border-[--color-graphite] bg-[--color-surface] p-3 shadow-xl transition-all hover:border-[--color-volt] hover:pr-4"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#25D366] text-white">
        <WhatsAppIcon className="h-5 w-5" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium text-[--color-ink] transition-all duration-300 group-hover:max-w-[140px]">
        Chatea con nosotros
      </span>
    </a>
  );
}
