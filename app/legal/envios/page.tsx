import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/site/LegalLayout";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Envíos y devoluciones — CAVI STORE",
  description:
    "Política de envíos, entregas, cambios y devoluciones de CAVI STORE. Cobertura nacional en el Perú.",
  alternates: { canonical: "/legal/envios" },
};

export default function EnviosPage() {
  return (
    <LegalLayout
      title="Envíos y devoluciones"
      intro="Cobertura nacional. Coordinamos cada entrega para que tu equipo y nutrición lleguen a tiempo para tus objetivos."
    >
      <LegalSection title="1. Cobertura y plazos">
        <p>
          Realizamos envíos a todo el {COMPANY.pais}. Los plazos referenciales
          son: {COMPANY.ciudad} 24–48 h; otras ciudades 2–5 días hábiles, según
          el destino y el courier. Los plazos se confirman al momento de la
          compra o por WhatsApp.
        </p>
      </LegalSection>

      <LegalSection title="2. Costos de envío">
        <p>
          El costo se calcula según el destino y el peso del pedido, y se muestra
          antes de confirmar la compra. Podemos ofrecer envío gratis en campañas
          o sobre un monto mínimo.
        </p>
      </LegalSection>

      <LegalSection title="3. Productos bajo pedido (pre-orden)">
        <p>
          Algunos productos se traen bajo pedido. En esos casos te informamos el
          tiempo estimado de entrega antes de confirmar; el plazo empieza a
          contar desde la confirmación del pago.
        </p>
      </LegalSection>

      <LegalSection title="4. Cambios">
        <p>
          Aceptamos cambios de talla o modelo dentro de los 7 días calendario
          desde la recepción, siempre que el producto esté sin uso, con etiquetas
          y en su empaque original. Los productos de nutrición, por higiene y
          seguridad, solo se cambian si llegan en mal estado o vencidos.
        </p>
      </LegalSection>

      <LegalSection title="5. Devoluciones y derecho de retracto">
        <p>
          Si el producto presenta defecto de fábrica o no corresponde a lo
          comprado, gestionamos la devolución o el reembolso sin costo para ti.
          Escríbenos a {COMPANY.email} o por WhatsApp adjuntando tu comprobante y
          fotos del producto.
        </p>
      </LegalSection>

      <LegalSection title="6. Cómo iniciar un cambio o devolución">
        <p>
          Contáctanos con tu número de pedido y el motivo. Te indicaremos el
          procedimiento y, cuando corresponda, el punto de recojo o reenvío.
        </p>
      </LegalSection>

      <LegalSection title="7. Reclamos">
        <p>
          Si no quedas conforme, puedes registrar tu caso en el{" "}
          <a href="/reclamaciones">Libro de Reclamaciones</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
