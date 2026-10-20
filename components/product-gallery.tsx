"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { productImages, type Product } from "@/lib/product";
export function ProductGallery({ product }: { product: Product }) {
  const images = productImages(product);
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const current = images[selected];
  const change = (offset: number) =>
    setSelected((index) => (index + offset + images.length) % images.length);
  const keyboard = (event: KeyboardEvent) => {
    if (images.length < 2) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      change(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      change(-1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      setSelected(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      setSelected(images.length - 1);
    }
  };
  const photo = (large = false) =>
    current && !failed.includes(current.src) ? (
      <img
        src={current.src}
        alt={current.alt}
        width={large ? 1200 : 600}
        height={large ? 850 : 500}
        onError={() => setFailed((items) => [...items, current.src])}
      />
    ) : (
      <div
        className="missing-photo"
        role="img"
        aria-label="Immagine non disponibile"
      >
        Immagine non disponibile
      </div>
    );
  const controls =
    images.length > 1 ? (
      <nav className="gallery-controls" aria-label="Navigazione fotografie">
        <button
          type="button"
          className="icon-button"
          aria-label="Foto precedente"
          onClick={() => change(-1)}
        >
          <ChevronLeft size={20} />
        </button>
        <span aria-live="polite">
          {selected + 1} / {images.length}
        </span>
        <button
          type="button"
          className="icon-button"
          aria-label="Foto successiva"
          onClick={() => change(1)}
        >
          <ChevronRight size={20} />
        </button>
      </nav>
    ) : null;
  return (
    <section
      className="gallery"
      aria-label={`Galleria di ${product.name}`}
      onKeyDown={keyboard}
    >
      {images.length > 0 && (
        <div className="thumbnails">
          {images.map((image, index) => (
            <button
              type="button"
              key={image.src}
              className={index === selected ? "active" : ""}
              aria-pressed={index === selected}
              aria-label={`Foto ${index + 1} di ${product.name}`}
              onClick={() => setSelected(index)}
            >
              <img
                src={image.src}
                alt=""
                width={70}
                height={70}
                loading={index ? "lazy" : "eager"}
              />
            </button>
          ))}
        </div>
      )}
      <figure className="gallery-stage">
        <div className="main-product-image">
          {photo()}
          {current && !failed.includes(current.src) && (
            <button
              ref={opener}
              className="icon-button zoom-button"
              type="button"
              aria-label="Ingrandisci foto prodotto"
              onClick={() => dialog.current?.showModal()}
            >
              <Maximize2 size={18} />
            </button>
          )}
        </div>
        {controls}
        {images.length > 1 && (
          <figcaption className="gallery-caption">
            Fotografie illustrative, non specifiche del ricambio.
            {current?.credit && (
              <span>
                {" "}
                {current.credit} ·{" "}
                <a href={current.source} target="_blank" rel="noreferrer">
                  Fonte
                </a>{" "}
                ·{" "}
                <a href={current.licenseUrl} target="_blank" rel="noreferrer">
                  {current.license}
                </a>
                . Ridimensionata e ottimizzata.
              </span>
            )}
          </figcaption>
        )}
      </figure>
      <dialog
        ref={dialog}
        className="image-modal"
        aria-label={`Fotografie di ${product.name}`}
        onClose={() => opener.current?.focus()}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
      >
        <button
          type="button"
          className="icon-button modal-close"
          aria-label="Chiudi immagine"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        {photo(true)}
        {controls}
      </dialog>
    </section>
  );
}
