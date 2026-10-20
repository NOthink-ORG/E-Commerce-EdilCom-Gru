import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { catalogProvider, products } from "@/lib/catalog";
import { categoryHref, brandHref } from "@/lib/catalog-navigation";
import { Breadcrumbs, ProductGrid } from "@/components/ui";
import { ProductDetail } from "@/components/product-detail";
import { SupportBanner } from "@/components/shell";
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = catalogProvider.find((await params).slug);
  return {
    title: p?.name || "Prodotto non trovato",
    description: p?.description,
    alternates: { canonical: `/prodotti/${(await params).slug}` },
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = catalogProvider.find((await params).slug);
  if (!p) notFound();
  const others = products.filter((item) => item.id !== p.id);
  const groups = [
    {
      title: "Prodotti correlati",
      href: categoryHref(p.category),
      label: `Tutti i prodotti: ${p.category}`,
      items: others.filter((item) => item.category === p.category).slice(0, 4),
    },
    {
      title: `Altri ricambi ${p.brand}`,
      href: brandHref(p.brand),
      label: `Esplora ${p.brand}`,
      items: others.filter((item) => item.brand === p.brand).slice(0, 4),
    },
    {
      title: "Altri ricambi per la tua gru",
      href: `/catalogo?compatibilita=${encodeURIComponent(p.compatibility[0])}`,
      label: "Esplora i ricambi",
      items: others
        .filter((item) => item.category !== p.category && item.brand !== p.brand &&
          item.compatibility.some((brand) => p.compatibility.includes(brand)))
        .slice(0, 4),
    },
  ].filter((group) => group.items.length > 0);
  return (
    <main id="contenuto">
      <div className="container product-page">
        <Breadcrumbs
          items={[
            { label: "Ricambi", href: "/catalogo" },
            {
              label: p.category,
              href: categoryHref(p.category),
            },
            { label: p.name },
          ]}
        />
        <ProductDetail product={p} />
        {groups.map((group) => (
          <section className="section related" key={group.title}>
            <div className="section-heading">
              <h2>{group.title}</h2>
              <Link className="text-link" href={group.href}>{group.label}</Link>
            </div>
            <ProductGrid products={group.items} columns={4} />
          </section>
        ))}
      </div>
      <SupportBanner />
    </main>
  );
}
