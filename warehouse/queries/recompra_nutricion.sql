-- Tasa de recompra de NUTRICIÓN por cohortes de cliente.
-- Cohorte = mes de la PRIMERA compra de nutrición del cliente.
-- Métrica = % de clientes de la cohorte que volvieron a comprar nutrición
-- en meses posteriores. Fuente: marts (dbt). Solo reporting.
--
-- Requiere que fct_order_items traiga la comunidad/categoría (columna `sport`)
-- y que los productos de nutrición estén en la categoría "nutricion".

with nutricion_orders as (
    select
        o.customer_id,
        o.order_id,
        date_trunc(o.order_date, month) as order_month
    from `TU_PROJECT.marts.fct_order_items` oi
    join `TU_PROJECT.marts.fct_orders` o using (order_id)
    where oi.sport = 'nutricion'
      and o.customer_id is not null
    group by 1, 2, 3
),

cohorte as (
    select customer_id, min(order_month) as cohorte_mes
    from nutricion_orders
    group by 1
),

actividad as (
    select
        c.cohorte_mes,
        date_diff(n.order_month, c.cohorte_mes, month) as mes_offset,
        n.customer_id
    from nutricion_orders n
    join cohorte c using (customer_id)
)

select
    cohorte_mes,
    mes_offset,
    count(distinct customer_id)                                   as clientes_activos,
    max(count(distinct customer_id)) over (partition by cohorte_mes) as tam_cohorte,
    safe_divide(
        count(distinct customer_id),
        max(count(distinct customer_id)) over (partition by cohorte_mes)
    )                                                             as tasa_recompra
from actividad
group by 1, 2
order by cohorte_mes, mes_offset
