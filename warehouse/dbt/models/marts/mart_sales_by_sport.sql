-- Ventas por deporte y fecha: el KPI central del negocio (running/natación…).
select
    order_date,
    coalesce(sport, 'desconocido')       as sport,
    count(distinct order_id)             as orders,
    sum(quantity)                        as units,
    sum(line_total)                      as revenue,
    safe_divide(sum(line_total), count(distinct order_id)) as avg_order_value
from {{ ref('fct_order_items') }}
group by 1, 2
