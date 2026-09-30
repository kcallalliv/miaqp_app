import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/site/LegalLayout";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Términos y condiciones — CAVI STORE",
  description:
    "Términos y condiciones de uso y compra en CAVI STORE. Condiciones de venta, precios, pagos y responsabilidades.",
  alternates: { canonical: "/legal/terminos" },
};

export default function TerminosPage() {
  return (
    <LegalLayout
      title="Términos y condiciones"
      intro={`Estos términos regulan el uso del sitio y la compra de productos en ${COMPANY.brand}, operado por ${COMPANY.razonSocial} (RUC ${COMPANY.ruc}).`}
    >
      <LegalSection title="1. Identificación del titular">
        <p>
          {COMPANY.razonSocial}, con RUC {COMPANY.ruc} y domicilio en{" "}
          {COMPANY.domicilio}. Contacto: {COMPANY.email} · WhatsApp +
          {COMPANY.whatsapp}.
        </p>
      </LegalSection>

      <LegalSection title="2. Objeto">
        <p>
          El sitio comercializa equipamiento y nutrición deportiva para running,
          natación, triatlón y endurance, con envíos dentro del {COMPANY.pais}.
        </p>
      </LegalSection>

      <LegalSection title="3. Precios y disponibilidad">
        <p>
          Los precios se muestran en Soles (PEN) e incluyen los impuestos de ley.
          La disponibilidad de stock puede variar; algunos productos se ofrecen
          bajo pedido (pre-orden), lo que se indica en la ficha del producto.
        </p>
        <p>
          Nos reservamos el derecho de corregir errores de precio evidentes,
          informando al cliente antes de procesar el pedido.
        </p>
      </LegalSection>

      <LegalSection title="4. Proceso de compra y pagos">
        <p>
          La compra se perfecciona al confirmarse el pago. Los pagos con tarjeta
          se procesan mediante la pasarela Culqi; también se puede coordinar la
          compra por WhatsApp. {COMPANY.brand} no almacena los datos completos de
          tu tarjeta.
        </p>
      </LegalSection>

      <LegalSection title="5. Comprobantes de pago">
        <p>
          Emitimos boleta o factura electrónica según los datos que proporciones
          al momento de la compra, conforme a la normativa de SUNAT.
        </p>
      </LegalSection>

      <LegalSection title="6. Envíos, cambios y devoluciones">
        <p>
          Las condiciones de entrega, cambios y devoluciones se detallan en la
          página <a href="/legal/envios">Envíos y devoluciones</a>, que forma
          parte de estos términos.
        </p>
      </LegalSection>

      <LegalSection title="7. Libro de Reclamaciones">
        <p>
          Conforme al Código de Protección y Defensa del Consumidor, ponemos a
          disposición un <a href="/reclamaciones">Libro de Reclamaciones</a>{" "}
          digital.
        </p>
      </LegalSection>

      <LegalSection title="8. Propiedad intelectual">
        <p>
          Las marcas, logotipos y contenidos del sitio pertenecen a sus
          respectivos titulares y no pueden usarse sin autorización.
        </p>
      </LegalSection>

      <LegalSection title="9. Ley aplicable">
        <p>
          Estos términos se rigen por las leyes del {COMPANY.pais}. Cualquier
          controversia se someterá a la jurisdicción de {COMPANY.ciudad}.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
