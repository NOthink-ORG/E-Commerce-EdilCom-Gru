"use client";
import { assetPath } from "@/lib/site-path";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import { products, money, calculateOrder } from "@/lib/catalog";
import { useStore } from "./store-provider";
import { QuantitySelector } from "./ui";
export function CartDrawer({ onClose }: { onClose: () => void }) {
  const { cart, update, remove, discount } = useStore();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = old; };
  }, []);
  const items = cart.flatMap(row => {
    const product = products.find(p => p.id === row.id);
    return product ? [{ product, quantity: row.quantity }] : [];
  });
  const totals = calculateOrder(items, "courier", discount);
  return <dialog ref={ref} className="cart-dialog" aria-label="Carrello" onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose(); }}>
    <div className="cart-drawer-panel">
      <div className="cart-drawer-heading"><h2>Il tuo carrello</h2><button className="icon-button" aria-label="Chiudi carrello" onClick={onClose}><X /></button></div>
      <div className="cart-drawer-items">{items.length ? items.map(({ product, quantity }) => <article className="cart-drawer-row" key={product.id}>
        <img src={assetPath(product.image)} alt="" width={74} height={74} />
        <div><Link href={`/prodotti/${product.slug}`} onClick={onClose}><strong>{product.name}</strong></Link><small>Cod. {product.code}</small><b>{money(product.price * quantity)}</b><QuantitySelector value={quantity} onChange={q => update(product.id, q)} label={`Quantità ${product.name}`} /></div>
        <button className="icon-button" aria-label={`Rimuovi ${product.name}`} onClick={() => remove(product.id)}><Trash2 size={17}/></button>
      </article>) : <p>Il tuo carrello è ancora vuoto.</p>}</div>
      <div className="cart-drawer-bottom"><p><span>Totale demo IVA inclusa</span><strong>{money(totals.total)}</strong></p><small>Prezzi, disponibilità e spedizione di esempio.</small><Link className="button primary" href={items.length ? "/carrello" : "/catalogo"} onClick={onClose}>{items.length ? "Vai al carrello" : "Esplora il catalogo"}</Link></div>
    </div>
  </dialog>;
}
