/**
 * Inteligencia de demanda para el panel interno ("Inteligencia CAVI").
 *
 * Mazzei & Noble (2017): autenticidad antes que aspiración. Por eso el radar
 * funciona SIEMPRE con señales internas (semillas curadas por disciplina +
 * los próximos eventos), y OPCIONALMENTE se enriquece con Google Trends si se
 * configura un proveedor por variable de entorno. Nunca se hardcodean claves.
 *
 * Configuración (todas opcionales; sin ellas corre en modo interno):
 *   TRENDS_PROVIDER = "serpapi" | "none"   (default: none)
 *   SERPAPI_KEY     = <api key>            (si TRENDS_PROVIDER=serpapi)
 *   TRENDS_GEO      = "PE"                  (default: PE)
 */

export type Tendencia = "sube" | "estable" | "baja";
export type CategoriaCompra = "nutricion" | "hidratacion" | "equipo" | "accesorios";

export interface DemandSignal {
  termino: string;
  disciplina: string;
  categoria: CategoriaCompra;
  tendencia: Tendencia;
  /** Interés relativo 0–100. */
  score: number;
  fuente: "google_trends" | "interno";
  /** Recomendación de compra/stock accionable. */
  sugerencia: string;
}

/** Semillas curadas por disciplina. Nutrición es transversal (protagonista). */
const SEEDS: Record<string, Array<Omit<DemandSignal, "score" | "tendencia" | "fuente">>> = {
  nutricion: [
    { termino: "geles energéticos", disciplina: "nutricion", categoria: "nutricion", sugerencia: "Reforzar geles 60–90 g CHO/h; formatos de alta densidad para larga distancia." },
    { termino: "sales / electrolitos", disciplina: "nutricion", categoria: "hidratacion", sugerencia: "Stock de electrolitos: clave por altura (Arequipa) y aguas abiertas." },
    { termino: "barras energéticas", disciplina: "nutricion", categoria: "nutricion", sugerencia: "Surtido de barras para entrenamientos largos y post-esfuerzo." },
  ],
  trail: [
    { termino: "chaleco de hidratación", disciplina: "trail", categoria: "equipo", sugerencia: "Chalecos 5–12 L: acompañan geles y flasks en montaña." },
    { termino: "bastones de trail", disciplina: "trail", categoria: "equipo", sugerencia: "Bastones plegables para carreras con +D (Misti/Colca)." },
  ],
  ruta: [
    { termino: "zapatillas de ruta", disciplina: "ruta", categoria: "equipo", sugerencia: "Rotación de placa de carbono para temporada de maratones." },
    { termino: "gorra running", disciplina: "ruta", categoria: "accesorios", sugerencia: "Accesorios de bajo ticket, alta rotación con nutrición." },
  ],
  triatlon: [
    { termino: "trisuit", disciplina: "triatlon", categoria: "equipo", sugerencia: "Trajes de triatlón antes de la temporada; tallaje amplio." },
    { termino: "gafas de natación", disciplina: "triatlon", categoria: "accesorios", sugerencia: "Gafas + gorros: cross-sell con aguas abiertas." },
  ],
  aguas_abiertas: [
    { termino: "wetsuit aguas abiertas", disciplina: "aguas_abiertas", categoria: "equipo", sugerencia: "Neoprenos para lagos de altura (Titicaca): agua fría." },
    { termino: "boya de seguridad", disciplina: "aguas_abiertas", categoria: "accesorios", sugerencia: "Boyas de arrastre: seguridad obligatoria en travesías." },
  ],
  ciclismo: [
    { termino: "maillot ciclismo", disciplina: "ciclismo", categoria: "equipo", sugerencia: "Maillots con bolsillos para nutrición en gran fondo." },
    { termino: "bidón / caramañola", disciplina: "ciclismo", categoria: "hidratacion", sugerencia: "Bidones + mezcla de carbohidratos para fondos largos." },
  ],
};

interface RadarOpts {
  /** Disciplinas con eventos próximos: suben su prioridad en el radar. */
  disciplinasProximas?: string[];
}

/** Radar interno: semillas curadas, con boost por eventos próximos. */
function radarInterno({ disciplinasProximas = [] }: RadarOpts): DemandSignal[] {
  const proximas = new Set(disciplinasProximas);
  // Nutrición siempre + las disciplinas con eventos próximos (o todas si no hay).
  const claves = new Set<string>(["nutricion"]);
  if (proximas.size) proximas.forEach((d) => claves.add(d));
  else Object.keys(SEEDS).forEach((k) => claves.add(k));

  const out: DemandSignal[] = [];
  for (const clave of claves) {
    const seeds = SEEDS[clave];
    if (!seeds) continue;
    const boost = clave === "nutricion" || proximas.has(clave);
    for (const s of seeds) {
      out.push({
        ...s,
        score: boost ? 82 : 55,
        tendencia: boost ? "sube" : "estable",
        fuente: "interno",
      });
    }
  }
  return out.sort((a, b) => b.score - a.score);
}

/** Enriquecimiento opcional con Google Trends (SerpApi). Defensivo: si falla,
 *  el caller usa el radar interno. Nunca lanza. */
async function radarGoogleTrends(termsByDisc: DemandSignal[]): Promise<DemandSignal[] | null> {
  const provider = process.env.TRENDS_PROVIDER;
  const key = process.env.SERPAPI_KEY;
  const geo = process.env.TRENDS_GEO || "PE";
  if (provider !== "serpapi" || !key) return null;

  try {
    const enriched: DemandSignal[] = [];
    // Consulta el interés de los términos ya priorizados (máx 8 para no gastar).
    for (const sig of termsByDisc.slice(0, 8)) {
      const url = new URL("https://serpapi.com/search.json");
      url.searchParams.set("engine", "google_trends");
      url.searchParams.set("q", sig.termino);
      url.searchParams.set("geo", geo);
      url.searchParams.set("data_type", "TIMESERIES");
      url.searchParams.set("api_key", key);
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        interest_over_time?: { timeline_data?: Array<{ values?: Array<{ value?: string }> }> };
      };
      const timeline = data.interest_over_time?.timeline_data ?? [];
      const vals = timeline
        .map((t) => Number(t.values?.[0]?.value))
        .filter((n) => Number.isFinite(n));
      if (!vals.length) {
        enriched.push(sig);
        continue;
      }
      const last = vals[vals.length - 1];
      const prev = vals.length > 4 ? vals[vals.length - 5] : vals[0];
      const tendencia: Tendencia = last > prev * 1.1 ? "sube" : last < prev * 0.9 ? "baja" : "estable";
      enriched.push({
        ...sig,
        score: Math.max(0, Math.min(100, Math.round(last))),
        tendencia,
        fuente: "google_trends",
      });
    }
    return enriched.length ? enriched.sort((a, b) => b.score - a.score) : null;
  } catch {
    return null; // cualquier fallo → fallback interno
  }
}

/** Radar de demanda ("qué comprar"): interno + enriquecimiento opcional. */
export async function getDemandRadar(opts: RadarOpts = {}): Promise<{
  signals: DemandSignal[];
  fuente: "google_trends" | "interno";
}> {
  const interno = radarInterno(opts);
  const trends = await radarGoogleTrends(interno);
  if (trends) return { signals: trends, fuente: "google_trends" };
  return { signals: interno, fuente: "interno" };
}
