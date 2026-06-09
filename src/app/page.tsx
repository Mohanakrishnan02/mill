import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { JourneySection } from "@/components/JourneySection";
import { products } from "@/lib/products";
import { MILL, DELIVERY } from "@/lib/mill-config";

export default function HomePage() {
  const featured = products.slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#5d3a1a] text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-[#f5a623]">
            🌾 Traditional Rice · Melur, Madurai
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: "var(--font-yeseva)" }}>
            ஜெயலட்சுமி விலாஸ்<br />
            <em className="not-italic text-[#f5a623]">Rice Mill, Melur</em>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70">
            Direct from our mill to your kitchen — stone-milled, hand-sorted traditional rice varieties. No middlemen. Pure quality since generations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="rounded bg-[#e07b00] px-6 py-3 text-sm font-bold hover:bg-[#f5a623]">
              🛒 Shop Rice Varieties
            </Link>
            <a href={`tel:${MILL.phone}`} className="rounded border-2 border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10">
              📞 Call {MILL.phone}
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-8">
            {[
              { n: "12+", l: "Varieties" },
              { n: "100%", l: "Traditional" },
              { n: "All Days", l: "Open" },
              { n: "Free", l: `≤${DELIVERY.freeKm} km` },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-bold text-[#f5a623]" style={{ fontFamily: "var(--font-yeseva)" }}>{s.n}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/50">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info band */}
      <section className="bg-[#2e7d32] py-4 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:px-6">
          {[
            { t: `Free Delivery ≤${DELIVERY.freeKm} km`, d: `₹${DELIVERY.ratePerKm}/km beyond · up to ${DELIVERY.maxKm} km` },
            { t: "1 kg – 25 kg Packs", d: `Outstation: min ${DELIVERY.minKgBeyondMaxKm} kg order` },
            { t: "100% Natural", d: "No chemicals, no polish" },
            { t: "Open All Days", d: "9:00 AM – 6:00 PM IST" },
          ].map((item) => (
            <div key={item.t} className="border-r border-white/10 px-2 last:border-0">
              <p className="text-xs font-bold">{item.t}</p>
              <p className="text-[10px] text-white/55">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <JourneySection />

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
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
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Payment strip */}
      <section className="border-y border-stone-200 bg-white py-6 text-center">
        <p className="text-xs font-bold text-stone-700">SECURE PAYMENT — NO COD</p>
        <p className="mt-2 text-xs text-stone-500">
          UPI (GPay, PhonePe, Paytm) · Credit & Debit Cards · Net Banking
        </p>
      </section>
    </>
  );
}
