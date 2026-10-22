import { pageMetadata } from "@/lib/seo";
import {
  Hero,
  CategoryShowcase,
  FeaturedProducts,
} from "@/components/home-sections";
import { SupportBanner } from "@/components/shell";
export const metadata = pageMetadata(
  "Edilcom Gru — Ricambi per gru e sollevamento",
  "Esplora il catalogo dimostrativo Edilcom Gru: ricambi per gru, radiocomandi, funi, motori e assistenza tecnica.",
  "/",
  "public",
);
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
