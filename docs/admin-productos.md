# Admin CAVI — cómo cargar productos

El admin de Medusa vive en `https://<backend>/app`. Login con tu usuario admin.

## Crear un producto

**Products → Create**. Campos estándar:
- Título, descripción, handle (URL).
- **Imágenes** (ver nota de almacenamiento abajo).
- **Variantes** (tallas/colores), **precios en PEN**, SKU.
- **Categorías** (nutrición, trail, triatlón, ruta, aguas abiertas, ciclismo, accesorios).
- **Sales channel**: CAVI STORE. **Status**: Published (para que se vea).

## Metadata (campos que usa el storefront)

Las tarjetas premium de la tienda leen estos campos de **Metadata** (sección
clave–valor al final de la ficha del producto). Complétalos así:

| Clave | Ejemplo | Para qué |
|---|---|---|
| `sport` | `trail` | categoría principal (una) |
| `community` | `trail, ruta` | comunidades, separadas por coma |
| `fulfillment` | `stock` o `preorder` | badge **En stock** / **Bajo pedido** |
| `brand` | `Salomon` | marca mostrada |
| `stock` | `40` | unidades mostradas |
| `accent` | `#FF7A45` | color de acento de la tarjeta (hex) |
| `featured` | `true` | aparece como destacado en portada |
| `badge` | `Top ventas` | etiqueta corta (opcional) |
| `gender` | `unisex` | `hombre` / `mujer` / `unisex` |
| `rating` | `4.7` | estrellas (opcional) |
| `reviews` | `30` | n.º de reseñas (opcional) |
| `compare_at` | `420` | precio tachado / antes (opcional) |

### Colores de acento por comunidad
`nutricion` `#B8FF32` · `trail` `#FF7A45` · `triatlon` `#38D9C7` ·
`ruta` `#5C7CFA` · `aguas-abiertas` `#4DABF7` · `ciclismo` `#DA77F2` ·
`accesorios` `#A7ADB2`

## Imágenes de producto

Sube las fotos en la ficha del producto. Para que **persistan** (no se borren
al reiniciar Cloud Run) el backend usa un **bucket de Google Cloud Storage**.
La configuración está en `deploy/terraform/storage.tf` y se activa con variables
de entorno (`S3_*`). Ver `deploy/README.md` → "Bucket de imágenes".

- Usa fotos **propias** o con autorización (no copies las oficiales de marca).
- Tamaño recomendado: cuadrada ~1200×1200 px, < 500 KB, fondo limpio.

## Otras secciones del admin
- **Agenda**: eventos de endurance (curación + aprobación de envíos públicos).
- **Inteligencia**: experimento A/B, radar de demanda y próximos eventos.
- **Reclamaciones**: Libro de Reclamaciones (responder dentro de 15 días hábiles).
- **Orders / Customers / Promotions / Price Lists**: pedidos, clientes, cupones y
  listas de precios (campañas) nativos de Medusa.
