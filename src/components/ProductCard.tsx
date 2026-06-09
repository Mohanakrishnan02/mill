"use client";

import Link from "next/link";
import { Product } from "@/types";
import { formatINR, calcDiscountPercent } from "@/lib/format";
import { useCart } from "@/context/CartContext";

const badgeColors: Record<string, string> = {
  popular: "bg-[#e07b00]",
  organic: "bg-[#558b2f]",
  raw: "bg-[#8b5e3c]",
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const defaultVariant = product.variants.find((v) => v.inStock) ?? product.variants[0];
  const discount = calcDiscountPercent(defaultVariant.mrp, defaultVariant.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!defaultVariant.inStock) return;
    addItem({
      productId: product.id,
      productSlug: product.slug,
      variantId: defaultVariant.id,
      name: product.name,
      tamil: product.tamil,
      variantLabel: defaultVariant.label,
      weightKg: defaultVariant.weightKg ?? parseInt(defaultVariant.weight, 10),
      image: product.image,
      price: defaultVariant.price,
      mrp: defaultVariant.mrp,
    });
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-[#fdf8f0] to-[#f5ede0] text-5xl">
          {product.image}
          {product.badge && product.badgeLabel && (
            <span className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase text-white ${badgeColors[product.badge]}`}>
              {product.badgeLabel}
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-bold text-stone-900 hover:text-[#2e7d32]">{product.name}</h3>
        </Link>
        {product.tamil && (
          <p className="text-xs text-stone-600" style={{ fontFamily: "var(--font-tamil)" }}>{product.tamil}</p>
        )}
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-stone-500">{product.description}</p>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-lg font-extrabold text-stone-900">{formatINR(defaultVariant.price)}</span>
          {discount > 0 && (
            <span className="text-[10px] font-bold text-[#2e7d32]">{discount}% off</span>
          )}
        </div>
        <p className="text-[10px] text-stone-400">From {defaultVariant.label}</p>
        <div className="mt-auto flex gap-1.5 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={!defaultVariant.inStock}
            className="flex-1 rounded border border-[#e07b00] bg-[#fff3e0] py-2 text-[11px] font-bold text-[#e07b00] hover:bg-[#e07b00] hover:text-white disabled:opacity-40"
          >
            ADD TO CART
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="flex flex-1 items-center justify-center rounded bg-[#e07b00] py-2 text-[11px] font-bold text-white hover:bg-[#f5a623]"
          >
            BUY NOW
          </Link>
        </div>
      </div>
    </div>
  );
}
