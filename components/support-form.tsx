"use client";
import { useRef, useState } from "react";
import { Copy } from "lucide-react";
import { Field } from "./form-field";
export function SupportForm({ reference = "" }: { reference?: string }) {
  const [summary, setSummary] = useState("");
  const [message, setMessage] = useState("");
  const review = useRef<HTMLElement>(null);
  return (
    <>
      <form
        className="panel support-form"
        onChange={() => {
          setSummary("");
          setMessage("");
        }}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const value = (name: string) => String(data.get(name) || "").trim();
          if (value("name").length < 2 || value("message").length < 10) {
            setMessage("Indica un nome e un messaggio di almeno 10 caratteri.");
            return;
          }
          setSummary(
            `Richiesta assistenza Edilcom Gru — bozza demo\nNome: ${value("name")}\nEmail: ${value("email")}\nTelefono: ${value("phone") || "Non indicato"}\nTipologia: ${value("type")}\nProdotto / modello / codice: ${value("model") || "Non indicato"}\nMatricola: ${value("serial") || "Non indicata"}\nMessaggio: ${value("message")}`,
          );
          requestAnimationFrame(() => review.current?.focus());
        }}
      >
        <h2>Prepara la tua richiesta</h2>
        <p className="muted">
          Usa dati fittizi per provare il modulo. I campi con * sono
          obbligatori.
        </p>
        <div className="form-grid">
          <Field label="Nome" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Telefono" name="phone" type="tel" />
          <label className="field">
            Tipologia richiesta *
            <select name="type" required>
              <option>Identificazione ricambio</option>
              <option>Compatibilità componente</option>
              <option>Informazioni tecniche</option>
              <option>Altra richiesta</option>
            </select>
          </label>
          <label className="field">
            Prodotto, modello o codice
            <input
              name="model"
              defaultValue={reference}
              maxLength={160}
              autoComplete="off"
            />
          </label>
          <Field label="Matricola (facoltativa)" name="serial" />
          <label className="field wide">
            Messaggio *
            <textarea
              name="message"
              required
              minLength={10}
              maxLength={3000}
              rows={5}
              placeholder="Descrivi il ricambio e le informazioni disponibili…"
            />
          </label>
        </div>
        <button type="submit" className="button primary">
          Prepara riepilogo
        </button>
        <p className="muted support-disclaimer">
          Nessun invio reale: i dati non vengono trasmessi né salvati.
        </p>
        {message && <p role="status">{message}</p>}
      </form>
      {summary && (
        <section
          className="panel support-review"
          ref={review}
          tabIndex={-1}
          aria-labelledby="support-review-title"
        >
          <h2 id="support-review-title">Riepilogo della bozza</h2>
          <p>
            Nessuna richiesta è stata inviata o salvata. Puoi copiare il testo
            preparato.
          </p>
          <pre>{summary}</pre>
          <button
            className="button outline"
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(summary);
                setMessage(
                  "Riepilogo copiato negli appunti. Nessun invio effettuato.",
                );
              } catch {
                setMessage("Copia il testo selezionandolo nel riepilogo.");
              }
            }}
          >
            <Copy size={16} />
            Copia riepilogo
          </button>
        </section>
      )}
    </>
  );
}
