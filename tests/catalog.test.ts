import test from "node:test";
import assert from "node:assert/strict";
import { accessSync } from "node:fs";
import { products, catalogPriceLimit } from "../lib/catalog.ts";
import type { Product } from "../lib/product.ts";
import { productImages } from "../lib/product.ts";
import {
  normalizeSearch,
  parseCatalogState,
  filterProducts,
  searchRank,
  scopedProducts,
  paginateProducts,
  isPurchasable,
} from "../lib/catalog-logic.ts";
const state = (query = "") =>
  parseCatalogState(new URLSearchParams(query), catalogPriceLimit);
const fixture = (
  id: string,
  code: string,
  name: string,
  brand = "Demo",
): Product => ({ ...products[0], id, slug: id, code, name, brand });
test("60 fixture valide, slug e SKU unici, immagini locali presenti", () => {
  assert.equal(products.length, 60);
  assert.equal(new Set(products.map((p) => p.slug)).size, 60);
  assert.equal(new Set(products.map((p) => p.code)).size, 60);
  for (const product of products) {
    assert(product.price >= 0);
    assert(product.compatibility.length);
    for (const image of productImages(product))
      accessSync(`public${image.src}`);
  }
  assert(products.some((product) => product.stock === "out_of_stock"));
});
test("normalizza maiuscole, accenti e spazi", () =>
  assert.equal(normalizeSearch("  MOTÓRE\t ELETTRICO  "), "motore elettrico"));
test("ranking SKU esatto > prefisso > nome esatto > termini nel nome > brand", () => {
  const ranked = [
    fixture("brand", "B1", "Componente", "Pompa"),
    fixture("name", "N1", "Pompa"),
    fixture("prefix", "POMPA-24", "Dispositivo"),
    fixture("terms", "T1", "Pompa per gru"),
    fixture("exact", "POMPA", "Unità"),
  ];
  assert.deepEqual(
    filterProducts(ranked, state("q=pompa")).map((p) => p.id),
    ["exact", "prefix", "name", "terms", "brand"],
  );
});
test("ricerca multi termine normalizzata e ordinamento stabile a parità", () => {
  const list = [
    fixture("a", "A1", "Motóre per gru"),
    fixture("b", "B1", "Motore per gru"),
  ];
  assert.deepEqual(
    filterProducts(list, state("q=motore++gru")).map((p) => p.id),
    ["a", "b"],
  );
  assert.equal(searchRank(list[0], "inesistente"), null);
});
test("ordinamenti prezzo e nome indipendenti dal ranking", () => {
  const list = products.slice(0, 10);
  for (const sort of ["price-asc", "price-desc", "name"]) {
    const result = filterProducts(list, state(`ordine=${sort}`));
    for (let i = 1; i < result.length; i++)
      assert(
        sort === "name"
          ? result[i - 1].name.localeCompare(result[i].name, "it") <= 0
          : sort === "price-asc"
            ? result[i - 1].price <= result[i].price
            : result[i - 1].price >= result[i].price,
      );
  }
});
test("OR nello stesso gruppo, AND tra gruppi e contesto brand", () => {
  const source = scopedProducts(products, { brand: "Hetronic" });
  const result = filterProducts(
    source,
    state("categoria=Radiocomandi&categoria=Batterie&min=100&max=2000"),
  );
  assert(result.length > 0);
  assert(
    result.every(
      (p) =>
        p.brand === "Hetronic" &&
        ["Radiocomandi", "Batterie"].includes(p.category) &&
        p.price >= 100 &&
        p.price <= 2000,
    ),
  );
});
test("filtro stock include pochi pezzi ed esclude solo esauriti", () => {
  const result = filterProducts(products, state("disponibile=1"));
  assert(result.some((p) => p.stock === "low"));
  assert(!result.some((p) => p.stock === "out_of_stock"));
  assert.equal(
    result.length,
    products.filter((p) => isPurchasable(p.stock)).length,
  );
});
test("compatibilità, alimentazione, brand e categoria filtrano davvero", () => {
  for (const [key, values] of [
    ["brand", [...new Set(products.map((p) => p.brand))]],
    ["categoria", [...new Set(products.map((p) => p.category))]],
    ["compatibilita", [...new Set(products.flatMap((p) => p.compatibility))]],
    [
      "tensione",
      [...new Set(products.flatMap((p) => (p.voltage ? [p.voltage] : [])))],
    ],
  ] as const) {
    for (const value of values) {
      const actual = filterProducts(
        products,
        state(`${key}=${encodeURIComponent(value)}`),
      );
      const expected = products.filter((p) =>
        key === "brand"
          ? p.brand === value
          : key === "categoria"
            ? p.category === value
            : key === "compatibilita"
              ? p.compatibility.includes(value)
              : p.voltage === value,
      );
      assert.deepEqual(actual, expected);
    }
  }
});
test("parametri numerici malformati, negativi, zero e ordinamento non valido", () => {
  const result = state("min=-50&max=Infinity&pagina=NaN&ordine=script");
  assert.equal(result.min, 0);
  assert.equal(result.max, catalogPriceLimit);
  assert.equal(result.page, 1);
  assert.equal(result.sort, "relevance");
  assert.equal(state("max=0").max, 0);
  assert.equal(state("pagina=2.8").page, 2);
  assert.equal(state("min=foo").min, 0);
  assert.equal(filterProducts(products, state("min=2000&max=100")).length, 0);
});
test("paginazione limitata, ultima pagina, valori non validi e stato vuoto", () => {
  assert.equal(paginateProducts(products, 2).visible.length, 12);
  assert.equal(paginateProducts(products, 999).page, 5);
  assert.equal(paginateProducts(products, NaN).page, 1);
  assert.equal(paginateProducts([], 0).pages, 1);
  assert.equal(paginateProducts(products, 1, 0).visible.length, 12);
});
test("galleria con array, fallback singolo e assenza immagini", () => {
  const sample = products.find((p) => p.images?.length)!;
  assert.equal(productImages(sample).length, 3);
  assert.equal(productImages(products[0]).length, 1);
  assert.deepEqual(
    productImages({ ...products[0], image: "", images: [] }),
    [],
  );
});
