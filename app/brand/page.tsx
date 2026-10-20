import { Suspense } from "react";
import Link from "next/link";
import { CollectionHero } from "@/components/collection-sections";
import { BrandDirectory } from "@/components/brand-directory";
import { ProductGrid } from "@/components/ui";
import { brandHref } from "@/lib/catalog-navigation";
import { products } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Brand disponibili",
  "Trova i marchi disponibili nel catalogo dimostrativo Edilcom Gru: radiocomandi, motori e ricambi per il sollevamento.",
  "/brand",
);
export default function BrandsPage() {
  const featured = ["Hetronic", "HBC", "Autec", "Telemecanique"].flatMap(
    (brand) =>
      products.filter((product) => product.brand === brand).slice(0, 1),
  );
  return (
    <main id="contenuto">
      <CollectionHero
        title="Brand disponibili"
        description="Ricambi originali e compatibili per i principali marchi di gru. Trova il brand ed esplora i ricambi del catalogo."
        items={[{ label: "Brand" }]}
      />
      <Suspense
        fallback={<div className="container loading">Caricamento brand…</div>}
      >
        <BrandDirectory />
      </Suspense>
      <section className="container section featured">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Dal catalogo demo</p>
            <h2>Una selezione dai nostri brand</h2>
          </div>
          <Link className="button primary" href={brandHref("Hetronic")}>
            Esplora Hetronic
          </Link>
        </div>
        <ProductGrid products={featured} columns={4} />
      </section>
    </main>
  );
}
