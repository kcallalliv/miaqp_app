{{ config(materialized='table') }}

with dates as (
    {{ dbt_utils.date_spine(
        datepart="day",
        start_date="cast('2024-01-01' as date)",
        end_date="date_add(current_date(), interval 365 day)"
    ) }}
)

select
    cast(date_day as date)                     as date,
    extract(year   from date_day)              as year,
    extract(month  from date_day)              as month,
    extract(day    from date_day)              as day,
    extract(dayofweek from date_day)           as day_of_week,
    format_date('%A', date_day)                as day_name,
    extract(dayofweek from date_day) in (1, 7) as is_weekend
from dates
