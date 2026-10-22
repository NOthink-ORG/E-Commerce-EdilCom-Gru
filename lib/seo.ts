import type { Metadata } from "next";
import type { Product } from "./product.ts";
import { categoryDirectory, brandDirectory } from "./catalog-navigation.ts";
import { catalogPriceLimit } from "./catalog.ts";
import {
  normalizeSearch,
  parseCatalogState,
  type CatalogScope,
} from "./catalog-logic.ts";
import {
  catalogRequest,
  queryParams,
  type SearchParams,
} from "./catalog-request.ts";
import {
  absoluteSiteUrl,
  indexingEnabled,
  publication,
  siteName,
} from "./site-config.ts";
export type { SearchParams } from "./catalog-request.ts";
export function robotsForPage(
  kind: "public" | "variant" | "private" = "public",
  policy = publication,
) {
  if (!indexingEnabled(policy) || kind === "private")
    return { index: false, follow: false };
  return { index: kind === "public", follow: true };
}
export function pageMetadata(
  title: string,
  description: string,
  canonical: string | undefined,
  kind: "public" | "variant" | "private" = "public",
): Metadata {
  const url = canonical ? absoluteSiteUrl(canonical) : undefined;
  return {
    title,
    description,
    // With no confirmed preview/production origin, omit absolute metadata instead of guessing localhost.
    alternates: url ? { canonical: url } : undefined,
    robots: robotsForPage(kind),
    openGraph: {
      type: "website",
      siteName,
      locale: "it_IT",
      title,
      description,
      ...(url ? { url } : {}),
    },
  };
}
export function normalizedCollectionQuery(
  params: SearchParams,
  scope: CatalogScope = {},
) {
  const query = queryParams(params);
  const state = parseCatalogState(query, catalogPriceLimit);
  const result = new URLSearchParams();
  if (state.query) result.set("q", normalizeSearch(state.query));
  const groups = [
    ["brand", state.brands],
    ["categoria", state.selectedCategories],
    ["compatibilita", state.compatible],
    ["tensione", state.voltage],
  ] as const;
  for (const [key, values] of groups)
    for (const value of [...values].sort()) result.append(key, value);
  if (state.available) result.set("disponibile", "1");
  if (state.min > 0) result.set("min", String(state.min));
  if (state.max < catalogPriceLimit) result.set("max", String(state.max));
  if (state.page > 1) result.set("pagina", String(state.page));
  // Sorting paginated sets changes page membership. Only drop sort for a single-page result.
  if (
    state.sort !== "relevance" &&
    catalogRequest(params, scope).result.pages > 1
  )
    result.set("ordine", state.sort);
  result.sort();
  return result;
}
export function collectionCanonical(
  path: string,
  params: SearchParams,
  scope: CatalogScope = {},
) {
  const query = normalizedCollectionQuery(params, scope);
  return `${path}${query.size ? `?${query.toString()}` : ""}`;
}
export function catalogCanonical(params: SearchParams) {
  const query = normalizedCollectionQuery(params);
  if (query.size === 1) {
    const category = categoryDirectory.find(
      (item) => item.name === query.get("categoria"),
    );
    const brand = brandDirectory.find(
      (item) => item.name === query.get("brand"),
    );
    if (category) return `/categorie/${category.slug}`;
    if (brand) return `/brand/${brand.slug}`;
  }
  return `/catalogo${query.size ? `?${query}` : ""}`;
}
export function collectionMetadata(
  title: string,
  description: string,
  path: string,
  params: SearchParams,
  scope: CatalogScope = {},
) {
  const query = normalizedCollectionQuery(params, scope);
  const variant =
    [...query.keys()].some((key) => key !== "pagina") ||
    Boolean(params.ordine && params.ordine !== "relevance");
  return pageMetadata(
    title,
    description,
    path === "/catalogo"
      ? catalogCanonical(params)
      : collectionCanonical(path, params, scope),
    variant ? "variant" : "public",
  );
}
export function productMetadata(product: Product) {
  const parts = [product.name];
  if (
    product.brand &&
    !normalizeSearch(product.name).includes(normalizeSearch(product.brand))
  )
    parts.push(product.brand);
  if (
    product.code &&
    !normalizeSearch(product.name).includes(normalizeSearch(product.code))
  )
    parts.push(product.code);
  return pageMetadata(
    product.seo?.title || parts.join(" · "),
    product.seo?.description ||
      `${product.name}${product.code ? `, codice ${product.code}` : ""}${product.brand ? `, ${product.brand}` : ""}. Scheda dimostrativa: informazioni e immagini da verificare.`,
    `/prodotti/${product.slug}`,
  );
}
export type BreadcrumbItem = { label: string; href?: string };
export function breadcrumbItems(items: BreadcrumbItem[], currentPath?: string) {
  return [
    { label: "Home", href: "/" },
    ...items.map((item, index) => ({
      ...item,
      href: item.href || (index === items.length - 1 ? currentPath : undefined),
    })),
  ];
}
export function breadcrumbJsonLd(
  items: BreadcrumbItem[],
  currentPath?: string,
) {
  const entries = breadcrumbItems(items, currentPath);
  if (!entries.every((item) => item.href && absoluteSiteUrl(item.href)))
    return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteSiteUrl(item.href!),
    })),
  };
}
export function serializeJsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
