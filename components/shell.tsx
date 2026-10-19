"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Headphones,
  Truck,
  ShieldCheck,
  Warehouse,
  MapPin,
  ArrowUp,
  Mail,
  UserRound,
} from "lucide-react";
import { useStore } from "./store-provider";
import { categories, products, brand } from "@/lib/catalog";
export function Header() {
  const { cart, support, info } = useStore();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>
            <Headphones size={13} /> {brand.description}
          </span>
          <span className="demo-label">
            Catalogo demo · prezzi e disponibilità di esempio
          </span>
          <div>
            <button onClick={() => info("Azienda")}>Azienda</button>
            <button onClick={() => support()}>Assistenza</button>
            <button
              aria-label="Area riservata"
              onClick={() => info("Area riservata")}
            >
              <UserRound size={14} />
            </button>
          </div>
        </div>
      </div>
      <header className="header">
        <div className="container header-inner">
          <Link
            href="/"
            onClick={() => setMenu(false)}
            aria-label={`${brand.name} — Home`}
            className="logo"
          >
            <img
              src="/images/logo.webp"
              alt={brand.name}
              width={178}
              height={51}
            />
          </Link>
          <nav
            aria-label="Navigazione principale"
            className={menu ? "main-nav open" : "main-nav"}
          >
            <Link onClick={() => setMenu(false)} href="/catalogo">
              Ricambi <ChevronDown size={13} />
            </Link>
            <div className="nav-dropdown">
              <button>
                Categorie <ChevronDown size={13} />
              </button>
              <div className="dropdown-content">
                {categories.map((c) => (
                  <Link
                    key={c.name}
                    onClick={() => setMenu(false)}
                    href={`/catalogo?categoria=${encodeURIComponent(c.name)}`}
                  >
                    {c.name}
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
            <div className="nav-dropdown brand-dropdown">
              <button>
                Brand <ChevronDown size={13} />
              </button>
              <div className="dropdown-content">
                {[...new Set(products.map((p) => p.brand))].map((name) => (
                  <Link
                    key={name}
                    onClick={() => setMenu(false)}
                    href={`/catalogo?brand=${encodeURIComponent(name)}`}
                  >
                    {name}
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                support();
                setMenu(false);
              }}
            >
              Assistenza <ChevronDown size={13} />
            </button>
            <button
              onClick={() => {
                info("Contatti");
                setMenu(false);
              }}
            >
              Contatti
            </button>
          </nav>
          <div className="header-actions">
            <button
              aria-label="Apri ricerca"
              aria-expanded={search}
              className="icon-button"
              onClick={() => {
                setSearch(!search);
                setMenu(false);
              }}
            >
              {search ? <X size={21} /> : <Search size={21} />}
            </button>
            <Link
              className="cart-link icon-button"
              href="/carrello"
              aria-label={`Carrello, ${cart.reduce((s, x) => s + x.quantity, 0)} articoli`}
            >
              <ShoppingCart size={21} />
              <span>{cart.reduce((s, x) => s + x.quantity, 0)}</span>
            </Link>
            <Link className="button primary catalog-button" href="/catalogo">
              Esplora il catalogo <ArrowRight size={17} />
            </Link>
            <button
              className="icon-button mobile-menu"
              aria-label={menu ? "Chiudi menu" : "Apri menu"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {search && (
          <form className="container header-search" action="/catalogo">
            <Search size={20} />
            <input
              autoFocus
              type="search"
              name="q"
              placeholder="Cerca un ricambio, codice o marca"
              aria-label="Cerca nel catalogo"
            />
            <button className="button primary">Cerca</button>
          </form>
        )}
      </header>
    </>
  );
}
const benefits = [
  {
    icon: Truck,
    title: "Spedizioni rapide",
    text: "Soluzioni di consegna per il tuo cantiere",
  },
  {
    icon: ShieldCheck,
    title: "Ricambi originali e compatibili",
    text: "Per i principali marchi di gru",
  },
  {
    icon: Warehouse,
    title: "Ampia disponibilità",
    text: "Un catalogo dedicato al sollevamento",
  },
  {
    icon: Headphones,
    title: "Consulenza tecnica",
    text: "Supporto nella scelta del ricambio",
  },
];
export function Benefits({ small = false }: { small?: boolean }) {
  return (
    <div className={`benefits ${small ? "small" : ""}`}>
      {benefits.map(({ icon: Icon, title, text }) => (
        <div key={title}>
          <Icon />
          <span>
            <strong>{title}</strong>
            <small>{text}</small>
          </span>
        </div>
      ))}
    </div>
  );
}
export function SupportBanner() {
  const { support } = useStore();
  return (
    <section className="support-banner">
      <div className="container">
        <p className="eyebrow">Supporto tecnico specializzato</p>
        <h2>
          Hai bisogno di un <span>ricambio specifico?</span>
        </h2>
        <p>
          Il nostro team tecnico ti aiuta a trovare il ricambio
          <br className="desktop-break" /> corretto e a verificarne la
          compatibilità con la tua gru.
        </p>
        <button className="button primary" onClick={() => support()}>
          <Headphones size={18} />
          Richiedi assistenza tecnica <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}
export function Footer() {
  const { info, support } = useStore();
  return (
    <>
      <section className="container trust-section">
        <Benefits />
        <div className="brands-section">
          <p className="eyebrow">I marchi del catalogo demo</p>
          <p className="muted">Ricambi per i principali marchi del settore</p>
          <img
            src="/images/brands.webp"
            alt="Esempi di marchi nei mockup: Manitowoc, Potain, Terex, Liebherr, Saez, Comedil. Partnership non verificate."
            width={1000}
            height={50}
            loading="lazy"
          />
        </div>
      </section>
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-about">
            <Link href="/">
              <img
                src="/images/logo-footer.webp"
                alt={brand.name}
                width={160}
                height={46}
              />
            </Link>
            <p>
              Ricambi e assistenza per chi lavora
              <br />
              ogni giorno nel sollevamento.
            </p>
            <span className="footer-demo">Frontend dimostrativo</span>
          </div>
          <div>
            <h3>Shop</h3>
            <Link href="/catalogo">Ricambi</Link>
            <Link href="/catalogo#categorie">Categorie</Link>
            <Link href="/catalogo?brand=Hetronic">Brand</Link>
            <Link href="/carrello">Carrello</Link>
          </div>
          <div>
            <h3>Assistenza</h3>
            <button onClick={() => support()}>Supporto tecnico</button>
            <button onClick={() => support()}>Richiesta ricambi</button>
            <button onClick={() => info("Manuali e documentazione")}>
              Manuali e documentazione
            </button>
            <button onClick={() => info("Spedizioni e resi")}>
              Spedizioni e resi
            </button>
          </div>
          <div>
            <h3>Azienda</h3>
            {[
              "Chi siamo",
              "Certificazioni",
              "Contatti",
              "Privacy e cookie",
            ].map((t) => (
              <button key={t} onClick={() => info(t)}>
                {t}
              </button>
            ))}
          </div>
          <div>
            <h3>Contatti</h3>
            <p>
              <MapPin size={17} /> Sede e recapiti da confermare
            </p>
            <button onClick={() => support()}>
              <Headphones size={17} /> Richiedi assistenza
            </button>
            <button onClick={() => info("Contatti")}>
              <Mail size={17} /> Contatti aziendali
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <span>
              © {new Date().getFullYear()} Edilcom Gru · Progetto dimostrativo
            </span>
            <div>
              <button onClick={() => info("Termini e condizioni")}>
                Termini e condizioni
              </button>
              <button onClick={() => info("Privacy")}>Privacy</button>
              <button
                aria-label="Torna all’inizio"
                className="back-top"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
