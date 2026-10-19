"use client";
import Link from "next/link";
import { LockKeyhole, ShieldCheck, Tag, Check } from "lucide-react";
import { useState } from "react";
import { products, calculateOrder, money } from "@/lib/catalog";
import { useStore } from "./store-provider";
export function OrderSummary({
  checkout = false,
  shipping = "courier",
}: {
  checkout?: boolean;
  shipping?: string;
}) {
  const { cart, discount, applyDiscount } = useStore();
  const [code, setCode] = useState(""),
    [message, setMessage] = useState("");
  const items = cart.flatMap((row) => {
    const product = products.find((p) => p.id === row.id);
    return product ? [{ product, quantity: row.quantity }] : [];
  });
  const totals = calculateOrder(items, shipping, discount);
  return (
    <aside className="panel order-summary">
      <div className="summary-heading">
        <h2>{checkout ? "Riepilogo ordine" : "Riepilogo ordine"}</h2>
        {checkout && (
          <Link className="text-button" href="/carrello">
            Modifica carrello
          </Link>
        )}
      </div>
      {checkout && (
        <div className="summary-products">
          {items.map(({ product, quantity }) => (
            <div key={product.id}>
              <img
                src={product.image}
                width={78}
                height={70}
                alt={product.name}
              />
              <div>
                <strong>{product.name}</strong>
                <small>Cod. {product.code}</small>
                <span>
                  Q.tà: {quantity} {product.unit === "metro" ? "m" : "pz"}
                </span>
              </div>
              <b>{money(product.price * quantity)}</b>
            </div>
          ))}
        </div>
      )}
      <dl className="summary-totals">
        <div>
          <dt>Totale prodotti ({items.length})</dt>
          <dd>{money(totals.subtotal)}</dd>
        </div>
        {discount && (
          <div className="discount-line">
            <dt>Sconto demo 10%</dt>
            <dd>− {money(totals.reduction)}</dd>
          </div>
        )}
        <div>
          <dt>Spese di spedizione</dt>
          <dd>{money(totals.shipping)}</dd>
        </div>
        {totals.shipping === 0 && items.length > 0 && (
          <p className="shipping-note">
            {shipping === "pickup"
              ? "Ritiro in sede gratuito · demo"
              : "Spedizione demo gratuita da € 300"}
          </p>
        )}
        <div className="taxable">
          <dt>Totale imponibile</dt>
          <dd>{money(totals.taxable)}</dd>
        </div>
        <div>
          <dt>IVA (22%)</dt>
          <dd>{money(totals.vat)}</dd>
        </div>
      </dl>
      <div className="grand-total">
        <strong>Totale ordine</strong>
        <div>
          <b>{money(totals.total)}</b>
          <small>IVA inclusa</small>
        </div>
      </div>
      <div className="coupon">
        <label htmlFor="discount">
          <Tag size={16} /> Hai un codice sconto?
        </label>
        <div>
          <input
            id="discount"
            value={discount ? "DEMO10" : code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Inserisci il codice"
            disabled={discount}
          />
          <button
            type="button"
            className="button primary"
            disabled={discount}
            onClick={() => {
              if (code.trim().toUpperCase() === "DEMO10") {
                applyDiscount();
                setMessage("Sconto demo del 10% applicato");
              } else setMessage("Codice non valido. Prova DEMO10.");
            }}
          >
            {discount ? <Check size={18} /> : "Applica"}
          </button>
        </div>
        <small className={discount ? "success-copy" : "muted"} role="status">
          {message ||
            (discount
              ? "Sconto demo del 10% applicato"
              : "Prova il codice dimostrativo DEMO10")}
        </small>
      </div>
      {checkout ? (
        <>
          <button
            type="submit"
            form="checkout-demo"
            className="button primary checkout-cta"
          >
            Verifica compilazione demo
          </button>
          <p className="demo-note">
            <LockKeyhole size={18} /> Nessun ordine o pagamento verrà
            effettuato.
          </p>
        </>
      ) : (
        <>
          <Link href="/checkout" className="button primary checkout-cta">
            <LockKeyhole size={19} />
            Procedi al checkout
          </Link>
          <div className="secure-note">
            <ShieldCheck size={27} />
            <div>
              <strong>Il tuo carrello, sempre con te</strong>
              <small>Salvato localmente su questo browser.</small>
            </div>
          </div>
        </>
      )}
      <p className="summary-demo">
        Calcolo dimostrativo. Prezzi e condizioni di esempio.
      </p>
    </aside>
  );
}
