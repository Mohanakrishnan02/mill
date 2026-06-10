import { MILL } from "@/lib/mill-config";
import {
  buildCustomerConfirmationMessage,
  buildMillAlertMessage,
  getOrderImageUrls,
  type OrderNotifyPayload,
} from "@/lib/whatsapp-order";

export type SendResult = {
  sent: boolean;
  viaApi: boolean;
  method?: "whatsapp-cloud" | "callmebot";
};

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
      console.error("WhatsApp Cloud API error:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("WhatsApp Cloud API request failed:", err);
    return false;
  }
}

/** CallMeBot — free auto-send after one-time WhatsApp registration */
async function sendViaCallMeBot(
  to: string,
  text: string,
  apiKey: string
): Promise<boolean> {
  const phone = to.replace(/\D/g, "");
  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${phone}` +
    `&text=${encodeURIComponent(text.normalize("NFC"))}` +
    `&apikey=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    const body = await res.text();
    if (!res.ok) {
      console.error("CallMeBot error:", body);
      return false;
    }
    // CallMeBot returns plain text like "Message sent" or error message
    const ok = /sent|success|queued/i.test(body) && !/error|fail|invalid/i.test(body);
    if (!ok) console.error("CallMeBot response:", body);
    return ok;
  } catch (err) {
    console.error("CallMeBot request failed:", err);
    return false;
  }
}

export async function sendWhatsAppText(to: string, body: string): Promise<boolean> {
  const digits = to.replace(/\D/g, "");
  return whatsAppApiCall({
    messaging_product: "whatsapp",
    to: digits,
    type: "text",
    text: { preview_url: false, body: body.normalize("NFC") },
  });
}

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

async function sendViaWhatsAppCloud(
  to: string,
  payload: OrderNotifyPayload,
  buildMessage: (p: OrderNotifyPayload) => string,
  imageCaption: string
): Promise<boolean> {
  if (!process.env.WHATSAPP_ACCESS_TOKEN) return false;

  const message = buildMessage(payload);
  const textOk = await sendWhatsAppText(to, message);
  if (!textOk) return false;

  const { logoUrl, productUrl } = getOrderImageUrls(payload);
  await sendWhatsAppImage(to, logoUrl, `${MILL.fullName} ${imageCaption}`);
  if (productUrl !== logoUrl) {
    const productName = payload.items?.[0]?.name ?? "Your Rice";
    await sendWhatsAppImage(to, productUrl, productName);
  }

  return true;
}

async function sendOrderNotification(
  to: string,
  payload: OrderNotifyPayload,
  buildMessage: (p: OrderNotifyPayload) => string,
  imageCaption: string,
  callMeBotKey?: string
): Promise<SendResult> {
  const message = buildMessage(payload);

  // 1. WhatsApp Cloud API — images + text
  const cloudFull = await sendViaWhatsAppCloud(to, payload, buildMessage, imageCaption);
  if (cloudFull) return { sent: true, viaApi: true, method: "whatsapp-cloud" };

  // 2. WhatsApp Cloud API — text only (more reliable for new customers)
  if (process.env.WHATSAPP_ACCESS_TOKEN) {
    const cloudText = await sendWhatsAppText(to, message);
    if (cloudText) return { sent: true, viaApi: true, method: "whatsapp-cloud" };
  }

  // 3. CallMeBot fallback (recipient must register once)
  if (callMeBotKey) {
    const botSent = await sendViaCallMeBot(to, message, callMeBotKey);
    if (botSent) return { sent: true, viaApi: true, method: "callmebot" };
  }

  return { sent: false, viaApi: false };
}

export async function sendCustomerConfirmation(payload: OrderNotifyPayload): Promise<SendResult> {
  const phone = payload.phone.replace(/\D/g, "").slice(-10);
  return sendOrderNotification(
    `91${phone}`,
    payload,
    buildCustomerConfirmationMessage,
    "\u2014 Order Confirmed"
  );
}

export async function sendMillTeamAlert(payload: OrderNotifyPayload): Promise<SendResult> {
  return sendOrderNotification(
    MILL.millAlertWhatsapp,
    payload,
    buildMillAlertMessage,
    "\u2014 New Order Alert",
    process.env.CALLMEBOT_MILL_API_KEY
  );
}

export type BothNotifyResult = {
  customer: SendResult;
  mill: SendResult;
};

/** Send customer confirmation + mill alert in parallel on every order */
export async function sendBothOrderNotifications(
  payload: OrderNotifyPayload,
  options?: { skipCustomer?: boolean; skipMill?: boolean }
): Promise<BothNotifyResult> {
  const [customer, mill] = await Promise.all([
    options?.skipCustomer
      ? Promise.resolve({ sent: true, viaApi: true } satisfies SendResult)
      : sendCustomerConfirmation(payload),
    options?.skipMill
      ? Promise.resolve({ sent: true, viaApi: true } satisfies SendResult)
      : sendMillTeamAlert(payload),
  ]);
  return { customer, mill };
}
