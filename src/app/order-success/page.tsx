"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle } from "lucide-react";
import { formatINR } from "@/lib/format";
import { MILL } from "@/lib/mill-config";

function OrderSuccessContent() {
  const params = useSearchParams();
  const total = Number(params.get("total") || 0);
  const paymentId = params.get("paymentId");
  const orderId = params.get("orderId") || "JV" + Date.now().toString().slice(-8).toUpperCase();
  const phone = params.get("phone") || "";
  const isDemo = params.get("demo") === "1";

  const waMsg = encodeURIComponent(
    `Hello ${MILL.fullName}!\n\nNew Order:\nOrder ID: #${orderId}\nTotal: ${formatINR(total)}\nMobile: +91 ${phone}\n\nPlease confirm. Thank you!`
  );
  const waUrl = `https://wa.me/${MILL.whatsapp}?text=${waMsg}`;

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
      <p className="mt-3 inline-block rounded bg-green-50 px-4 py-2 text-lg font-extrabold tracking-wide text-[#2e7d32]">
        Order #{orderId}
      </p>
      {phone && (
        <p className="mt-2 text-xs text-stone-500">
          We will contact <strong>+91 {phone}</strong> to confirm delivery.
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
          WhatsApp — Share Order
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
