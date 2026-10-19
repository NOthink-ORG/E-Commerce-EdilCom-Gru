"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { products, categories, money, type Product } from "@/lib/catalog";
import { ProductGrid, SearchBar } from "./ui";
import { FilterDrawer } from "./filter-drawer";
const pageSize = 12;
const allCategories = [...new Set(products.map((p) => p.category))];
const allBrands = [...new Set(products.map((p) => p.brand))];
export function CatalogView() {
  const params = useSearchParams(),
    router = useRouter();
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
    router.replace(`/catalogo?${next.toString()}`, { scroll: false });
  }
  const normalize = (s: string) =>
    s
      .toLocaleLowerCase("it")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  let filtered = products.filter((p) => {
    const searchable = normalize(
      `${p.name} ${p.code} ${p.brand} ${p.category}`,
    );
    return (
      normalize(query)
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
  function checkGroup(
    title: string,
    options: string[],
    key: string,
    chosen: string[],
    count: (p: Product, v: string) => boolean,
  ) {
    return (
      <fieldset>
        <legend>{title}</legend>
        {options.map((v) => (
          <label className="check-label" key={v}>
            <input
              type="checkbox"
              checked={chosen.includes(v)}
              onChange={() => change(key, v, true)}
            />
            <span>{v}</span>
            <small>({products.filter((p) => count(p, v)).length})</small>
          </label>
        ))}
      </fieldset>
    );
  }
  const filters = (
    <>
      <div className="filter-heading">
        <h2>Filtri di ricerca</h2>
        <button
          className="text-button"
          onClick={() => router.replace("/catalogo", { scroll: false })}
        >
          Pulisci filtri
        </button>
        <button
          className="icon-button close-filters"
          onClick={() => setDrawer(false)}
          aria-label="Chiudi filtri"
        >
          <X size={19} />
        </button>
      </div>
      {checkGroup(
        "Categoria",
        allCategories,
        "categoria",
        selectedCategories,
        (p, v) => p.category === v,
      )}
      {checkGroup("Brand", allBrands, "brand", brands, (p, v) => p.brand === v)}
      {checkGroup(
        "Compatibilità demo",
        ["Potain", "Terex", "Liebherr"],
        "compatibilita",
        compatible,
        (p, v) => p.compatibility.includes(v),
      )}
      <fieldset>
        <legend>Disponibilità</legend>
        <label className="check-label">
          <input
            type="checkbox"
            checked={available}
            onChange={() => change("disponibile", available ? "" : "1")}
          />
          <span>Solo prodotti disponibili</span>
        </label>
      </fieldset>
      <fieldset>
        <legend>Fascia prezzo</legend>
        <div className="price-inputs">
          <label>
            <span className="sr-only">Prezzo minimo</span>
            <input
              type="number"
              aria-label="Prezzo minimo"
              min={0}
              max={2000}
              value={min || ""}
              placeholder="Da €"
              onChange={(e) => change("min", e.target.value)}
            />
          </label>
          <label>
            <span className="sr-only">Prezzo massimo</span>
            <input
              type="number"
              aria-label="Prezzo massimo"
              min={0}
              max={2000}
              value={max}
              onChange={(e) => change("max", e.target.value)}
            />
          </label>
        </div>
        <input
          className="price-range"
          aria-label="Limite prezzo massimo"
          type="range"
          min={0}
          max={2000}
          step={10}
          value={max}
          onChange={(e) => change("max", e.target.value)}
        />
        <small className="muted">Fino a {money(max)} · IVA esclusa</small>
      </fieldset>
      {checkGroup(
        "Tensione / alimentazione",
        ["24 V", "400 V", "Batteria ricaricabile"],
        "tensione",
        voltage,
        (p, v) => p.voltage === v,
      )}
      <button
        className="button primary apply-filters"
        onClick={() => setDrawer(false)}
      >
        Mostra {filtered.length} prodotti
      </button>
    </>
  );
  return (
    <>
      <div className="container catalog-search">
        <SearchBar key={query} initial={query} category />
      </div>
      <section className="container catalog-layout">
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
          <div className="subcategories" id="categorie">
            {categories.slice(0, 5).map((c) => (
              <Link
                key={c.name}
                href={`/catalogo?categoria=${encodeURIComponent(c.name)}`}
              >
                <img
                  src={`/images/${c.image}.webp`}
                  width={48}
                  height={48}
                  alt=""
                />
                <span>
                  <strong>{c.name}</strong>
                  <small>
                    {products.filter((p) => p.category === c.name).length}{" "}
                    prodotti
                  </small>
                </span>
                <ChevronRight size={15} />
              </Link>
            ))}
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
                onClick={() => router.replace("/catalogo", { scroll: false })}
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
                onClick={() => router.replace("/catalogo", { scroll: false })}
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
                <ChevronRight size={17} />
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
