import type { Metadata } from "next";
import { categoryDirectory, brandDirectory } from "./catalog-navigation";
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
export function catalogCanonical(params: SearchParams) {
  const category =
    typeof params.categoria === "string"
      ? categoryDirectory.find((item) => item.name === params.categoria)
      : undefined;
  const brand =
    typeof params.brand === "string"
      ? brandDirectory.find((item) => item.name === params.brand)
      : undefined;
  // Legacy query URLs remain usable; dedicated collections own their canonical URL.
  if (brand) return `/brand/${brand.slug}`;
  if (category) return `/categorie/${category.slug}`;
  return "/catalogo";
}
