"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  brandDirectory,
  brandHref,
  normalizeSearch,
} from "@/lib/catalog-navigation";
import { SearchBar } from "./ui";
export function BrandDirectory() {
  const params = useSearchParams();
  const query = params.get("q") || "";
  const matches = brandDirectory.filter((brand) =>
    normalizeSearch(brand.name).includes(normalizeSearch(query)),
  );
  return (
    <>
      <div className="container catalog-search">
        <SearchBar
          key={query}
          initial={query}
          action="/brand"
          placeholder="Cerca un brand (es. Hetronic, HBC, Autec…)"
          popularTerms={[]}
        />
      </div>
      <section className="container section directory-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Brand disponibili</p>
            <h2>Tutti i marchi di ricambi per gru</h2>
          </div>
          <p className="muted" role="status">
            {matches.length}{" "}
            {matches.length === 1 ? "brand trovato" : "brand trovati"}
          </p>
        </div>
        <div className="directory-grid">
          {matches.map((brand) => (
            <Link
              key={brand.slug}
              href={brandHref(brand.name)}
              className="category-card directory-card brand-card"
            >
              <div
                className={`brand-wordmark brand-wordmark-${brand.slug}`}
                aria-hidden="true"
              >
                {brand.name}
              </div>
              <h3>{brand.name}</h3>
              <p>{brand.description}</p>
              <strong className="directory-count">
                {brand.count} {brand.count === 1 ? "prodotto" : "prodotti"}
              </strong>
              <span className="button primary">Esplora brand</span>
            </Link>
          ))}
        </div>
        {!matches.length && (
          <div className="empty-state">
            <h2>Nessun brand trovato</h2>
            <p>Prova un altro nome o mostra tutti i brand.</p>
            <Link className="button primary" href="/brand">
              Mostra tutti i brand
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
