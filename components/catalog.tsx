import { notFound } from "next/navigation";
import { CollectionLinks } from "./collection-sections";
import { CatalogView } from "./catalog-view";
import { catalogRequest, type SearchParams } from "@/lib/catalog-request";
import type { CatalogScope } from "@/lib/catalog-logic";
export function Catalog({
  params,
  pathname,
  scope = {},
}: {
  params: SearchParams;
  pathname: string;
  scope?: CatalogScope;
}) {
  const data = catalogRequest(params, scope);
  if (!data.result.validPage) notFound();
  return (
    <CatalogView
      scope={scope}
      pathname={pathname}
      initialQuery={data.query}
      source={data.source}
      initialResult={data.result}
      collectionLinks={!scope.brand ? <CollectionLinks /> : null}
    />
  );
}
