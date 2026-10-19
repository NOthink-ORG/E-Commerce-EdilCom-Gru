import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  categories as defaultCategories,
  products,
  type Product,
} from "@/lib/catalog";
import { SearchBar, ProductGrid, SectionHeading } from "./ui";
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
              Esplora il catalogo <ArrowRight size={18} />
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
        link="/catalogo#categorie"
      />
      <div className="category-grid">
        {items.map((c) => (
          <Link
            key={c.name}
            className="category-card"
            href={`/catalogo?categoria=${encodeURIComponent(c.name)}`}
          >
            <img
              src={`/images/${c.image}.webp`}
              alt={c.name}
              width={180}
              height={130}
              loading="lazy"
            />
            <h3>{c.name}</h3>
            <p>{c.description}</p>
            <span className="category-arrow">
              <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
export function FeaturedProducts({
  items = products.slice(0, 5),
  title = "I più richiesti dai nostri clienti",
}: {
  items?: Product[];
  title?: string;
}) {
  return (
    <section className="container section featured">
      <SectionHeading eyebrow="Prodotti in evidenza" title={title} />
      <ProductGrid products={items} />
    </section>
  );
}
