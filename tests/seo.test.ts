import test from "node:test";
import assert from "node:assert/strict";
import {
  absoluteSiteUrl,
  deploymentConfig,
  indexingEnabled,
  publication,
  site,
} from "../lib/site-config.ts";
import {
  breadcrumbItems,
  breadcrumbJsonLd,
  catalogCanonical,
  collectionCanonical,
  normalizedCollectionQuery,
  pageMetadata,
  productMetadata,
  robotsForPage,
  serializeJsonLd,
} from "../lib/seo.ts";
import {
  paginationHref,
  selectCatalogPage,
  scopedProducts,
} from "../lib/catalog-logic.ts";
import { catalogRequest } from "../lib/catalog-request.ts";
import {
  catalogProvider,
  catalogPriceLimit,
  products,
} from "../lib/catalog.ts";

test("origine configurabile, nessun localhost implicito in produzione, sottopercorso coerente", () => {
  assert.deepEqual(deploymentConfig({ NODE_ENV: "production" }), {
    basePath: "",
    siteUrl: undefined,
  });
  assert.equal(
    deploymentConfig({ NODE_ENV: "development" }).siteUrl,
    "http://localhost:3000",
  );
  assert.throws(() =>
    deploymentConfig({
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    }),
  );
  for (const url of [
    "ftp://example.test",
    "https://user:password@example.test",
    "https://example.test/?secret=x",
    "https://example.test/#fragment",
  ])
    assert.throws(() => deploymentConfig({ NEXT_PUBLIC_SITE_URL: url }));
  assert.throws(() => deploymentConfig({ NEXT_PUBLIC_BASE_PATH: "//shop" }));
  assert.throws(() =>
    deploymentConfig({ NEXT_PUBLIC_SITE_URL: "https://example.test/shop" }),
  );
  for (const url of ["https://example.test", "https://example.test/shop/"]) {
    const config = deploymentConfig({
      NEXT_PUBLIC_SITE_URL: url,
      NEXT_PUBLIC_BASE_PATH: "/shop",
    });
    assert.equal(
      absoluteSiteUrl("/catalogo?pagina=2", config),
      "https://example.test/shop/catalogo?pagina=2",
    );
    assert.equal(absoluteSiteUrl("/", config), "https://example.test/shop/");
  }
  assert.equal(
    absoluteSiteUrl("/catalogo", { basePath: "", siteUrl: undefined }),
    undefined,
  );
  assert.throws(() =>
    absoluteSiteUrl("//external.test", {
      basePath: "",
      siteUrl: "https://example.test",
    }),
  );
});

test("la demo prevale su qualsiasi richiesta di pubblicazione via ambiente", () => {
  const future = {
    ...publication,
    demo: false,
    mode: "published",
    authorized: true,
    deployment: "production",
    siteUrl: "https://example.test",
  };
  assert.equal(indexingEnabled({ ...future, demo: true }), false);
  assert.equal(indexingEnabled({ ...future, deployment: "preview" }), false);
  assert.equal(indexingEnabled({ ...future, authorized: false }), false);
  assert.equal(indexingEnabled({ ...future, siteUrl: undefined }), false);
  assert.equal(indexingEnabled(future), true);
  for (const kind of ["public", "variant", "private"] as const)
    assert.deepEqual(robotsForPage(kind), { index: false, follow: false });
  assert.deepEqual(robotsForPage("private", future), {
    index: false,
    follow: false,
  });
  assert.deepEqual(robotsForPage("variant", future), {
    index: false,
    follow: true,
  });
  assert.deepEqual(robotsForPage("public", future), {
    index: true,
    follow: true,
  });
});

test("metadata condivisi, prodotto descrittivo e override editoriale senza cambiare fixture", () => {
  const product = products[1];
  const metadata = productMetadata(product);
  assert.equal(metadata.title, `${product.name} · ${product.code}`);
  assert.ok(String(metadata.description).includes(product.code));
  assert.deepEqual(metadata.robots, { index: false, follow: false });
  assert.equal(metadata.openGraph?.siteName, "Edilcom Gru");
  assert.ok(!metadata.openGraph || !("images" in metadata.openGraph));
  assert.equal(
    productMetadata({
      ...product,
      seo: {
        title: "Titolo verificato",
        description: "Descrizione verificata",
      },
    }).title,
    "Titolo verificato",
  );
  const root = pageMetadata("Catalogo", "Descrizione", "/catalogo");
  assert.equal(
    root.alternates?.canonical,
    site.siteUrl ? absoluteSiteUrl("/catalogo") : undefined,
  );
  assert.equal(catalogProvider.find("slug-inesistente"), undefined);
});

test("canonical principali e pagina due distinta dalla prima", () => {
  assert.equal(catalogCanonical({}), "/catalogo");
  assert.equal(catalogCanonical({ pagina: "1" }), "/catalogo");
  assert.equal(catalogCanonical({ pagina: "2" }), "/catalogo?pagina=2");
  assert.equal(
    collectionCanonical("/categorie/radiocomandi", {}),
    "/categorie/radiocomandi",
  );
  assert.equal(
    collectionCanonical("/brand/hetronic", { pagina: "2" }),
    "/brand/hetronic?pagina=2",
  );
});

test("normalizza parametri vuoti, duplicati, default e numeri invalidi senza cambiare filtri", () => {
  assert.equal(
    catalogCanonical({
      brand: ["HBC", "HBC", " "],
      q: "",
      disponibile: "0",
      min: "NaN",
      max: "Infinity",
      ordine: "invalid",
      pagina: "1",
      tracking: "ignored",
    }),
    "/brand/hbc",
  );
  assert.equal(
    normalizedCollectionQuery({
      tensione: ["24 V", "400 V", "24 V"],
      brand: [" HBC ", "Autec"],
      q: "  MÓTORE   GRU ",
    }).toString(),
    "brand=Autec&brand=HBC&q=motore+gru&tensione=24+V&tensione=400+V",
  );
  assert.equal(
    catalogCanonical({ q: "motore", disponibile: "1" }),
    "/catalogo?disponibile=1&q=motore",
  );
  assert.equal(
    collectionCanonical(
      "/brand/hetronic",
      { categoria: "Batterie" },
      { brand: "Hetronic" },
    ),
    "/brand/hetronic?categoria=Batterie",
  );
});

test("sort eliminato solo con prodotti equivalenti sulla singola pagina", () => {
  assert.equal(
    catalogCanonical({ q: "HR-NOVA-L", ordine: "price-desc" }),
    "/catalogo?q=hr-nova-l",
  );
  assert.equal(
    catalogCanonical({ ordine: "price-asc" }),
    "/catalogo?ordine=price-asc",
  );
  assert.equal(
    catalogCanonical({ ordine: "price-asc", pagina: "2" }),
    "/catalogo?ordine=price-asc&pagina=2",
  );
  assert.equal(
    collectionCanonical(
      "/brand/hbc",
      { ordine: "price-asc" },
      { brand: "HBC" },
    ),
    "/brand/hbc",
  );
});

test("link paginazione preservano gruppi ripetuti, ricerca, sort e contesto", () => {
  const params = new URLSearchParams(
    "brand=HBC&brand=Autec&q=radio&ordine=price-desc&pagina=2",
  );
  assert.equal(
    paginationHref("/categorie/radiocomandi", params, 3),
    "/categorie/radiocomandi?brand=HBC&brand=Autec&q=radio&ordine=price-desc&pagina=3",
  );
  assert.equal(
    paginationHref("/brand/hbc", new URLSearchParams("pagina=2"), 1),
    "/brand/hbc",
  );
  assert.equal(params.get("pagina"), "2");
});

test("richieste server fuori intervallo/non intere non vengono mascherate con un’altra pagina", () => {
  const source = catalogProvider.list();
  assert.equal(catalogRequest({ pagina: "5" }).result.validPage, true);
  for (const page of [
    "0",
    "-1",
    "2.5",
    "NaN",
    "Infinity",
    "",
    "6",
    "9007199254740992",
  ]) {
    assert.equal(
      selectCatalogPage(
        source,
        new URLSearchParams({ pagina: page }),
        catalogPriceLimit,
      ).validPage,
      false,
      page,
    );
  }
  assert.equal(catalogRequest({ pagina: ["1", "2"] }).result.validPage, false);
  assert.equal(
    catalogRequest({ pagina: "2" }, { category: "Funi" }).result.validPage,
    false,
  );
  assert.equal(
    catalogRequest({ pagina: "2" }, { brand: "Hetronic" }).result.visible
      .length,
    4,
  );
  assert.equal(catalogRequest({ q: "nessun-prodotto" }).result.validPage, true);
  assert.equal(
    catalogRequest({ q: "nessun-prodotto", pagina: "2" }).result.validPage,
    false,
  );
  assert.equal(scopedProducts(source, { brand: "inesistente" }).length, 0);
});

test("breadcrumb strutturati identici ai livelli visibili, escaping sicuro e nessun dominio inventato", () => {
  const items = [{ label: "Categorie", href: "/categorie" }, { label: "Funi" }];
  assert.deepEqual(breadcrumbItems(items, "/categorie/funi"), [
    { label: "Home", href: "/" },
    { label: "Categorie", href: "/categorie" },
    { label: "Funi", href: "/categorie/funi" },
  ]);
  const schema = breadcrumbJsonLd(items, "/categorie/funi");
  if (site.siteUrl) {
    assert.equal(schema?.itemListElement.length, 3);
    assert.equal(
      schema?.itemListElement[2].item,
      absoluteSiteUrl("/categorie/funi"),
    );
    assert.deepEqual(
      schema?.itemListElement.map((item) => item.name),
      ["Home", "Categorie", "Funi"],
    );
  } else assert.equal(schema, undefined);
  assert.equal(breadcrumbJsonLd(items), undefined);
  assert.ok(
    !serializeJsonLd({ name: "</script><script>alert(1)</script>" }).includes(
      "<",
    ),
  );
  assert.ok(!serializeJsonLd(schema || {}).includes("Offer"));
});
