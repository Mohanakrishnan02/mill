"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PriceSummary } from "@/components/PriceSummary";
import { loadRazorpayScript } from "@/lib/razorpay-client";
import { formatINR } from "@/lib/format";
import { MILL, DELIVERY } from "@/lib/mill-config";
import { distanceFromMill } from "@/lib/shipping";
import { reverseGeocodePincode } from "@/lib/geocode";
import { GoogleAddressInput } from "@/components/GoogleAddressInput";
import { saveOrderForWhatsApp } from "@/lib/whatsapp-order";
import { ShippingAddress } from "@/types";
import { OtpEntryModal, OtpSuccessModal } from "@/components/OtpModals";
import type { RazorpaySuccessResponse } from "@/types/razorpay";

type NominatimResult = { display_name: string; lat: string; lon: string };

const emptyAddress: ShippingAddress = {
  fullName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "Madurai",
  state: "Tamil Nadu",
  pincode: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, summary, clearCart, isHydrated, setDeliveryDistanceKm, deliveryDistanceKm } = useCart();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [genOtp, setGenOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [addrSuggestions, setAddrSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addrTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateField = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const applyDistance = useCallback(
    (lat: number, lng: number) => {
      const d = distanceFromMill(lat, lng);
      setDeliveryDistanceKm(d);
    },
    [setDeliveryDistanceKm]
  );

  useEffect(() => {
    return () => setDeliveryDistanceKm(null);
  }, [setDeliveryDistanceKm]);

  const searchAddress = (q: string) => {
    if (addrTimer.current) clearTimeout(addrTimer.current);
    if (q.length < 4) {
      setAddrSuggestions([]);
      return;
    }
    addrTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ", Tamil Nadu, India")}&format=json&limit=6`
        );
        const data: NominatimResult[] = await res.json();
        setAddrSuggestions(data);
        setShowSuggestions(true);
      } catch {
        setAddrSuggestions([]);
      }
    }, 450);
  };

  const pickSuggestion = async (s: NominatimResult) => {
    updateField("addressLine1", s.display_name.split(",").slice(0, 3).join(", ").trim());
    const lat = parseFloat(s.lat);
    const lng = parseFloat(s.lon);
    applyDistance(lat, lng);

    const geo = await reverseGeocodePincode(lat, lng);
    if (geo.pincode) updateField("pincode", geo.pincode);
    if (geo.city) updateField("city", geo.city);
    if (geo.state) updateField("state", geo.state);

    setShowSuggestions(false);
  };

  const handleGooglePlace = async (place: {
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  }) => {
    updateField("addressLine1", place.addressLine1);
    if (place.city) updateField("city", place.city);
    if (place.state) updateField("state", place.state);
    if (place.pincode) updateField("pincode", place.pincode);
    applyDistance(place.lat, place.lng);
    setShowSuggestions(false);
  };

  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const sendOtp = () => {
    if (!/^\d{10}$/.test(address.phone)) {
      alert("Enter valid 10-digit mobile number.");
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGenOtp(code);
    setOtpSent(true);
    setShowOtpModal(true);
  };

  const handleOtpSubmit = (otp: string) => {
    if (otp !== genOtp) return false;
    setOtpVerified(true);
    setShowOtpModal(false);
    setShowVerifiedModal(true);
    return true;
  };

  const validateStep1 = () => {
    if (!address.fullName.trim()) {
      alert("Enter your name.");
      return false;
    }
    if (!/^\d{10}$/.test(address.phone)) {
      alert("Enter valid 10-digit mobile.");
      return false;
    }
    if (!otpVerified) {
      alert("Please verify your mobile with OTP.");
      return false;
    }
    if (!address.addressLine1.trim()) {
      alert("Enter delivery address.");
      return false;
    }
    if (!address.city.trim()) {
      alert("Enter city.");
      return false;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      alert("Enter valid 6-digit pincode.");
      return false;
    }
    if (summary.isOutstation && summary.totalKg < DELIVERY.minKgBeyondMaxKm) {
      alert(`Beyond ${DELIVERY.maxKm} km requires minimum ${DELIVERY.minKgBeyondMaxKm} kg. You have ${summary.totalKg} kg.`);
      return false;
    }
    return true;
  };

  const finalizeOrder = async (
    orderId: string,
    paymentId?: string,
    isDemoOrder = false,
  ): Promise<{
    trackingUrl?: string;
    awb?: string;
    deliveryMessage?: string;
    customerConfirmSent?: boolean;
    customerConfirmViaApi?: boolean;
    millAlertSent?: boolean;
    millAlertViaApi?: boolean;
  }> => {
    try {
      const res = await fetch("/api/orders/fulfill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          address,
          items,
          totalKg: summary.totalKg,
          total: summary.total,
          paymentId,
          deliveryDistanceKm,
          isDemo: isDemoOrder,
        }),
      });
      const data = await res.json();
      return {
        trackingUrl: data.trackingUrl,
        awb: data.awb,
        deliveryMessage: data.message,
        customerConfirmSent: data.customerConfirmSent,
        customerConfirmViaApi: data.customerConfirmViaApi,
        millAlertSent: data.millAlertSent,
        millAlertViaApi: data.millAlertViaApi,
      };
    } catch {
      return { deliveryMessage: "Order placed — delivery will be arranged shortly." };
    }
  };

  const handlePay = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Failed to load payment gateway.");
        return;
      }

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: summary.total * 100 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not initiate payment");
        return;
      }

      const orderId = "JV" + Date.now().toString().slice(-8).toUpperCase();

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: MILL.fullName,
        description: `Rice Order — Melur`,
        order_id: data.orderId,
        prefill: {
          name: address.fullName,
          email: address.email || "",
          contact: address.phone,
        },
        notes: {
          orderId,
          address: [address.addressLine1, address.addressLine2, address.city, address.pincode].filter(Boolean).join(", "),
        },
        theme: { color: "#E07A2F" },
        handler: async (response: RazorpaySuccessResponse) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            const fulfillment = await finalizeOrder(orderId, response.razorpay_payment_id);
            saveOrderForWhatsApp({
              orderId,
              total: summary.total,
              phone: address.phone,
              paymentId: response.razorpay_payment_id,
              address,
              items,
            });
            clearCart();
            setDeliveryDistanceKm(null);
            const params = new URLSearchParams({
              total: String(summary.total),
              paymentId: response.razorpay_payment_id,
              orderId,
              phone: address.phone,
            });
            if (fulfillment.awb) params.set("awb", fulfillment.awb);
            if (fulfillment.trackingUrl) params.set("tracking", fulfillment.trackingUrl);
            if (fulfillment.customerConfirmViaApi) params.set("customerViaApi", "1");
            if (fulfillment.millAlertViaApi) params.set("millViaApi", "1");
            router.push(`/order-success?${params.toString()}`);
          } else {
            setError("Payment verification failed. Call " + MILL.phone + " if amount was deducted.");
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (r: unknown) => {
        const err = r as { error?: { description?: string } };
        setError("Payment failed: " + (err.error?.description || "Unknown error"));
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoConfirm = async () => {
    const orderId = "JV" + Date.now().toString().slice(-8).toUpperCase();
    const fulfillment = await finalizeOrder(orderId, undefined, true);
    saveOrderForWhatsApp({
      orderId,
      total: summary.total,
      phone: address.phone,
      isDemo: true,
      address,
      items,
    });
    clearCart();
    setDeliveryDistanceKm(null);
    const params = new URLSearchParams({
      total: String(summary.total),
      orderId,
      phone: address.phone,
      demo: "1",
    });
    if (fulfillment.awb) params.set("awb", fulfillment.awb);
    if (fulfillment.trackingUrl) params.set("tracking", fulfillment.trackingUrl);
    if (fulfillment.customerConfirmViaApi) params.set("customerViaApi", "1");
    if (fulfillment.millAlertViaApi) params.set("millViaApi", "1");
    router.push(`/order-success?${params.toString()}`);
  };

  if (!isHydrated) {
    return <div className="flex min-h-[50vh] items-center justify-center text-stone-500">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-lg text-stone-600">Your cart is empty</p>
        <Link href="/products" className="mt-4 inline-block rounded bg-[#E07A2F] px-6 py-2.5 text-sm font-bold text-white">
          Shop Rice Varieties
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-[#3A2A24]" style={{ fontFamily: "var(--font-yeseva)" }}>
        Checkout
      </h1>
      <p className="mt-1 text-sm text-stone-500">Online payment only — No COD</p>

      {/* Step indicator */}
      <div className="mt-6 flex items-center gap-2 text-xs font-semibold">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full ${step >= n ? "bg-[#7A2E3A] text-white" : "bg-stone-200 text-stone-500"}`}>
              {step > n ? "✓" : n}
            </span>
            <span className={step >= n ? "text-[#7A2E3A]" : "text-stone-400"}>
              {n === 1 ? "Address" : n === 2 ? "Payment" : "Confirm"}
            </span>
            {n < 3 && <div className={`h-0.5 w-8 ${step > n ? "bg-[#7A2E3A]" : "bg-stone-200"}`} />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {step === 1 && (
            <section className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="font-bold text-stone-900">Delivery Address & Verification</h2>
              <p className="mt-2 rounded border border-[#7A2E3A]/20 bg-[#F5EBE8] px-3 py-2 text-xs text-[#5C1F28]">
                🚚 Delivered via <strong>Ekart Logistics</strong> for outstation & bulk orders from Melur.
                Local orders ≤ {DELIVERY.maxKm} km delivered from our mill.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input
                  placeholder="First Name *"
                  value={address.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="rounded border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#7A2E3A] sm:col-span-2"
                />
                <div className="sm:col-span-2">
                  <div className="flex gap-2">
                    <input
                      placeholder="Mobile (10 digits) *"
                      value={address.phone}
                      readOnly={otpVerified}
                      onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="flex-1 rounded border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#7A2E3A]"
                    />
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={address.phone.length !== 10 || otpVerified}
                      className="rounded bg-[#7A2E3A] px-4 py-2 text-xs font-bold text-white disabled:bg-stone-300"
                    >
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  </div>
                  {otpVerified && (
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#7A2E3A]/20 bg-[#F5EBE8] px-3 py-1 text-xs font-semibold text-[#7A2E3A]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified · +91 {address.phone}
                    </p>
                  )}
                </div>
                <input
                  placeholder="Email (optional)"
                  type="email"
                  value={address.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="rounded border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#7A2E3A] sm:col-span-2"
                />
                <div className="relative sm:col-span-2">
                  {googleMapsKey ? (
                    <>
                      <GoogleAddressInput
                        placeholder="Search address on Google Maps *"
                        value={address.addressLine1}
                        onChange={(v) => updateField("addressLine1", v)}
                        onPlaceSelect={handleGooglePlace}
                        className="w-full rounded border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#7A2E3A]"
                      />
                      <p className="mt-1 text-[10px] text-stone-400">
                        Select from Google Maps — pincode fills automatically
                      </p>
                    </>
                  ) : (
                    <>
                      <input
                        placeholder="Delivery address * (type for suggestions)"
                        value={address.addressLine1}
                        onChange={(e) => {
                          updateField("addressLine1", e.target.value);
                          searchAddress(e.target.value);
                        }}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="w-full rounded border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#7A2E3A]"
                      />
                      {showSuggestions && addrSuggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded border border-stone-200 bg-white shadow-lg">
                          {addrSuggestions.map((s, i) => (
                            <button
                              key={i}
                              type="button"
                              className="block w-full border-b border-stone-100 px-3 py-2 text-left text-xs hover:bg-[#FDE8D4] last:border-0"
                              onMouseDown={() => pickSuggestion(s)}
                            >
                              {s.display_name.split(",").slice(0, 4).join(", ")}
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="mt-1 text-[10px] text-stone-400">
                        Pick a suggestion — pincode auto-fills from location
                      </p>
                    </>
                  )}
                </div>
                <input
                  placeholder="Landmark (optional)"
                  value={address.addressLine2}
                  onChange={(e) => updateField("addressLine2", e.target.value)}
                  className="rounded border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#7A2E3A] sm:col-span-2"
                />
                <input
                  placeholder="City *"
                  value={address.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="rounded border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#7A2E3A]"
                />
                <input
                  placeholder="Pincode *"
                  value={address.pincode}
                  onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="rounded border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#7A2E3A]"
                />
              </div>
              {deliveryDistanceKm !== null && (
                <div className="mt-4 rounded border border-stone-200 bg-[#FFFAF5] p-3 text-xs">
                  <div className="flex justify-between"><span>📍 Distance from mill</span><span>{deliveryDistanceKm.toFixed(1)} km</span></div>
                  <div className="mt-1 flex justify-between"><span>🚚 Delivery</span><span>{summary.delivery === 0 ? (summary.isOutstation ? "Contact us" : "FREE") : formatINR(summary.delivery)}</span></div>
                </div>
              )}
              {summary.isOutstation && (
                <p className="mt-3 rounded border border-amber-300 bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
                  Beyond {DELIVERY.maxKm} km: minimum {DELIVERY.minKgBeyondMaxKm} kg required. You have {summary.totalKg} kg.
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <Link href="/cart" className="flex-1 rounded border border-stone-200 py-2.5 text-center text-sm font-bold text-stone-600">
                  ← Back to Cart
                </Link>
                <button
                  onClick={() => validateStep1() && setStep(2)}
                  className="flex-[2] rounded bg-[#7A2E3A] py-2.5 text-sm font-bold text-white"
                >
                  Continue →
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="font-bold text-stone-900">Payment Method</h2>
              <p className="mt-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <strong>No Cash on Delivery.</strong> Online payment only via UPI, Cards, or Net Banking.
              </p>
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-[#7A2E3A]/40 bg-[#F5EBE8] p-4">
                <input type="radio" checked readOnly className="mt-1" />
                <div>
                  <div className="flex items-center gap-2 font-semibold">
                    <CreditCard className="h-4 w-4" />
                    UPI / Cards / Net Banking
                  </div>
                  <p className="mt-1 text-xs text-stone-500">PhonePe, GPay, Paytm, all major cards — via Razorpay</p>
                </div>
              </label>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 rounded border border-stone-200 py-2.5 text-sm font-bold">
                  ← Back
                </button>
                <button onClick={() => setStep(3)} className="flex-[2] rounded bg-[#7A2E3A] py-2.5 text-sm font-bold text-white">
                  Review & Confirm →
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="font-bold text-stone-900">Review Order</h2>
              <ul className="mt-4 divide-y divide-stone-100 text-sm">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.variantId}`} className="flex justify-between py-2">
                    <span>{item.name} ×{item.quantity} ({item.variantLabel})</span>
                    <span className="font-semibold">{formatINR(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-1 rounded bg-[#FFFAF5] p-3 text-xs">
                <p><strong>Deliver to:</strong> {[address.addressLine1, address.city, address.pincode].filter(Boolean).join(", ")}</p>
                <p><strong>Mobile:</strong> +91 {address.phone} ✅</p>
                <p><strong>Payment:</strong> Online (Razorpay)</p>
              </div>
              {error && <p className="mt-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              <div className="mt-4 flex gap-2">
                <button onClick={() => setStep(2)} className="flex-1 rounded border border-stone-200 py-2.5 text-sm font-bold">
                  ← Back
                </button>
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="flex-[2] flex items-center justify-center gap-2 rounded bg-[#7A2E3A] py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Pay {formatINR(summary.total)} Now →
                </button>
              </div>
              <button
                type="button"
                onClick={handleDemoConfirm}
                className="mt-3 w-full rounded border border-dashed border-stone-300 py-2 text-xs text-stone-500 hover:bg-stone-50"
              >
                Demo: Confirm without Razorpay (for testing)
              </button>
            </section>
          )}
        </div>

        <PriceSummary summary={summary} itemCount={items.reduce((s, i) => s + i.quantity, 0)} />
      </div>

      <OtpEntryModal
        open={showOtpModal}
        phone={address.phone}
        demoOtp={genOtp}
        onClose={() => setShowOtpModal(false)}
        onSubmit={handleOtpSubmit}
      />
      <OtpSuccessModal
        open={showVerifiedModal}
        phone={address.phone}
        onClose={() => setShowVerifiedModal(false)}
      />
    </div>
  );
}
