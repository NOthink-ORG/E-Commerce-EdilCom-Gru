import { catalogProvider, catalogPriceLimit } from "./catalog.ts";
import {
  scopedProducts,
  selectCatalogPage,
  type CatalogScope,
} from "./catalog-logic.ts";
export type SearchParams = Record<string, string | string[] | undefined>;
export function queryParams(params: SearchParams) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params))
    for (const item of Array.isArray(value)
      ? value
      : value === undefined
        ? []
        : [value])
      query.append(key, item);
  return query;
}
export function catalogRequest(params: SearchParams, scope: CatalogScope = {}) {
  const query = queryParams(params);
  const source = scopedProducts(catalogProvider.list(), scope);
  return {
    query: query.toString(),
    source,
    result: selectCatalogPage(source, query, catalogPriceLimit),
  };
}

export function requestHref(path: string, params: SearchParams) {
  const query = queryParams(params);
  return `${path}${query.size ? `?${query}` : ""}`;
}
