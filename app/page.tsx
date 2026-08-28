import { Hero } from "@/components/site/Hero";
import { MetricsTicker } from "@/components/site/MetricsTicker";
import { NutritionGuide } from "@/components/site/NutritionGuide";
import { CategoryGrid } from "@/components/site/CategoryGrid";
import { ValueProps } from "@/components/site/ValueProps";
import { Shop } from "@/components/shop/Shop";
import { CommunitySection } from "@/components/site/CommunitySection";
import { getCatalog } from "@/lib/catalog";

// ISR: la página se regenera cuando hay backend Medusa detrás.
export const revalidate = 60;

export default async function HomePage() {
  const { products, source } = await getCatalog();

  return (
    <>
      <Hero />
      <MetricsTicker />
      {/* Nutrición: categoría protagonista, primero */}
      <NutritionGuide products={products} />
      {/* Las 5 comunidades de endurance */}
      <CategoryGrid />
      <ValueProps />
      <Shop products={products} demo={source === "mock"} />
      <CommunitySection />
    </>
  );
}
