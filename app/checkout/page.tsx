import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout-view";
export const metadata: Metadata = { title: "Checkout demo" };
export default function CheckoutPage() {
  return (
    <main id="contenuto" className="container checkout-page">
      <div className="checkout-heading">
        <div className="page-heading">
          <h1>Checkout</h1>
          <p>Esplora il percorso di acquisto.</p>
        </div>
        <ol className="checkout-steps">
          <li className="done">
            <span>1</span>Carrello
          </li>
          <li className="active">
            <span>2</span>Dati e spedizione
          </li>
          <li>
            <span>3</span>Pagamento non attivo
          </li>
        </ol>
      </div>
      <CheckoutView />
    </main>
  );
}
