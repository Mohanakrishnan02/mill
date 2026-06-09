"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

export function ProductCarousel() {
  const featured = getFeaturedProducts();
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <div className="relative px-8 sm:px-12">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowPrompt(true)}
        aria-label="View all rice varieties"
        className="absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-[#5d3a1a] shadow-md transition hover:border-[#e07b00] hover:text-[#e07b00] sm:-right-5 sm:h-12 sm:w-12"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {showPrompt && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/20"
            aria-label="Close"
            onClick={() => setShowPrompt(false)}
          />
          <div className="absolute -right-1 top-1/2 z-50 w-56 -translate-y-1/2 rounded-lg border border-stone-200 bg-white p-4 shadow-xl sm:-right-2 sm:w-64">
            <button
              type="button"
              onClick={() => setShowPrompt(false)}
              className="absolute right-2 top-2 rounded p-0.5 text-stone-400 hover:text-stone-600"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="pr-6 text-sm font-bold text-[#5d3a1a]">View full product list?</p>
            <p className="mt-1 text-xs text-stone-500">All 5 rice varieties from our mill</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setShowPrompt(false)}
                className="flex-1 rounded border border-stone-200 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <Link
                href="/products"
                className="flex-1 rounded bg-[#e07b00] py-1.5 text-center text-xs font-bold text-white hover:bg-[#f5a623]"
              >
                Open →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
