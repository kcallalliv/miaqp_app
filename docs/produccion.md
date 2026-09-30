# CAVI STORE — Checklist de producción

## ✅ Producción básica (este bloque)

### Legal (Perú)
- **Libro de Reclamaciones digital** persistente: formulario público
  (`/reclamaciones`) → módulo Medusa `reclamos` (tabla `cavi_reclamo`) →
  gestión en el admin (`/app` → **Reclamaciones**), con respuesta y estado.
- **Términos y condiciones** (`/legal/terminos`).
- **Política de privacidad** (`/legal/privacidad`, Ley N.º 29733).
- **Envíos y devoluciones** (`/legal/envios`).
- Footer con enlaces legales + distintivo del Libro de Reclamaciones.
- Datos de la empresa centralizados en `lib/company.ts`.
  > ⚠️ Reemplaza los placeholders ⟨…⟩ (razón social, RUC, domicilio) o pásalos
  > por env: `NEXT_PUBLIC_RAZON_SOCIAL`, `NEXT_PUBLIC_RUC`,
  > `NEXT_PUBLIC_DOMICILIO_FISCAL`, `NEXT_PUBLIC_CONTACT_EMAIL`.

### Seguridad
- **CORS cerrado** a las URLs reales (lo aplica `deploy.sh`, ya no `*`).
- **Cabeceras de seguridad** en `next.config.mjs` (HSTS, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- `poweredByHeader` desactivado.
- Cold start opcional: `BACKEND_MIN_INSTANCES=1 bash deploy/deploy.sh`.
  > ⚠️ Cambia la clave admin por defecto (`CaviAdmin2026`):
  > `ADMIN_PASS=... bash deploy/deploy.sh`.

### SEO
- `app/sitemap.ts` (+ `robots.txt` con Sitemap).
- Metadata enriquecida (title template, keywords, canonical, OpenGraph,
  Twitter) y **JSON-LD** de tipo `Store` en el layout.
- Base configurable con `NEXT_PUBLIC_SITE_URL`.

## ⏳ Pendiente para vender de verdad (depende de terceros)

1. **Culqi en producción** — llaves `pk_live`/`sk_live` + integrar el provider
   real y probar. (No tocado hasta tener llaves.)
2. **Dominio propio + HTTPS** — mapear `cavistore.pe` a Cloud Run y fijar
   `NEXT_PUBLIC_SITE_URL`.
3. **Comprobantes SUNAT** (boleta/factura) — elegir facturador e integrar.
4. **Envíos reales** — tarifas y courier (Olva/Shalom) o coordinación WhatsApp.
5. **Emails transaccionales** — provider de notificación (confirmación de pedido).
6. **Catálogo real** — fotos, precios, stock y descripciones definitivas.
7. **Textos legales** — validación por asesoría legal antes de publicar.
