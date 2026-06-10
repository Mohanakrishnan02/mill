import { MILL } from "@/lib/mill-config";
import { buildMillAlertMessage, type OrderNotifyPayload } from "@/lib/whatsapp-order";

/** Server-side WhatsApp Cloud API send (requires env vars on Vercel) */
export async function sendWhatsAppText(to: string, body: string): Promise<boolean> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) return false;

  const digits = to.replace(/\D/g, "");

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: digits,
        type: "text",
        text: { preview_url: true, body: body.normalize("NFC") },
      }),
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

/** Auto-send new order alert to mill team WhatsApp */
export async function sendMillTeamAlert(
  payload: OrderNotifyPayload
): Promise<{ sent: boolean; viaApi: boolean }> {
  const message = buildMillAlertMessage(payload);
  const sent = await sendWhatsAppText(MILL.millAlertWhatsapp, message);
  return { sent, viaApi: sent };
}
