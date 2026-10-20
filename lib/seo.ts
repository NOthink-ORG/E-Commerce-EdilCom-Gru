import type { Metadata } from "next";
import { categoryDirectory, brandDirectory } from "./catalog-navigation.ts";
export type SearchParams = Record<string, string | string[] | undefined>;
export function pageMetadata(
  title: string,
  description: string,
  canonical: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: false, follow: false },
  };
}
export function collectionCanonical(path: string, params: SearchParams) {
  const query = new URLSearchParams();
  for (const key of Object.keys(params).sort()) {
    const values = params[key];
    for (const value of Array.isArray(values)
      ? values
      : values === undefined
        ? []
        : [values])
      if (value.trim()) query.append(key, value);
  }
  return `${path}${query.size ? `?${query.toString()}` : ""}`;
}
export function catalogCanonical(params: SearchParams) {
  const active = Object.entries(params).filter(([, value]) =>
    Array.isArray(value) ? value.some(Boolean) : Boolean(value?.trim()),
  );
  if (active.length === 1) {
    const [key, value] = active[0];
    if (typeof value === "string") {
      const category =
        key === "categoria"
          ? categoryDirectory.find((item) => item.name === value)
          : undefined;
      const brand =
        key === "brand"
          ? brandDirectory.find((item) => item.name === value)
          : undefined;
      if (category) return `/categorie/${category.slug}`;
      if (brand) return `/brand/${brand.slug}`;
    }
  }
  return collectionCanonical("/catalogo", params);
}
