"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X, CheckCircle2, Headphones, Copy, Info } from "lucide-react";
import { products } from "@/lib/catalog";
type CartRow = { id: string; quantity: number };
type Store = {
  cart: CartRow[];
  ready: boolean;
  discount: boolean;
  applyDiscount: () => void;
  add: (id: string, qty: number) => void;
  update: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  support: (subject?: string) => void;
  info: (title: string) => void;
  notify: (text: string) => void;
};
const StoreContext = createContext<Store | null>(null);
const KEY = "edilcom-cart-v1";
export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Store provider missing");
  return store;
};
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartRow[]>([]),
    [ready, setReady] = useState(false),
    [toast, setToast] = useState(""),
    [modal, setModal] = useState<{
      type: "support" | "info";
      title: string;
    } | null>(null),
    [draft, setDraft] = useState(""),
    [discount, setDiscount] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(stored)) {
        // Hydrate a validated local cart after the server render.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart(
          stored
            .filter(
              (x: CartRow) =>
                products.some((p) => p.id === x.id) &&
                Number.isInteger(x.quantity) &&
                x.quantity > 0 &&
                x.quantity <= 999,
            )
            .filter(
              (x: CartRow, i: number, a: CartRow[]) =>
                a.findIndex((y) => y.id === x.id) === i,
            ),
        );
      }
    } catch {}
    try {
      setDiscount(localStorage.getItem("edilcom-discount-v1") === "DEMO10");
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(KEY, JSON.stringify(cart));
      } catch {}
  }, [cart, ready]);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem("edilcom-discount-v1", discount ? "DEMO10" : "");
      } catch {}
  }, [discount, ready]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (modal) dialog.current?.showModal();
    else dialog.current?.close();
  }, [modal]);
  function add(id: string, qty: number) {
    if (!products.some((p) => p.id === id) || !Number.isInteger(qty) || qty < 1)
      return;
    setCart((c) =>
      c.some((x) => x.id === id)
        ? c.map((x) =>
            x.id === id
              ? { ...x, quantity: Math.min(999, x.quantity + qty) }
              : x,
          )
        : [...c, { id, quantity: Math.min(999, qty) }],
    );
    setToast("Prodotto aggiunto al carrello");
  }
  return (
    <StoreContext.Provider
      value={{
        cart,
        ready,
        discount,
        applyDiscount: () => setDiscount(true),
        add,
        update: (id, qty) =>
          setCart((c) =>
            c.map((x) =>
              x.id === id
                ? {
                    ...x,
                    quantity: Math.max(1, Math.min(999, Math.round(qty) || 1)),
                  }
                : x,
            ),
          ),
        remove: (id) => setCart((c) => c.filter((x) => x.id !== id)),
        clear: () => {
          setCart([]);
          setDiscount(false);
        },
        support: (subject = "") => {
          setDraft("");
          setModal({ type: "support", title: subject });
        },
        info: (title) => setModal({ type: "info", title }),
        notify: setToast,
      }}
    >
      {children}
      <div className={`toast ${toast ? "visible" : ""}`} role="status">
        <CheckCircle2 size={20} />
        {toast}
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="shared-dialog-title"
        onCancel={() => setModal(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setModal(null);
        }}
        className="modal"
      >
        <button
          className="icon-button modal-close"
          aria-label="Chiudi finestra"
          onClick={() => setModal(null)}
        >
          <X />
        </button>
        {modal?.type === "support" ? (
          <>
            <Headphones className="accent" size={36} />
            <h2 id="shared-dialog-title">Troviamo il ricambio giusto.</h2>
            <p className="muted">
              Prepara una richiesta per il team tecnico. In questa demo non
              viene inviata né salvata.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                setDraft(
                  `Richiesta assistenza Edilcom Gru\nRicambio / modello: ${data.get("model")}\nDettagli: ${data.get("message")}`,
                );
              }}
            >
              <label>
                Ricambio o modello della gru
                <input
                  name="model"
                  required
                  defaultValue={modal.title}
                  placeholder="Es. Hetronic Nova L"
                />
              </label>
              <label>
                Come possiamo aiutarti?
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Indica matricola, modello e il ricambio che cerchi…"
                />
              </label>
              <button className="button primary" type="submit">
                Prepara richiesta <Headphones size={17} />
              </button>
            </form>
            {draft && (
              <div className="draft">
                <pre>{draft}</pre>
                <button
                  className="button outline"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(draft);
                      setToast("Richiesta copiata");
                    } catch {
                      setToast("Seleziona e copia il testo della richiesta");
                    }
                  }}
                >
                  <Copy size={16} /> Copia richiesta
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <Info size={32} className="accent" />
            <h2 id="shared-dialog-title">{modal?.title}</h2>
            <p>
              Questa sezione sarà completata con i contenuti ufficiali
              dell’azienda.
            </p>
            <p className="muted">
              Il sito è una dimostrazione del catalogo. Contatti, informazioni
              societarie, condizioni di vendita e documentazione devono essere
              forniti e approvati prima della pubblicazione.
            </p>
          </>
        )}
      </dialog>
    </StoreContext.Provider>
  );
}
