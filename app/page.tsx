import {
  Hero,
  CategoryShowcase,
  FeaturedProducts,
} from "@/components/home-sections";
import { SupportBanner } from "@/components/shell";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <main id="contenuto">
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <SupportBanner />
    </main>
  );
}
