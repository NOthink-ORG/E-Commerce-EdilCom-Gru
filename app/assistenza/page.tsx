import { Breadcrumbs } from "@/components/breadcrumbs";
import { SupportForm } from "@/components/support-form";
import { products } from "@/lib/catalog";
import { pageMetadata, type SearchParams } from "@/lib/seo";
export const metadata = pageMetadata(
  "Assistenza tecnica",
  "Prepara una richiesta dimostrativa per identificare un ricambio o raccogliere informazioni tecniche.",
  "/assistenza",
  "private",
);
export default async function AssistancePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const reference = typeof params.prodotto === "string" ? params.prodotto : "";
  const product = products.find(
    (product) => product.slug === reference || product.code === reference,
  );
  return (
    <main id="contenuto" className="container assistance-page">
      <Breadcrumbs
        currentPath="/assistenza"
        items={[{ label: "Assistenza" }]}
      />
      <div className="page-heading">
        <h1>Assistenza tecnica</h1>
        <p>
          Raccogli le informazioni utili per identificare il ricambio e
          preparare una richiesta chiara.
        </p>
      </div>
      <div className="assistance-layout">
        <div>
          <SupportForm
            reference={product ? `${product.name} — ${product.code}` : ""}
          />
        </div>
        <aside className="panel support-faq">
          <h2>Prima di iniziare</h2>
          <p>
            Modello della gru, codice del componente e matricola aiutano a
            descrivere la richiesta.
          </p>
          <details>
            <summary>Quali dati del ricambio servono?</summary>
            <p>
              Se disponibili, indica marca, codice e modello. Aggiungi la
              matricola e una descrizione del problema.
            </p>
          </details>
          <details>
            <summary>La compatibilità è confermata?</summary>
            <p>
              No. Le associazioni del catalogo sono dimostrative e richiedono
              una verifica sulla documentazione ufficiale.
            </p>
          </details>
          <details>
            <summary>Il modulo invia la richiesta?</summary>
            <p>
              No. Questa demo prepara soltanto un riepilogo copiabile. Nessun
              dato viene trasmesso o conservato.
            </p>
          </details>
        </aside>
      </div>
    </main>
  );
}
