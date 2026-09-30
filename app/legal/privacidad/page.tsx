import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/site/LegalLayout";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Política de privacidad — CAVI STORE",
  description:
    "Cómo CAVI STORE trata tus datos personales conforme a la Ley N.º 29733 de Protección de Datos Personales del Perú.",
  alternates: { canonical: "/legal/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <LegalLayout
      title="Política de privacidad"
      intro={`En ${COMPANY.brand} protegemos tus datos personales conforme a la Ley N.º 29733 y su reglamento. Aquí explicamos qué datos tratamos y para qué.`}
    >
      <LegalSection title="1. Responsable del tratamiento">
        <p>
          {COMPANY.razonSocial} (RUC {COMPANY.ruc}), {COMPANY.domicilio}.
          Contacto para temas de datos: {COMPANY.email}.
        </p>
      </LegalSection>

      <LegalSection title="2. Datos que recopilamos">
        <p>
          (a) Datos que nos das al comprar o contactarnos: nombre, documento,
          correo, teléfono y dirección de entrega. (b) Datos de navegación
          anónimos (analítica): páginas vistas e interacciones, mediante un
          identificador anónimo. <strong>No</strong> usamos esa analítica para
          identificarte personalmente.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalidades">
        <p>
          Procesar y entregar tus pedidos, emitir comprobantes, brindar soporte
          y asesoría, atender reclamos y mejorar la tienda. Con tu
          consentimiento, enviarte comunicaciones sobre productos y eventos.
        </p>
      </LegalSection>

      <LegalSection title="4. Analítica y almacén de datos">
        <p>
          La analítica se almacena de forma agregada y anónima en nuestro almacén
          de datos (BigQuery) con fines de reporte. No se combina con tus datos
          personales ni se usa para decisiones transaccionales.
        </p>
      </LegalSection>

      <LegalSection title="5. Conservación">
        <p>
          Conservamos tus datos el tiempo necesario para las finalidades
          descritas y los plazos legales (por ejemplo, tributarios y de
          protección al consumidor).
        </p>
      </LegalSection>

      <LegalSection title="6. Encargados y terceros">
        <p>
          Podemos compartir datos con proveedores que nos prestan servicios
          (pasarela de pago, mensajería, infraestructura en la nube), únicamente
          para cumplir con tu pedido y bajo obligación de confidencialidad.
        </p>
      </LegalSection>

      <LegalSection title="7. Tus derechos (ARCO)">
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, cancelación y
          oposición escribiendo a {COMPANY.email}. Atenderemos tu solicitud en
          los plazos que fija la ley.
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <p>
          Usamos almacenamiento local y cookies técnicas para el carrito y
          preferencias. La analítica usa un identificador anónimo que puedes
          borrar limpiando los datos del navegador.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
