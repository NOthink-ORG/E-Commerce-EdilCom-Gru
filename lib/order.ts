import type { Product } from "./product.ts";
export const taxRate = 0.22;
export function priceWithTax(price: number) {
  const cents = Math.round(price * 100);
  return Math.round(cents * (1 + taxRate)) / 100;
}
export function calculateOrder(
  items: { product: Product; quantity: number }[],
  shippingMode = "courier",
  discount = false,
) {
  const subtotal =
    items
      .filter(
        (item) =>
          Number.isFinite(item.product.price) &&
          item.product.price >= 0 &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0,
      )
      .reduce(
        (sum, item) =>
          sum + Math.round(item.product.price * 100) * item.quantity,
        0,
      ) / 100;
  const reduction = discount ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const shipping =
    !items.length || shippingMode === "pickup" || subtotal - reduction >= 300
      ? 0
      : 12;
  const taxable = Math.round((subtotal - reduction + shipping) * 100) / 100;
  const vat = Math.round(taxable * taxRate * 100) / 100;
  return {
    subtotal,
    reduction,
    shipping,
    taxable,
    vat,
    total: Math.round((taxable + vat) * 100) / 100,
  };
}
