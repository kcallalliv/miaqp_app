with src as (
    select * from {{ source('medusa', 'customer') }}
)

select
    id                             as customer_id,
    email,
    first_name,
    last_name,
    cast(created_at as timestamp)  as created_at
from src
where coalesce(cast(_metadata_deleted as bool), false) = false
