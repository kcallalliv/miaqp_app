-- Órdenes normalizadas
with src as (
    select * from {{ source('medusa', 'order') }}
)

select
    id                                as order_id,
    customer_id,
    email,
    lower(currency_code)              as currency_code,
    status,
    cast(created_at as timestamp)     as created_at,
    cast(updated_at as timestamp)     as updated_at,
    date(created_at)                  as order_date
from src
-- Datastream marca borrados lógicos; excluimos filas eliminadas si aplica.
where coalesce(cast(_metadata_deleted as bool), false) = false
