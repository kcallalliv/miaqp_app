import type { Metadata } from "next";
import { getEncargos } from "@/lib/encargos/data";
import { EncargosBoard } from "@/components/encargos/EncargosBoard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Encargos desde USA — CAVI STORE",
  description:
    "Productos de running, triatlón, natación y tecnología traídos bajo pedido desde USA. Cupos limitados, precio con comisión y reserva por WhatsApp.",
  alternates: { canonical: "/encargos" },
};

export default async function EncargosPage() {
  const { encargos, source } = await getEncargos();
  const disponibles = encargos.filter((e) => !e.agotado).length;

  return (
    <>
      <section className="border-b border-[--color-graphite] bg-[--color-anthracite]">
        <div className="container-cavi py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-[--color-graphite] px-3 py-1 text-xs text-[--color-muted]">
            ✈️ Viaje de diciembre · cupos limitados
          </span>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold text-[--color-ink]">
            Encargos desde <span className="text-[--color-volt]">USA</span>
          </h1>
          <p className="mt-3 max-w-xl text-[--color-muted]">
            Traigo bajo pedido lo que no se consigue fácil en Perú: zapatillas, relojes,
            triatlón, natación y tecnología. Reservas con 50% y pagas el resto al recibir.
          </p>
          <p className="mt-4 text-sm text-[--color-muted]">
            {disponibles > 0
              ? `${disponibles} producto(s) con cupo disponible ahora.`
              : "Por ahora sin cupos; escríbenos para la próxima lista."}
            {source === "mock" && " (ejemplos de muestra)"}
          </p>
        </div>
      </section>

      <EncargosBoard encargos={encargos} />
    </>
  );
}
