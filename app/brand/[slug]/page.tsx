import { Suspense } from "react";
import { notFound } from "next/navigation";
import { brandDirectory, categoryDirectory } from "@/lib/catalog-navigation";
import { products } from "@/lib/catalog";
import { CollectionHero, CategoryCard } from "@/components/collection-sections";
import { CatalogView } from "@/components/catalog-view";
import { SupportBanner } from "@/components/shell";
import { pageMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return brandDirectory.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const brand = brandDirectory.find((item) => item.slug === slug);
  if (!brand) notFound();
  return pageMetadata(
    `Ricambi ${brand.name}`,
    `${brand.description}. Esplora categorie e prodotti del catalogo dimostrativo.`,
    `/brand/${brand.slug}`,
  );
}
export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = brandDirectory.find((item) => item.slug === slug);
  if (!brand) notFound();
  const associated = categoryDirectory
    .map((category) => ({
      ...category,
      count: products.filter(
        (product) =>
          product.brand === brand.name && product.category === category.name,
      ).length,
    }))
    .filter((category) => category.count > 0);
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
        <CatalogView scope={{ brand: brand.name }}>
          <section className="container section brand-categories">
            <h2>Categorie {brand.name}</h2>
            <div className="directory-grid compact-directory">
              {associated.map((category) => (
                <CategoryCard
                  key={category.slug}
                  category={category}
                  href={`/brand/${brand.slug}?categoria=${encodeURIComponent(category.name)}`}
                />
              ))}
            </div>
          </section>
        </CatalogView>
      </Suspense>
      <SupportBanner />
    </main>
  );
}
