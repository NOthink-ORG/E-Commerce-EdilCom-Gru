export type Product = {
  id: string;
  slug: string;
  name: string;
  code: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  stock: "available" | "low";
  unit: "pezzo" | "metro";
  compatibility: string[];
  voltage?: string;
  description: string;
};
const product = (
  id: string,
  name: string,
  code: string,
  brand: string,
  category: string,
  price: number,
  image: string,
  stock: Product["stock"] = "available",
  unit: Product["unit"] = "pezzo",
  voltage?: string,
): Product => ({
  id,
  slug: id,
  name,
  code,
  brand,
  category,
  price,
  image: `/images/demo/${image}.jpg`,
  stock,
  unit,
  compatibility:
    category === "Radiocomandi" ? ["Potain", "Terex"] : ["Potain", "Liebherr"],
  voltage,
  description: `${name}: un esempio di ricambio per il settore del sollevamento. La selezione del componente richiede la verifica di modello, matricola e documentazione della gru. Fotografie, prezzo e disponibilità sono dimostrativi; le caratteristiche tecniche devono essere confermate prima di un acquisto reale.`,
});
export const products: Product[] = [
  product(
    "fune-acciaio-10mm",
    "Fune in acciaio zincato Ø 10 mm",
    "FZ100",
    "Potain",
    "Funi",
    8.9,
    "rope",
    "available",
    "metro",
  ),
  product(
    "radiocomando-hetronic-nova-l",
    "Radiocomando Hetronic Nova L",
    "HR-NOVA-L",
    "Hetronic",
    "Radiocomandi",
    1250,
    "remote",
  ),
  product(
    "carrucola-320",
    "Carrucola Ø 320 mm con cuscinetti",
    "CR320",
    "Manitowoc",
    "Carrucole",
    420,
    "pulley",
    "low",
  ),
  product(
    "finecorsa-rotativo",
    "Finecorsa rotativo leva regolabile",
    "FC-ROT",
    "Telemecanique",
    "Finecorsa",
    96,
    "limit",
  ),
  product(
    "motore-elettrico-4kw",
    "Motore elettrico 4 kW trifase",
    "MOT-4KW",
    "SEW",
    "Motori e riduttori",
    540,
    "motor",
    "available",
    "pezzo",
    "400 V",
  ),
  product(
    "quadro-elettrico",
    "Quadro elettrico per gru",
    "QE-601",
    "Saez",
    "Quadri elettrici",
    620,
    "panel",
  ),
  product(
    "ricevitore-hetronic",
    "Ricevitore Hetronic Nova L",
    "HET-RX-NL",
    "Hetronic",
    "Ricevitori",
    980,
    "receiver",
    "available",
    "pezzo",
    "24 V",
  ),
  product(
    "batteria-hetronic",
    "Batteria per radiocomando Hetronic",
    "HET-BAT-72",
    "Hetronic",
    "Batterie",
    145,
    "battery",
    "available",
    "pezzo",
    "Batteria ricaricabile",
  ),
  product(
    "caricabatterie-hetronic",
    "Caricabatterie Hetronic 12/24 V",
    "HET-CH-1224",
    "Hetronic",
    "Caricabatterie",
    220,
    "charger",
    "low",
    "pezzo",
    "24 V",
  ),
  product(
    "radiocomando-hbc",
    "Radiocomando HBC Spectrum B",
    "HBC-SP-B",
    "HBC",
    "Radiocomandi",
    1480,
    "remote-hbc",
  ),
  product(
    "ricevitore-hbc",
    "Ricevitore HBC Spectrum B",
    "HBC-RX-SPB",
    "HBC",
    "Ricevitori",
    1050,
    "receiver-hbc",
    "available",
    "pezzo",
    "24 V",
  ),
  product(
    "batteria-hbc",
    "Batteria HBC 7,2 V NiMH",
    "HBC-BAT-SP",
    "HBC",
    "Batterie",
    160,
    "battery",
  ),
  product(
    "cintura-hbc",
    "Cintura di trasporto HBC",
    "HBC-BELT",
    "HBC",
    "Accessori",
    85,
    "belt",
  ),
  product(
    "radiocomando-autec",
    "Radiocomando Autec MJX",
    "AUT-MJX",
    "Autec",
    "Radiocomandi",
    1180,
    "remote-autec",
  ),
  product(
    "ricevitore-autec",
    "Ricevitore Autec MJX",
    "AUT-RX-MJX",
    "Autec",
    "Ricevitori",
    920,
    "receiver-autec",
  ),
  product(
    "batteria-autec",
    "Batteria Autec 7,4 V",
    "AUT-BAT-MJX",
    "Autec",
    "Batterie",
    140,
    "battery-autec",
    "low",
  ),
  product(
    "antenna-ricevitore",
    "Antenna per ricevitore",
    "ANT-433",
    "Generica",
    "Accessori",
    52,
    "antenna",
  ),
  product(
    "valigetta-hetronic",
    "Valigetta per radiocomando Hetronic",
    "HET-CASE",
    "Hetronic",
    "Accessori",
    95,
    "case",
  ),
  product(
    "fune-acciaio-12mm",
    "Fune in acciaio zincato Ø 12 mm",
    "FZ120",
    "Potain",
    "Funi",
    11.5,
    "rope",
    "available",
    "metro",
  ),
  product(
    "riduttore-rotazione",
    "Riduttore di rotazione",
    "RD-360",
    "Bonfiglioli",
    "Motori e riduttori",
    780,
    "gearbox",
  ),
];
export const categories = [
  { name: "Funi", image: "rope", description: "Funi in acciaio e accessori" },
  {
    name: "Radiocomandi",
    image: "remote",
    description: "Sistemi di comando e ricambi",
  },
  {
    name: "Carrucole",
    image: "pulley-yellow",
    description: "Carrucole e sistemi di rinvio",
  },
  {
    name: "Finecorsa",
    image: "switch",
    description: "Finecorsa meccanici ed elettrici",
  },
  {
    name: "Quadri elettrici",
    image: "panel",
    description: "Componenti e ricambi",
  },
  {
    name: "Motori e riduttori",
    image: "motor",
    description: "Motori elettrici, riduttori e freni",
  },
  { name: "Batterie", image: "battery", description: "Batterie per radiocomandi e sistemi di comando" },
  { name: "Ricevitori", image: "receiver", description: "Unità di ricezione e controllo per radiocomandi" },
  { name: "Accessori", image: "belt", description: "Cinghie, antenne e accessori per gru" },
  { name: "Caricabatterie", image: "charger", description: "Caricabatterie e alimentatori per radiocomandi" },
];
export const catalogProvider = {
  list: () => products,
  find: (slug: string) => products.find((p) => p.slug === slug),
};
export const money = (value: number) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    useGrouping: "always",
  }).format(value);
export const brand = {
  name: "Edilcom Gru",
  description: "Ricambi per gru, edilizia e sollevamento",
  demo: true,
};
export const taxRate = 0.22;
export function calculateOrder(
  items: { product: Product; quantity: number }[],
  shippingMode = "courier",
  discount = false,
) {
  const subtotal =
    items.reduce(
      (sum, item) => sum + Math.round(item.product.price * 100) * item.quantity,
      0,
    ) / 100;
  const reduction = discount ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const shipping =
    !items.length || shippingMode === "pickup" || subtotal - reduction >= 300
      ? 0
      : 12;
  const taxable = Math.round((subtotal - reduction + shipping) * 100) / 100;
  const vat = Math.round(taxable * taxRate * 100) / 100;
  return {
    subtotal,
    reduction,
    shipping,
    taxable,
    vat,
    total: Math.round((taxable + vat) * 100) / 100,
  };
}
