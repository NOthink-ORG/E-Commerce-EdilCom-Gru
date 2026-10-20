"use client";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Search, ChevronRight } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/lib/catalog";
import { normalizeSearch, searchRank } from "@/lib/catalog-logic";
import type { Product } from "@/lib/catalog";
import { money } from "@/lib/catalog";
import { isPurchasable, stockLabels } from "@/lib/catalog-logic";
import { brandHref } from "@/lib/catalog-navigation";
import { useStore } from "./store-provider";
export function StockBadge({ stock }: { stock: Product["stock"] }) {
  return (
    <span
      className={`stock ${stock === "low" ? "low" : stock === "out_of_stock" ? "out" : ""}`}
    >
      <span />
      {stockLabels[stock]}
    </span>
  );
}
export function Price({ product }: { product: Product }) {
  return (
    <span className="price">
      {money(product.price)}
      {product.unit === "metro" && <small> / metro</small>}
    </span>
  );
}
export function QuantitySelector({
  value,
  onChange,
  label = "Quantità",
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
}) {
  return (
    <div className="quantity">
      <button
        aria-label={`Riduci ${label}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={14} />
      </button>
      <input
        aria-label={label}
        type="number"
        min={1}
        max={999}
        value={value}
        onChange={(e) =>
          onChange(
            Math.max(1, Math.min(999, Math.round(Number(e.target.value)) || 1)),
          )
        }
      />
      <button
        aria-label={`Aumenta ${label}`}
        disabled={value >= 999}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
export function AddToCart({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const [qty, setQty] = useState(1);
  const { add } = useStore();
  return (
    <div className={`buy-row ${compact ? "compact" : ""}`}>
      <QuantitySelector
        value={qty}
        onChange={setQty}
        label={`Quantità ${product.name}`}
      />
      <button
        className="button primary"
        disabled={!isPurchasable(product.stock)}
        onClick={() => add(product.id, qty)}
      >
        <ShoppingCart size={17} />
        <span>
          {isPurchasable(product.stock) ? "Aggiungi al carrello" : "Esaurito"}
        </span>
      </button>
    </div>
  );
}
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <StockBadge stock={product.stock} />
      <Link className="product-image" href={`/prodotti/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          width={240}
          height={170}
          loading="lazy"
        />
      </Link>
      <Link className="product-name" href={`/prodotti/${product.slug}`}>
        {product.name}
      </Link>
      <div className="product-meta">
        <span>Cod. {product.code}</span>
        <Link className="brand-tag" href={brandHref(product.brand)}>
          {product.brand}
        </Link>
      </div>
      <Price product={product} />
      <AddToCart product={product} compact />
    </article>
  );
}
export function ProductGrid({
  products,
  columns = 5,
}: {
  products: Product[];
  columns?: number;
}) {
  return (
    <div className={`product-grid columns-${columns}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Percorso" className="breadcrumbs">
      <Link href="/">Home</Link>
      {items.map((item, i) => (
        <span key={i}>
          <ChevronRight size={12} />
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function SearchBar({
  initial = "", category = false, action = "/catalogo", fields = [], placeholder,
  popularTerms, children, source = products,
}: {
  initial?: string; category?: boolean; action?: string; fields?: [string, string][];
  placeholder?: string; popularTerms?: string[]; children?: React.ReactNode; source?: Product[];
}) {
  const router = useRouter();
  const id = useId();
  const [value, setValue] = useState(initial);
  const [debounced, setDebounced] = useState(initial);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { const timer = setTimeout(() => setDebounced(value.trim()), 180); return () => clearTimeout(timer); }, [value]);
  const terms = popularTerms ?? (category
    ? ["hetronic", "hbc", "autec", "ricevitore", "batteria", "antenna"]
    : ["radiocomando", "motore", "fune", "finecorsa", "potain", "manitowoc"]);
  const matches = action === "/brand" ? [] : source
    .map(product => ({ product, rank: searchRank(product, debounced) }))
    .filter((entry): entry is { product: Product; rank: number } => entry.rank !== null)
    .sort((a, b) => a.rank - b.rank || a.product.name.localeCompare(b.product.name, "it"))
    .slice(0, 6);
  const brandMatches = action === "/brand" ? [...new Set(products.map(p => p.brand))]
    .filter(name => normalizeSearch(name).includes(normalizeSearch(debounced))).slice(0, 6) : [];
  const suggestions = action === "/brand" ? brandMatches.map(name => ({ label: name, detail: "Brand", href: `/brand?q=${encodeURIComponent(name)}` }))
    : matches.map(({ product }) => ({ label: product.name, detail: `Cod. ${product.code}`, href: `/prodotti/${product.slug}` }));
  const visible = open && debounced.length > 0;
  function submit(query: string) {
    const params = new URLSearchParams(fields);
    if (query.trim()) params.set("q", query.trim());
    setOpen(false);
    router.push(`${action}${params.size ? `?${params.toString()}` : ""}`);
  }
  return <div className="search-panel" ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <form className="search-form" onSubmit={event => { event.preventDefault(); submit(value); }} role="search">
      <Search size={21} />
      <input name="q" value={value} onChange={event => { setValue(event.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)} onKeyDown={event => {
          if (event.key === "Escape") { setOpen(false); setActive(-1); }
          if (visible && event.key === "ArrowDown") { event.preventDefault(); setActive(i => Math.min(i + 1, suggestions.length - 1)); }
          if (visible && event.key === "ArrowUp") { event.preventDefault(); setActive(i => Math.max(i - 1, -1)); }
          if (visible && event.key === "Enter" && active >= 0) { event.preventDefault(); router.push(suggestions[active].href); setOpen(false); }
        }}
        aria-label={action === "/brand" ? "Cerca brand" : "Cerca ricambi"} type="search" autoComplete="off"
        role="combobox" aria-autocomplete="list" aria-expanded={visible} aria-controls={`${id}-results`}
        aria-activedescendant={visible && active >= 0 ? `${id}-item-${active}` : undefined}
        placeholder={placeholder ?? (category ? "Cerca tra i ricambi (es. Hetronic, HBC, trasmettitore…)" : "Cerca per codice, marca o ricambio (es. motore, radiocomando, funi…)")} />
      <button className="button primary" type="submit">Cerca <Search size={17} /></button>
    </form>
    {visible && <div className="search-suggestions" id={`${id}-results`} role="listbox" aria-label="Suggerimenti di ricerca">
      {suggestions.length ? suggestions.map((item, index) => <Link id={`${id}-item-${index}`} role="option" aria-selected={active === index}
        key={item.href} href={item.href} onMouseDown={event => event.preventDefault()} onClick={() => setOpen(false)}>
        <span>{item.label}</span><small>{item.detail}</small></Link>) : <p>Nessun risultato tra i dati demo.</p>}
      {suggestions.length > 0 && <button type="button" className="search-all" onClick={() => submit(value)}>Vedi tutti i risultati per “{value.trim()}”</button>}
    </div>}
    {terms.length > 0 && <div className="popular"><span>Ricerche popolari:</span>{terms.map(q => <button type="button" key={q} onClick={() => { setValue(q); submit(q); }}>{q}</button>)}</div>}
    {children}
  </div>;
}
export function SectionHeading({
  eyebrow,
  title,
  link,
  linkLabel = "Vedi tutte le categorie",
}: {
  eyebrow: string;
  title: string;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {link && (
        <Link className="button primary" href={link}>
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
