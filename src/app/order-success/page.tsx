"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle, MessageCircle, Bell } from "lucide-react";
import { formatINR } from "@/lib/format";
import { MILL } from "@/lib/mill-config";
import { IMAGES } from "@/lib/images";
import {
  getCustomerWhatsAppUrl,
  getMillAlertWhatsAppUrl,
  loadOrderForWhatsApp,
  WA_CUSTOMER_SENT_KEY,
  WA_MILL_SENT_KEY,
  buildCustomerConfirmationMessage,
  buildMillAlertMessage,
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
  const millAlertAuto = params.get("millAlert") === "1";

  const [customerSent, setCustomerSent] = useState(false);
  const [millSent, setMillSent] = useState(millAlertAuto);
  const [millAutoViaApi, setMillAutoViaApi] = useState(millAlertAuto);
  const [customerAutoViaApi, setCustomerAutoViaApi] = useState(false);
  const [showCustomerCard, setShowCustomerCard] = useState(false);
  const [showMillCard, setShowMillCard] = useState(false);

  const stored = loadOrderForWhatsApp();
  const notifyPayload: OrderNotifyPayload = stored ?? {
    orderId,
    total,
    phone,
    paymentId: paymentId ?? undefined,
    isDemo,
  };

  const customerWaUrl = getCustomerWhatsAppUrl(notifyPayload);
  const millWaUrl = getMillAlertWhatsAppUrl(notifyPayload);
  const customerPreview = buildCustomerConfirmationMessage(notifyPayload);
  const millPreview = buildMillAlertMessage(notifyPayload);
  const productImageSrc = notifyPayload.items?.[0]?.image || IMAGES.logo;

  useEffect(() => {
    const customerAlready = sessionStorage.getItem(WA_CUSTOMER_SENT_KEY);
    const millAlready = sessionStorage.getItem(WA_MILL_SENT_KEY) || millAlertAuto;

    const t1 = setTimeout(() => setShowCustomerCard(true), 400);
    const t3 = setTimeout(() => setShowMillCard(true), 1800);

    const sendCustomerConfirmation = async () => {
      if (customerAlready || !phone) return;
      try {
        const res = await fetch("/api/orders/notify-customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notifyPayload),
        });
        const data = await res.json();
        if (data.sent) {
          setCustomerSent(true);
          setCustomerAutoViaApi(true);
          sessionStorage.setItem(WA_CUSTOMER_SENT_KEY, "1");
          return;
        }
        if (data.fallbackUrl) {
          window.open(data.fallbackUrl, "_blank", "noopener,noreferrer");
          setCustomerSent(true);
          sessionStorage.setItem(WA_CUSTOMER_SENT_KEY, "1");
        }
      } catch {
        window.open(customerWaUrl, "_blank", "noopener,noreferrer");
        setCustomerSent(true);
        sessionStorage.setItem(WA_CUSTOMER_SENT_KEY, "1");
      }
    };

    const sendMillAlert = async () => {
      if (millAlready) {
        setMillSent(true);
        return;
      }
      try {
        const res = await fetch("/api/orders/notify-mill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notifyPayload),
        });
        const data = await res.json();
        if (data.sent) {
          setMillSent(true);
          setMillAutoViaApi(true);
          sessionStorage.setItem(WA_MILL_SENT_KEY, "1");
          return;
        }
        if (data.fallbackUrl) {
          window.open(data.fallbackUrl, "_blank", "noopener,noreferrer");
          setMillSent(true);
          sessionStorage.setItem(WA_MILL_SENT_KEY, "1");
        }
      } catch {
        window.open(millWaUrl, "_blank", "noopener,noreferrer");
        setMillSent(true);
        sessionStorage.setItem(WA_MILL_SENT_KEY, "1");
      }
    };

    const t2 = setTimeout(() => sendCustomerConfirmation(), 1200);
    const t4 = setTimeout(() => {
      if (!millAlertAuto) sendMillAlert();
      else sessionStorage.setItem(WA_MILL_SENT_KEY, "1");
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [customerWaUrl, millWaUrl, phone, millAlertAuto, orderId]);

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <div className="text-center">
        <div className="order-success-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#2e7d32] bg-green-50">
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
      </div>

      {/* Customer WhatsApp confirmation */}
      {showCustomerCard && phone && (
        <div className="wa-notify-slide mt-8 overflow-hidden rounded-2xl border border-[#25d366]/30 bg-gradient-to-br from-[#f0fff4] to-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-[#25d366]/20 bg-[#25d366]/10 px-4 py-2">
            <MessageCircle className="h-4 w-4 text-[#25d366]" />
            <p className="text-xs font-bold text-[#128C7E]">
              {customerAutoViaApi ? "Confirmation auto-sent to your mobile" : "Confirmation sent to your mobile"}
            </p>
            {customerSent && (
              <span className="ml-auto rounded-full bg-[#25d366] px-2 py-0.5 text-[10px] font-bold text-white wa-pulse-dot">
                Sent ✓
              </span>
            )}
          </div>
          <div className="flex gap-4 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-2 ring-[#25d366]/40 shadow-md">
              <Image src={productImageSrc} alt="" fill className="object-cover" sizes="80px" />
            </div>
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-[#25d366]/30 -ml-2">
              <Image src={IMAGES.logo} alt="" fill className="object-cover" sizes="56px" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-stone-800">{MILL.fullName}</p>
              <p className="mt-1 text-sm font-semibold text-[#2e7d32]">✅ Order Confirmed! 🎉</p>
              <p className="mt-1 text-xs text-stone-500">
                WhatsApp → <strong>+91 {phone}</strong>
              </p>
              <p className="mt-1 text-xs text-stone-600">
                Order #{orderId} · {formatINR(total)}
              </p>
            </div>
          </div>
          <div className="wa-msg-shimmer mx-4 mb-4 rounded-lg bg-[#dcf8c6] px-3 py-2.5 text-left text-xs leading-relaxed text-stone-700 whitespace-pre-line">
            {customerPreview}
          </div>
        </div>
      )}

      {/* Mill team alert */}
      {showMillCard && (
        <div className="wa-notify-slide mt-4 overflow-hidden rounded-2xl border border-[#e07b00]/30 bg-gradient-to-br from-[#fff8f0] to-white shadow-lg" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-2 border-b border-[#e07b00]/20 bg-[#e07b00]/10 px-4 py-2">
            <Bell className="h-4 w-4 text-[#e07b00] wa-bell-ring" />
            <p className="text-xs font-bold text-[#e07b00]">
              {millAutoViaApi ? "Auto-sent to mill team" : "Alert sent to mill team"}
            </p>
            {millSent && (
              <span className="ml-auto rounded-full bg-[#e07b00] px-2 py-0.5 text-[10px] font-bold text-white wa-pulse-dot">
                Alert ✓
              </span>
            )}
          </div>
          <div className="flex gap-4 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-2 ring-[#e07b00]/40 shadow-md">
              <Image src={productImageSrc} alt="" fill className="object-cover" sizes="80px" />
            </div>
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-[#e07b00]/30 -ml-2">
              <Image src={IMAGES.logo} alt="" fill className="object-cover" sizes="56px" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-[#e07b00]">🚨 NEW ORDER RECEIVED 🔔</p>
              <p className="mt-1 text-sm font-semibold text-stone-800">{MILL.fullName}</p>
              <p className="mt-1 text-xs text-stone-500">
                {millAutoViaApi ? "Sent automatically" : "WhatsApp"} → <strong>{MILL.millAlertDisplay}</strong>
              </p>
              <p className="mt-1 text-xs text-stone-600">
                Customer +91 {phone || "—"} · {formatINR(total)}
              </p>
            </div>
          </div>
          <div className="wa-msg-shimmer mx-4 mb-4 rounded-lg bg-[#fff3e0] px-3 py-2.5 text-left text-xs leading-relaxed text-stone-700 whitespace-pre-line">
            {millPreview}
          </div>
        </div>
      )}

      {(awb || tracking) && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-left text-sm">
          <p className="font-bold text-[#2874f0]">🚚 Ekart Logistics</p>
          {awb && <p className="mt-1 text-stone-600">AWB / Tracking: <strong>{awb}</strong></p>}
          {tracking && (
            <a href={tracking} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-bold text-[#2874f0] hover:underline">
              Track your shipment →
            </a>
          )}
        </div>
      )}

      <div className="mt-6 rounded-lg border border-stone-200 bg-white p-5 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-stone-500">Amount</span>
          <span className="font-bold">{formatINR(total)}</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="text-stone-500">Payment</span>
          <span className="font-bold text-[#2e7d32]">{isDemo ? "Demo / Pending" : "Paid Online ✓"}</span>
        </div>
        {paymentId && (
          <div className="mt-2 flex justify-between">
            <span className="text-stone-500">Payment ID</span>
            <span className="font-mono text-[10px]">{paymentId}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {phone && (
          <a href={customerWaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded bg-[#25d366] py-3 text-sm font-extrabold text-white">
            WhatsApp — Your Confirmation
          </a>
        )}
        <p className="text-center text-xs text-stone-500">
          Mill team alert sent automatically to {MILL.millAlertDisplay}
        </p>
        <Link href="/products" className="rounded bg-[#e07b00] py-3 text-center text-sm font-bold text-white">
          Continue Shopping
        </Link>
        <Link href="/" className="rounded border border-stone-200 py-2.5 text-center text-sm font-semibold text-stone-700">
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
