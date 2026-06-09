"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/format";
import { DELIVERY } from "@/lib/mill-config";
import { CartItemRow } from "./CartItemRow";
import { PriceSummary } from "./PriceSummary";

export function CartDrawer() {
  const { items, savedForLater, summary, isDrawerOpen, closeDrawer, isHydrated } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={closeDrawer} />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-[#2874f0] px-4 py-3.5 text-white">
          <div>
            <h2 className="font-bold">My Cart</h2>
            <span className="text-xs opacity-75">{isHydrated ? `${items.length} items` : ""}</span>
          </div>
          <button onClick={closeDrawer} aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isHydrated ? (
          <div className="flex flex-1 items-center justify-center text-stone-500">Loading cart…</div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-16 w-16 text-stone-300" />
            <p className="text-stone-600">Your cart is empty</p>
            <p className="text-sm text-stone-400">Items are saved automatically in your browser</p>
            <Link href="/products" onClick={closeDrawer} className="rounded bg-[#e07b00] px-6 py-2.5 text-sm font-bold text-white">
              Shop Rice Varieties
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-3">
              {items.map((item) => (
                <CartItemRow key={`${item.productId}-${item.variantId}`} item={item} />
              ))}
              {savedForLater.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <p className="mb-2 text-xs font-bold uppercase text-stone-500">
                    Saved for later ({savedForLater.length})
                  </p>
                  {savedForLater.map((item) => (
                    <CartItemRow key={`saved-${item.productId}-${item.variantId}`} item={item} variant="saved" />
                  ))}
                </div>
              )}
            </div>
            <div className="border-t bg-[#fdf8f0] p-4">
              <PriceSummary summary={summary} itemCount={items.reduce((s, i) => s + i.quantity, 0)} />
              <p className="mt-2 text-[11px] text-blue-800">
                Free ≤{DELIVERY.freeKm} km · ₹{DELIVERY.ratePerKm}/km up to {DELIVERY.maxKm} km
              </p>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="mt-3 block w-full rounded bg-[#e07b00] py-3 text-center text-sm font-extrabold text-white hover:bg-[#f5a623]"
              >
                PROCEED TO CHECKOUT →
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
