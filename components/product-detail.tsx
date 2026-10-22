import { ShieldCheck } from "lucide-react";
import { ProductGallery } from "./product-gallery";
import type { Product } from "@/lib/catalog";
import { money } from "@/lib/catalog";
import { priceWithTax } from "@/lib/order";
import { StockBadge, AddToCart } from "./ui";
import { SupportButton } from "./support-button";
import { Benefits } from "./shell";
export function ProductDetail({ product }: { product: Product }) {
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
        <ProductGallery key={product.id} product={product} />
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
            {money(priceWithTax(product.price))} IVA inclusa
          </p>
          <div className="detail-purchase">
            <AddToCart product={product} />
            <SupportButton productSlug={product.slug} />
          </div>
          <p className="demo-note">
            <ShieldCheck size={15} /> Prezzo e disponibilità dimostrativi ·
            Nessun acquisto reale
          </p>
          <Benefits small />
        </section>
      </div>
      <section
        className="product-description"
        aria-labelledby="product-description-title"
      >
        <h2 id="product-description-title">Descrizione del prodotto</h2>
        <p>{product.description}</p>
      </section>
      <section
        className="panel technical product-technical"
        aria-labelledby="product-technical-title"
      >
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
          I dati di questo esempio non sostituiscono una scheda tecnica
          ufficiale.
        </p>
      </section>
    </>
  );
}
