"use client";

import Link from "next/link";
import { Minus, Plus, Bookmark, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR, calcDiscountPercent } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { CartItem } from "@/types";

interface CartItemRowProps {
  item: CartItem;
  variant?: "cart" | "saved";
}

export function CartItemRow({ item, variant = "cart" }: CartItemRowProps) {
  const { updateQuantity, removeItem, saveForLater, moveToCart, removeSaved } = useCart();
  const discount = calcDiscountPercent(item.mrp, item.price);

  return (
    <div className="flex gap-3 border-b border-stone-100 py-4 last:border-0">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-[#F5EBE0]">
        <ProductImage src={item.image} alt={item.name} className="object-cover" sizes="64px" />
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${item.productSlug}`}
          className="line-clamp-2 text-sm font-bold text-stone-800 hover:text-[#7A2E3A]"
        >
          {item.name}
        </Link>
        {item.tamil && (
          <p className="text-[11px] text-stone-500" style={{ fontFamily: "var(--font-tamil)" }}>
            {item.tamil}
          </p>
        )}
        <p className="mt-0.5 text-xs text-stone-500">{item.variantLabel}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-extrabold text-stone-900">{formatINR(item.price)}</span>
          {discount > 0 && (
            <span className="text-[10px] font-bold text-[#7A2E3A]">{discount}% off</span>
          )}
        </div>

        {variant === "cart" ? (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded border border-stone-200">
              <button
                onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                className="px-2 py-1 text-stone-600 hover:bg-stone-50"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-8 border-x border-stone-200 px-2 py-1 text-center text-sm font-bold">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                className="px-2 py-1 text-stone-600 hover:bg-stone-50"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={() => saveForLater(item.productId, item.variantId)}
              className="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-[#7A2E3A]"
            >
              <Bookmark className="h-3.5 w-3.5" />
              Save for later
            </button>
            <button
              onClick={() => removeItem(item.productId, item.variantId)}
              className="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        ) : (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => moveToCart(item.productId, item.variantId)}
              className="rounded border border-[#7A2E3A] px-3 py-1 text-xs font-semibold text-[#7A2E3A] hover:bg-[#F5EBE8]"
            >
              Move to cart
            </button>
            <button
              onClick={() => removeSaved(item.productId, item.variantId)}
              className="text-xs font-medium text-stone-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        )}
      </div>
      <div className="text-right text-sm font-extrabold text-stone-900">
        {formatINR(item.price * item.quantity)}
      </div>
    </div>
  );
}
