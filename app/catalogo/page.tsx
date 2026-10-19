import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog-view";
import { SupportBanner } from "@/components/shell";
export const metadata: Metadata = { title: "Catalogo ricambi" };
export default function CatalogPage() {
  return (
    <main id="contenuto">
      <section className="hero category-hero">
        <div className="container">
          <p className="hero-breadcrumb">Home / Ricambi / Catalogo</p>
          <h1>Ricambi per la tua gru</h1>
          <p>
            Comandi, componenti e accessori per il sollevamento.
            <br />
            Trova il ricambio giusto, in pochi passi.
          </p>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="container loading" role="status">
            Caricamento catalogo…
          </div>
        }
      >
        <CatalogView />
      </Suspense>
      <SupportBanner />
    </main>
  );
}
