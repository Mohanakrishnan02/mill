"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Truck, Percent, Package, Sparkles } from "lucide-react";
import { DELIVERY } from "@/lib/mill-config";

const SHOW_DELAY_MS = 1800;

const offers = [
  {
    icon: Truck,
    title: `Free Delivery ≤ ${DELIVERY.freeKm} km`,
    desc: `₹${DELIVERY.ratePerKm}/km beyond · up to ${DELIVERY.maxKm} km from Melur mill`,
    accent: "from-green-600 to-green-700",
  },
  {
    icon: Percent,
    title: `${DELIVERY.discountPercent}% Online Discount`,
    desc: "Applied automatically at checkout on every order",
    accent: "from-[#E07A2F] to-[#F5A962]",
  },
  {
    icon: Package,
    title: "Bulk 25 kg Packs",
    desc: "Best per-kg price — ideal for families & monthly stock",
    accent: "from-[#3A2A24] to-[#8b5e3c]",
  },
  {
    icon: Sparkles,
    title: "5 Rice Varieties",
    desc: "JGL, Akshaya, Ponni Boiled & more",
    accent: "from-purple-600 to-purple-800",
  },
];

export function OfferPopup() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Show popup every time user lands on the home page
  useEffect(() => {
    if (!isHome) {
      setVisible(false);
      setClosing(false);
      return;
    }

    setClosing(false);
    setActiveSlide(0);
    setVisible(false);

    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [isHome, pathname]);

  useEffect(() => {
    if (!visible || closing) return;
    const id = setInterval(() => {
      setActiveSlide((s) => (s + 1) % offers.length);
    }, 3200);
    return () => clearInterval(id);
  }, [visible, closing]);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 320);
  };

  if (!isHome || !visible) return null;

  return (
    <div
      className={`offer-overlay fixed inset-0 z-[9990] flex items-center justify-center p-4 ${closing ? "offer-overlay-out" : "offer-overlay-in"}`}
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Special offers"
    >
      <div className="offer-grains pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="offer-grain" style={{ left: `${(i * 7 + 3) % 100}%`, animationDelay: `${i * 0.35}s` }} />
        ))}
      </div>

      <div
        className={`offer-modal relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ${closing ? "offer-modal-out" : "offer-modal-in"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#7A2E3A] via-[#388e3c] to-[#1b5e20] px-5 pb-8 pt-5 text-white">
          <div className="offer-shimmer absolute inset-0 opacity-30" aria-hidden />
          <button
            onClick={dismiss}
            className="absolute right-3 top-3 rounded-full bg-white/15 p-1.5 transition hover:bg-white/25"
            aria-label="Close offers"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="offer-badge-pop relative inline-flex items-center gap-1.5 rounded-full border border-[#F5A962]/40 bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#F5A962]">
            <span className="offer-spark">✦</span> Limited Time
          </div>
          <h2 className="relative mt-3 text-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-yeseva)" }}>
            Today&apos;s Offers 🌾
          </h2>
          <p className="relative mt-1 text-xs text-white/70">Direct from our Melur rice mill</p>
        </div>

        <div className="relative -mt-5 mx-4">
          <div className="offer-featured overflow-hidden rounded-xl border-2 border-[#F5A962] bg-gradient-to-br from-[#fff8e1] to-white p-4 pb-8 shadow-lg">
            <div className="relative h-[52px]">
              {offers.map((offer, i) => {
                const Icon = offer.icon;
                return (
                  <div
                    key={offer.title}
                    className={`offer-slide absolute inset-0 flex items-center gap-3 ${i === activeSlide ? "offer-slide-active" : "offer-slide-hidden"}`}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${offer.accent} text-white shadow-md`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-[#3A2A24]">{offer.title}</p>
                      <p className="text-[11px] leading-snug text-stone-500">{offer.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {offers.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === activeSlide ? "w-5 bg-[#E07A2F]" : "w-1.5 bg-stone-300"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <ul className="space-y-2 px-4 py-4">
          {offers.map((offer, i) => {
            const Icon = offer.icon;
            return (
              <li
                key={offer.title}
                className="offer-row flex items-center gap-2.5 rounded-lg border border-stone-100 bg-[#FFFAF5] px-3 py-2"
                style={{ animationDelay: `${0.15 + i * 0.08}s` }}
              >
                <Icon className="h-4 w-4 shrink-0 text-[#E07A2F]" />
                <span className="text-xs font-semibold text-stone-700">{offer.title}</span>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-stone-100 px-4 pb-5 pt-3">
          <Link
            href="/products"
            onClick={dismiss}
            className="offer-cta block w-full rounded-lg bg-gradient-to-r from-[#E07A2F] to-[#F5A962] py-3 text-center text-sm font-extrabold text-white shadow-md"
          >
            🛒 Shop & Grab Offers
          </Link>
          <button
            onClick={dismiss}
            className="mt-2 w-full py-1.5 text-xs text-stone-400 hover:text-stone-600"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
