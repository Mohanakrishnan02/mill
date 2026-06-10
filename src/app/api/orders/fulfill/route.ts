import { NextRequest, NextResponse } from "next/server";
import { sendBothOrderNotifications } from "@/lib/whatsapp-api";
import { createEkartShipment } from "@/lib/ekart/client";
import {
  deliveryProviderLabel,
  selectDeliveryProvider,
} from "@/lib/delivery-config";
import type { CartItem, ShippingAddress } from "@/types";

type FulfillBody = {
  orderId: string;
  address: ShippingAddress;
  items: CartItem[];
  totalKg: number;
  total: number;
  paymentId?: string;
  deliveryDistanceKm?: number | null;
  isDemo?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FulfillBody;

    if (!body.orderId || !body.address || !body.items?.length) {
      return NextResponse.json({ error: "Missing order details" }, { status: 400 });
    }

    const notifyPayload = {
      orderId: body.orderId,
      total: body.total,
      phone: body.address.phone,
      paymentId: body.paymentId,
      isDemo: body.isDemo,
      address: body.address,
      items: body.items,
    };

    // Auto-send both WhatsApp messages — customer confirmation + mill team alert
    const { customer: customerNotify, mill: millAlert } =
      await sendBothOrderNotifications(notifyPayload);

    const provider = selectDeliveryProvider(
      body.deliveryDistanceKm ?? null,
      body.totalKg,
    );

    if (provider === "local") {
      return NextResponse.json({
        success: true,
        provider: "local",
        providerLabel: deliveryProviderLabel("local"),
        message: "Order confirmed. Our team will deliver from Melur mill.",
        customerConfirmSent: customerNotify.sent,
        customerConfirmViaApi: customerNotify.viaApi,
        millAlertSent: millAlert.sent,
        millAlertViaApi: millAlert.viaApi,
      });
    }

    const shipment = await createEkartShipment({
      orderId: body.orderId,
      address: body.address,
      items: body.items.map((i) => ({
        name: i.name,
        variantLabel: i.variantLabel,
        quantity: i.quantity,
        weightKg: i.weightKg,
      })),
      totalKg: body.totalKg,
      totalAmount: body.total,
      paymentId: body.paymentId,
    });

    return NextResponse.json({
      ...shipment,
      providerLabel: deliveryProviderLabel(shipment.provider === "pending" ? "ekart" : "ekart"),
      customerConfirmSent: customerNotify.sent,
      customerConfirmViaApi: customerNotify.viaApi,
      millAlertSent: millAlert.sent,
      millAlertViaApi: millAlert.viaApi,
    });
  } catch (error) {
    console.error("Order fulfill error:", error);
    return NextResponse.json({ error: "Failed to process delivery" }, { status: 500 });
  }
}
