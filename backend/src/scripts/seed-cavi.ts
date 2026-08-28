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

const CATALOG: CaviItem[] = [
  // Nutrición (protagonista, transversal)
  { handle: "maurten-gel-100", title: "Gel 100 (caja x12)", brand: "Maurten", sport: "nutricion", communities: ["nutricion", "ruta", "trail", "triatlon"], fulfillment: "stock", gender: "unisex", price: 380, compareAt: 420, rating: 4.9, reviews: 301, stock: 60, sizes: ["Caja x12"], colors: ["Neutro"], badge: "Top ventas", accent: "#B8FF32", featured: true },
  { handle: "maurten-drink-mix-320", title: "Drink Mix 320 (caja x14)", brand: "Maurten", sport: "nutricion", communities: ["nutricion", "triatlon", "ciclismo"], fulfillment: "stock", gender: "unisex", price: 460, rating: 4.9, reviews: 128, stock: 34, sizes: ["Caja x14"], colors: ["Neutro"], badge: "Alta carga", accent: "#B8FF32", featured: true },
  { handle: "sis-beta-fuel", title: "Beta Fuel 80 (caja x15)", brand: "SiS", sport: "nutricion", communities: ["nutricion", "ciclismo", "ruta"], fulfillment: "stock", gender: "unisex", price: 320, compareAt: 360, rating: 4.7, reviews: 142, stock: 40, sizes: ["Caja x15"], colors: ["Naranja", "Limón"], accent: "#FFD43B", featured: true },
  { handle: "precision-hydration-1500", title: "PH 1500 Electrolitos (x30)", brand: "Precision", sport: "nutricion", communities: ["nutricion", "trail", "triatlon", "aguas-abiertas"], fulfillment: "stock", gender: "unisex", price: 240, rating: 4.8, reviews: 96, stock: 50, sizes: ["Sobre x30"], colors: ["Neutro"], badge: "Sales · altura", accent: "#4DABF7", featured: true },
  { handle: "precision-gel-30", title: "PF 30 Gel (caja x12)", brand: "Precision", sport: "nutricion", communities: ["nutricion", "ruta", "trail"], fulfillment: "stock", gender: "unisex", price: 300, rating: 4.7, reviews: 71, stock: 45, sizes: ["Caja x12"], colors: ["Neutro"], accent: "#B8FF32" },
  { handle: "sis-hydro-tabs", title: "GO Hydro Pastillas (x20)", brand: "SiS", sport: "nutricion", communities: ["nutricion", "ruta", "ciclismo"], fulfillment: "stock", gender: "unisex", price: 85, rating: 4.6, reviews: 210, stock: 120, sizes: ["Tubo x20"], colors: ["Frutos", "Limón"], badge: "Hidratación", accent: "#FFD43B" },
  // Trail
  { handle: "hoka-speedgoat-6", title: "Speedgoat 6 Trail", brand: "HOKA", sport: "trail", communities: ["trail"], fulfillment: "stock", gender: "unisex", price: 720, compareAt: 820, rating: 4.8, reviews: 88, stock: 12, sizes: ["39", "40", "41", "42", "43", "44"], colors: ["Naranja", "Negro"], badge: "Top ventas", accent: "#FF7A45", featured: true },
  { handle: "salomon-adv-skin-12", title: "ADV Skin 12 Chaleco", brand: "Salomon", sport: "trail", communities: ["trail"], fulfillment: "preorder", gender: "unisex", price: 890, rating: 4.9, reviews: 41, stock: 0, sizes: ["S", "M", "L"], colors: ["Negro/Rojo"], badge: "Bajo pedido", accent: "#FF7A45" },
  // Ruta
  { handle: "nike-vaporfly-3", title: "Vaporfly 3 Carbon", brand: "Nike", sport: "ruta", communities: ["ruta", "triatlon"], fulfillment: "stock", gender: "unisex", price: 899, compareAt: 1099, rating: 4.9, reviews: 214, stock: 10, sizes: ["38", "39", "40", "41", "42", "43", "44"], colors: ["Volt", "Negro"], badge: "Carbono", accent: "#5C7CFA", featured: true },
  { handle: "garmin-forerunner-965", title: "Forerunner 965 AMOLED", brand: "Garmin", sport: "ruta", communities: ["ruta", "trail", "triatlon"], fulfillment: "preorder", gender: "unisex", price: 2490, compareAt: 2790, rating: 4.9, reviews: 176, stock: 0, sizes: ["47 mm"], colors: ["Negro/Volt", "Blanco"], badge: "GPS Multibanda", accent: "#5C7CFA", featured: true },
  // Triatlón
  { handle: "huub-aero-trisuit", title: "Aero Trisuit Elite", brand: "HUUB", sport: "triatlon", communities: ["triatlon"], fulfillment: "preorder", gender: "hombre", price: 890, compareAt: 1050, rating: 4.7, reviews: 41, stock: 0, sizes: ["S", "M", "L", "XL"], colors: ["Negro/Volt"], badge: "Bajo pedido", accent: "#38D9C7" },
  { handle: "orca-wetsuit-openwater", title: "Wetsuit Openwater 3.8", brand: "Orca", sport: "triatlon", communities: ["triatlon", "aguas-abiertas"], fulfillment: "preorder", gender: "unisex", price: 1590, rating: 4.8, reviews: 52, stock: 0, sizes: ["S", "M", "L", "XL"], colors: ["Negro"], badge: "Bajo pedido", accent: "#38D9C7", featured: true },
  // Aguas abiertas
  { handle: "arena-cobra-ultra", title: "Cobra Ultra Swipe", brand: "Arena", sport: "aguas-abiertas", communities: ["aguas-abiertas", "triatlon"], fulfillment: "stock", gender: "unisex", price: 245, compareAt: 299, rating: 4.8, reviews: 121, stock: 18, sizes: ["Única"], colors: ["Espejo Volt", "Negro"], badge: "Top ventas", accent: "#4DABF7" },
  { handle: "orca-openwater-buoy", title: "Boya de seguridad Openwater", brand: "Orca", sport: "aguas-abiertas", communities: ["aguas-abiertas"], fulfillment: "stock", gender: "unisex", price: 180, rating: 4.6, reviews: 63, stock: 22, sizes: ["Única"], colors: ["Naranja"], accent: "#4DABF7" },
  // Ciclismo
  { handle: "specialized-evade-3", title: "Casco Evade 3 Aero", brand: "Specialized", sport: "ciclismo", communities: ["ciclismo", "triatlon"], fulfillment: "preorder", gender: "unisex", price: 1150, compareAt: 1350, rating: 4.8, reviews: 88, stock: 0, sizes: ["S", "M", "L"], colors: ["Negro", "Blanco"], badge: "Bajo pedido", accent: "#DA77F2" },
  { handle: "assos-mille-bib", title: "Mille GT Bib Shorts", brand: "Assos", sport: "ciclismo", communities: ["ciclismo"], fulfillment: "stock", gender: "hombre", price: 640, rating: 4.7, reviews: 67, stock: 16, sizes: ["S", "M", "L", "XL"], colors: ["Negro"], accent: "#DA77F2" },
  // Accesorios
  { handle: "flipbelt-classic", title: "Cinturón FlipBelt", brand: "FlipBelt", sport: "accesorios", communities: ["accesorios", "ruta", "trail"], fulfillment: "stock", gender: "unisex", price: 145, rating: 4.6, reviews: 98, stock: 50, sizes: ["S", "M", "L"], colors: ["Negro", "Volt"], accent: "#A7ADB2" },
];

export default async function seedCavi({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);
  const regionModule = container.resolve(Modules.REGION);
  const apiKeyModule = container.resolve(Modules.API_KEY);

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
