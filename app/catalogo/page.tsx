import { collectionMetadata, type SearchParams } from "@/lib/seo";
import { CollectionHero } from "@/components/collection-sections";
import { Catalog } from "@/components/catalog";
import { catalogRequest, requestHref } from "@/lib/catalog-request";
import { notFound } from "next/navigation";
import { SupportBanner } from "@/components/shell";
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  if (!catalogRequest(query).result.validPage) notFound();
  return collectionMetadata(
    "Catalogo ricambi",
    "Ricambi per gru: esplora categorie, brand e prodotti del catalogo dimostrativo Edilcom Gru.",
    "/catalogo",
    query,
  );
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  if (!catalogRequest(query).result.validPage) notFound();
  return (
    <main id="contenuto">
      <CollectionHero
        currentPath={requestHref("/catalogo", query)}
        title="Ricambi per la tua gru"
        description="Comandi, componenti e accessori per il sollevamento. Trova il ricambio giusto, in pochi passi."
        items={[{ label: "Catalogo" }]}
      />
      <Catalog params={query} pathname={"/catalogo"} scope={{}} />
      <SupportBanner />
    </main>
  );
}
