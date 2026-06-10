import { NextRequest, NextResponse } from "next/server";
import { sendCustomerConfirmation, sendMillTeamAlert } from "@/lib/whatsapp-api";
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

    // Send WhatsApp notifications in parallel — customer + mill team
    const [customerNotify, millAlert] = await Promise.all([
      sendCustomerConfirmation(notifyPayload),
      sendMillTeamAlert(notifyPayload),
    ]);

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
        millAlertSent: millAlert.sent,
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
      millAlertSent: millAlert.sent,
    });
  } catch (error) {
    console.error("Order fulfill error:", error);
    return NextResponse.json({ error: "Failed to process delivery" }, { status: 500 });
  }
}
