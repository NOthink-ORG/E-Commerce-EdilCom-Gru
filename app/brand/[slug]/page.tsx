import { Suspense } from "react";
import { notFound } from "next/navigation";
import { brandDirectory } from "@/lib/catalog-navigation";
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
  return brandDirectory.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params;
  const brand = brandDirectory.find((item) => item.slug === slug);
  if (!brand) notFound();
  return pageMetadata(
    `Ricambi ${brand.name}`,
    `${brand.description}. Esplora categorie e prodotti del catalogo dimostrativo.`,
    collectionCanonical(`/brand/${brand.slug}`, await searchParams),
  );
}
export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = brandDirectory.find((item) => item.slug === slug);
  if (!brand) notFound();
  return (
    <main id="contenuto">
      <CollectionHero
        title={`Ricambi ${brand.name}`}
        description={`${brand.description}. Scopri la selezione di componenti e accessori disponibili nel catalogo.`}
        items={[{ label: "Brand", href: "/brand" }, { label: brand.name }]}
        image={brand.image}
      />
      <Suspense
        fallback={
          <div className="container loading">Caricamento prodotti…</div>
        }
      >
        <CatalogView scope={{ brand: brand.name }} />
      </Suspense>
      <SupportBanner />
    </main>
  );
}
