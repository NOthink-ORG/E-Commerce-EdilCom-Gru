import Link from "next/link";
import {
  categories as defaultCategories,
  products,
  type Product,
} from "@/lib/catalog";
import { SearchBar, ProductGrid, SectionHeading } from "./ui";
import { CategoryCard } from "./collection-sections";
import { categoryDirectory } from "@/lib/catalog-navigation";
import { SupportButton } from "./support-button";
export function Hero({
  title = "Ricambi per gru,",
  highlight = "subito disponibili",
}: {
  title?: string;
  highlight?: string;
}) {
  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">Ricambi originali e compatibili</p>
          <h1>
            {title}
            <br />
            <span>{highlight}</span>
          </h1>
          <p>
            Tutto ciò che serve per mantenere le tue gru sempre operative.
            <br className="desktop-break" /> Ricambi per i principali marchi,
            consulenza tecnica
            <br className="desktop-break" /> e soluzioni di spedizione in tutta
            Italia.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/catalogo">
              Esplora il catalogo
            </Link>
            <SupportButton className="button light-outline" />
          </div>
        </div>
      </section>
      <div className="container home-search">
        <SearchBar />
      </div>
    </>
  );
}
export function CategoryShowcase({
  items = defaultCategories,
}: {
  items?: typeof defaultCategories;
}) {
  return (
    <section className="container section categories" id="categorie">
      <SectionHeading
        eyebrow="Categorie principali"
        title="Trova il ricambio giusto per la tua gru"
        link="/categorie"
      />
      <div className="category-grid">
        {items.slice(0, 4).map((c) => (
          <CategoryCard
            key={c.name}
            category={categoryDirectory.find((item) => item.name === c.name)!}
            compact
          />
        ))}
      </div>
    </section>
  );
}
export function FeaturedProducts({
  items = products.slice(0, 4),
  title = "I più richiesti dai nostri clienti",
}: {
  items?: Product[];
  title?: string;
}) {
  return (
    <section className="container section featured">
      <SectionHeading
        eyebrow="Prodotti in evidenza"
        title={title}
        link="/catalogo"
        linkLabel="Esplora il catalogo"
      />
      <ProductGrid products={items.slice(0, 4)} columns={4} />
    </section>
  );
}
