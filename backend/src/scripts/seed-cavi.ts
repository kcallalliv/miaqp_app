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
  sport: string;
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

const CATEGORIES: { name: string; handle: string }[] = [
  { name: "Running", handle: "running" },
  { name: "Natación", handle: "natacion" },
  { name: "Triatlón", handle: "triatlon" },
  { name: "Ciclismo", handle: "ciclismo" },
  { name: "Nutrición deportiva", handle: "nutricion" },
  { name: "Tecnología y wearables", handle: "tecnologia" },
  { name: "Accesorios", handle: "accesorios" },
  { name: "Recuperación", handle: "recuperacion" },
];

const CATALOG: CaviItem[] = [
  { handle: "nike-vaporfly-3", title: "Vaporfly 3 Carbon", brand: "Nike", sport: "running", gender: "unisex", price: 899, compareAt: 1099, rating: 4.9, reviews: 214, stock: 12, sizes: ["38", "39", "40", "41", "42", "43", "44"], colors: ["Volt", "Negro", "Blanco"], badge: "Top ventas", accent: "#B8FF32", featured: true },
  { handle: "hoka-mach-x", title: "Mach X Speed", brand: "HOKA", sport: "running", gender: "hombre", price: 649, rating: 4.7, reviews: 132, stock: 20, sizes: ["40", "41", "42", "43", "44", "45"], colors: ["Cyan", "Negro"], badge: "Nuevo", accent: "#38D9C7", featured: true },
  { handle: "saucony-endorphin-pro", title: "Endorphin Pro 4", brand: "Saucony", sport: "running", gender: "mujer", price: 720, compareAt: 850, rating: 4.8, reviews: 98, stock: 8, sizes: ["36", "37", "38", "39", "40"], colors: ["Coral", "Negro"], accent: "#FF7A45" },
  { handle: "adidas-adizero-adios-pro", title: "Adizero Adios Pro 3", brand: "Adidas", sport: "running", gender: "unisex", price: 780, rating: 4.6, reviews: 156, stock: 6, sizes: ["39", "40", "41", "42", "43"], colors: ["Blanco", "Rojo"], accent: "#F7F7F5" },
  { handle: "arena-carbon-glide", title: "Powerskin Carbon Glide", brand: "Arena", sport: "natacion", gender: "hombre", price: 1290, compareAt: 1490, rating: 4.9, reviews: 74, stock: 6, sizes: ["S", "M", "L", "XL"], colors: ["Negro/Volt", "Azul"], badge: "Competición", accent: "#38D9C7", featured: true },
  { handle: "speedo-fastskin-goggles", title: "Fastskin Pure Focus", brand: "Speedo", sport: "natacion", gender: "unisex", price: 210, rating: 4.7, reviews: 189, stock: 34, sizes: ["Única"], colors: ["Ahumado", "Espejo"], badge: "Top ventas", accent: "#5C7CFA", featured: true },
  { handle: "arena-cobra-ultra", title: "Cobra Ultra Swipe", brand: "Arena", sport: "natacion", gender: "unisex", price: 245, compareAt: 299, rating: 4.8, reviews: 121, stock: 18, sizes: ["Única"], colors: ["Espejo Volt", "Negro"], accent: "#B8FF32" },
  { handle: "finis-tempo-trainer", title: "Tempo Trainer Pro", brand: "FINIS", sport: "natacion", gender: "unisex", price: 165, rating: 4.6, reviews: 63, stock: 22, sizes: ["Única"], colors: ["Amarillo"], accent: "#FFD43B" },
  { handle: "huub-aero-tri-suit", title: "Aero Tri Suit Elite", brand: "HUUB", sport: "triatlon", gender: "hombre", price: 890, compareAt: 1050, rating: 4.7, reviews: 41, stock: 9, sizes: ["S", "M", "L", "XL"], colors: ["Negro/Volt"], badge: "Nuevo", accent: "#FF7A45" },
  { handle: "orca-wetsuit-openwater", title: "Wetsuit Open Water 3.8", brand: "Orca", sport: "triatlon", gender: "unisex", price: 1590, rating: 4.8, reviews: 52, stock: 5, sizes: ["S", "M", "L", "XL"], colors: ["Negro"], accent: "#5C7CFA" },
  { handle: "specialized-helmet-evade", title: "Casco Evade 3 Aero", brand: "Specialized", sport: "ciclismo", gender: "unisex", price: 1150, compareAt: 1350, rating: 4.8, reviews: 88, stock: 14, sizes: ["S", "M", "L"], colors: ["Negro", "Blanco"], badge: "Aero", accent: "#5C7CFA" },
  { handle: "assos-mille-bib", title: "Mille GT Bib Shorts", brand: "Assos", sport: "ciclismo", gender: "hombre", price: 640, rating: 4.7, reviews: 67, stock: 16, sizes: ["S", "M", "L", "XL"], colors: ["Negro"], accent: "#A7ADB2" },
  { handle: "maurten-gel-100", title: "Gel 100 (caja x12)", brand: "Maurten", sport: "nutricion", gender: "unisex", price: 380, compareAt: 420, rating: 4.9, reviews: 301, stock: 60, sizes: ["Caja x12"], colors: ["Neutro"], badge: "Top ventas", accent: "#FFD43B", featured: true },
  { handle: "sis-beta-fuel", title: "Beta Fuel 80 (x15)", brand: "SiS", sport: "nutricion", gender: "unisex", price: 320, rating: 4.6, reviews: 142, stock: 40, sizes: ["Caja x15"], colors: ["Naranja", "Limón"], accent: "#FF7A45" },
  { handle: "garmin-forerunner-965", title: "Forerunner 965 AMOLED", brand: "Garmin", sport: "tecnologia", gender: "unisex", price: 2490, compareAt: 2790, rating: 4.9, reviews: 176, stock: 7, sizes: ["47 mm"], colors: ["Negro/Volt", "Blanco"], badge: "GPS Multibanda", accent: "#B8FF32", featured: true },
  { handle: "wahoo-tickr-hr", title: "TICKR Monitor Cardíaco", brand: "Wahoo", sport: "tecnologia", gender: "unisex", price: 290, rating: 4.7, reviews: 210, stock: 25, sizes: ["Única"], colors: ["Negro"], accent: "#FF6B6B" },
  { handle: "flipbelt-classic", title: "Cinturón de Running FlipBelt", brand: "FlipBelt", sport: "accesorios", gender: "unisex", price: 145, rating: 4.6, reviews: 98, stock: 50, sizes: ["S", "M", "L"], colors: ["Negro", "Volt"], accent: "#B8FF32" },
  { handle: "theragun-mini", title: "Theragun Mini Percusión", brand: "Therabody", sport: "recuperacion", gender: "unisex", price: 890, compareAt: 990, rating: 4.8, reviews: 134, stock: 11, sizes: ["Única"], colors: ["Negro"], badge: "Recovery", accent: "#DA77F2" },
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
    category_ids: catByHandle.get(item.sport)
      ? [catByHandle.get(item.sport) as string]
      : [],
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
