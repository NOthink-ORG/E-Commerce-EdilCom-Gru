export type Product = {
  id: string;
  slug: string;
  name: string;
  code: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  images?: {
    src: string;
    alt: string;
    credit?: string;
    source?: string;
    license?: string;
    licenseUrl?: string;
  }[];
  stock: "available" | "low" | "out_of_stock";
  unit: "pezzo" | "metro";
  compatibility: string[];
  voltage?: string;
  description: string;
};
export const createDemoProduct = (
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
  compatibility?: string[],
  images?: Product["images"],
): Product => ({
  id,
  slug: id,
  name,
  code,
  brand,
  category,
  price,
  image: image.startsWith("/")
    ? image
    : `/images/demo/${image}${/\.(png|jpe?g|webp)$/i.test(image) ? "" : ".jpg"}`,
  images,
  stock,
  unit,
  compatibility:
    compatibility ??
    (category === "Radiocomandi"
      ? ["Potain", "Terex"]
      : ["Potain", "Liebherr"]),
  voltage,
  description: `${name}: un esempio di ricambio per il settore del sollevamento. La selezione del componente richiede la verifica di modello, matricola e documentazione della gru. Fotografie, prezzo e disponibilità sono dimostrativi; le caratteristiche tecniche devono essere confermate prima di un acquisto reale.`,
});

export function productImages(
  product: Product,
): NonNullable<Product["images"]> {
  const gallery = product.images?.filter((image) => image.src.trim());
  return gallery?.length
    ? gallery
    : product.image
      ? [{ src: product.image, alt: product.name }]
      : [];
}
