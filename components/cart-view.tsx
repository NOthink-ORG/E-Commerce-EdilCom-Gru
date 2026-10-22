"use client";
import { assetPath } from "@/lib/site-path";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";
import { useStore } from "./store-provider";
import { products, money } from "@/lib/catalog";
import {
  StockBadge,
  QuantitySelector,
  ProductGrid,
  SectionHeading,
} from "./ui";
import { OrderSummary } from "./order-summary";
export function CartView() {
  const { cart, ready, update, remove, clear } = useStore();
  if (!ready)
    return (
      <div className="loading" role="status">
        Caricamento carrello…
      </div>
    );
  if (!cart.length)
    return (
      <div className="empty-state cart-empty">
        <ShoppingCart size={54} />
        <h2>Il tuo carrello è ancora vuoto</h2>
        <p>Il prossimo ricambio per la tua gru ti aspetta nel catalogo.</p>
        <Link className="button primary" href="/catalogo">
          Esplora il catalogo
        </Link>
      </div>
    );
  return (
    <>
      <div className="cart-layout">
        <section className="panel cart-table">
          <div className="cart-table-head">
            <span>Prodotto</span>
            <span>Prezzo unitario</span>
            <span>Quantità</span>
            <span>Disponibilità</span>
            <span>Subtotale</span>
            <span className="sr-only">Azioni</span>
          </div>
          {cart.map((row) => {
            const p = products.find((x) => x.id === row.id)!;
            return (
              <article key={p.id} className="cart-row">
                <Link className="cart-product" href={`/prodotti/${p.slug}`}>
                  <img src={assetPath(p.image)} width={98} height={98} alt={p.name} />
                  <div>
                    <h2>{p.name}</h2>
                    <small>Cod. {p.code}</small>
                    <small>Brand: {p.brand.toUpperCase()}</small>
                  </div>
                </Link>
                <div className="cart-unit">
                  <strong>{money(p.price)}</strong>
                  <small>/ {p.unit}</small>
                </div>
                <div className="cart-quantity">
                  <QuantitySelector
                    value={row.quantity}
                    onChange={(q) => update(p.id, q)}
                    label={`Quantità ${p.name}`}
                  />
                  <small>{p.unit === "metro" ? "metri" : "pezzi"}</small>
                </div>
                <div className="cart-stock">
                  <StockBadge stock={p.stock} />
                  <small>Disponibilità demo</small>
                </div>
                <strong className="cart-subtotal">
                  {money(p.price * row.quantity)}
                </strong>
                <button
                  className="icon-button remove-product"
                  aria-label={`Rimuovi ${p.name}`}
                  onClick={() => remove(p.id)}
                >
                  <Trash2 size={18} />
                </button>
              </article>
            );
          })}
          <div className="cart-bottom">
            <Link className="button outline" href="/catalogo">
              <ArrowLeft size={17} />
              Continua lo shopping
            </Link>
            <button className="text-button" onClick={clear}>
              <Trash2 size={16} />
              Svuota il carrello
            </button>
          </div>
        </section>
        <OrderSummary />
      </div>
      <section className="section">
        <SectionHeading
          eyebrow="Completa il tuo ordine"
          title="Potrebbero interessarti anche"
        />
        <ProductGrid
          products={products
            .filter((p) => !cart.some((x) => x.id === p.id))
            .slice(0, 5)}
        />
      </section>
    </>
  );
}
