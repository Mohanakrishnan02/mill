import { formatINR } from "@/lib/format";
import { MILL } from "@/lib/mill-config";
import { IMAGES } from "@/lib/images";
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

/** Unicode escapes — reliable in WhatsApp pre-filled text (avoids encoding corruption) */
const WA = {
  rice: "\u{1F33E}",
  check: "\u2705",
  party: "\u{1F389}",
  phone: "\u{1F4DE}",
  pin: "\u{1F4CD}",
  pray: "\u{1F64F}",
  alert: "\u{1F6A8}",
  bolt: "\u26A1",
  bell: "\u{1F514}",
  camera: "\u{1F4F7}",
  box: "\u{1F4E6}",
  truck: "\u{1F69A}",
} as const;

const MAX_ENCODED_TEXT_LEN = 1400;

export function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const base = MILL.siteUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function primaryProductImage(items?: CartItem[]): string {
  const first = items?.[0]?.image;
  return toAbsoluteUrl(first || IMAGES.logo);
}

function shortDeliveryAddress(address: ShippingAddress): string {
  return [
    address.fullName,
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}

function buildWhatsAppSendUrl(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  let body = text.normalize("NFC");

  while (body.length > 0 && encodeURIComponent(body).length > MAX_ENCODED_TEXT_LEN) {
    body = body.slice(0, Math.floor(body.length * 0.85)).trimEnd() + "\n...";
  }

  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(body)}`;
}

export function buildCustomerConfirmationMessage(payload: OrderNotifyPayload): string {
  const logoUrl = toAbsoluteUrl(IMAGES.logo);
  const productImg = primaryProductImage(payload.items);

  const lines = [
    `${WA.camera} *Mill Logo:* ${logoUrl}`,
    `${WA.camera} *Your Rice:* ${productImg}`,
    "",
    `${WA.rice} *${MILL.fullName}*`,
    `${WA.check} *Order Confirmed!* ${WA.party}`,
    "",
    `Dear customer, thank you for your order.`,
    "",
    `${WA.box} *Order ID:* #${payload.orderId}`,
    `*Total Paid:* ${formatINR(payload.total)}`,
    payload.paymentId ? `*Payment ID:* ${payload.paymentId}` : null,
    "",
    `${WA.truck} Your rice will be prepared at our Melur mill and delivered soon.`,
    "",
    `${WA.phone} Queries: ${MILL.phone}`,
    `${WA.pin} ${MILL.address}, ${MILL.city}`,
  ].filter(Boolean) as string[];

  if (payload.items?.length) {
    lines.push("", "*Your items:*");
    for (const item of payload.items) {
      lines.push(`\u2022 ${item.name} (${item.variantLabel}) \u00D7${item.quantity}`);
    }
  }

  lines.push("", `\u2014 ${MILL.fullName}, Melur ${WA.pray}`);
  return lines.join("\n");
}

export function buildMillAlertMessage(payload: OrderNotifyPayload): string {
  const logoUrl = toAbsoluteUrl(IMAGES.logo);
  const productImg = primaryProductImage(payload.items);

  const lines = [
    `${WA.camera} *Mill Logo:* ${logoUrl}`,
    `${WA.camera} *Order Rice:* ${productImg}`,
    "",
    `${WA.alert} *NEW ORDER RECEIVED* ${WA.bell}`,
    `${WA.rice} *${MILL.fullName}*`,
    "",
    `${WA.bolt} A new order has been placed \u2014 please confirm & arrange delivery.`,
    "",
    `${WA.box} *Order ID:* #${payload.orderId}`,
    `*Customer Mobile:* +91 ${payload.phone}`,
    `*Order Total:* ${formatINR(payload.total)}`,
    payload.paymentId ? `*Payment ID:* ${payload.paymentId}` : null,
    payload.isDemo ? `*Mode:* Demo / Test order` : `*Payment:* ${WA.check} Paid online`,
  ].filter(Boolean) as string[];

  if (payload.address) {
    lines.push("", `${WA.pin} *Deliver to:* ${shortDeliveryAddress(payload.address)}`);
  }

  if (payload.items?.length) {
    lines.push("", "*Order items:*");
    for (const item of payload.items) {
      lines.push(
        `\u2022 ${item.name} (${item.variantLabel}) \u00D7${item.quantity} \u2014 ${formatINR(item.price * item.quantity)}`
      );
    }
  }

  lines.push("", `${WA.bell} Please contact customer and confirm delivery. Thank you!`);
  return lines.join("\n");
}

/** @deprecated use getMillAlertWhatsAppUrl */
export function buildOrderWhatsAppMessage(payload: OrderNotifyPayload): string {
  return buildMillAlertMessage(payload);
}

export function getCustomerWhatsAppUrl(payload: OrderNotifyPayload): string {
  const phone = payload.phone.replace(/\D/g, "").slice(-10);
  const text = buildCustomerConfirmationMessage(payload);
  return buildWhatsAppSendUrl(`91${phone}`, text);
}

export function getMillAlertWhatsAppUrl(payload: OrderNotifyPayload): string {
  const text = buildMillAlertMessage(payload);
  return buildWhatsAppSendUrl(MILL.millAlertWhatsapp, text);
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
