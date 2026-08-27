-- Grano: una fila por línea de orden, enriquecida con deporte/marca del producto.
select
    oi.order_item_id,
    oi.order_id,
    o.order_date,
    o.customer_id,
    oi.product_id,
    p.product_name,
    p.brand,
    p.sport,
    p.gender,
    oi.variant_title,
    oi.quantity,
    oi.unit_price,
    oi.line_total
from {{ ref('stg_order_items') }} oi
left join {{ ref('stg_orders') }} o  using (order_id)
left join {{ ref('stg_products') }} p using (product_id)
