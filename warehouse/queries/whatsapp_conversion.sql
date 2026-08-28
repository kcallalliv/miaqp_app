-- Conversión de clicks de WhatsApp a venta.
-- Mide, por sesión anónima, cuántas que hicieron whatsapp_click terminaron en
-- purchase. Identificador anónimo = session_id (sin datos personales).
-- Fuente: raw.raw_events (o stg_events). Solo reporting.

with por_sesion as (
    select
        session_id,
        date(min(occurred_at))                              as fecha,
        countif(event_name = 'whatsapp_click')              as clicks_wa,
        countif(event_name = 'preorder_request')            as preorders,
        countif(event_name = 'purchase')                    as compras,
        sum(if(event_name = 'purchase', safe_cast(value as numeric), 0)) as ingreso
    from `TU_PROJECT.raw.raw_events`
    group by 1
)

select
    fecha,
    countif(clicks_wa > 0)                                as sesiones_con_wa,
    countif(clicks_wa > 0 and compras > 0)                as wa_con_compra,
    safe_divide(
        countif(clicks_wa > 0 and compras > 0),
        countif(clicks_wa > 0)
    )                                                     as conversion_wa_a_venta,
    countif(preorders > 0)                                as sesiones_preorder,
    round(sum(if(clicks_wa > 0, ingreso, 0)), 2)          as ingreso_atribuible_wa
from por_sesion
group by 1
order by fecha desc
