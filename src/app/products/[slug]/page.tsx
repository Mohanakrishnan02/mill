"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Truck, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { getProductBySlug, getAdjacentProducts } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { formatINR, calcDiscountPercent } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";
import { DELIVERY } from "@/lib/mill-config";

const badgeColors: Record<string, string> = {
  popular: "bg-[#E07A2F]",
  organic: "bg-[#9E4A56]",
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

  const { prev, next } = getAdjacentProducts(slug);

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
        <Link href="/" className="hover:text-[#7A2E3A]">Home</Link>
        {" / "}
        <Link href="/products" className="hover:text-[#7A2E3A]">Products</Link>
        {" / "}
        <span className="text-stone-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[#FFFAF5] to-[#F5EBE0]">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {prev && slug !== "jgl" && (
            <Link
              href={`/products/${prev.slug}`}
              aria-label={`Previous: ${prev.name}`}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[#3A2A24] shadow-md transition hover:border-[#E07A2F] hover:text-[#E07A2F]"
            >
              <ChevronLeft className="h-6 w-6" />
            </Link>
          )}
          {next && (
            <Link
              href={`/products/${next.slug}`}
              aria-label={`Next: ${next.name}`}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[#3A2A24] shadow-md transition hover:border-[#E07A2F] hover:text-[#E07A2F]"
            >
              <ChevronRight className="h-6 w-6" />
            </Link>
          )}
          {product.badge && product.badgeLabel && (
            <span className={`absolute left-4 top-4 rounded px-2 py-0.5 text-xs font-bold text-white ${badgeColors[product.badge]}`}>
              {product.badgeLabel}
            </span>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-[#E07A2F]">{product.category}</p>
          <h1 className="mt-1 text-3xl font-bold text-[#3A2A24]" style={{ fontFamily: "var(--font-yeseva)" }}>
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
              <span className="rounded bg-[#F5EBE8] px-2 py-0.5 text-sm font-bold text-[#7A2E3A]">
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
                      ? "border-[#E07A2F] bg-[#FDE8D4] text-[#E07A2F]"
                      : v.inStock
                        ? "border-stone-200 text-stone-700 hover:border-[#E07A2F]"
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
              className="flex-1 rounded border-2 border-[#E07A2F] bg-[#FDE8D4] py-3.5 text-sm font-bold text-[#E07A2F] hover:bg-[#E07A2F] hover:text-white disabled:opacity-40"
            >
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!variant.inStock}
              className="flex-1 rounded bg-[#E07A2F] py-3.5 text-sm font-bold text-white hover:bg-[#F5A962] disabled:opacity-40"
            >
              BUY NOW
            </button>
          </div>

          <ul className="mt-8 space-y-3 border-t border-stone-100 pt-6">
            <li className="flex items-center gap-2 text-sm text-stone-600">
              <Truck className="h-4 w-4 text-[#7A2E3A]" />
              Free delivery ≤ {DELIVERY.freeKm} km · ₹{DELIVERY.ratePerKm}/km up to {DELIVERY.maxKm} km
            </li>
            <li className="flex items-center gap-2 text-sm text-stone-600">
              <Shield className="h-4 w-4 text-[#7A2E3A]" />
              100% traditional — stone-milled, no chemicals
            </li>
            <li className="flex items-center gap-2 text-sm text-stone-600">
              <Check className="h-4 w-4 text-[#7A2E3A]" />
              Online payment only — UPI, Cards, Net Banking (No COD)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
