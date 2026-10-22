"use client";
import { assetPath } from "@/lib/site-path";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Headphones,
  MapPin,
  ArrowUp,
  Mail,
  UserRound,
} from "lucide-react";
import { useStore } from "./store-provider";
import { CartDrawer } from "./cart-drawer";
import { SearchBar } from "./ui";
import { brand } from "@/lib/catalog";
import {
  categoryDirectory,
  brandDirectory,
  categoryHref,
  brandHref,
} from "@/lib/catalog-navigation";
function CollectionMenu({
  label,
  href,
  items,
  onNavigate,
}: {
  label: string;
  href: string;
  items: { name: string; href: string }[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const id = `navigation-${label.toLowerCase()}`;
  return (
    <div
      className="nav-dropdown"
      data-open={open}
      ref={container}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          container.current
            ?.querySelector<HTMLAnchorElement>(":scope > a")
            ?.focus();
        }
        if (event.key === "ArrowDown" && !open) {
          event.preventDefault();
          setOpen(true);
          requestAnimationFrame(() =>
            container.current
              ?.querySelector<HTMLAnchorElement>(".dropdown-content a")
              ?.focus(),
          );
        }
      }}
    >
      <Link
        href={href}
        onClick={() => {
          setOpen(false);
          onNavigate();
        }}
      >
        {label}
      </Link>
      <button
        aria-label={`Mostra ${label.toLowerCase()}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        <ChevronDown size={13} />
      </button>
      <div id={id} className="dropdown-content" hidden={!open}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              setOpen(false);
              onNavigate();
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
export function Header() {
  const { cart, info } = useStore();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartButton = useRef<HTMLButtonElement>(null);
  const closeCart = () => { setCartOpen(false); requestAnimationFrame(() => cartButton.current?.focus()); };
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
            <Link href="/assistenza">Assistenza</Link>
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
              src={assetPath("/images/edilcomgru-logo.svg")}
              alt={brand.name}
              width={188}
              height={54}
            />
          </Link>
          <nav
            aria-label="Navigazione principale"
            className={menu ? "main-nav open" : "main-nav"}
          >
            <Link onClick={() => setMenu(false)} href="/catalogo">
              Ricambi
            </Link>
            <CollectionMenu
              label="Categorie"
              href="/categorie"
              onNavigate={() => setMenu(false)}
              items={categoryDirectory.map((item) => ({
                name: item.name,
                href: categoryHref(item.name),
              }))}
            />
            <CollectionMenu
              label="Brand"
              href="/brand"
              onNavigate={() => setMenu(false)}
              items={brandDirectory.map((item) => ({
                name: item.name,
                href: brandHref(item.name),
              }))}
            />
            <Link href="/assistenza" onClick={() => setMenu(false)}>
              Assistenza
            </Link>
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
            <button
              ref={cartButton}
              className="cart-link icon-button"
              type="button"
              aria-expanded={cartOpen}
              aria-haspopup="dialog"
              onClick={() => setCartOpen(true)}
              aria-label={`Carrello, ${cart.reduce((s, x) => s + x.quantity, 0)} articoli`}
            >
              <ShoppingCart size={21} />
              <span>{cart.reduce((s, x) => s + x.quantity, 0)}</span>
            </button>
            <Link className="button primary catalog-button" href="/catalogo">
              Esplora il catalogo
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
        {search && <div className="container header-search"><SearchBar action="/catalogo" popularTerms={[]} placeholder="Cerca un ricambio, codice o marca" /></div>}
      </header>
      {cartOpen && <CartDrawer onClose={closeCart} />}
    </>
  );
}
const benefits = [
  {
    title: "Spedizioni rapide",
    text: "Soluzioni di consegna per il tuo cantiere",
  },
  {
    title: "Ricambi originali e compatibili",
    text: "Per i principali marchi di gru",
  },
  {
    title: "Ampia disponibilità",
    text: "Un catalogo dedicato al sollevamento",
  },
  {
    title: "Consulenza tecnica",
    text: "Supporto nella scelta del ricambio",
  },
];
export function Benefits({ small = false }: { small?: boolean }) {
  return (
    <div className={`benefits ${small ? "small" : ""}`}>
      {benefits.map(({ title, text }) => (
        <div key={title}>
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
        <Link className="button primary" href="/assistenza">
          <Headphones size={18} />
          Richiedi assistenza tecnica
        </Link>
      </div>
    </section>
  );
}
export function Footer() {
  const { info } = useStore();
  return (
    <>
      <section className="container trust-section">
        <Benefits />
        <div className="brands-section">
          <h2>Ricambi per i principali marchi di gru</h2>
          <div className="brand-logos" aria-label="Marchi presenti nel catalogo demo">
            {["comedil", "liebherr", "manitowoc", "potain", "saez", "terex"].map((name) => (
              <img key={name} src={assetPath(`/images/${name}.svg`)} alt={name} loading="lazy" />
            ))}
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-about">
            <Link href="/">
              <img
                src={assetPath("/images/edilcomgru-logo-footer.svg")}
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
            <Link href="/categorie">Categorie</Link>
            <Link href="/brand">Brand</Link>
            <Link href="/carrello">Carrello</Link>
          </div>
          <div>
            <h3>Assistenza</h3>
            <Link href="/assistenza">Supporto tecnico</Link>
            <Link href="/assistenza">Richiesta ricambi</Link>
            <button onClick={() => info("Manuali e documentazione")}>
              Manuali e documentazione
            </button>
            <button onClick={() => info("Spedizioni e resi")}>
              Spedizioni e resi
            </button>
          </div>
          <div>
            <h3>Azienda</h3>
            {["Chi siamo", "Certificazioni", "Privacy e cookie"].map((t) => (
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
            <Link href="/assistenza">
              <Headphones size={17} />
              Richiedi assistenza
            </Link>
            <Link href="/assistenza">
              <Mail size={17} />
              Richieste e informazioni
            </Link>
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
