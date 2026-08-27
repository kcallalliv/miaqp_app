select
    product_id,
    product_name,
    handle,
    brand,
    sport,
    gender,
    rating,
    status,
    created_at
from {{ ref('stg_products') }}
