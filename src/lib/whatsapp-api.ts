import { MILL } from "@/lib/mill-config";
import {
  buildCustomerConfirmationMessage,
  buildMillAlertMessage,
  getOrderImageUrls,
  type OrderNotifyPayload,
} from "@/lib/whatsapp-order";

async function whatsAppApiCall(body: Record<string, unknown>): Promise<boolean> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) return false;

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error("WhatsApp API error:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("WhatsApp API request failed:", err);
    return false;
  }
}

/** Send a text message via WhatsApp Cloud API */
export async function sendWhatsAppText(to: string, body: string): Promise<boolean> {
  const digits = to.replace(/\D/g, "");
  return whatsAppApiCall({
    messaging_product: "whatsapp",
    to: digits,
    type: "text",
    text: { preview_url: false, body: body.normalize("NFC") },
  });
}

/** Send an image message via WhatsApp Cloud API */
export async function sendWhatsAppImage(
  to: string,
  imageUrl: string,
  caption?: string
): Promise<boolean> {
  const digits = to.replace(/\D/g, "");
  return whatsAppApiCall({
    messaging_product: "whatsapp",
    to: digits,
    type: "image",
    image: {
      link: imageUrl,
      ...(caption ? { caption: caption.normalize("NFC").slice(0, 1024) } : {}),
    },
  });
}

/** Send logo + product images, then formatted text */
async function sendOrderNotification(
  to: string,
  payload: OrderNotifyPayload,
  buildMessage: (p: OrderNotifyPayload) => string,
  imageCaption: string
): Promise<{ sent: boolean; viaApi: boolean }> {
  const message = buildMessage(payload);
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token) return { sent: false, viaApi: false };

  const { logoUrl, productUrl } = getOrderImageUrls(payload);

  await sendWhatsAppImage(to, logoUrl, `${MILL.fullName} ${imageCaption}`);
  if (productUrl !== logoUrl) {
    const productName = payload.items?.[0]?.name ?? "Your Rice";
    await sendWhatsAppImage(to, productUrl, productName);
  }

  const sent = await sendWhatsAppText(to, message);
  return { sent, viaApi: sent };
}

/** Auto-send customer order confirmation with images + text */
export async function sendCustomerConfirmation(
  payload: OrderNotifyPayload
): Promise<{ sent: boolean; viaApi: boolean }> {
  const phone = payload.phone.replace(/\D/g, "").slice(-10);
  return sendOrderNotification(
    `91${phone}`,
    payload,
    buildCustomerConfirmationMessage,
    "\u2014 Order Confirmed"
  );
}

/** Auto-send new order alert to mill team with images + text */
export async function sendMillTeamAlert(
  payload: OrderNotifyPayload
): Promise<{ sent: boolean; viaApi: boolean }> {
  return sendOrderNotification(
    MILL.millAlertWhatsapp,
    payload,
    buildMillAlertMessage,
    "\u2014 New Order Alert"
  );
}
