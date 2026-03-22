import type { OrderItem } from "../models/Order";

export const calculateTotals = (items: OrderItem[], distanceKm: number = 0) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Simple and sample formulas for distance-based calculations
  const baseTax = subtotal * 0.05; // 5% base tax
  const distanceTax = distanceKm * 0.10; // $0.10 tax per km
  const tax = Number((baseTax + distanceTax).toFixed(2));

  // $5 flat fee + $0.50 per km
  const shipping = distanceKm > 0 ? Number((5 + (distanceKm * 0.50)).toFixed(2)) : 0;

  const total = Number((subtotal + tax + shipping).toFixed(2));

  return { subtotal, tax, shipping, total };
};
