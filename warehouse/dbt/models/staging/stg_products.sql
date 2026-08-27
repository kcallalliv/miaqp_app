-- Productos con atributos deportivos extraídos de metadata (JSON)
with src as (
    select * from {{ source('medusa', 'product') }}
)

select
    id                                                      as product_id,
    title                                                  as product_name,
    handle,
    status,
    json_value(metadata, '$.brand')                        as brand,
    json_value(metadata, '$.sport')                        as sport,
    json_value(metadata, '$.gender')                       as gender,
    safe_cast(json_value(metadata, '$.rating') as float64) as rating,
    cast(created_at as timestamp)                          as created_at
from src
where coalesce(cast(_metadata_deleted as bool), false) = false
