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
  buildCustomerConfirmationMessage,
  buildMillAlertMessage,
  type OrderNotifyPayload,
} from "@/lib/whatsapp-order";

function WhatsAppTextPreview({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`text-left text-xs leading-relaxed text-stone-700 ${className}`}>
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        const parts = line.split(/(\*[^*]+\*|_[^_]+_)/g);
        return (
          <p key={i} className="whitespace-pre-wrap">
            {parts.map((part, j) => {
              if (part.startsWith("*") && part.endsWith("*")) {
                return <strong key={j}>{part.slice(1, -1)}</strong>;
              }
              if (part.startsWith("_") && part.endsWith("_")) {
                return <em key={j} className="text-stone-500">{part.slice(1, -1)}</em>;
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

function OrderSuccessContent() {
  const params = useSearchParams();
  const total = Number(params.get("total") || 0);
  const paymentId = params.get("paymentId");
  const orderId = params.get("orderId") || "JV" + Date.now().toString().slice(-8).toUpperCase();
  const phone = params.get("phone") || "";
  const awb = params.get("awb");
  const tracking = params.get("tracking");
  const isDemo = params.get("demo") === "1";
  const customerViaApiFromFulfill = params.get("customerViaApi") === "1";
  const millViaApiFromFulfill = params.get("millViaApi") === "1";

  const [customerSent, setCustomerSent] = useState(false);
  const [millSent, setMillSent] = useState(false);
  const [millAutoViaApi, setMillAutoViaApi] = useState(false);
  const [customerAutoViaApi, setCustomerAutoViaApi] = useState(false);
  const [showCustomerCard, setShowCustomerCard] = useState(false);
  const [showMillCard, setShowMillCard] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendAttempt, setSendAttempt] = useState(0);

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
    const customerSentKey = `jv_wa_customer_${orderId}`;
    const millSentKey = `jv_wa_mill_${orderId}`;

    const t1 = setTimeout(() => setShowCustomerCard(true), 400);
    const t3 = setTimeout(() => setShowMillCard(true), 1200);

    const sendBothWhatsAppMessages = async (attempt = 1) => {
      if (!phone) return;

      const customerAlready =
        sessionStorage.getItem(customerSentKey) === "api" || customerViaApiFromFulfill;
      const millAlready = sessionStorage.getItem(millSentKey) === "api" || millViaApiFromFulfill;

      if (customerAlready) {
        setCustomerSent(true);
        setCustomerAutoViaApi(true);
      }
      if (millAlready) {
        setMillSent(true);
        setMillAutoViaApi(true);
      }
      if (customerAlready && millAlready) return;

      setSending(true);
      setSendAttempt(attempt);

      try {
        const res = await fetch("/api/orders/notify-both", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...notifyPayload,
            skipCustomer: customerAlready,
            skipMill: millAlready,
          }),
        });
        const data = await res.json();

        const customerOk = customerAlready || Boolean(data.customer?.sent && data.customer?.viaApi);
        const millOk = millAlready || Boolean(data.mill?.sent && data.mill?.viaApi);

        if (data.customer?.sent && data.customer?.viaApi) {
          setCustomerSent(true);
          setCustomerAutoViaApi(true);
          sessionStorage.setItem(customerSentKey, "api");
        }

        if (data.mill?.sent && data.mill?.viaApi) {
          setMillSent(true);
          setMillAutoViaApi(true);
          sessionStorage.setItem(millSentKey, "api");
        }

        if (customerOk && millOk) {
          setSending(false);
          return;
        }

        if (attempt < 3) {
          setTimeout(() => sendBothWhatsAppMessages(attempt + 1), 2500);
          return;
        }
        setSending(false);
      } catch {
        if (attempt < 3) {
          setTimeout(() => sendBothWhatsAppMessages(attempt + 1), 2500);
        } else {
          setSending(false);
        }
      }
    };

    const t2 = setTimeout(() => sendBothWhatsAppMessages(1), 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [
    customerWaUrl,
    millWaUrl,
    phone,
    customerViaApiFromFulfill,
    millViaApiFromFulfill,
    orderId,
    notifyPayload.orderId,
    notifyPayload.phone,
    notifyPayload.total,
    notifyPayload.paymentId,
    notifyPayload.isDemo,
  ]);

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <div className="text-center">
        <div className="order-success-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#2F6B3A] bg-[#E8F5EE]">
          <CheckCircle className="h-9 w-9 text-[#2F6B3A]" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-[#2F6B3A]" style={{ fontFamily: "var(--font-yeseva)" }}>
          Order Placed! 🎉
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Thank you for ordering from <strong>{MILL.fullName}</strong>, Melur.
        </p>
        <p className="mt-3 inline-block rounded bg-[#E8F5EE] px-4 py-2 text-lg font-extrabold tracking-wide text-[#2F6B3A]">
          Order #{orderId}
        </p>
      </div>

      {/* Customer WhatsApp confirmation */}
      {showCustomerCard && phone && (
        <div className="wa-notify-slide mt-8 overflow-hidden rounded-2xl border border-[#25d366]/30 bg-gradient-to-br from-[#f0fff4] to-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-[#25d366]/20 bg-[#25d366]/10 px-4 py-2">
            <MessageCircle className="h-4 w-4 text-[#25d366]" />
            <p className="text-xs font-bold text-[#128C7E]">
              {sending && !customerAutoViaApi
                ? "Sending confirmation to your mobile…"
                : customerAutoViaApi
                  ? "Confirmation auto-sent to your mobile"
                  : "Customer confirmation"}
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
              <p className="mt-1 text-sm font-semibold text-[#2F6B3A]">✅ Order Confirmed! 🎉</p>
              <p className="mt-1 text-xs text-stone-500">
                WhatsApp → <strong>+91 {phone}</strong>
              </p>
              <p className="mt-1 text-xs text-stone-600">
                Order #{orderId} · {formatINR(total)}
              </p>
            </div>
          </div>
          <div className="wa-msg-shimmer mx-4 mb-4 rounded-lg bg-[#dcf8c6] px-3 py-2.5">
            <WhatsAppTextPreview text={customerPreview} />
          </div>
        </div>
      )}

      {/* Mill team alert */}
      {showMillCard && (
        <div className="wa-notify-slide mt-4 overflow-hidden rounded-2xl border border-[#D4A017]/30 bg-gradient-to-br from-[#FAF6EB] to-white shadow-lg" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-2 border-b border-[#D4A017]/20 bg-[#D4A017]/10 px-4 py-2">
            <Bell className="h-4 w-4 text-[#D4A017] wa-bell-ring" />
            <p className="text-xs font-bold text-[#D4A017]">
              {sending && !millAutoViaApi
                ? "Sending alert to mill team…"
                : millAutoViaApi
                  ? "Auto-sent to mill team"
                  : "Mill team alert"}
            </p>
            {millSent && (
              <span className="ml-auto rounded-full bg-[#D4A017] px-2 py-0.5 text-[10px] font-bold text-white wa-pulse-dot">
                Alert ✓
              </span>
            )}
          </div>
          <div className="flex gap-4 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-2 ring-[#D4A017]/40 shadow-md">
              <Image src={productImageSrc} alt="" fill className="object-cover" sizes="80px" />
            </div>
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-[#D4A017]/30 -ml-2">
              <Image src={IMAGES.logo} alt="" fill className="object-cover" sizes="56px" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-[#D4A017]">🚨 NEW ORDER RECEIVED 🔔</p>
              <p className="mt-1 text-sm font-semibold text-stone-800">{MILL.fullName}</p>
              <p className="mt-1 text-xs text-stone-500">
                {millAutoViaApi ? "Sent automatically" : "WhatsApp"} → <strong>{MILL.millAlertDisplay}</strong>
              </p>
              <p className="mt-1 text-xs text-stone-600">
                Customer +91 {phone || "—"} · {formatINR(total)}
              </p>
            </div>
          </div>
          <div className="wa-msg-shimmer mx-4 mb-4 rounded-lg bg-[#F5E9C0] px-3 py-2.5">
            <WhatsAppTextPreview text={millPreview} />
          </div>
        </div>
      )}

      {(awb || tracking) && (
        <div className="mt-6 rounded-lg border border-[#2F6B3A]/25 bg-[#E8F5EE] p-4 text-left text-sm">
          <p className="font-bold text-[#2F6B3A]">🚚 Ekart Logistics</p>
          {awb && <p className="mt-1 text-stone-600">AWB / Tracking: <strong>{awb}</strong></p>}
          {tracking && (
            <a href={tracking} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-bold text-[#2F6B3A] hover:underline">
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
          <span className="font-bold text-[#2F6B3A]">{isDemo ? "Demo / Pending" : "Paid Online ✓"}</span>
        </div>
        {paymentId && (
          <div className="mt-2 flex justify-between">
            <span className="text-stone-500">Payment ID</span>
            <span className="font-mono text-[10px]">{paymentId}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {sending && (
          <p className="rounded-lg border border-stone-200 bg-white py-2.5 text-center text-xs text-stone-600">
            Sending WhatsApp messages automatically… (attempt {sendAttempt}/3)
          </p>
        )}
        {phone && customerAutoViaApi && (
          <p className="rounded-lg border border-[#25d366]/30 bg-[#f0fff4] py-2.5 text-center text-xs font-semibold text-[#128C7E]">
            Confirmation auto-sent to +91 {phone}
          </p>
        )}
        {millAutoViaApi && (
          <p className="rounded-lg border border-[#D4A017]/30 bg-[#FAF6EB] py-2.5 text-center text-xs font-semibold text-[#D4A017]">
            Mill alert auto-sent to {MILL.millAlertDisplay}
          </p>
        )}
        {!sending && phone && !customerAutoViaApi && (
          <a href={customerWaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded border border-[#25d366] bg-white py-2.5 text-sm font-semibold text-[#128C7E]">
            Manual: Send confirmation to +91 {phone}
          </a>
        )}
        {!sending && !millAutoViaApi && (
          <a href={millWaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded border border-[#D4A017] bg-white py-2.5 text-sm font-semibold text-[#D4A017]">
            Manual: Send mill alert to {MILL.millAlertDisplay}
          </a>
        )}
        <Link href="/products" className="rounded bg-[#D4A017] py-3 text-center text-sm font-bold text-[#14261C]">
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
