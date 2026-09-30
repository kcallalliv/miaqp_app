/**
 * Datos de la empresa para páginas legales y footer. Un solo lugar.
 * Completa/ajusta con tus datos reales (o pásalos por variables de entorno).
 * Los valores entre ⟨⟩ son PLACEHOLDERS que debes reemplazar antes de vender.
 */
export const COMPANY = {
  brand: "CAVI STORE",
  razonSocial: process.env.NEXT_PUBLIC_RAZON_SOCIAL || "⟨Razón Social S.A.C.⟩",
  ruc: process.env.NEXT_PUBLIC_RUC || "⟨20XXXXXXXXX⟩",
  domicilio:
    process.env.NEXT_PUBLIC_DOMICILIO_FISCAL ||
    "⟨Dirección fiscal⟩, Arequipa, Perú",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hola@cavistore.pe",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51966538608",
  ciudad: "Arequipa",
  pais: "Perú",
  /** Fecha de última actualización de los documentos legales. */
  legalUpdated: "30 de septiembre de 2026",
} as const;

/** ¿Faltan datos por completar? (para mostrar un aviso discreto en el admin/legal) */
export function companyHasPlaceholders(): boolean {
  return [COMPANY.razonSocial, COMPANY.ruc, COMPANY.domicilio].some((v) =>
    v.includes("⟨"),
  );
}
