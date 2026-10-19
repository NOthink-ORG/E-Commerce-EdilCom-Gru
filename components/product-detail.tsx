"use client";
import { useRef, useState } from "react";
import {
  Maximize2,
  X,
  CheckCircle2,
  FileText,
  Truck,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import type { Product } from "@/lib/catalog";
import { money } from "@/lib/catalog";
import { StockBadge, AddToCart } from "./ui";
import { SupportButton } from "./support-button";
import { Benefits } from "./shell";
export function ProductDetail({ product }: { product: Product }) {
  const isRemote = product.id === "radiocomando-hetronic-nova-l";
  const gallery = isRemote
    ? [
        "/images/detail-remote.webp",
        "/images/detail-side.webp",
        "/images/detail-controls.webp",
        "/images/detail-case.webp",
      ]
    : [product.image];
  const [selected, setSelected] = useState(0),
    [tab, setTab] = useState("Descrizione");
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
          <div className="compatibility-box">
            <ShieldCheck size={33} />
            <div>
              <h3>Compatibilità</h3>
              <p>
                Verifica il componente con il modello e la matricola della tua
                gru.
              </p>
            </div>
            <SupportButton
              subject={`Compatibilità: ${product.name}`}
              label="Verifica compatibilità"
            />
          </div>
        </section>
      </div>
      <div className="detail-panels">
        <section className="panel technical">
          <h2>
            <FileText size={22} />
            Dati tecnici principali
          </h2>
          <dl>
            {technical.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="muted small-copy">
            I dati di questo esempio non sostituiscono una scheda tecnica
            ufficiale.
          </p>
        </section>
        <div>
          <section className="panel reasons">
            <h2>
              <ShieldCheck size={22} />
              La scelta del ricambio, con il supporto giusto
            </h2>
            {[
              "Identifica il componente tramite il codice prodotto",
              "Confronta marca e modello della tua gru",
              "Richiedi la verifica di compatibilità al team tecnico",
              "Consulta la documentazione originale prima dell’installazione",
            ].map((t) => (
              <p key={t}>
                <CheckCircle2 size={17} />
                {t}
              </p>
            ))}
          </section>
          <section className="panel help-panel">
            <Headphones size={42} />
            <div>
              <h3>Hai bisogno di aiuto?</h3>
              <p>
                Prepariamo insieme una richiesta per identificare il ricambio
                corretto.
              </p>
              <SupportButton
                subject={product.name}
                className="button primary"
                label="Richiedi assistenza tecnica"
              />
            </div>
          </section>
        </div>
      </div>
      <section className="product-tabs">
        <div role="tablist" aria-label="Informazioni prodotto">
          {["Descrizione", "Scheda tecnica", "Compatibilità", "Spedizioni"].map(
            (t) => (
              <button
                role="tab"
                key={t}
                id={`tab-${t}`}
                aria-controls="product-tab-panel"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                onKeyDown={(e) => {
                  const tabs = [
                    "Descrizione",
                    "Scheda tecnica",
                    "Compatibilità",
                    "Spedizioni",
                  ];
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const next =
                      tabs[
                        (tabs.indexOf(t) + (e.key === "ArrowRight" ? 1 : 3)) % 4
                      ];
                    setTab(next);
                    document.getElementById(`tab-${next}`)?.focus();
                  }
                }}
              >
                {t}
              </button>
            ),
          )}
        </div>
        <div
          role="tabpanel"
          id="product-tab-panel"
          aria-labelledby={`tab-${tab}`}
          tabIndex={0}
        >
          <h2>{tab === "Descrizione" ? "Descrizione del prodotto" : tab}</h2>
          {tab === "Descrizione" ? (
            <p>{product.description}</p>
          ) : tab === "Scheda tecnica" ? (
            <p>
              La scheda tecnica ufficiale non è ancora disponibile in questa
              demo. Richiedi il documento relativo al codice {product.code}{" "}
              prima di scegliere il componente.
            </p>
          ) : tab === "Compatibilità" ? (
            <>
              <p>
                La compatibilità deve essere verificata sul modello e sulla
                matricola della gru. I marchi indicati nei filtri sono
                associazioni dimostrative.
              </p>
              <SupportButton
                subject={`Compatibilità ${product.code}`}
                label="Richiedi verifica"
              />
            </>
          ) : (
            <>
              <p>
                Nell’esempio: corriere a € 12,00 IVA esclusa; spedizione
                gratuita da € 300,00 di prodotti. È previsto anche il ritiro in
                sede. Tempi, costi e condizioni effettivi sono da confermare.
              </p>
              <p className="muted">
                <Truck size={16} /> Nessuna spedizione reale viene attivata.
              </p>
            </>
          )}
        </div>
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
