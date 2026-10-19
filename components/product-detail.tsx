"use client";
import { useRef, useState } from "react";
import {
  Maximize2,
  X,
  ShieldCheck,
} from "lucide-react";
import type { Product } from "@/lib/catalog";
import { money } from "@/lib/catalog";
import { StockBadge, AddToCart } from "./ui";
import { SupportButton } from "./support-button";
import { Benefits } from "./shell";
export function ProductDetail({ product }: { product: Product }) {
  const gallery = [product.image];
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const technical = [
    ["Marca", product.brand],
    ["Codice prodotto", product.code],
    ["Categoria", product.category],
    ["Unità di vendita", product.unit],
    [
      "Alimentazione",
      product.voltage || "Da verificare sulla scheda ufficiale",
    ],
    ["Documentazione tecnica", "Da fornire dal produttore"],
  ];
  return (
    <>
      <div className="product-detail">
        <div className="gallery">
          <div className="thumbnails">
            {gallery.map((src, i) => (
              <button
                key={src}
                className={selected === i ? "active" : ""}
                onClick={() => setSelected(i)}
                aria-label={`Foto ${i + 1} di ${product.name}`}
              >
                <img src={src} width={70} height={70} alt="" />
              </button>
            ))}
          </div>
          <div className="main-product-image">
            <img
              src={gallery[selected]}
              alt={`${product.name} — vista ${selected + 1}`}
              width={600}
              height={500}
            />
            <button
              className="icon-button zoom-button"
              aria-label="Ingrandisci foto prodotto"
              onClick={() => dialog.current?.showModal()}
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
        <section className="product-intro">
          <span className="category-tag">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-subtitle">
            {product.category === "Radiocomandi"
              ? "Sistema di comando wireless per gru edili"
              : `Componenti e ricambi per il sollevamento`}
          </p>
          <div className="detail-meta">
            Codice prodotto: <strong>{product.code}</strong>
            <span>
              Marca: <b>{product.brand.toUpperCase()}</b>
            </span>
          </div>
          <StockBadge stock={product.stock} />
          <div className="detail-price">
            <strong>{money(product.price)}</strong>
            <span>IVA esclusa{product.unit === "metro" ? " / metro" : ""}</span>
          </div>
          <p className="muted inclusive-price">
            {money(Math.round(product.price * 122) / 100)} IVA inclusa
          </p>
          <div className="detail-purchase">
            <AddToCart product={product} />
            <SupportButton subject={product.name} />
          </div>
          <p className="demo-note">
            <ShieldCheck size={15} /> Prezzo e disponibilità dimostrativi ·
            Nessun acquisto reale
          </p>
          <Benefits small />
        </section>
      </div>
      <section className="product-description" aria-labelledby="product-description-title">
        <h2 id="product-description-title">Descrizione del prodotto</h2>
        <p>{product.description}</p>
      </section>
      <section className="panel technical product-technical" aria-labelledby="product-technical-title">
        <h2 id="product-technical-title">Dati tecnici principali</h2>
        <dl>
          {technical.map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="muted small-copy">
          I dati di questo esempio non sostituiscono una scheda tecnica ufficiale.
        </p>
      </section>
      <dialog
        ref={dialog}
        className="image-modal"
        aria-label={`Immagine ingrandita: ${product.name}`}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <button
          className="icon-button modal-close"
          aria-label="Chiudi immagine"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <img
          src={gallery[selected]}
          alt={product.name}
          width={900}
          height={700}
        />
      </dialog>
    </>
  );
}
