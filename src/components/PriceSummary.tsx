"use client";

import { OrderSummary } from "@/types";
import { formatINR } from "@/lib/format";
import { DELIVERY } from "@/lib/mill-config";
import { deliveryLabel } from "@/lib/shipping";

interface PriceSummaryProps {
  summary: OrderSummary;
  itemCount?: number;
}

export function PriceSummary({ summary, itemCount = 0 }: PriceSummaryProps) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <h3 className="font-bold text-stone-900">PRICE DETAILS</h3>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-stone-600">Subtotal ({itemCount} items)</dt>
          <dd>{formatINR(summary.subtotal)}</dd>
        </div>
        {summary.promoDiscount > 0 && (
          <div className="flex justify-between text-[#7A2E3A]">
            <dt>Discount ({DELIVERY.discountPercent}%)</dt>
            <dd>− {formatINR(summary.promoDiscount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-stone-600">Delivery</dt>
          <dd className="max-w-[55%] text-right text-xs">
            {summary.deliveryDistanceKm === null ? (
              <span className="text-stone-500">After address</span>
            ) : summary.isOutstation ? (
              <span className="text-amber-700">Contact us</span>
            ) : summary.delivery === 0 ? (
              <span className="font-semibold text-[#7A2E3A]">FREE</span>
            ) : (
              formatINR(summary.delivery)
            )}
          </dd>
        </div>
        {summary.deliveryDistanceKm !== null && (
          <p className="text-[11px] text-stone-400">
            {deliveryLabel(summary.deliveryDistanceKm, summary.delivery)}
          </p>
        )}
        <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold">
          <dt>Total Amount</dt>
          <dd>{formatINR(summary.total)}</dd>
        </div>
      </dl>
      {summary.isOutstation && (
        <p className="mt-3 rounded border border-amber-300 bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
          Beyond {DELIVERY.maxKm} km: minimum {DELIVERY.minKgBeyondMaxKm} kg required. You have {summary.totalKg} kg.
        </p>
      )}
      <p className="mt-3 rounded border border-amber-200 bg-amber-50 px-2 py-1.5 text-[11px] text-amber-800">
        No Cash on Delivery. Online payment only via UPI / Cards / Net Banking.
      </p>
    </div>
  );
}
