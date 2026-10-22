import { notFound } from "next/navigation";
import { categoryDirectory } from "@/lib/catalog-navigation";
import { CollectionHero } from "@/components/collection-sections";
import { Catalog } from "@/components/catalog";
import { catalogRequest, requestHref } from "@/lib/catalog-request";
import { SupportBanner } from "@/components/shell";
import { collectionMetadata, type SearchParams } from "@/lib/seo";
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
  const query = await searchParams;
  if (!catalogRequest(query, { category: category.name }).result.validPage)
    notFound();
  return collectionMetadata(
    `${category.name} per gru`,
    `${category.description}. Esplora i prodotti demo, filtra per marca e confronta i ricambi.`,
    `/categorie/${category.slug}`,
    query,
    { category: category.name },
  );
}
export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = categoryDirectory.find((item) => item.slug === slug);
  if (!category) notFound();
  const query = await searchParams;
  if (!catalogRequest(query, { category: category.name }).result.validPage)
    notFound();
  return (
    <main id="contenuto">
      <CollectionHero
        currentPath={requestHref(`/categorie/${category.slug}`, query)}
        title={`${category.name} per gru`}
        description={`${category.description}. Esplora la selezione di ricambi e accessori per il sollevamento.`}
        items={[
          { label: "Categorie", href: "/categorie" },
          { label: category.name },
        ]}
      />
      <Catalog
        params={query}
        pathname={`/categorie/${category.slug}`}
        scope={{ category: category.name }}
      />
      <SupportBanner />
    </main>
  );
}
