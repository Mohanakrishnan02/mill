import { NextRequest, NextResponse } from "next/server";
import { sendMillTeamAlert } from "@/lib/whatsapp-api";
import { getMillAlertWhatsAppUrl, type OrderNotifyPayload } from "@/lib/whatsapp-order";

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as OrderNotifyPayload;

    if (!payload.orderId || !payload.phone) {
      return NextResponse.json({ error: "Missing order details" }, { status: 400 });
    }

    const result = await sendMillTeamAlert(payload);

    return NextResponse.json({
      success: true,
      sent: result.sent,
      viaApi: result.viaApi,
      fallbackUrl: result.sent ? null : getMillAlertWhatsAppUrl(payload),
    });
  } catch (error) {
    console.error("Mill notify error:", error);
    return NextResponse.json({ error: "Failed to notify mill team" }, { status: 500 });
  }
}
