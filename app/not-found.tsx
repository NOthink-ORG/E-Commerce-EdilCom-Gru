import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
export const metadata = pageMetadata(
  "Pagina non trovata",
  "La pagina richiesta non è disponibile nel catalogo dimostrativo Edilcom Gru.",
  undefined,
  "private",
);
export default function NotFound() {
  return (
    <main id="contenuto" className="container empty-state">
      <h1>Qui non c’è il ricambio che cerchi.</h1>
      <p>
        La pagina non è disponibile. Riparti dal catalogo per trovare il
        componente giusto.
      </p>
      <Link href="/catalogo" className="button primary">
        Esplora il catalogo
      </Link>
    </main>
  );
}
