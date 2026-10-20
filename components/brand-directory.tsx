"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  brandDirectory,
  brandHref,
  normalizeSearch,
} from "@/lib/catalog-navigation";
import { SearchBar } from "./ui";
const initials = [
  ...new Set(brandDirectory.map((brand) => brand.name[0].toUpperCase())),
].sort();
export function BrandDirectory() {
  const params = useSearchParams();
  const query = params.get("q") || "";
  const initial = params.get("lettera") || "";
  const matches = brandDirectory.filter(
    (brand) =>
      normalizeSearch(brand.name).includes(normalizeSearch(query)) &&
      (!initial || brand.name[0].toUpperCase() === initial),
  );
  function letterHref(letter: string) {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (letter) next.set("lettera", letter);
    return `/brand${next.size ? `?${next}` : ""}`;
  }
  return (
    <>
      <div className="container catalog-search">
        <SearchBar
          key={query}
          initial={query}
          action="/brand"
          placeholder="Cerca un brand (es. Hetronic, HBC, Autec…)"
          popularTerms={[]}
          fields={initial ? [["lettera", initial]] : []}
        >
          <nav
            className="alphabet-filter"
            aria-label="Filtra brand per iniziale"
          >
            <strong>Tutti i brand:</strong>
            {["", ...initials].map((letter) => (
              <Link
                key={letter}
                href={letterHref(letter)}
                className={letter === initial ? "active" : ""}
                aria-current={letter === initial ? "true" : undefined}
              >
                {letter || "Tutti"}
              </Link>
            ))}
          </nav>
        </SearchBar>
      </div>
      <section className="container section directory-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Brand disponibili</p>
            <h2>Tutti i marchi di ricambi per gru</h2>
          </div>
          <p className="muted" role="status">
            {matches.length} brand trovati
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
            <p>Prova un altro nome o rimuovi il filtro alfabetico.</p>
            <Link className="button primary" href="/brand">
              Mostra tutti i brand
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
