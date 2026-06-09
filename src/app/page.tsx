import { ProductCarousel } from "@/components/ProductCarousel";
import { HeroSection } from "@/components/HeroSection";
import { JourneySection } from "@/components/JourneySection";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { DELIVERY } from "@/lib/mill-config";

export default function HomePage() {
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
          <div className="border-b-2 border-stone-200 pb-3">
            <h2 className="text-xl font-bold text-[#5d3a1a]" style={{ fontFamily: "var(--font-yeseva)" }}>
              Traditional Rice Varieties <span className="text-[#e07b00]">— Direct from Mill</span>
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Featured: JGL, Akshaya & Ponni Boiled · Use → to see full catalog
            </p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <div className="mt-8">
            <ProductCarousel />
          </div>
        </RevealOnScroll>
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
