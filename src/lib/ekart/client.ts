import { MILL } from "@/lib/mill-config";
import { EKART, isEkartConfigured } from "@/lib/delivery-config";
import type { CartItem, ShippingAddress } from "@/types";

export type ShipmentRequest = {
  orderId: string;
  address: ShippingAddress;
  items: Pick<CartItem, "name" | "variantLabel" | "quantity" | "weightKg">[];
  totalKg: number;
  totalAmount: number;
  paymentId?: string;
};

export type ShipmentResult = {
  success: boolean;
  provider: "ekart" | "local" | "pending";
  awb?: string;
  trackingUrl?: string;
  message: string;
  raw?: unknown;
};

function buildShipmentPayload(req: ShipmentRequest) {
  const description = req.items
    .map((i) => `${i.name} ${i.variantLabel} ×${i.quantity}`)
    .join(", ");

  return {
    merchant_reference_id: req.orderId,
    shipment_type: req.totalKg >= EKART.largeShipmentKgThreshold ? "LARGE" : "EXPRESS",
    payment_mode: "PREPAID",
    pickup: {
      name: MILL.fullName,
      phone: MILL.phone,
      address: MILL.address,
      city: MILL.city,
      state: MILL.state,
      pincode: MILL.pincode,
    },
    drop: {
      name: req.address.fullName,
      phone: req.address.phone,
      email: req.address.email || undefined,
      address_line1: req.address.addressLine1,
      address_line2: req.address.addressLine2 || undefined,
      city: req.address.city,
      state: req.address.state,
      pincode: req.address.pincode,
    },
    package: {
      weight_kg: Math.max(req.totalKg, 1),
      description: description.slice(0, 200),
      declared_value: req.totalAmount,
    },
  };
}

/** Create Ekart shipment — calls live API when credentials are set, else queues for manual booking */
export async function createEkartShipment(req: ShipmentRequest): Promise<ShipmentResult> {
  if (!isEkartConfigured()) {
    return {
      success: true,
      provider: "pending",
      message:
        "Order saved. Ekart shipment will be booked once merchant API credentials are configured.",
    };
  }

  const baseUrl = process.env.EKART_API_BASE_URL!.replace(/\/$/, "");
  const payload = buildShipmentPayload(req);

  try {
    const res = await fetch(`${baseUrl}/v1/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.EKART_AUTH_TOKEN!,
        "X-Merchant-Code": process.env.EKART_MERCHANT_CODE!,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Ekart API error:", data);
      return {
        success: false,
        provider: "ekart",
        message: "Ekart booking failed — order saved for manual dispatch.",
        raw: data,
      };
    }

    const awb =
      (data as { awb?: string }).awb ||
      (data as { tracking_id?: string }).tracking_id ||
      (data as { shipment_id?: string }).shipment_id;

    return {
      success: true,
      provider: "ekart",
      awb,
      trackingUrl: awb ? `${EKART.trackingBaseUrl}${awb}` : undefined,
      message: "Shipment booked with Ekart Logistics.",
      raw: data,
    };
  } catch (err) {
    console.error("Ekart request failed:", err);
    return {
      success: false,
      provider: "ekart",
      message: "Could not reach Ekart API — order saved for manual booking.",
    };
  }
}

export async function trackEkartShipment(awb: string): Promise<{ status: string; raw?: unknown }> {
  if (!isEkartConfigured()) {
    return { status: "pending_configuration" };
  }

  const baseUrl = process.env.EKART_API_BASE_URL!.replace(/\/$/, "");
  const res = await fetch(`${baseUrl}/v1/shipments/${encodeURIComponent(awb)}/track`, {
    headers: {
      Authorization: process.env.EKART_AUTH_TOKEN!,
      "X-Merchant-Code": process.env.EKART_MERCHANT_CODE!,
    },
  });

  const data = await res.json().catch(() => ({}));
  return {
    status: (data as { status?: string }).status || "unknown",
    raw: data,
  };
}
