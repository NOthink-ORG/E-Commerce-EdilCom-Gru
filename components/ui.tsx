"use client";
import Link from "next/link";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Search,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { money } from "@/lib/catalog";
import { useStore } from "./store-provider";
export function StockBadge({ stock }: { stock: Product["stock"] }) {
  return (
    <span className={`stock ${stock === "low" ? "low" : ""}`}>
      <span />
      {stock === "low" ? "Pochi pezzi" : "Disponibile"}
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
  const { add, ready } = useStore();
  return (
    <div className={`buy-row ${compact ? "compact" : ""}`}>
      <QuantitySelector
        value={qty}
        onChange={setQty}
        label={`Quantità ${product.name}`}
      />
      <button
        className="button primary"
        disabled={!ready}
        onClick={() => add(product.id, qty)}
      >
        <ShoppingCart size={17} />
        <span>Aggiungi al carrello</span>
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
        <span className="brand-tag">{product.brand}</span>
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
  initial = "",
  category = false,
}: {
  initial?: string;
  category?: boolean;
}) {
  const popular = category
    ? ["hetronic", "hbc", "autec", "ricevitore", "batteria", "antenna"]
    : ["radiocomando", "motore", "fune", "finecorsa", "potain", "manitowoc"];
  return (
    <div className="search-panel">
      <form action="/catalogo" className="search-form">
        <Search size={21} />
        <input
          name="q"
          aria-label="Cerca ricambi"
          defaultValue={initial}
          placeholder={
            category
              ? "Cerca tra i ricambi (es. Hetronic, HBC, trasmettitore…)"
              : "Cerca per codice, marca o ricambio (es. motore, radiocomando, funi…)"
          }
          type="search"
        />
        <button className="button primary">
          Cerca <ArrowRight size={17} />
        </button>
      </form>
      <div className="popular">
        <span>Ricerche popolari:</span>
        {popular.map((q) => (
          <Link href={`/catalogo?q=${q}`} key={q}>
            {q}
          </Link>
        ))}
      </div>
    </div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {link && (
        <Link className="text-link" href={link}>
          Vedi tutte le categorie <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
