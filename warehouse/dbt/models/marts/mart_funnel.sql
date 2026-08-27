-- Embudo de conversión por sesión: vista → add_to_cart → checkout → compra.
with by_session as (
    select
        session_id,
        min(event_date)                                             as session_date,
        countif(event_name = 'view_item')                           as views,
        countif(event_name = 'add_to_cart')                         as add_to_cart,
        countif(event_name = 'begin_checkout')                      as begin_checkout,
        countif(event_name = 'purchase')                            as purchases,
        sum(if(event_name = 'purchase', value, 0))                  as revenue
    from {{ ref('stg_events') }}
    group by 1
)

select
    session_date,
    count(*)                                                   as sessions,
    countif(add_to_cart   > 0)                                 as sessions_add_to_cart,
    countif(begin_checkout > 0)                                as sessions_checkout,
    countif(purchases     > 0)                                 as sessions_purchase,
    safe_divide(countif(add_to_cart > 0), count(*))            as rate_add_to_cart,
    safe_divide(countif(purchases > 0), countif(add_to_cart > 0)) as rate_cart_to_purchase,
    safe_divide(countif(purchases > 0), count(*))              as conversion_rate,
    sum(revenue)                                               as revenue
from by_session
group by 1
