import { Hero } from "@/components/site/Hero";
import { MetricsTicker } from "@/components/site/MetricsTicker";
import { CategoryGrid } from "@/components/site/CategoryGrid";
import { ValueProps } from "@/components/site/ValueProps";
import { Shop } from "@/components/shop/Shop";
import { getCatalog } from "@/lib/catalog";

// ISR: la página se regenera cuando hay backend Medusa detrás.
export const revalidate = 60;

export default async function HomePage() {
  const { products, source } = await getCatalog();

  return (
    <>
      <Hero />
      <MetricsTicker />
      <CategoryGrid />
      <ValueProps />
      <Shop products={products} demo={source === "mock"} />
    </>
  );
}
