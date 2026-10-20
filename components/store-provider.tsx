"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X, CheckCircle2, Info } from "lucide-react";
import { products } from "@/lib/catalog";
import { addCartItem, sanitizeCart, type CartRow } from "@/lib/cart-logic";
import { isPurchasable } from "@/lib/catalog-logic";
type Store = {
  cart: CartRow[];
  ready: boolean;
  discount: boolean;
  applyDiscount: () => void;
  add: (id: string, qty: number) => void;
  update: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
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
    [modal, setModal] = useState<string | null>(null),
    [discount, setDiscount] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
      // Revalidate fixtures and stock when restoring this browser's demo cart.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart(sanitizeCart(stored, products));
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
    const item = products.find((product) => product.id === id);
    if (!item || !isPurchasable(item.stock)) {
      setToast("Prodotto esaurito o non disponibile");
      return;
    }
    if (!Number.isInteger(qty) || qty < 1) return;
    setCart((cart) => addCartItem(cart, id, qty, products));
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
        info: setModal,
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
        <>
          <Info size={32} className="accent" />
          <h2 id="shared-dialog-title">{modal}</h2>
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
      </dialog>
    </StoreContext.Provider>
  );
}
