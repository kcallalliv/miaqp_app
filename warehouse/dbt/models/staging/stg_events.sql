with src as (
    select * from {{ source('web', 'raw_events') }}
)

select
    event_id,
    event_name,
    cast(occurred_at as timestamp)  as occurred_at,
    date(occurred_at)               as event_date,
    session_id,
    path,
    product_id,
    sport,
    brand,
    safe_cast(value as numeric)     as value,
    coalesce(currency, 'PEN')       as currency,
    cast(quantity as int64)         as quantity
from src
