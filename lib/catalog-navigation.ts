import { categories, products } from "./catalog";

// These slugs are part of the public URLs; keep them stable when editing labels.
const categorySlugs: Record<string, string> = {
  Funi: "funi",
  Radiocomandi: "radiocomandi",
  Carrucole: "carrucole",
  Finecorsa: "finecorsa",
  "Quadri elettrici": "quadri-elettrici",
  "Motori e riduttori": "motori-e-riduttori",
  Batterie: "batterie",
  Ricevitori: "ricevitori",
  Accessori: "accessori",
  Caricabatterie: "caricabatterie",
};
const brandDescriptions: Record<string, string> = {
  Hetronic: "Sistemi di radiocomando e ricambi per macchine industriali",
  HBC: "Radiocomandi e componenti per il sollevamento",
  Autec: "Sistemi di comando wireless e accessori",
  Potain: "Ricambi e componenti per gru edili",
  Manitowoc: "Componenti per gru e sistemi di sollevamento",
  Telemecanique: "Finecorsa e componenti elettrici",
  SEW: "Motori e componenti di trasmissione",
  Saez: "Ricambi e componenti per gru",
  Bonfiglioli: "Riduttori e componenti meccanici",
  Generica: "Accessori e componenti per il sollevamento",
};
export const categoryDirectory = categories.map((category) => ({
  ...category,
  slug: categorySlugs[category.name],
  count: products.filter((product) => product.category === category.name)
    .length,
}));
export const brandDirectory = [
  ...new Set(products.map((product) => product.brand)),
].map((name) => ({
  name,
  slug: name.toLowerCase(),
  description: brandDescriptions[name] || "Ricambi e accessori per gru",
  count: products.filter((product) => product.brand === name).length,
  image: products.find((product) => product.brand === name)!.image,
}));
export const categoryHref = (name: string) =>
  `/categorie/${categoryDirectory.find((item) => item.name === name)!.slug}`;
export const brandHref = (name: string) =>
  `/brand/${brandDirectory.find((item) => item.name === name)!.slug}`;
export type CatalogScope = { category?: string; brand?: string };
export const normalizeSearch = (value: string) =>
  value
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
