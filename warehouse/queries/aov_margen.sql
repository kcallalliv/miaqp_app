-- Ticket promedio (AOV) y margen de contribución por pedido.
-- AOV = ingreso medio por orden. Margen de contribución = ingreso - costo
-- de los productos vendidos (COGS). Solo reporting.
--
-- NOTA: el margen requiere un COSTO por producto. Añade `metadata.cost` en
-- Medusa y expónlo en dim_product como `cost`. Si aún no hay costo, la parte
-- de margen sale NULL y el AOV igual funciona.

with items as (
    select
        oi.order_id,
        oi.quantity,
        oi.line_total,
        oi.quantity * coalesce(p.cost, 0) as line_cost,
        p.cost is not null                as tiene_costo
    from `TU_PROJECT.marts.fct_order_items` oi
    left join `TU_PROJECT.marts.dim_product` p using (product_id)
),

por_orden as (
    select
        order_id,
        sum(line_total)                     as ingreso,
        sum(line_cost)                      as costo,
        logical_or(tiene_costo)             as con_costo
    from items
    group by 1
)

select
    count(*)                                          as ordenes,
    round(avg(ingreso), 2)                            as aov,
    round(sum(ingreso), 2)                            as ingreso_total,
    -- Margen solo sobre órdenes con costo cargado
    round(sum(if(con_costo, ingreso - costo, 0)), 2)  as margen_contribucion,
    safe_divide(
        sum(if(con_costo, ingreso - costo, 0)),
        sum(if(con_costo, ingreso, 0))
    )                                                 as margen_pct
from por_orden
