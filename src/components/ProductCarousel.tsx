"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import type { Product } from "@/types";

interface ProductCarouselProps {
  /** Products to show in the sliding window (defaults to all) */
  items?: Product[];
  /** How many cards visible at once on large screens */
  visibleCount?: number;
}

export function ProductCarousel({ items = products, visibleCount: desktopCount = 3 }: ProductCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(desktopCount);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(Math.min(2, desktopCount));
      else setVisibleCount(desktopCount);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [desktopCount]);

  useEffect(() => {
    setStartIndex(0);
  }, [visibleCount]);

  const maxStart = Math.max(0, items.length - visibleCount);

  const prev = () => setStartIndex((i) => (i <= 0 ? maxStart : i - 1));
  const next = () => setStartIndex((i) => (i >= maxStart ? 0 : i + 1));

  const visible = items.slice(startIndex, startIndex + visibleCount);

  const gridCols =
    visibleCount >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : visibleCount === 2 ? "sm:grid-cols-2" : "grid-cols-1";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={prev}
        aria-label="Previous rice variety"
        className="absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-[#5d3a1a] shadow-md transition hover:border-[#e07b00] hover:text-[#e07b00] sm:-left-5 sm:h-12 sm:w-12"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <div className={`grid grid-cols-1 gap-3 sm:gap-5 ${gridCols}`}>
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <button
        type="button"
        onClick={next}
        aria-label="Next rice variety"
        className="absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-[#5d3a1a] shadow-md transition hover:border-[#e07b00] hover:text-[#e07b00] sm:-right-5 sm:h-12 sm:w-12"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="mt-4 flex justify-center gap-1.5">
        {Array.from({ length: maxStart + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setStartIndex(i)}
            className={`h-2 rounded-full transition-all ${
              startIndex === i ? "w-6 bg-[#e07b00]" : "w-2 bg-stone-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
