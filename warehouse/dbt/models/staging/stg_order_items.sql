-- Líneas de orden con su importe
with src as (
    select * from {{ source('medusa', 'order_line_item') }}
)

select
    id                                          as order_item_id,
    order_id,
    product_id,
    variant_id,
    product_title,
    title                                       as variant_title,
    cast(quantity as int64)                     as quantity,
    cast(unit_price as numeric)                 as unit_price,
    cast(unit_price as numeric) * quantity      as line_total
from src
where coalesce(cast(_metadata_deleted as bool), false) = false
