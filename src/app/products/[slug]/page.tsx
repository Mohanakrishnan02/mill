"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Truck, Shield } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { formatINR, calcDiscountPercent } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";
import { DELIVERY } from "@/lib/mill-config";

const badgeColors: Record<string, string> = {
  popular: "bg-[#e07b00]",
  organic: "bg-[#558b2f]",
  raw: "bg-[#8b5e3c]",
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  const { addItem } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState(
    product?.variants.find((v) => v.inStock)?.id ?? product?.variants[0]?.id
  );

  if (!product) notFound();

  const variant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];
  const discount = calcDiscountPercent(variant.mrp, variant.price);
  const weightKg = variant.weightKg ?? parseInt(variant.weight, 10);

  const handleAddToCart = () => {
    if (!variant.inStock) return;
    addItem({
      productId: product.id,
      productSlug: product.slug,
      variantId: variant.id,
      name: product.name,
      tamil: product.tamil,
      variantLabel: variant.label,
      weightKg,
      image: product.image,
      price: variant.price,
      mrp: variant.mrp,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/" className="hover:text-[#2e7d32]">Home</Link>
        {" / "}
        <Link href="/products" className="hover:text-[#2e7d32]">Products</Link>
        {" / "}
        <span className="text-stone-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[#fdf8f0] to-[#f5ede0]">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {product.badge && product.badgeLabel && (
            <span className={`absolute left-4 top-4 rounded px-2 py-0.5 text-xs font-bold text-white ${badgeColors[product.badge]}`}>
              {product.badgeLabel}
            </span>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-[#e07b00]">{product.category}</p>
          <h1 className="mt-1 text-3xl font-bold text-[#5d3a1a]" style={{ fontFamily: "var(--font-yeseva)" }}>
            {product.name}
          </h1>
          {product.tamil && (
            <p className="mt-1 text-lg text-stone-600" style={{ fontFamily: "var(--font-tamil)" }}>
              {product.tamil}
            </p>
          )}

          <div className="mt-6 flex items-end gap-3">
            <span className="text-3xl font-extrabold text-stone-900">{formatINR(variant.price)}</span>
            <span className="text-sm text-stone-400">/ {variant.label}</span>
            {discount > 0 && (
              <span className="rounded bg-green-100 px-2 py-0.5 text-sm font-bold text-[#2e7d32]">
                {discount}% off
              </span>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-stone-600">{product.description}</p>

          <div className="mt-6">
            <p className="text-sm font-semibold text-stone-700">Select Pack Size</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  disabled={!v.inStock}
                  className={`rounded border px-4 py-2 text-sm font-semibold transition ${
                    selectedVariantId === v.id
                      ? "border-[#e07b00] bg-[#fff3e0] text-[#e07b00]"
                      : v.inStock
                        ? "border-stone-200 text-stone-700 hover:border-[#e07b00]"
                        : "cursor-not-allowed border-stone-100 bg-stone-50 text-stone-300"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!variant.inStock}
              className="flex-1 rounded border-2 border-[#e07b00] bg-[#fff3e0] py-3.5 text-sm font-bold text-[#e07b00] hover:bg-[#e07b00] hover:text-white disabled:opacity-40"
            >
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!variant.inStock}
              className="flex-1 rounded bg-[#e07b00] py-3.5 text-sm font-bold text-white hover:bg-[#f5a623] disabled:opacity-40"
            >
              BUY NOW
            </button>
          </div>

          <ul className="mt-8 space-y-3 border-t border-stone-100 pt-6">
            <li className="flex items-center gap-2 text-sm text-stone-600">
              <Truck className="h-4 w-4 text-[#2e7d32]" />
              Free delivery ≤ {DELIVERY.freeKm} km · ₹{DELIVERY.ratePerKm}/km up to {DELIVERY.maxKm} km
            </li>
            <li className="flex items-center gap-2 text-sm text-stone-600">
              <Shield className="h-4 w-4 text-[#2e7d32]" />
              100% traditional — stone-milled, no chemicals
            </li>
            <li className="flex items-center gap-2 text-sm text-stone-600">
              <Check className="h-4 w-4 text-[#2e7d32]" />
              Online payment only — UPI, Cards, Net Banking (No COD)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
