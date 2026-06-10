"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Truck, ExternalLink } from "lucide-react";
import { EKART } from "@/lib/delivery-config";
import { MILL } from "@/lib/mill-config";

/** Demo AWB for Ekart tracking preview until live API is connected */
const DEMO_AWB = "JV-DEMO-001";

export default function TrackOrderPage() {
  const [awb, setAwb] = useState("");

  const openEkartTrack = (trackingId: string) => {
    const id = trackingId.trim() || DEMO_AWB;
    window.open(`${EKART.trackingBaseUrl}${encodeURIComponent(id)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7A2E3A]/10">
          <Truck className="h-7 w-7 text-[#7A2E3A]" />
        </div>
        <h1
          className="mt-4 text-2xl font-bold text-[#3A2A24]"
          style={{ fontFamily: "var(--font-yeseva)" }}
        >
          Track Your Order
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Outstation & bulk orders ship via <strong>Ekart Logistics</strong> from our Melur mill.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <label className="text-sm font-semibold text-stone-700">AWB / Tracking Number</label>
        <input
          type="text"
          value={awb}
          onChange={(e) => setAwb(e.target.value.toUpperCase())}
          placeholder="Enter your tracking ID"
          className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-3 text-sm font-mono outline-none focus:border-[#7A2E3A]"
        />
        <button
          type="button"
          onClick={() => openEkartTrack(awb)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#7A2E3A] py-3 text-sm font-bold text-white hover:bg-[#5C1F28]"
        >
          <ExternalLink className="h-4 w-4" />
          Track on Ekart Logistics
        </button>

        <div className="mt-6 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4">
          <p className="text-xs font-bold text-amber-900">Demo — Try with sample tracking ID</p>
          <p className="mt-1 text-xs text-amber-800">
            Use <code className="rounded bg-white px-1.5 py-0.5 font-mono">{DEMO_AWB}</code> to
            preview the Ekart tracking flow.
          </p>
          <button
            type="button"
            onClick={() => openEkartTrack(DEMO_AWB)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#7A2E3A] bg-white py-2.5 text-xs font-bold text-[#7A2E3A] hover:bg-[#F5EBE8]"
          >
            <Package className="h-4 w-4" />
            Demo Track — {DEMO_AWB}
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-stone-400">
        Local orders ≤ 25 km are delivered directly from {MILL.name}. Tracking is shared on
        WhatsApp after dispatch.
      </p>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm font-semibold text-[#7A2E3A] hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
