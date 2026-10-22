import { assetPath } from "@/lib/site-path";
import { preload } from "react-dom";
import Link from "next/link";
import { Breadcrumbs } from "./breadcrumbs";
import { categoryDirectory, categoryHref } from "@/lib/catalog-navigation";

export function CollectionHero({
  title,
  description,
  items,
  image,
  currentPath,
}: {
  title: string;
  description: string;
  items: { label: string; href?: string }[];
  image?: string;
  currentPath?: string;
}) {
  preload(assetPath("/images/hero.webp"), {
    as: "image",
    fetchPriority: "high",
  });
  return (
    <section
      className={`hero category-hero collection-hero${image ? " brand-hero" : ""}`}
    >
      <div className="container">
        <Breadcrumbs items={items} currentPath={currentPath} />
        <div className="collection-hero-copy">
          <h1>{title}</h1>
          <p>{description}</p>
          {image && (
            <Link className="button primary" href="#prodotti">
              Esplora i prodotti
            </Link>
          )}
        </div>
        {image && (
          <img
            className="brand-hero-image"
            src={assetPath(image)}
            alt=""
            width={230}
            height={200}
          />
        )}
      </div>
    </section>
  );
}

export function CategoryCard({
  category,
  href,
  compact = false,
}: {
  category: (typeof categoryDirectory)[number];
  href?: string;
  compact?: boolean;
}) {
  return (
    <Link
      className={`category-card${compact ? "" : " directory-card"}`}
      href={href ?? categoryHref(category.name)}
    >
      <img
        className="directory-image"
        src={assetPath(`/images/demo/${category.image}.jpg`)}
        alt=""
        width={280}
        height={210}
        loading="lazy"
      />
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      {!compact && (
        <>
          <strong className="directory-count">
            {category.count} {category.count === 1 ? "prodotto" : "prodotti"}
          </strong>
          <span className="button primary">Esplora categoria</span>
        </>
      )}
    </Link>
  );
}

export function CollectionLinks() {
  return (
    <nav
      className="container collection-links"
      aria-label="Esplora il catalogo"
    >
      <Link className="category-card collection-link" href="/categorie">
        <img
          src={assetPath("/images/demo/remote.jpg")}
          loading="lazy"
          alt=""
          width={100}
          height={80}
        />
        <span>
          <strong>Tutte le categorie</strong>
          <small>
            Trova il ricambio per la tua gru, famiglia per famiglia.
          </small>
        </span>
      </Link>
      <Link className="category-card collection-link" href="/brand">
        <img
          src={assetPath("/images/demo/receiver.jpg")}
          loading="lazy"
          alt=""
          width={100}
          height={80}
        />
        <span>
          <strong>Tutti i brand</strong>
          <small>Esplora i marchi disponibili nel catalogo ricambi.</small>
        </span>
      </Link>
    </nav>
  );
}
