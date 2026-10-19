import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { catalogProvider, products } from "@/lib/catalog";
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
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = catalogProvider.find((await params).slug);
  if (!p) notFound();
  const related = products
    .filter(
      (x) =>
        x.id !== p.id && (x.brand === p.brand || x.category === p.category),
    )
    .slice(0, 4);
  const shown =
    related.length >= 4
      ? related
      : [
          ...related,
          ...products.filter((x) => x.id !== p.id && !related.includes(x)),
        ].slice(0, 4);
  return (
    <main id="contenuto">
      <div className="container product-page">
        <Breadcrumbs
          items={[
            { label: "Ricambi", href: "/catalogo" },
            {
              label: p.category,
              href: `/catalogo?categoria=${encodeURIComponent(p.category)}`,
            },
            { label: p.name },
          ]}
        />
        <ProductDetail product={p} />
        <section className="section related">
          <div className="section-heading">
            <h2>Prodotti correlati</h2>
            <Link className="text-link" href="/catalogo">
              Vedi tutti i ricambi <ArrowRight size={16} />
            </Link>
          </div>
          <ProductGrid products={shown} columns={4} />
        </section>
      </div>
      <SupportBanner />
    </main>
  );
}
