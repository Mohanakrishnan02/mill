"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { formatINR } from "@/lib/format";
import { MILL } from "@/lib/mill-config";
import {
  getOrderWhatsAppUrl,
  loadOrderForWhatsApp,
  WA_SENT_KEY,
  type OrderNotifyPayload,
} from "@/lib/whatsapp-order";

function OrderSuccessContent() {
  const params = useSearchParams();
  const total = Number(params.get("total") || 0);
  const paymentId = params.get("paymentId");
  const orderId = params.get("orderId") || "JV" + Date.now().toString().slice(-8).toUpperCase();
  const phone = params.get("phone") || "";
  const awb = params.get("awb");
  const tracking = params.get("tracking");
  const isDemo = params.get("demo") === "1";
  const [waOpened, setWaOpened] = useState(false);

  const stored = loadOrderForWhatsApp();
  const notifyPayload: OrderNotifyPayload = stored ?? {
    orderId,
    total,
    phone,
    paymentId: paymentId ?? undefined,
    isDemo,
  };

  const waUrl = getOrderWhatsAppUrl(notifyPayload);

  useEffect(() => {
    if (sessionStorage.getItem(WA_SENT_KEY)) return;
    sessionStorage.setItem(WA_SENT_KEY, "1");
    const timer = setTimeout(() => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
      setWaOpened(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [waUrl]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#2e7d32] bg-green-50">
        <CheckCircle className="h-9 w-9 text-[#2e7d32]" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-[#2e7d32]" style={{ fontFamily: "var(--font-yeseva)" }}>
        Order Placed! 🎉
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        Thank you for ordering from <strong>{MILL.fullName}</strong>, Melur.
      </p>
      {waOpened && (
        <p className="mt-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
          ✅ WhatsApp opened automatically — order details sent to our mill team.
        </p>
      )}
      <p className="mt-3 inline-block rounded bg-green-50 px-4 py-2 text-lg font-extrabold tracking-wide text-[#2e7d32]">
        Order #{orderId}
      </p>
      {phone && (
        <p className="mt-2 text-xs text-stone-500">
          We will contact <strong>+91 {phone}</strong> to confirm delivery.
        </p>
      )}

      {(awb || tracking) && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-left text-sm">
          <p className="font-bold text-[#2874f0]">🚚 Ekart Logistics</p>
          {awb && <p className="mt-1 text-stone-600">AWB / Tracking: <strong>{awb}</strong></p>}
          {tracking && (
            <a
              href={tracking}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-bold text-[#2874f0] hover:underline"
            >
              Track your shipment →
            </a>
          )}
        </div>
      )}

      {!awb && !tracking && (
        <p className="mt-3 text-xs text-stone-500">
          Delivery via Ekart Logistics (Melur hub) or direct mill delivery — tracking shared on WhatsApp.
        </p>
      )}

      <div className="mt-6 rounded-lg border border-stone-200 bg-white p-5 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-stone-500">Amount</span>
          <span className="font-bold">{formatINR(total)}</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="text-stone-500">Payment</span>
          <span className="font-bold text-[#2e7d32]">
            {isDemo ? "Demo / Pending" : "Paid Online ✓"}
          </span>
        </div>
        {paymentId && (
          <div className="mt-2 flex justify-between">
            <span className="text-stone-500">Payment ID</span>
            <span className="font-mono text-[10px]">{paymentId}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded bg-[#25d366] py-3 text-sm font-extrabold text-white"
        >
          WhatsApp — Open Order Message Again
        </a>
        <Link href="/products" className="rounded bg-[#e07b00] py-3 text-sm font-bold text-white">
          Continue Shopping
        </Link>
        <Link href="/" className="rounded border border-stone-200 py-2.5 text-sm font-semibold text-stone-700">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-stone-500">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
