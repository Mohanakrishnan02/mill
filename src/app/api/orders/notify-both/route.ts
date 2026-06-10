import { NextRequest, NextResponse } from "next/server";
import {
  isWhatsAppAutoSendConfigured,
  sendBothOrderNotifications,
} from "@/lib/whatsapp-api";
import type { OrderNotifyPayload } from "@/lib/whatsapp-order";

type NotifyBothBody = OrderNotifyPayload & {
  skipCustomer?: boolean;
  skipMill?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NotifyBothBody;

    if (!body.orderId || !body.phone) {
      return NextResponse.json({ error: "Missing order details" }, { status: 400 });
    }

    const { skipCustomer, skipMill, ...payload } = body;
    const { customer, mill } = await sendBothOrderNotifications(payload, {
      skipCustomer,
      skipMill,
    });

    return NextResponse.json({
      success: true,
      configured: isWhatsAppAutoSendConfigured(),
      customer: {
        sent: customer.sent,
        viaApi: customer.viaApi,
        method: customer.method ?? null,
        error: customer.error ?? null,
      },
      mill: {
        sent: mill.sent,
        viaApi: mill.viaApi,
        method: mill.method ?? null,
        error: mill.error ?? null,
      },
    });
  } catch (error) {
    console.error("Notify both error:", error);
    return NextResponse.json({ error: "Failed to send WhatsApp notifications" }, { status: 500 });
  }
}
