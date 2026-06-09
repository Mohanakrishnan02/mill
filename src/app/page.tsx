import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { HeroSection } from "@/components/HeroSection";
import { JourneySection } from "@/components/JourneySection";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { products } from "@/lib/products";
import { DELIVERY } from "@/lib/mill-config";

export default function HomePage() {
  const featured = products.slice(0, 8);

  return (
    <>
      <HeroSection />

      {/* Info band */}
      <RevealOnScroll>
        <section className="bg-[#2e7d32] py-4 text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:px-6">
            {[
              { t: `Free Delivery ≤${DELIVERY.freeKm} km`, d: `₹${DELIVERY.ratePerKm}/km beyond · up to ${DELIVERY.maxKm} km` },
              { t: "1 kg – 25 kg Packs", d: `Outstation: min ${DELIVERY.minKgBeyondMaxKm} kg order` },
              { t: "100% Natural", d: "No chemicals, no polish" },
              { t: "Open All Days", d: "9:00 AM – 6:00 PM IST" },
            ].map((item, i) => (
              <RevealOnScroll key={item.t} delay={i * 80} direction="up">
                <div className="border-r border-white/10 px-2 last:border-0">
                  <p className="text-xs font-bold">{item.t}</p>
                  <p className="text-[10px] text-white/55">{item.d}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <JourneySection />

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <RevealOnScroll>
          <div className="flex items-end justify-between border-b-2 border-stone-200 pb-3">
            <div>
              <h2 className="text-xl font-bold text-[#5d3a1a]" style={{ fontFamily: "var(--font-yeseva)" }}>
                Traditional Rice Varieties <span className="text-[#e07b00]">— Direct from Mill</span>
              </h2>
              <p className="mt-1 text-sm text-stone-500">Cart saved automatically · Online payment only</p>
            </div>
            <Link href="/products" className="text-sm font-bold text-[#2874f0] hover:underline">
              View All 12 →
            </Link>
          </div>
        </RevealOnScroll>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {featured.map((product, i) => (
            <RevealOnScroll key={product.id} delay={i * 60} direction="scale">
              <ProductCard product={product} />
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Payment strip */}
      <RevealOnScroll>
        <section className="border-y border-stone-200 bg-white py-6 text-center">
          <p className="text-xs font-bold text-stone-700">SECURE PAYMENT — NO COD</p>
          <p className="mt-2 text-xs text-stone-500">
            UPI (GPay, PhonePe, Paytm) · Credit & Debit Cards · Net Banking
          </p>
        </section>
      </RevealOnScroll>
    </>
  );
}
