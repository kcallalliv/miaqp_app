with orders as (
    select
        customer_id,
        min(created_at)  as first_order_at,
        max(created_at)  as last_order_at,
        count(*)         as orders_count
    from {{ ref('stg_orders') }}
    where customer_id is not null
    group by 1
)

select
    c.customer_id,
    c.email,
    c.first_name,
    c.last_name,
    c.created_at,
    coalesce(o.orders_count, 0)          as orders_count,
    o.first_order_at,
    o.last_order_at,
    coalesce(o.orders_count, 0) > 1      as is_returning
from {{ ref('stg_customers') }} c
left join orders o using (customer_id)
