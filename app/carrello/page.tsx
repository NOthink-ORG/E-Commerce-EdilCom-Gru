import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CartView } from "@/components/cart-view";
import { SupportBanner } from "@/components/shell";
export const metadata = pageMetadata(
  "Il tuo carrello",
  "Rivedi i prodotti selezionati nel carrello dimostrativo Edilcom Gru.",
  "/carrello",
  "private",
);
export default function CartPage() {
  return (
    <main id="contenuto">
      <div className="container cart-page">
        <Breadcrumbs currentPath="/carrello" items={[{ label: "Carrello" }]} />
        <div className="page-heading">
          <h1>Il tuo carrello</h1>
          <p>Controlla i prodotti selezionati e prepara il tuo ordine.</p>
        </div>
        <CartView />
      </div>
      <SupportBanner />
    </main>
  );
}
