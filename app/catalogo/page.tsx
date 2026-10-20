import { Suspense } from "react";
import { catalogCanonical, pageMetadata, type SearchParams } from "@/lib/seo";
import { CollectionHero } from "@/components/collection-sections";
import { CatalogView } from "@/components/catalog-view";
import { SupportBanner } from "@/components/shell";
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return pageMetadata(
    "Catalogo ricambi",
    "Ricambi per gru: esplora categorie, brand e prodotti del catalogo dimostrativo Edilcom Gru.",
    catalogCanonical(await searchParams),
  );
}
export default function CatalogPage() {
  return (
    <main id="contenuto">
      <CollectionHero
        title="Ricambi per la tua gru"
        description="Comandi, componenti e accessori per il sollevamento. Trova il ricambio giusto, in pochi passi."
        items={[{ label: "Catalogo" }]}
      />
      <Suspense
        fallback={
          <div className="container loading" role="status">
            Caricamento catalogo…
          </div>
        }
      >
        <CatalogView />
      </Suspense>
      <SupportBanner />
    </main>
  );
}
