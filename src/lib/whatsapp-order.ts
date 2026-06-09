import { formatINR } from "@/lib/format";
import { MILL } from "@/lib/mill-config";
import type { CartItem, ShippingAddress } from "@/types";

export type OrderNotifyPayload = {
  orderId: string;
  total: number;
  phone: string;
  paymentId?: string;
  isDemo?: boolean;
  address?: ShippingAddress;
  items?: CartItem[];
};

export function buildOrderWhatsAppMessage(payload: OrderNotifyPayload): string {
  const lines = [
    `🌾 *New Order — ${MILL.fullName}*`,
    "",
    `*Order ID:* #${payload.orderId}`,
    `*Total:* ${formatINR(payload.total)}`,
    `*Customer:* +91 ${payload.phone}`,
    payload.paymentId ? `*Payment ID:* ${payload.paymentId}` : null,
    payload.isDemo ? `*Mode:* Demo / Test order` : `*Payment:* Paid online ✓`,
  ].filter(Boolean) as string[];

  if (payload.address) {
    const addr = [
      payload.address.fullName,
      payload.address.addressLine1,
      payload.address.addressLine2,
      payload.address.city,
      payload.address.state,
      payload.address.pincode,
    ]
      .filter(Boolean)
      .join(", ");
    lines.push("", `*Deliver to:* ${addr}`);
  }

  if (payload.items?.length) {
    lines.push("", "*Items:*");
    for (const item of payload.items) {
      lines.push(
        `• ${item.name} (${item.variantLabel}) ×${item.quantity} — ${formatINR(item.price * item.quantity)}`
      );
    }
  }

  lines.push("", "Please confirm and arrange delivery. Thank you!");
  return lines.join("\n");
}

export function getOrderWhatsAppUrl(payload: OrderNotifyPayload): string {
  const text = encodeURIComponent(buildOrderWhatsAppMessage(payload));
  return `https://wa.me/${MILL.whatsapp}?text=${text}`;
}

export const LAST_ORDER_KEY = "jv_last_order";
export const WA_SENT_KEY = "jv_wa_sent";

export function saveOrderForWhatsApp(payload: OrderNotifyPayload) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(payload));
  sessionStorage.removeItem(WA_SENT_KEY);
}

export function loadOrderForWhatsApp(): OrderNotifyPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as OrderNotifyPayload) : null;
  } catch {
    return null;
  }
}

export function openOrderWhatsApp(payload: OrderNotifyPayload) {
  window.open(getOrderWhatsAppUrl(payload), "_blank", "noopener,noreferrer");
}
