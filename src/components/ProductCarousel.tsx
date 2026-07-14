"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronRight, X, ArrowRight, Wheat } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";
import { IMAGES } from "@/lib/images";

export function ProductCarousel() {
  const featured = getFeaturedProducts();
  const [showPanel, setShowPanel] = useState(false);

  const openPanel = () => setShowPanel(true);
  const closePanel = () => setShowPanel(false);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className={`relative transition-transform duration-500 ease-out ${
          showPanel ? "-translate-x-6 sm:-translate-x-10 md:-translate-x-14" : "translate-x-0"
        }`}
      >
        <div className="px-8 sm:px-12">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {!showPanel && (
          <button
            type="button"
            onClick={openPanel}
            aria-label="View all rice varieties"
            className="absolute -right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-[#3D3428] shadow-lg transition hover:scale-105 hover:border-[#D4A017] hover:text-[#D4A017] sm:-right-5 sm:h-14 sm:w-14"
          >
            <ChevronRight className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>
        )}
      </div>

      {showPanel && (
        <>
          <button
            type="button"
            className="view-all-overlay-in absolute inset-0 z-20 bg-black/25 backdrop-blur-[1px]"
            aria-label="Close"
            onClick={closePanel}
          />
          <aside
            className="view-all-panel-in absolute right-0 top-1/2 z-30 flex w-[min(340px,88vw)] -translate-y-1/2 flex-col rounded-l-2xl border border-r-0 border-stone-200 bg-white shadow-2xl sm:w-[min(380px,75vw)]"
            role="dialog"
            aria-labelledby="view-all-title"
          >
            <button
              type="button"
              onClick={closePanel}
              className="absolute right-3 top-3 rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-stone-100 bg-gradient-to-br from-[#FAF6EB] to-[#F5E9C0]/80 px-6 pb-5 pt-8 text-center">
              <div className="view-all-logo-pop mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white shadow-md ring-2 ring-[#E8C547]/40">
                <Image
                  src={IMAGES.logo}
                  alt=""
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3
                id="view-all-title"
                className="text-lg font-bold text-[#3D3428] sm:text-xl"
                style={{ fontFamily: "var(--font-yeseva)" }}
              >
                View All Product List
              </h3>
              <p className="mt-1.5 text-sm text-stone-600">
                All 5 rice varieties from our mill
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-4 px-6 py-5">
              <div className="flex items-start gap-3 rounded-xl bg-[#FAF6EB] p-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2F6B3A]/10">
                  <Wheat className="h-5 w-5 text-[#2F6B3A]" />
                </div>
                <div className="text-left text-sm text-stone-600">
                  <p className="font-semibold text-[#3D3428]">JGL · Akshaya · Ponni</p>
                  <p className="mt-0.5 text-xs leading-relaxed">
                    Browse every variety, weights & prices — fresh from Jayalakshmi Vilas Mill.
                  </p>
                </div>
              </div>

              <Link
                href="/products"
                className="view-all-cta-pulse flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4A017] px-5 py-3.5 text-base font-bold text-[#14261C] shadow-lg transition hover:bg-[#E8C547]"
              >
                View All Products
                <ArrowRight className="h-5 w-5" />
              </Link>

              <button
                type="button"
                onClick={closePanel}
                className="w-full rounded-xl border border-stone-200 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
              >
                Stay on featured
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
