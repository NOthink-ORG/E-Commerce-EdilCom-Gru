import type { Product } from "./product.ts";
export type CatalogScope = { category?: string; brand?: string };
export type CatalogState = {
  query: string;
  selectedCategories: string[];
  brands: string[];
  compatible: string[];
  available: boolean;
  min: number;
  max: number;
  sort: string;
  voltage: string[];
  page: number;
};
export const normalizeSearch = (value: string) =>
  value
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
export const isPurchasable = (stock: Product["stock"]) =>
  stock === "available" || stock === "low";
export const stockLabels: Record<Product["stock"], string> = {
  available: "Disponibile",
  low: "Pochi pezzi",
  out_of_stock: "Esaurito",
};
function boundedNumber(
  value: string | null,
  fallback: number,
  ceiling: number,
) {
  if (value === null || value.trim() === "") return fallback;
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.max(0, Math.min(ceiling, number))
    : fallback;
}
export function parseCatalogState(
  params: URLSearchParams,
  priceLimit: number,
): CatalogState {
  const list = (name: string) => [
    ...new Set(
      params
        .getAll(name)
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ];
  const page = Number(params.get("pagina"));
  const sort = params.get("ordine") || "relevance";
  return {
    query: (params.get("q") || "").trim(),
    selectedCategories: list("categoria"),
    brands: list("brand"),
    compatible: list("compatibilita"),
    available: params.get("disponibile") === "1",
    min: boundedNumber(params.get("min"), 0, priceLimit),
    max: boundedNumber(params.get("max"), priceLimit, priceLimit),
    voltage: list("tensione"),
    sort: ["relevance", "price-asc", "price-desc", "name"].includes(sort)
      ? sort
      : "relevance",
    page: Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1,
  };
}
export function searchRank(product: Product, query: string): number | null {
  const normalized = normalizeSearch(query);
  if (!normalized) return 0;
  const sku = normalizeSearch(product.code),
    name = normalizeSearch(product.name);
  if (sku === normalized) return 0;
  if (sku.startsWith(normalized)) return 1;
  if (name === normalized) return 2;
  const terms = normalized.split(" ");
  if (terms.every((term) => name.includes(term))) return 3;
  const searchable = normalizeSearch(
    `${product.code} ${product.name} ${product.brand} ${product.category}`,
  );
  return terms.every((term) => searchable.includes(term)) ? 4 : null;
}
export function scopedProducts(products: Product[], scope: CatalogScope) {
  return products.filter(
    (product) =>
      (!scope.category || product.category === scope.category) &&
      (!scope.brand || product.brand === scope.brand),
  );
}
export function filterProducts(products: Product[], state: CatalogState) {
  return products
    .map((product, index) => ({
      product,
      index,
      rank: searchRank(product, state.query),
    }))
    .filter(
      ({ product: p, rank }) =>
        rank !== null &&
        (!state.selectedCategories.length ||
          state.selectedCategories.includes(p.category)) &&
        (!state.brands.length || state.brands.includes(p.brand)) &&
        (!state.compatible.length ||
          state.compatible.some((value) => p.compatibility.includes(value))) &&
        (!state.available || isPurchasable(p.stock)) &&
        p.price >= state.min &&
        p.price <= state.max &&
        (!state.voltage.length || state.voltage.includes(p.voltage || "")),
    )
    .sort((a, b) => {
      const order =
        state.sort === "price-asc"
          ? a.product.price - b.product.price
          : state.sort === "price-desc"
            ? b.product.price - a.product.price
            : state.sort === "name"
              ? a.product.name.localeCompare(b.product.name, "it")
              : (a.rank ?? 0) - (b.rank ?? 0);
      return order || a.index - b.index;
    })
    .map(({ product }) => product);
}
export function paginateProducts<T>(
  items: T[],
  requestedPage: number,
  pageSize = 12,
) {
  const size =
    Number.isFinite(pageSize) && pageSize >= 1 ? Math.floor(pageSize) : 12;
  const pages = Math.max(1, Math.ceil(items.length / size));
  const page = Number.isFinite(requestedPage)
    ? Math.max(1, Math.min(pages, Math.floor(requestedPage)))
    : 1;
  return { page, pages, visible: items.slice((page - 1) * size, page * size) };
}
