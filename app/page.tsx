import { Hero } from "@/components/site/Hero";
import { MetricsTicker } from "@/components/site/MetricsTicker";
import { CategoryGrid } from "@/components/site/CategoryGrid";
import { ValueProps } from "@/components/site/ValueProps";
import { Shop } from "@/components/shop/Shop";
import { PRODUCTS } from "@/lib/products";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MetricsTicker />
      <CategoryGrid />
      <ValueProps />
      <Shop products={PRODUCTS} />
    </>
  );
}
