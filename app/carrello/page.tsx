import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui";
import { CartView } from "@/components/cart-view";
import { SupportBanner } from "@/components/shell";
export const metadata: Metadata = { alternates: { canonical: "/carrello" }, title: "Il tuo carrello" };
export default function CartPage() {
  return (
    <main id="contenuto">
      <div className="container cart-page">
        <Breadcrumbs items={[{ label: "Carrello" }]} />
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
