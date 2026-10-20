"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  Search,
  ChevronLeft,
  RotateCcw,
} from "lucide-react";
import { products } from "@/lib/catalog";
import { ProductGrid, SearchBar } from "./ui";
import { CatalogFilters } from "./catalog-filters";
import { FilterDrawer } from "./filter-drawer";
import { normalizeSearch, type CatalogScope } from "@/lib/catalog-navigation";
import { CollectionLinks } from "./collection-sections";
const pageSize = 12;
export function CatalogView({ scope = {} }: { scope?: CatalogScope }) {
  const params = useSearchParams(),
    router = useRouter(),
    pathname = usePathname();
  const source = products.filter(
    (product) =>
      (!scope.category || product.category === scope.category) &&
      (!scope.brand || product.brand === scope.brand),
  );
  const [drawer, setDrawer] = useState(false);
  const [layout, setLayout] = useState("grid");
  const query = params.get("q") || "",
    selectedCategories = params.getAll("categoria"),
    brands = params.getAll("brand"),
    compatible = params.getAll("compatibilita"),
    available = params.get("disponibile") === "1",
    max = Number(params.get("max") || 2000),
    min = Number(params.get("min") || 0),
    sort = params.get("ordine") || "relevance",
    voltage = params.getAll("tensione");
  const [priceDraft, setPriceDraft] = useState({ source: max, value: max });
  const sliderMax = priceDraft.source === max ? priceDraft.value : max;
  function commitPrice(value: string) {
    if (Number(value) !== max) change("max", value);
  }
  function change(key: string, value: string, multi = false) {
    const next = new URLSearchParams(params.toString());
    next.delete("pagina");
    if (multi) {
      const old = next.getAll(key);
      next.delete(key);
      (old.includes(value)
        ? old.filter((x) => x !== value)
        : [...old, value]
      ).forEach((v) => next.append(key, v));
    } else if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.size ? `?${next.toString()}` : ""}`, {
      scroll: false,
    });
  }
  let filtered = source.filter((p) => {
    const searchable = normalizeSearch(
      `${p.name} ${p.code} ${p.brand} ${p.category}`,
    );
    return (
      normalizeSearch(query)
        .split(/\s+/)
        .every((q) => searchable.includes(q)) &&
      (!selectedCategories.length || selectedCategories.includes(p.category)) &&
      (!brands.length || brands.includes(p.brand)) &&
      (!compatible.length ||
        compatible.some((c) => p.compatibility.includes(c))) &&
      (!available || p.stock === "available") &&
      p.price >= min &&
      p.price <= max &&
      (!voltage.length || voltage.includes(p.voltage || ""))
    );
  });
  filtered = [...filtered].sort((a, b) =>
    sort === "price-asc"
      ? a.price - b.price
      : sort === "price-desc"
        ? b.price - a.price
        : sort === "name"
          ? a.name.localeCompare(b.name)
          : 0,
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize)),
    page = Math.max(1, Math.min(pages, Number(params.get("pagina")) || 1)),
    visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const filters = (
    <CatalogFilters
      source={source}
      scope={scope}
      values={{
        selectedCategories,
        brands,
        compatible,
        available,
        min,
        max,
        voltage,
        sliderMax,
      }}
      filteredCount={filtered.length}
      change={change}
      onReset={() => router.replace(pathname, { scroll: false })}
      onClose={() => setDrawer(false)}
      onPriceDraft={(value) => setPriceDraft({ source: max, value })}
      onPriceCommit={commitPrice}
    />
  );
  return (
    <>
      <div className="container catalog-search">
        <SearchBar
          key={query}
          initial={query}
          category
          action={pathname}
          fields={[...params.entries()].filter(
            ([key]) => key !== "q" && key !== "pagina",
          )}
          placeholder={
            scope.category
              ? `Cerca tra ${scope.category.toLowerCase()}…`
              : scope.brand
                ? `Cerca tra i ricambi ${scope.brand}…`
                : undefined
          }
        />
      </div>
      {!scope.brand && <CollectionLinks />}
      <section className="container catalog-layout" id="prodotti">
        <aside className="filters desktop-filters" aria-label="Filtri catalogo">
          {filters}
        </aside>
        {drawer && (
          <FilterDrawer onClose={() => setDrawer(false)}>
            {filters}
          </FilterDrawer>
        )}
        <div className="catalog-results">
          <div className="catalog-toolbar">
            <strong>{filtered.length} prodotti trovati</strong>
            <button
              className="button outline filter-toggle"
              onClick={() => setDrawer(true)}
            >
              <SlidersHorizontal size={17} />
              Filtri
            </button>
            <div className="sort-controls">
              <label htmlFor="sort">Ordina per</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => change("ordine", e.target.value)}
              >
                <option value="relevance">Più rilevanti</option>
                <option value="price-asc">Prezzo crescente</option>
                <option value="price-desc">Prezzo decrescente</option>
                <option value="name">Nome A–Z</option>
              </select>
              <div className="view-toggle">
                <button
                  className={layout === "grid" ? "active" : ""}
                  aria-label="Vista griglia"
                  aria-pressed={layout === "grid"}
                  onClick={() => setLayout("grid")}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  className={layout === "list" ? "active" : ""}
                  aria-label="Vista elenco"
                  aria-pressed={layout === "list"}
                  onClick={() => setLayout("list")}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
          {(query ||
            selectedCategories.length > 0 ||
            brands.length > 0 ||
            compatible.length > 0 ||
            available ||
            min > 0 ||
            max < 2000 ||
            voltage.length > 0) && (
            <div className="active-filters">
              <span>
                {query ? `Ricerca: “${query}”` : "Filtri attivi"}{" "}
                {selectedCategories.join(", ")} {brands.join(", ")}
              </span>
              <button
                className="text-button"
                onClick={() => router.replace(pathname, { scroll: false })}
              >
                <X size={14} /> Rimuovi tutti
              </button>
            </div>
          )}
          {visible.length ? (
            <div className={layout === "list" ? "list-view" : ""}>
              <ProductGrid products={visible} columns={4} />
            </div>
          ) : (
            <div className="empty-state">
              <Search size={42} />
              <h2>Nessun ricambio trovato</h2>
              <p>Prova un altro codice o rimuovi alcuni filtri.</p>
              <button
                className="button primary"
                onClick={() => router.replace(pathname, { scroll: false })}
              >
                <RotateCcw size={17} />
                Azzera la ricerca
              </button>
            </div>
          )}
          {pages > 1 && (
            <nav aria-label="Paginazione" className="pagination">
              <button
                aria-label="Pagina precedente"
                disabled={page === 1}
                onClick={() => change("pagina", String(page - 1))}
              >
                <ChevronLeft size={17} />
              </button>
              {Array.from({ length: pages }, (_, i) => (
                <button
                  aria-current={page === i + 1 ? "page" : undefined}
                  key={i}
                  className={page === i + 1 ? "active" : ""}
                  onClick={() => change("pagina", String(i + 1))}
                >
                  {i + 1}
                </button>
              ))}
              <button
                aria-label="Pagina successiva"
                disabled={page === pages}
                onClick={() => change("pagina", String(page + 1))}
              >
                Successiva
              </button>
            </nav>
          )}
          <p className="catalog-note">
            Prezzi IVA esclusa. Catalogo, disponibilità e compatibilità sono
            dati di esempio.
          </p>
        </div>
      </section>
    </>
  );
}
