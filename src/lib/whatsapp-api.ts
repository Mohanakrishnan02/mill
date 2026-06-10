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
  method?: "whatsapp-cloud" | "green-api" | "callmebot";
  error?: string;
};

function toWhatsAppDigits(to: string): string {
  return to.replace(/\D/g, "");
}

function toGreenApiChatId(to: string): string {
  const digits = toWhatsAppDigits(to);
  const normalized = digits.length === 10 ? `91${digits}` : digits;
  return `${normalized}@c.us`;
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(fn: () => Promise<boolean>, attempts = 3, gapMs = 1200): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    if (await fn()) return true;
    if (i < attempts - 1) await delay(gapMs);
  }
  return false;
}

async function whatsAppApiCall(body: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) {
    return { ok: false, error: "WhatsApp Cloud API not configured" };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error("WhatsApp Cloud API error:", text);
      return { ok: false, error: text.slice(0, 200) };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "WhatsApp Cloud API request failed";
    console.error(message, err);
    return { ok: false, error: message };
  }
}

async function sendWhatsAppText(to: string, body: string): Promise<boolean> {
  const digits = toWhatsAppDigits(to);
  const result = await whatsAppApiCall({
    messaging_product: "whatsapp",
    to: digits,
    type: "text",
    text: { preview_url: false, body: body.normalize("NFC") },
  });
  return result.ok;
}

async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  bodyParams: string[]
): Promise<boolean> {
  const digits = toWhatsAppDigits(to);
  const result = await whatsAppApiCall({
    messaging_product: "whatsapp",
    to: digits,
    type: "template",
    template: {
      name: templateName,
      language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "en" },
      components: bodyParams.length
        ? [
            {
              type: "body",
              parameters: bodyParams.map((text) => ({ type: "text", text: text.slice(0, 256) })),
            },
          ]
        : undefined,
    },
  });
  return result.ok;
}

async function sendWhatsAppImage(
  to: string,
  imageUrl: string,
  caption?: string
): Promise<boolean> {
  const digits = toWhatsAppDigits(to);
  const result = await whatsAppApiCall({
    messaging_product: "whatsapp",
    to: digits,
    type: "image",
    image: {
      link: imageUrl,
      ...(caption ? { caption: caption.normalize("NFC").slice(0, 1024) } : {}),
    },
  });
  return result.ok;
}

/** Green API — connect mill WhatsApp once, then auto-send to any customer number */
async function sendViaGreenApi(to: string, text: string): Promise<boolean> {
  const instanceId = process.env.GREEN_API_INSTANCE_ID;
  const token = process.env.GREEN_API_TOKEN;
  if (!instanceId || !token) return false;

  try {
    const res = await fetch(
      `https://api.green-api.com/waInstance${instanceId}/sendMessage/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: toGreenApiChatId(to),
          message: text.normalize("NFC"),
        }),
        cache: "no-store",
      }
    );
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Green API error:", body);
      return false;
    }
    return Boolean(body.idMessage);
  } catch (err) {
    console.error("Green API request failed:", err);
    return false;
  }
}

/** CallMeBot — free auto-send to a pre-registered phone (mill team) */
async function sendViaCallMeBot(to: string, text: string, apiKey: string): Promise<boolean> {
  const phone = toWhatsAppDigits(to);
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
    const ok = /sent|success|queued/i.test(body) && !/error|fail|invalid/i.test(body);
    if (!ok) console.error("CallMeBot response:", body);
    return ok;
  } catch (err) {
    console.error("CallMeBot request failed:", err);
    return false;
  }
}

async function sendViaWhatsAppCloudFull(
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

async function sendViaWhatsAppCloudCustomer(to: string, payload: OrderNotifyPayload): Promise<boolean> {
  const template = process.env.WHATSAPP_ORDER_TEMPLATE;
  if (template) {
    const itemLine = payload.items?.[0]
      ? `${payload.items[0].name} (${payload.items[0].variantLabel})`
      : "Rice order";
    const templateOk = await sendWhatsAppTemplate(to, template, [
      payload.orderId,
      String(payload.total),
      itemLine,
      MILL.phone,
    ]);
    if (templateOk) return true;
  }

  return sendWhatsAppText(to, buildCustomerConfirmationMessage(payload));
}

async function sendOrderNotification(
  to: string,
  payload: OrderNotifyPayload,
  buildMessage: (p: OrderNotifyPayload) => string,
  imageCaption: string,
  options?: { callMeBotKey?: string; isCustomer?: boolean }
): Promise<SendResult> {
  const message = buildMessage(payload);
  const errors: string[] = [];

  const tryCloud = async (): Promise<SendResult | null> => {
    if (!process.env.WHATSAPP_ACCESS_TOKEN) return null;

    if (options?.isCustomer) {
      const customerOk = await withRetry(() => sendViaWhatsAppCloudCustomer(to, payload), 2);
      if (customerOk) return { sent: true, viaApi: true, method: "whatsapp-cloud" };
    } else {
      const fullOk = await withRetry(
        () => sendViaWhatsAppCloudFull(to, payload, buildMessage, imageCaption),
        2
      );
      if (fullOk) return { sent: true, viaApi: true, method: "whatsapp-cloud" };

      const textOk = await withRetry(() => sendWhatsAppText(to, message), 2);
      if (textOk) return { sent: true, viaApi: true, method: "whatsapp-cloud" };
    }

    errors.push("WhatsApp Cloud API send failed");
    return null;
  };

  const tryGreen = async (): Promise<SendResult | null> => {
    if (!process.env.GREEN_API_INSTANCE_ID || !process.env.GREEN_API_TOKEN) return null;
    const greenOk = await withRetry(() => sendViaGreenApi(to, message), 2);
    if (greenOk) return { sent: true, viaApi: true, method: "green-api" };
    errors.push("Green API send failed");
    return null;
  };

  const tryCallMeBot = async (): Promise<SendResult | null> => {
    if (!options?.callMeBotKey) return null;
    const botOk = await withRetry(() => sendViaCallMeBot(to, message, options.callMeBotKey!), 2);
    if (botOk) return { sent: true, viaApi: true, method: "callmebot" };
    errors.push("CallMeBot send failed");
    return null;
  };

  for (const attempt of [tryCloud, tryGreen, tryCallMeBot]) {
    const result = await attempt();
    if (result) return result;
  }

  return {
    sent: false,
    viaApi: false,
    error: errors.join("; ") || "No WhatsApp API configured on server",
  };
}

export async function sendCustomerConfirmation(payload: OrderNotifyPayload): Promise<SendResult> {
  const phone = payload.phone.replace(/\D/g, "").slice(-10);
  return sendOrderNotification(
    `91${phone}`,
    payload,
    buildCustomerConfirmationMessage,
    "\u2014 Order Confirmed",
    { isCustomer: true }
  );
}

export async function sendMillTeamAlert(payload: OrderNotifyPayload): Promise<SendResult> {
  return sendOrderNotification(
    MILL.millAlertWhatsapp,
    payload,
    buildMillAlertMessage,
    "\u2014 New Order Alert",
    { callMeBotKey: process.env.CALLMEBOT_MILL_API_KEY }
  );
}

export type BothNotifyResult = {
  customer: SendResult;
  mill: SendResult;
};

export function isWhatsAppAutoSendConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN ||
      process.env.GREEN_API_INSTANCE_ID ||
      process.env.CALLMEBOT_MILL_API_KEY
  );
}

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
