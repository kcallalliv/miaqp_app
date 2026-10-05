import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * Seed autocontenido del catálogo CAVI STORE.
 *
 * Crea (de forma idempotente por nombre) todo lo necesario para que el
 * storefront consuma la Store API:
 *   región PEN · canal de venta · ubicación de stock · publishable key ·
 *   categorías por deporte · productos con variantes (talla) y precios.
 *
 * Ejecutar:  npm run seed:cavi
 * Al final imprime REGION_ID y PUBLISHABLE_KEY para el `.env.local` del front.
 */

interface CaviItem {
  handle: string;
  title: string;
  brand: string;
  /** Categoría principal (comunidad, nutricion o accesorios). */
  sport: string;
  /** Todas las categorías/comunidades (un gel puede estar en varias). */
  communities: string[];
  /** Modelo de venta: "stock" | "preorder". */
  fulfillment: "stock" | "preorder";
  gender: "hombre" | "mujer" | "unisex";
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  stock: number;
  sizes: string[];
  colors: string[];
  badge?: string;
  accent: string;
  featured?: boolean;
}

// Las 5 comunidades de endurance + Nutrición (protagonista) + Accesorios.
const CATEGORIES: { name: string; handle: string }[] = [
  { name: "Nutrición", handle: "nutricion" },
  { name: "Trail", handle: "trail" },
  { name: "Triatlón", handle: "triatlon" },
  { name: "Ruta", handle: "ruta" },
  { name: "Aguas abiertas", handle: "aguas-abiertas" },
  { name: "Ciclismo", handle: "ciclismo" },
  { name: "Accesorios", handle: "accesorios" },
];

/**
 * CATÁLOGO DE ARRANQUE (bootstrap).
 * Foco en NO INGERIBLES en stock: accesorios de ticket bajo, markup alto,
 * importación ligera y poca talla (menos devoluciones) para validar la tienda.
 * La NUTRICIÓN (protagonista) entra como "bajo pedido" hasta tener distribuidor
 * oficial con Registro Sanitario DIGESA. Edita precios/stock en el admin.
 */
const CATALOG: CaviItem[] = [
  // --- Trail (accent #FF7A45) ---
  { handle: "soft-flask-500", title: "Soft Flask 500 ml", brand: "Salomon", sport: "trail", communities: ["trail", "ruta"], fulfillment: "stock", gender: "unisex", price: 59, rating: 4.7, reviews: 42, stock: 60, sizes: ["500 ml"], colors: ["Transparente"], badge: "Top ventas", accent: "#FF7A45", featured: true },
  { handle: "gorra-trail-run", title: "Gorra Trail Run", brand: "Buff", sport: "trail", communities: ["trail", "ruta"], fulfillment: "stock", gender: "unisex", price: 75, rating: 4.6, reviews: 28, stock: 40, sizes: ["Única"], colors: ["Negro", "Volt"], accent: "#FF7A45" },
  { handle: "polainas-antipiedras", title: "Polainas antipiedras", brand: "Salomon", sport: "trail", communities: ["trail"], fulfillment: "stock", gender: "unisex", price: 69, rating: 4.5, reviews: 15, stock: 30, sizes: ["S/M", "L/XL"], colors: ["Negro"], accent: "#FF7A45" },
  { handle: "bastones-trail-plegables", title: "Bastones de trail plegables", brand: "Leki", sport: "trail", communities: ["trail"], fulfillment: "preorder", gender: "unisex", price: 420, rating: 4.8, reviews: 12, stock: 0, sizes: ["110 cm", "120 cm", "130 cm"], colors: ["Negro"], badge: "Bajo pedido", accent: "#FF7A45" },

  // --- Ruta (accent #5C7CFA) ---
  { handle: "medias-compresion", title: "Medias de compresión", brand: "Compressport", sport: "ruta", communities: ["ruta", "trail"], fulfillment: "stock", gender: "unisex", price: 89, rating: 4.7, reviews: 55, stock: 70, sizes: ["S", "M", "L"], colors: ["Negro", "Blanco"], badge: "Top ventas", accent: "#5C7CFA", featured: true },
  { handle: "cinturon-porta-dorsal", title: "Cinturón porta-dorsal", brand: "CAVI", sport: "ruta", communities: ["ruta", "triatlon"], fulfillment: "stock", gender: "unisex", price: 45, rating: 4.5, reviews: 33, stock: 90, sizes: ["Única"], colors: ["Negro"], accent: "#5C7CFA" },
  { handle: "gorra-running-ligera", title: "Gorra running ultraligera", brand: "Ciele", sport: "ruta", communities: ["ruta"], fulfillment: "stock", gender: "unisex", price: 65, rating: 4.6, reviews: 24, stock: 45, sizes: ["Única"], colors: ["Blanco", "Negro"], accent: "#5C7CFA" },
  { handle: "cinturon-hidratacion", title: "Cinturón de hidratación", brand: "Salomon", sport: "ruta", communities: ["ruta", "trail"], fulfillment: "stock", gender: "unisex", price: 119, rating: 4.6, reviews: 19, stock: 35, sizes: ["Única"], colors: ["Negro"], accent: "#5C7CFA" },

  // --- Triatlón (accent #38D9C7) ---
  { handle: "cinturon-porta-numeros", title: "Cinturón porta-números", brand: "Zone3", sport: "triatlon", communities: ["triatlon", "ruta"], fulfillment: "stock", gender: "unisex", price: 49, rating: 4.7, reviews: 38, stock: 80, sizes: ["Única"], colors: ["Negro", "Volt"], badge: "Transición", accent: "#38D9C7", featured: true },
  { handle: "toalla-transicion", title: "Toalla de transición microfibra", brand: "Huub", sport: "triatlon", communities: ["triatlon"], fulfillment: "stock", gender: "unisex", price: 59, rating: 4.5, reviews: 17, stock: 40, sizes: ["Única"], colors: ["Azul"], accent: "#38D9C7" },
  { handle: "antiparras-competicion", title: "Antiparras de competición", brand: "Arena", sport: "triatlon", communities: ["triatlon", "aguas-abiertas"], fulfillment: "stock", gender: "unisex", price: 129, rating: 4.8, reviews: 61, stock: 30, sizes: ["Única"], colors: ["Espejo", "Clara"], accent: "#38D9C7" },

  // --- Aguas abiertas (accent #4DABF7) ---
  { handle: "gorro-silicona", title: "Gorro de silicona", brand: "Arena", sport: "aguas-abiertas", communities: ["aguas-abiertas", "triatlon"], fulfillment: "stock", gender: "unisex", price: 35, rating: 4.6, reviews: 72, stock: 120, sizes: ["Única"], colors: ["Volt", "Negro"], badge: "Alta rotación", accent: "#4DABF7" },
  { handle: "boya-seguridad-drybag", title: "Boya de seguridad + dry bag 28L", brand: "Orca", sport: "aguas-abiertas", communities: ["aguas-abiertas"], fulfillment: "stock", gender: "unisex", price: 159, rating: 4.7, reviews: 23, stock: 25, sizes: ["28 L"], colors: ["Naranja"], badge: "Seguridad", accent: "#4DABF7", featured: true },
  { handle: "antiparras-openwater", title: "Antiparras open water espejadas", brand: "Zone3", sport: "aguas-abiertas", communities: ["aguas-abiertas", "triatlon"], fulfillment: "stock", gender: "unisex", price: 185, rating: 4.8, reviews: 29, stock: 22, sizes: ["Única"], colors: ["Espejo Volt"], accent: "#4DABF7" },

  // --- Ciclismo (accent #DA77F2) ---
  { handle: "bidon-650", title: "Bidón 650 ml", brand: "Elite", sport: "ciclismo", communities: ["ciclismo"], fulfillment: "stock", gender: "unisex", price: 39, rating: 4.6, reviews: 48, stock: 100, sizes: ["650 ml"], colors: ["Negro", "Volt"], badge: "Alta rotación", accent: "#DA77F2" },
  { handle: "multiherramienta-12", title: "Multiherramienta 12 funciones", brand: "Topeak", sport: "ciclismo", communities: ["ciclismo"], fulfillment: "stock", gender: "unisex", price: 95, rating: 4.7, reviews: 34, stock: 50, sizes: ["Única"], colors: ["Negro"], accent: "#DA77F2" },
  { handle: "guantes-ruta", title: "Guantes de ruta", brand: "GripGrab", sport: "ciclismo", communities: ["ciclismo"], fulfillment: "stock", gender: "unisex", price: 89, rating: 4.5, reviews: 21, stock: 40, sizes: ["S", "M", "L", "XL"], colors: ["Negro"], accent: "#DA77F2" },
  { handle: "kit-co2-inflador", title: "Kit CO2 + inflador", brand: "Zefal", sport: "ciclismo", communities: ["ciclismo"], fulfillment: "stock", gender: "unisex", price: 79, rating: 4.6, reviews: 18, stock: 45, sizes: ["Única"], colors: ["Negro"], accent: "#DA77F2" },

  // --- Accesorios transversales (accent #A7ADB2) ---
  { handle: "buff-cuello-tubular", title: "Cuello tubular multifunción", brand: "Buff", sport: "accesorios", communities: ["accesorios", "trail", "ruta", "ciclismo"], fulfillment: "stock", gender: "unisex", price: 45, rating: 4.7, reviews: 90, stock: 150, sizes: ["Única"], colors: ["Volt", "Negro", "Gris"], badge: "Top ventas", accent: "#A7ADB2", featured: true },
  { handle: "balsamo-antirozaduras", title: "Bálsamo antirozaduras", brand: "Body Glide", sport: "accesorios", communities: ["accesorios", "trail", "triatlon"], fulfillment: "stock", gender: "unisex", price: 55, rating: 4.8, reviews: 64, stock: 80, sizes: ["40 ml"], colors: ["Neutro"], badge: "Recompra", accent: "#A7ADB2" },
  { handle: "medias-tecnicas-run", title: "Medias técnicas running", brand: "CAVI", sport: "accesorios", communities: ["accesorios", "ruta"], fulfillment: "stock", gender: "unisex", price: 55, rating: 4.5, reviews: 40, stock: 100, sizes: ["S", "M", "L"], colors: ["Negro", "Blanco"], accent: "#A7ADB2" },
  { handle: "foam-roller", title: "Rodillo de recuperación", brand: "TriggerPoint", sport: "accesorios", communities: ["accesorios"], fulfillment: "preorder", gender: "unisex", price: 149, rating: 4.7, reviews: 26, stock: 0, sizes: ["33 cm"], colors: ["Negro"], badge: "Bajo pedido", accent: "#A7ADB2" },

  // --- Nutrición (PROTAGONISTA) — bajo pedido hasta Registro Sanitario DIGESA ---
  { handle: "geles-energeticos-x12", title: "Geles energéticos (caja x12)", brand: "Por confirmar", sport: "nutricion", communities: ["nutricion", "ruta", "trail", "triatlon"], fulfillment: "preorder", gender: "unisex", price: 300, rating: 4.8, reviews: 0, stock: 0, sizes: ["Caja x12"], colors: ["Neutro"], badge: "Próximamente", accent: "#B8FF32", featured: true },
  { handle: "electrolitos-sales-x30", title: "Electrolitos / sales (x30)", brand: "Por confirmar", sport: "nutricion", communities: ["nutricion", "trail", "triatlon", "aguas-abiertas"], fulfillment: "preorder", gender: "unisex", price: 230, rating: 4.8, reviews: 0, stock: 0, sizes: ["Sobre x30"], colors: ["Neutro"], badge: "Próximamente · altura", accent: "#B8FF32", featured: true },
  { handle: "mezcla-carbohidratos", title: "Mezcla de carbohidratos (1 kg)", brand: "Por confirmar", sport: "nutricion", communities: ["nutricion", "ciclismo", "ruta"], fulfillment: "preorder", gender: "unisex", price: 320, rating: 4.7, reviews: 0, stock: 0, sizes: ["Bolsa 1 kg"], colors: ["Neutro"], badge: "Próximamente", accent: "#B8FF32" },
];

/**
 * Handles del catálogo demo ANTERIOR. El seed los elimina si existen, para que
 * la lista de arranque reemplace al demo. Solo afecta a estos handles conocidos;
 * los productos que crees manualmente en el admin NO se tocan.
 */
const LEGACY_HANDLES = [
  "maurten-gel-100",
  "maurten-drink-mix-320",
  "sis-beta-fuel",
  "precision-hydration-1500",
  "precision-gel-30",
  "sis-hydro-tabs",
  "hoka-speedgoat-6",
  "salomon-adv-skin-12",
  "nike-vaporfly-3",
  "garmin-forerunner-965",
  "huub-aero-trisuit",
  "orca-wetsuit-openwater",
  "arena-cobra-ultra",
  "orca-openwater-buoy",
  "specialized-evade-3",
  "assos-mille-bib",
  "flipbelt-classic",
];

export default async function seedCavi({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);
  const regionModule = container.resolve(Modules.REGION);
  const apiKeyModule = container.resolve(Modules.API_KEY);
  const productModule = container.resolve(Modules.PRODUCT);

  logger.info("🌱 Seed CAVI STORE — iniciando…");

  // --- 1. Canal de venta ---
  let [salesChannel] = await salesChannelModule.listSalesChannels({
    name: "CAVI STORE",
  });
  if (!salesChannel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "CAVI STORE" }] },
    });
    salesChannel = result[0];
    logger.info("✅ Canal de venta creado");
  }

  // --- 2. Región Perú (PEN) ---
  let [region] = await regionModule.listRegions({ name: "Perú" });
  if (!region) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Perú",
            currency_code: "pen",
            countries: ["pe"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    region = result[0];
    logger.info("✅ Región Perú (PEN) creada");
  }

  // --- 3. Ubicación de stock ---
  const { data: existingLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
    filters: { name: "Almacén Lima" },
  });
  let stockLocationId = existingLocations?.[0]?.id as string | undefined;
  if (!stockLocationId) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Almacén Lima",
            address: { city: "Lima", country_code: "pe", address_1: "Lima" },
          },
        ],
      },
    });
    stockLocationId = result[0].id;
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: stockLocationId, add: [salesChannel.id] },
    });
    logger.info("✅ Ubicación de stock creada y vinculada al canal");
  }

  // --- 4. Publishable API key ---
  let [pubKey] = await apiKeyModule.listApiKeys({
    title: "Storefront CAVI",
    type: "publishable",
  });
  if (!pubKey) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          { title: "Storefront CAVI", type: "publishable", created_by: "seed" },
        ],
      },
    });
    pubKey = result[0];
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: { id: pubKey.id, add: [salesChannel.id] },
    });
    logger.info("✅ Publishable key creada y vinculada al canal");
  }

  // --- 5. Categorías por deporte ---
  const { data: existingCats } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
  });
  const existingHandles = new Set(existingCats?.map((c) => c.handle));
  const toCreate = CATEGORIES.filter((c) => !existingHandles.has(c.handle));
  if (toCreate.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: toCreate.map((c) => ({
          name: c.name,
          handle: c.handle,
          is_active: true,
        })),
      },
    });
    logger.info(`✅ ${toCreate.length} categorías creadas`);
  }
  const { data: allCats } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
  });
  const catByHandle = new Map(allCats?.map((c) => [c.handle, c.id]));

  // --- 5.5 Limpieza del catálogo demo anterior ---
  const { data: legacyProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: LEGACY_HANDLES },
  });
  if (legacyProducts?.length) {
    await productModule.deleteProducts(legacyProducts.map((p) => p.id));
    logger.info(`🧹 ${legacyProducts.length} productos demo anteriores eliminados`);
  }

  // --- 6. Productos ---
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  });
  const existingProductHandles = new Set(
    existingProducts?.map((p) => p.handle),
  );

  const productsInput = CATALOG.filter(
    (item) => !existingProductHandles.has(item.handle),
  ).map((item) => ({
    title: item.title,
    handle: item.handle,
    status: ProductStatus.PUBLISHED,
    // Un producto puede pertenecer a varias comunidades (nutrición transversal).
    category_ids: item.communities
      .map((h) => catByHandle.get(h))
      .filter((id): id is string => Boolean(id)),
    sales_channels: [{ id: salesChannel.id }],
    options: [{ title: "Talla", values: item.sizes }],
    variants: item.sizes.map((size) => ({
      title: size,
      sku: `${item.handle}-${size}`.toLowerCase().replace(/\s+/g, "-"),
      manage_inventory: false,
      options: { Talla: size },
      prices: [{ amount: item.price, currency_code: "pen" }],
    })),
    metadata: {
      brand: item.brand,
      sport: item.sport,
      community: item.communities.join(", "),
      fulfillment: item.fulfillment,
      gender: item.gender,
      rating: item.rating,
      reviews: item.reviews,
      stock: item.stock,
      colors: item.colors.join(", "),
      accent: item.accent,
      featured: item.featured ? "true" : "false",
      ...(item.badge ? { badge: item.badge } : {}),
      ...(item.compareAt ? { compare_at: item.compareAt } : {}),
    },
  }));

  if (productsInput.length) {
    await createProductsWorkflow(container).run({
      input: { products: productsInput },
    });
    logger.info(`✅ ${productsInput.length} productos creados`);
  } else {
    logger.info("ℹ️  Todos los productos del catálogo ya existían");
  }

  logger.info("🏁 Seed CAVI completado.");
  logger.info("──────────────────────────────────────────────");
  logger.info("Configura el storefront (.env.local) con:");
  logger.info(`  MEDUSA_REGION_ID=${region.id}`);
  logger.info(`  MEDUSA_PUBLISHABLE_KEY=${pubKey.token}`);
  logger.info("  MEDUSA_BACKEND_URL=http://localhost:9000");
  logger.info("──────────────────────────────────────────────");
}
