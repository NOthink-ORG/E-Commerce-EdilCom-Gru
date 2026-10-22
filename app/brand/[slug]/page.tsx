import { notFound } from "next/navigation";
import { brandDirectory } from "@/lib/catalog-navigation";
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
  return brandDirectory.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params;
  const brand = brandDirectory.find((item) => item.slug === slug);
  if (!brand) notFound();
  const query = await searchParams;
  if (!catalogRequest(query, { brand: brand.name }).result.validPage)
    notFound();
  return collectionMetadata(
    `Ricambi ${brand.name}`,
    `${brand.description}. Esplora categorie e prodotti del catalogo dimostrativo.`,
    `/brand/${brand.slug}`,
    query,
    { brand: brand.name },
  );
}
export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const brand = brandDirectory.find((item) => item.slug === slug);
  if (!brand) notFound();
  const query = await searchParams;
  if (!catalogRequest(query, { brand: brand.name }).result.validPage)
    notFound();
  return (
    <main id="contenuto">
      <CollectionHero
        currentPath={requestHref(`/brand/${brand.slug}`, query)}
        title={`Ricambi ${brand.name}`}
        description={`${brand.description}. Scopri la selezione di componenti e accessori disponibili nel catalogo.`}
        items={[{ label: "Brand", href: "/brand" }, { label: brand.name }]}
        image={brand.image}
      />
      <Catalog
        params={query}
        pathname={`/brand/${brand.slug}`}
        scope={{ brand: brand.name }}
      />
      <SupportBanner />
    </main>
  );
}
