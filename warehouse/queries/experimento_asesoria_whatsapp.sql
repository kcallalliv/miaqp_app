-- Lectura del experimento A/B `wa_advisory_v1` (Thomke, 2020).
-- Hipótesis: mostrar el CTA de asesoría de WhatsApp de forma proactiva y
-- contextual a sesiones de ALTA INTENCIÓN aumenta el clic cualificado a
-- WhatsApp, SIN dañar la conversión.
--
-- Unidad de análisis: sesión anónima (session_id, sin PII).
-- Variante e intención viajan en la columna JSON `properties`.
-- Fuente: raw.raw_events. Solo reporting.
--
-- Métrica primaria  : CTR de WhatsApp = sesiones con whatsapp_click / expuestas.
-- Métrica de guardia : conversión (begin_checkout / purchase) por variante,
--                      para asegurar que "smart" no canibaliza la compra.

with por_sesion as (
    select
        session_id,
        -- variante asignada al visitante (constante dentro de la sesión)
        max(json_value(properties, '$.variant'))                     as variante,
        date(min(occurred_at))                                       as fecha,
        countif(event_name = 'experiment_exposure')                  as expuesta,
        countif(event_name = 'advisory_shown')                       as asesoria_proactiva,
        countif(event_name = 'whatsapp_click')                       as clicks_wa,
        countif(event_name = 'begin_checkout')                       as checkouts,
        countif(event_name = 'purchase')                             as compras,
        max(safe_cast(json_value(properties, '$.intent') as int64))  as intent_max
    from `TU_PROJECT.raw.raw_events`
    where json_value(properties, '$.experiment') = 'wa_advisory_v1'
       or event_name in ('whatsapp_click', 'begin_checkout', 'purchase')
    group by 1
)

select
    variante,
    count(*)                                             as sesiones_expuestas,
    countif(clicks_wa > 0)                               as sesiones_con_click_wa,
    round(safe_divide(countif(clicks_wa > 0), count(*)), 4) as ctr_whatsapp,
    countif(asesoria_proactiva > 0)                      as sesiones_cta_proactivo,
    countif(compras > 0)                                 as sesiones_con_compra,
    round(safe_divide(countif(compras > 0), count(*)), 4)   as conversion,
    round(avg(intent_max), 1)                            as intent_promedio
from por_sesion
where variante in ('control', 'smart')
  and expuesta > 0
group by variante
order by variante;

-- Cómo leerlo (Thomke Q5/Q6): compara `ctr_whatsapp` entre control y smart.
-- El "lift" = (ctr_smart - ctr_control) / ctr_control. Considera el resultado
-- accionable cuando haya suficientes sesiones por variante (regla práctica:
-- >= 300 por brazo) y `conversion` de smart NO caiga frente a control.
