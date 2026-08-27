-- Abandono de carrito: sesiones que agregaron al carrito pero no compraron,
-- con el detalle de productos/deportes más abandonados.
with sessions as (
    select
        session_id,
        product_id,
        sport,
        brand,
        countif(event_name = 'add_to_cart')  as added,
        countif(event_name = 'purchase')     as purchased
    from {{ ref('stg_events') }}
    group by 1, 2, 3, 4
)

select
    coalesce(sport, 'desconocido')  as sport,
    brand,
    product_id,
    count(distinct session_id)      as sessions_abandoned
from sessions
where added > 0 and purchased = 0
group by 1, 2, 3
order by sessions_abandoned desc
