import type { Product } from "./product.ts";
import { isPurchasable } from "./catalog-logic.ts";
export type CartRow = { id: string; quantity: number };
export function addCartItem(
  cart: CartRow[],
  id: string,
  quantity: number,
  products: Product[],
): CartRow[] {
  const product = products.find((item) => item.id === id);
  if (
    !product ||
    !isPurchasable(product.stock) ||
    !Number.isInteger(quantity) ||
    quantity < 1
  )
    return cart;
  return cart.some((item) => item.id === id)
    ? cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(999, item.quantity + quantity) }
          : item,
      )
    : [...cart, { id, quantity: Math.min(999, quantity) }];
}
export function sanitizeCart(value: unknown, products: Product[]): CartRow[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((row: unknown) => {
    if (
      typeof row !== "object" ||
      row === null ||
      !("id" in row) ||
      !("quantity" in row)
    )
      return [];
    const { id, quantity } = row;
    const product = products.find((item) => item.id === id);
    if (
      typeof id !== "string" ||
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 999 ||
      !product ||
      !isPurchasable(product.stock) ||
      seen.has(id)
    )
      return [];
    seen.add(id);
    return [{ id, quantity }];
  });
}
