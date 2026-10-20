"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import {
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  Search,
  ChevronLeft,
  RotateCcw,
} from "lucide-react";
import { products, catalogPriceLimit } from "@/lib/catalog";
import { ProductGrid, SearchBar } from "./ui";
import { CatalogFilters } from "./catalog-filters";
import { FilterDrawer } from "./filter-drawer";
import {
  parseCatalogState,
  scopedProducts,
  filterProducts,
  paginateProducts,
  type CatalogScope,
} from "@/lib/catalog-logic";
import { CollectionLinks } from "./collection-sections";
export function CatalogView({ scope = {} }: { scope?: CatalogScope }) {
  const params = useSearchParams(),
    router = useRouter(),
    pathname = usePathname();
  const [filterQuery, setFilterQuery] = useOptimistic(params.toString());
  const [pending, startTransition] = useTransition();
  const current = new URLSearchParams(filterQuery);
  const [resetRevision, setResetRevision] = useState(0);
  const source = scopedProducts(products, scope);
  const [drawer, setDrawer] = useState(false);
  const [layout, setLayout] = useState("grid");
  const state = parseCatalogState(current, catalogPriceLimit);
  const {
    query,
    selectedCategories,
    brands,
    compatible,
    available,
    max,
    min,
    sort,
    voltage,
  } = state;
  const [priceDraft, setPriceDraft] = useState<number | null>(null);
  const sliderMax = priceDraft ?? max;
  function navigate(next: URLSearchParams) {
    startTransition(() => {
      setFilterQuery(next.toString());
      router.replace(`${pathname}${next.size ? `?${next.toString()}` : ""}`, {
        scroll: false,
      });
    });
  }
  function reset() {
    setPriceDraft(null);
    setResetRevision((revision) => revision + 1);
    navigate(new URLSearchParams());
  }
  function commitPrice(value: string) {
    setPriceDraft(null);
    if (Number(value) !== max) change("max", value);
  }
  function change(key: string, value: string, multi = false) {
    const next = new URLSearchParams(filterQuery);
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
    navigate(next);
  }
  const filtered = filterProducts(source, state);
  const { pages, page, visible } = paginateProducts(filtered, state.page);
  const filters = (
    <CatalogFilters
      key={resetRevision}
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
      onReset={reset}
      onClose={() => setDrawer(false)}
      onPriceDraft={setPriceDraft}
      onPriceCommit={commitPrice}
    />
  );
  return (
    <>
      <div className="container catalog-search">
        <SearchBar
          key={`${query}-${resetRevision}`}
          initial={query}
          source={source}
          category
          action={pathname}
          fields={[...current.entries()].filter(
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
        <div className="catalog-results" aria-busy={pending}>
          <div className="catalog-toolbar">
            <strong>
              {filtered.length}{" "}
              {filtered.length === 1 ? "prodotto trovato" : "prodotti trovati"}
            </strong>
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
            max < catalogPriceLimit ||
            voltage.length > 0) && (
            <div className="active-filters">
              <span>
                {query ? `Ricerca: “${query}”` : "Filtri attivi"}{" "}
                {selectedCategories.join(", ")} {brands.join(", ")}
              </span>
              <button className="text-button" onClick={reset}>
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
              <button className="button primary" onClick={reset}>
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
