import type { OrderItem } from "../models/Order";

export const calculateTotals = (items: OrderItem[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = 0;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
};
