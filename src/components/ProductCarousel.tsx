"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Grid3X3 } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

export function ProductCarousel() {
  const featured = getFeaturedProducts();
  const [showViewAll, setShowViewAll] = useState(false);

  if (showViewAll) {
    return (
      <div className="relative px-8 sm:px-12">
        <button
          type="button"
          onClick={() => setShowViewAll(false)}
          aria-label="Back to featured varieties"
          className="absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-[#5d3a1a] shadow-md transition hover:border-[#e07b00] hover:text-[#e07b00] sm:-left-5 sm:h-12 sm:w-12"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <Link
          href="/products"
          className="group flex min-h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e07b00]/40 bg-gradient-to-br from-[#fff8f0] to-[#f5ede0] p-8 text-center transition hover:border-[#e07b00] hover:shadow-lg"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e07b00]/15 transition group-hover:scale-110">
            <Grid3X3 className="h-8 w-8 text-[#e07b00]" />
          </div>
          <p
            className="mt-4 text-xl font-bold text-[#5d3a1a]"
            style={{ fontFamily: "var(--font-yeseva)" }}
          >
            Click here to view all
          </p>
          <p className="mt-2 text-sm text-stone-500">
            See our full rice catalog — JGL, Akshaya, Ponni & more
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#e07b00] px-6 py-2.5 text-sm font-bold text-white transition group-hover:bg-[#f5a623]">
            Open full product list
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative px-8 sm:px-12">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowViewAll(true)}
        aria-label="View all rice varieties"
        className="absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-[#5d3a1a] shadow-md transition hover:border-[#e07b00] hover:text-[#e07b00] sm:-right-5 sm:h-12 sm:w-12"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
