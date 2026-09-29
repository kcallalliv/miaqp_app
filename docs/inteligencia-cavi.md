# Inteligencia CAVI — Experimento A/B + Radar de demanda

Primer eslabón **capacidad → impacto** de la estrategia de datos (Ylijoki &
Porras, 2019): ya teníamos activos de datos (BigQuery, eventos); esto los
convierte en **decisiones**. Empezamos en Tier 1 (eficiencia operativa) con
autenticidad (Mazzei & Noble, 2017): reglas simples + un experimento antes de
cualquier modelo de ML.

## 1. Experimento A/B — `wa_advisory_v1`

**Hipótesis (Thomke Q1):** mostrar el CTA de asesoría de WhatsApp de forma
proactiva y contextual a las sesiones de **alta intención** aumenta el clic
cualificado a WhatsApp (≥20%) **sin** dañar la conversión.

- **Asignación:** determinista y estable por visitante anónimo (`cavi.vid`),
  50/50 → `control` | `smart`. Sin PII. (`lib/experiments.ts`)
- **Score de intención:** heurística sobre las señales que ya emitíamos
  (vistas, nutrición, add-to-cart, preventa, búsquedas, agenda). NO es ML.
  (`lib/intent.ts`)
- **Variante `control`:** el FAB de WhatsApp clásico (se expande al pasar el
  cursor, mensaje de soporte).
- **Variante `smart`:** en sesiones de alta intención el FAB se abre solo, con
  copy de asesoría contextual (nutrición si el interés se inclina a fueling).
  (`components/site/WhatsAppFab.tsx`)
- **Medición (Thomke Q4/Q5):** eventos `experiment_exposure`, `advisory_shown`
  y `whatsapp_click` etiquetados con `variant` e `intent` → BigQuery.

### Cómo leer el resultado
```
warehouse/queries/experimento_asesoria_whatsapp.sql
```
Compara `ctr_whatsapp` entre `control` y `smart`. Accionable con ≥300 sesiones
por brazo y `conversion` de `smart` que no caiga (métrica de guardia).

### Cuándo pasar a ML (Thomke Q6/Q7)
Sólo si el experimento demuestra lift: entonces el score heurístico se sustituye
por un clasificador de intención entrenado con los eventos históricos.

## 2. Radar de demanda — "qué comprar"

Panel interno que prioriza el stock cruzando **interés** con **eventos que se
aproximan**. (`backend/src/lib/intel.ts`, `backend/src/api/admin/intel/route.ts`)

- **Modo interno (siempre activo):** semillas curadas por disciplina +
  nutrición, con boost para las disciplinas de los próximos eventos.
- **Enriquecimiento opcional con Google Trends** (SerpApi), activado por env:
  ```
  TRENDS_PROVIDER=serpapi
  SERPAPI_KEY=<clave, vía Secret Manager en prod — nunca hardcodear>
  TRENDS_GEO=PE
  ```
  Si falla o no está configurado, cae al modo interno (nunca rompe el panel).

## 3. Intranet — panel "Inteligencia" en el admin

`/app` → **Inteligencia** (`backend/src/admin/routes/panel/page.tsx`). Tres
bloques: estado del experimento, radar de demanda y próximos eventos con su
**ventana de compra** sugerida (7–45 días antes). Protegido por el login admin
de Medusa (mismo usuario que la Agenda).

## Factores de éxito (Neira & Vesga, 2024)
Calidad de dato (identificador anónimo, sin PII), gobernanza (BigQuery solo
reporting), y una decisión concreta detrás de cada dato. El radar y el
experimento están pensados para **acatar el resultado** (Thomke Q2), no para
adornar un dashboard.
