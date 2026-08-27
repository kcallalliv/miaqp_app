-- Grano: una fila por orden, con importe agregado desde las líneas.
with items as (
    select
        order_id,
        sum(line_total)  as order_total,
        sum(quantity)    as items_count
    from {{ ref('stg_order_items') }}
    group by 1
)

select
    o.order_id,
    o.order_date,
    o.created_at,
    o.customer_id,
    o.email,
    o.currency_code,
    o.status,
    coalesce(i.order_total, 0)  as order_total,
    coalesce(i.items_count, 0)  as items_count
from {{ ref('stg_orders') }} o
left join items i using (order_id)
