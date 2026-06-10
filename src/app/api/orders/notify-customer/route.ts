import { NextRequest, NextResponse } from "next/server";
import { sendCustomerConfirmation } from "@/lib/whatsapp-api";
import { getCustomerWhatsAppUrl, type OrderNotifyPayload } from "@/lib/whatsapp-order";

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as OrderNotifyPayload;

    if (!payload.orderId || !payload.phone) {
      return NextResponse.json({ error: "Missing order details" }, { status: 400 });
    }

    const result = await sendCustomerConfirmation(payload);

    return NextResponse.json({
      success: true,
      sent: result.sent,
      viaApi: result.viaApi,
      method: result.method ?? null,
      error: result.error ?? null,
      manualUrl: result.sent ? null : getCustomerWhatsAppUrl(payload),
    });
  } catch (error) {
    console.error("Customer notify error:", error);
    return NextResponse.json({ error: "Failed to notify customer" }, { status: 500 });
  }
}
