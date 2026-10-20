import { Suspense } from "react";
import { notFound } from "next/navigation";
import { categoryDirectory } from "@/lib/catalog-navigation";
import { CollectionHero } from "@/components/collection-sections";
import { CatalogView } from "@/components/catalog-view";
import { SupportBanner } from "@/components/shell";
import {
  collectionCanonical,
  type SearchParams,
  pageMetadata,
} from "@/lib/seo";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};
export const dynamicParams = false;

export function generateStaticParams() {
  return categoryDirectory.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = categoryDirectory.find((item) => item.slug === slug);
  if (!category) notFound();
  return pageMetadata(
    `${category.name} per gru`,
    `${category.description}. Esplora i prodotti demo, filtra per marca e confronta i ricambi.`,
    collectionCanonical(`/categorie/${category.slug}`, await searchParams),
  );
}
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categoryDirectory.find((item) => item.slug === slug);
  if (!category) notFound();
  return (
    <main id="contenuto">
      <CollectionHero
        title={`${category.name} per gru`}
        description={`${category.description}. Esplora la selezione di ricambi e accessori per il sollevamento.`}
        items={[
          { label: "Categorie", href: "/categorie" },
          { label: category.name },
        ]}
      />
      <Suspense
        fallback={
          <div className="container loading">Caricamento prodotti…</div>
        }
      >
        <CatalogView scope={{ category: category.name }} />
      </Suspense>
      <SupportBanner />
    </main>
  );
}
