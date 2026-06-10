"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartItemRow } from "@/components/CartItemRow";
import { PriceSummary } from "@/components/PriceSummary";

export default function CartPage() {
  const { items, savedForLater, summary, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-stone-500">
        Loading cart...
      </div>
    );
  }

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-20 w-20 text-stone-300" />
        <h1 className="mt-4 text-xl font-bold text-stone-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-stone-500">
          Items added to cart are saved automatically in your browser — even if you close the tab.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded bg-[#E07A2F] px-8 py-3 text-sm font-bold text-white hover:bg-[#F5A962]"
        >
          Shop Rice Varieties
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-stone-900">My Cart</h1>
      <p className="mt-1 text-sm text-stone-500">
        Your cart is saved automatically — just like Flipkart
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.length > 0 && (
            <section className="rounded-lg border border-stone-200 bg-white px-4">
              <p className="border-b border-stone-100 py-3 text-sm font-semibold text-stone-700">
                {items.length} item(s) in cart
              </p>
              {items.map((item) => (
                <CartItemRow key={`${item.productId}-${item.variantId}`} item={item} />
              ))}
            </section>
          )}

          {savedForLater.length > 0 && (
            <section className="mt-6 rounded-lg border border-stone-200 bg-white px-4">
              <p className="border-b border-stone-100 py-3 text-sm font-semibold text-stone-700">
                Saved for later ({savedForLater.length})
              </p>
              {savedForLater.map((item) => (
                <CartItemRow
                  key={`saved-${item.productId}-${item.variantId}`}
                  item={item}
                  variant="saved"
                />
              ))}
            </section>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4">
            <PriceSummary summary={summary} />
            <Link
              href="/checkout"
              className="block w-full rounded bg-[#E07A2F] py-3.5 text-center text-sm font-extrabold text-white hover:bg-[#F5A962]"
            >
              PROCEED TO CHECKOUT →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
