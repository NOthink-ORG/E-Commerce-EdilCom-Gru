"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  MapPin,
  Truck,
  CreditCard,
  FileText,
  Info,
  CheckCircle2,
  ShoppingCart,
  } from "lucide-react";
import { useStore } from "./store-provider";
import { OrderSummary } from "./order-summary";
function Field({
  label,
  name,
  required = false,
  type = "text",
  placeholder,
  wide = false,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "field wide" : "field"}>
      {label}
      {required && <span className="required"> *</span>}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        maxLength={160}
      />
    </label>
  );
}
function AddressFields({ prefix }: { prefix: string }) {
  return (
    <div className="form-grid">
      <Field
        name={`${prefix}-address`}
        label="Indirizzo"
        required
        placeholder="Via e numero civico"
        wide
      />
      <Field
        name={`${prefix}-zip`}
        label="CAP"
        required
        placeholder="Es. 80100"
      />
      <Field name={`${prefix}-city`} label="Città" required />
      <Field
        name={`${prefix}-province`}
        label="Provincia"
        required
        placeholder="Es. NA"
      />
      <label className="field">
        Nazione
        <select name={`${prefix}-country`} defaultValue="Italia">
          <option>Italia</option>
          <option>Francia</option>
          <option>Germania</option>
          <option>Spagna</option>
        </select>
      </label>
    </div>
  );
}
export function CheckoutView() {
  const { cart, ready } = useStore();
  const [customer, setCustomer] = useState("company"),
    [same, setSame] = useState(true),
    [shipping, setShipping] = useState("courier"),
    [reviewed, setReviewed] = useState(false);
  if (!ready)
    return (
      <div className="loading" role="status">
        Caricamento riepilogo…
      </div>
    );
  if (!cart.length)
    return (
      <div className="empty-state">
        <ShoppingCart size={48} />
        <h2>Aggiungi un ricambio per continuare</h2>
        <p>Il checkout demo usa i prodotti presenti nel carrello.</p>
        <Link href="/catalogo" className="button primary">
          Vai al catalogo
        </Link>
      </div>
    );
  return (
    <>
      <div className="demo-callout">
        <Info size={23} />
        <div>
          <strong>Checkout dimostrativo, non operativo</strong>
          <p>
            Usa solo dati fittizi. Nessun dato viene inviato o salvato, nessun
            ordine viene creato e nessun pagamento viene richiesto.
          </p>
        </div>
      </div>
      <div className="checkout-layout">
        <form
          id="checkout-demo"
          className="panel checkout-form"
          onChange={() => setReviewed(false)}
          onSubmit={(e) => {
            e.preventDefault();
            setReviewed(true);
            document
              .getElementById("demo-feedback")
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        >
          <section>
            <h2>
              <Building2 size={25} />
              Dati cliente e contatti
            </h2>
            <p className="muted">
              Inserisci dati di esempio per esplorare la compilazione.
            </p>
            <div
              className="customer-toggle"
              role="group"
              aria-label="Tipo cliente"
            >
              <button
                type="button"
                aria-pressed={customer === "company"}
                className={customer === "company" ? "active" : ""}
                onClick={() => setCustomer("company")}
              >
                Azienda
              </button>
              <button
                type="button"
                aria-pressed={customer === "private"}
                className={customer === "private" ? "active" : ""}
                onClick={() => setCustomer("private")}
              >
                Privato
              </button>
            </div>
            <div className="form-grid">
              {customer === "company" ? (
                <>
                  <Field
                    name="company"
                    label="Ragione sociale"
                    required
                    placeholder="Azienda di esempio S.r.l."
                  />
                  <label className="field">
                    Partita IVA <span className="required">*</span>
                    <input
                      name="vat"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{11}"
                      title="Inserisci 11 cifre"
                      maxLength={11}
                      placeholder="11 cifre — solo dati fittizi"
                    />
                  </label>
                  <Field name="sdi" label="Codice destinatario (SDI)" />
                  <Field name="pec" label="PEC" type="email" />
                </>
              ) : (
                <>
                  <Field name="firstName" label="Nome" required />
                  <Field name="lastName" label="Cognome" required />
                </>
              )}
              <Field
                name="email"
                label="Email per comunicazioni"
                type="email"
                required
                placeholder="demo@example.com"
              />
              <Field name="phone" label="Telefono" type="tel" required />
              {customer === "company" && (
                <Field name="contact" label="Persona di riferimento" />
              )}
            </div>
          </section>
          <section>
            <h2>
              <MapPin size={25} />
              Indirizzo di spedizione
            </h2>
            <AddressFields prefix="shipping" />
            <label className="check-label same-address">
              <input
                type="checkbox"
                checked={same}
                onChange={(e) => setSame(e.target.checked)}
              />
              L’indirizzo di fatturazione è uguale a quello di spedizione
            </label>
            {!same && (
              <>
                <h3>Indirizzo di fatturazione</h3>
                <AddressFields prefix="billing" />
              </>
            )}
          </section>
          <section>
            <h2>
              <Truck size={25} />
              Modalità di spedizione
            </h2>
            <label
              className={`shipping-option ${shipping === "courier" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="shipping-mode"
                value="courier"
                checked={shipping === "courier"}
                onChange={() => setShipping("courier")}
              />
              <span>
                <strong>Corriere espresso</strong>
                <small>Tariffa demo: € 12,00 · gratuita da € 300</small>
              </span>
              <b>IVA esclusa</b>
            </label>
            <label
              className={`shipping-option ${shipping === "pickup" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="shipping-mode"
                value="pickup"
                checked={shipping === "pickup"}
                onChange={() => setShipping("pickup")}
              />
              <span>
                <strong>Ritiro presso la sede</strong>
                <small>Sede e disponibilità da confermare</small>
              </span>
              <b>Gratuito</b>
            </label>
          </section>
          <section>
            <h2>
              <CreditCard size={25} />
              Modalità di pagamento
            </h2>
            <div className="payment-unavailable">
              <Info size={22} />
              <div>
                <strong>I pagamenti non sono attivi</strong>
                <p>
                  Bonifico, carta di credito e PayPal saranno disponibili dopo
                  l’integrazione di un checkout reale.
                </p>
              </div>
            </div>
          </section>
          <section>
            <h2>
              <FileText size={25} />
              Note ordine <small>(opzionale)</small>
            </h2>
            <label>
              <span className="sr-only">Note per l’ordine demo</span>
              <textarea
                name="notes"
                rows={3}
                maxLength={1000}
                placeholder="Es. riferimenti del cantiere, indicazioni per la consegna…"
              />
            </label>
          </section>
          <div id="demo-feedback" aria-live="polite">
            {reviewed && (
              <div className="review-success">
                <CheckCircle2 size={25} />
                <div>
                  <strong>Compilazione demo verificata</strong>
                  <p>
                    I campi obbligatori sono compilati. Nessun ordine è stato
                    creato e nessun dato è stato inviato.
                  </p>
                </div>
              </div>
            )}
          </div>
        </form>
        <OrderSummary checkout shipping={shipping} />
      </div>
    </>
  );
}
