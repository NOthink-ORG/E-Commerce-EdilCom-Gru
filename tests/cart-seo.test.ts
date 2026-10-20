import test from "node:test";
import assert from "node:assert/strict";
import { products } from "../lib/catalog.ts";
import { addCartItem, sanitizeCart } from "../lib/cart-logic.ts";
import { calculateOrder, priceWithTax } from "../lib/order.ts";
import { catalogCanonical, collectionCanonical } from "../lib/seo.ts";
test("canonical solo per equivalenze esatte con una categoria o un brand", () => {
  assert.equal(
    catalogCanonical({ categoria: "Radiocomandi" }),
    "/categorie/radiocomandi",
  );
  assert.equal(catalogCanonical({ brand: "Hetronic" }), "/brand/hetronic");
  assert.equal(
    catalogCanonical({ brand: "Hetronic", q: "" }),
    "/brand/hetronic",
  );
});
test("canonical per combinazioni, ricerca, pagina e ordinamento resta equivalente", () => {
  assert.equal(
    catalogCanonical({ brand: "HBC", categoria: "Radiocomandi" }),
    "/catalogo?brand=HBC&categoria=Radiocomandi",
  );
  assert.equal(
    catalogCanonical({ brand: "HBC", pagina: "2" }),
    "/catalogo?brand=HBC&pagina=2",
  );
  assert.equal(
    catalogCanonical({ q: "Nova L", ordine: "price-asc" }),
    "/catalogo?ordine=price-asc&q=Nova+L",
  );
  assert.equal(
    catalogCanonical({ categoria: ["Funi", "Batterie"] }),
    "/catalogo?categoria=Funi&categoria=Batterie",
  );
  assert.equal(
    collectionCanonical("/brand/hbc", { max: "500" }),
    "/brand/hbc?max=500",
  );
  assert.equal(
    catalogCanonical({ brand: "Non presente" }),
    "/catalogo?brand=Non+presente",
  );
});
test("funzione client rifiuta esauriti, identificativi e quantità invalidi", () => {
  const out = products.find((p) => p.stock === "out_of_stock")!;
  assert.deepEqual(addCartItem([], out.id, 1, products), []);
  assert.deepEqual(addCartItem([], "missing", 1, products), []);
  for (const qty of [0, -1, NaN, 1.5])
    assert.deepEqual(addCartItem([], products[0].id, qty, products), []);
  const low = products.find((p) => p.stock === "low")!;
  assert.equal(addCartItem([], low.id, 1, products).length, 1);
});
test("carrello aggrega quantità, limita a 999 e ripristina solo righe valide", () => {
  const id = products[0].id;
  assert.deepEqual(addCartItem([{ id, quantity: 998 }], id, 5, products), [
    { id, quantity: 999 },
  ]);
  assert.deepEqual(
    sanitizeCart(
      [
        { id, quantity: 2 },
        { id, quantity: 3 },
        { id: "missing", quantity: 1 },
        null,
      ],
      products,
    ),
    [{ id, quantity: 2 }],
  );
  assert.deepEqual(
    sanitizeCart(
      [
        {
          id: products.find((p) => p.stock === "out_of_stock")!.id,
          quantity: 1,
        },
      ],
      products,
    ),
    [],
  );
});
test("centesimi, IVA e sconto applicato solo ai prodotti", () => {
  const product = { ...products[0], price: 10.01 };
  const result = calculateOrder([{ product, quantity: 3 }], "courier", true);
  assert.deepEqual(result, {
    subtotal: 30.03,
    reduction: 3,
    shipping: 12,
    taxable: 39.03,
    vat: 8.59,
    total: 47.62,
  });
});
test("soglia spedizione dopo sconto, ritiro e carrello vuoto", () => {
  const product = { ...products[0], price: 300 };
  assert.equal(calculateOrder([{ product, quantity: 1 }]).shipping, 0);
  assert.equal(
    calculateOrder([{ product, quantity: 1 }], "courier", true).shipping,
    12,
  );
  assert.equal(
    calculateOrder([{ product, quantity: 1 }], "pickup").shipping,
    0,
  );
  assert.equal(calculateOrder([]).total, 0);
  assert.equal(calculateOrder([{ product, quantity: -1 }]).subtotal, 0);
});

test("prezzo IVA inclusa usa lo stesso arrotondamento del riepilogo", () => {
  for (const price of [8.9, 39.99, 1250]) {
    const product = { ...products[0], price };
    const totals = calculateOrder([{ product, quantity: 1 }], "pickup");
    assert.equal(priceWithTax(price), totals.total);
  }
});
