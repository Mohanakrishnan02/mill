import { DELIVERY } from "./mill-config";
import { calcDeliveryCharge, isOutstation } from "./shipping";
import { CartItem, OrderSummary } from "@/types";

export function cartTotalKg(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const kg = item.weightKg ?? (parseInt(item.variantLabel, 10) || 1);
    return sum + kg * item.quantity;
  }, 0);
}

export function computeOrderSummary(
  items: CartItem[],
  deliveryDistanceKm: number | null = null
): OrderSummary {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const mrpTotal = items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const listDiscount = mrpTotal - subtotal;
  const promoDiscount = Math.round(subtotal * (DELIVERY.discountPercent / 100));
  const discount = listDiscount + promoDiscount;

  let delivery = 0;
  if (deliveryDistanceKm !== null && !isOutstation(deliveryDistanceKm)) {
    delivery = calcDeliveryCharge(deliveryDistanceKm);
  }

  const total = subtotal - promoDiscount + delivery;

  return {
    subtotal,
    mrpTotal,
    discount,
    promoDiscount,
    delivery,
    total,
    deliveryDistanceKm,
    isOutstation: deliveryDistanceKm !== null && isOutstation(deliveryDistanceKm),
    totalKg: cartTotalKg(items),
  };
}
