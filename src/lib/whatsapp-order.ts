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

export function buildCustomerConfirmationMessage(payload: OrderNotifyPayload): string {
  const lines = [
    `🌾 *${MILL.fullName}*`,
    `✅ *Order Confirmed!*`,
    "",
    `Dear customer, thank you for your order.`,
    "",
    `*Order ID:* #${payload.orderId}`,
    `*Total Paid:* ${formatINR(payload.total)}`,
    payload.paymentId ? `*Payment ID:* ${payload.paymentId}` : null,
    "",
    `Your rice will be prepared at our Melur mill and delivered soon.`,
    "",
    `📞 Queries: ${MILL.phone}`,
    `📍 ${MILL.address}, ${MILL.city}`,
  ].filter(Boolean) as string[];

  if (payload.items?.length) {
    lines.push("", "*Your items:*");
    for (const item of payload.items) {
      lines.push(`• ${item.name} (${item.variantLabel}) ×${item.quantity}`);
    }
  }

  lines.push("", "— Jayalakshmi Vilas Rice Mill, Melur 🙏");
  return lines.join("\n");
}

export function buildMillAlertMessage(payload: OrderNotifyPayload): string {
  const lines = [
    `🚨 *NEW ORDER RECEIVED*`,
    `🌾 *${MILL.fullName}*`,
    "",
    `⚡ A new order has been placed — please confirm & arrange delivery.`,
    "",
    `*Order ID:* #${payload.orderId}`,
    `*Customer Mobile:* +91 ${payload.phone}`,
    `*Order Total:* ${formatINR(payload.total)}`,
    payload.paymentId ? `*Payment ID:* ${payload.paymentId}` : null,
    payload.isDemo ? `*Mode:* Demo / Test order` : `*Payment:* ✅ Paid online`,
  ].filter(Boolean) as string[];

  if (payload.address) {
    const addr = [
      payload.address.fullName,
      payload.address.addressLine1,
      payload.address.addressLine2,
      payload.address.city,
      payload.address.pincode,
    ]
      .filter(Boolean)
      .join(", ");
    lines.push("", `*Deliver to:* ${addr}`);
  }

  if (payload.items?.length) {
    lines.push("", "*Order items:*");
    for (const item of payload.items) {
      lines.push(
        `• ${item.name} (${item.variantLabel}) ×${item.quantity} — ${formatINR(item.price * item.quantity)}`
      );
    }
  }

  lines.push("", "🔔 Please contact customer and confirm delivery. Thank you!");
  return lines.join("\n");
}

/** @deprecated use getMillAlertWhatsAppUrl */
export function buildOrderWhatsAppMessage(payload: OrderNotifyPayload): string {
  return buildMillAlertMessage(payload);
}

export function getCustomerWhatsAppUrl(payload: OrderNotifyPayload): string {
  const phone = payload.phone.replace(/\D/g, "").slice(-10);
  const text = encodeURIComponent(buildCustomerConfirmationMessage(payload));
  return `https://wa.me/91${phone}?text=${text}`;
}

export function getMillAlertWhatsAppUrl(payload: OrderNotifyPayload): string {
  const text = encodeURIComponent(buildMillAlertMessage(payload));
  return `https://wa.me/${MILL.whatsapp}?text=${text}`;
}

export function getOrderWhatsAppUrl(payload: OrderNotifyPayload): string {
  return getMillAlertWhatsAppUrl(payload);
}

export const LAST_ORDER_KEY = "jv_last_order";
export const WA_CUSTOMER_SENT_KEY = "jv_wa_customer_sent";
export const WA_MILL_SENT_KEY = "jv_wa_mill_sent";
/** @deprecated */
export const WA_SENT_KEY = WA_MILL_SENT_KEY;

export function saveOrderForWhatsApp(payload: OrderNotifyPayload) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(payload));
  sessionStorage.removeItem(WA_CUSTOMER_SENT_KEY);
  sessionStorage.removeItem(WA_MILL_SENT_KEY);
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

export function openCustomerWhatsApp(payload: OrderNotifyPayload) {
  window.open(getCustomerWhatsAppUrl(payload), "_blank", "noopener,noreferrer");
}

export function openMillAlertWhatsApp(payload: OrderNotifyPayload) {
  window.open(getMillAlertWhatsAppUrl(payload), "_blank", "noopener,noreferrer");
}
