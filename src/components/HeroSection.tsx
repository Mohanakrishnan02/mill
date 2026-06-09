"use client";

import Image from "next/image";
import Link from "next/link";
import { MILL, DELIVERY } from "@/lib/mill-config";
import { IMAGES } from "@/lib/images";

export function HeroSection() {
  return (
    <section className="relative min-h-[520px] overflow-hidden bg-[#5d3a1a] text-white lg:min-h-[580px]">
      {/* Background paddy field */}
      <Image
        src={IMAGES.heroBg}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f05]/95 via-[#1a0f05]/75 to-[#1a0f05]/40" />
      <div className="hero-mesh absolute inset-0 opacity-30" aria-hidden />

      {/* Floating grain particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="hero-grain-particle"
            style={{
              left: `${(i * 8.3 + 5) % 100}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${6 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
        {/* Left — copy */}
        <div className="hero-stagger">
          <p className="hero-item inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-[#f5a623] backdrop-blur-sm">
            🌾 Traditional Rice · Melur, Madurai
          </p>
          <h1
            className="hero-item mt-4 text-4xl font-bold leading-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-yeseva)" }}
          >
            ஜெயலட்சுமி விலாஸ்
            <br />
            <em className="not-italic text-[#f5a623]">Rice Mill, Melur</em>
          </h1>
          <p
            className="hero-item mt-2 text-sm text-[#f5a623]/80"
            style={{ fontFamily: "var(--font-tamil)" }}
          >
            பாரம்பரிய நெல் அரைப்பு — மேலூர், மதுரை
          </p>
          <p className="hero-item mt-4 max-w-lg text-sm leading-relaxed text-white/75">
            Direct from our mill to your kitchen — stone-milled, hand-sorted traditional rice
            varieties. No middlemen. Pure quality since generations.
          </p>
          <div className="hero-item mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="btn-shimmer rounded bg-[#e07b00] px-6 py-3 text-sm font-bold shadow-lg shadow-[#e07b00]/30 transition hover:scale-[1.03] hover:bg-[#f5a623]"
            >
              🛒 Shop Rice Varieties
            </Link>
            <a
              href={`tel:${MILL.phone}`}
              className="rounded border-2 border-white/30 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition hover:scale-[1.03] hover:bg-white/10"
            >
              📞 Call {MILL.phone}
            </a>
          </div>
          <div className="hero-item mt-10 grid grid-cols-2 gap-6 sm:flex sm:flex-wrap sm:gap-8">
            {[
              { n: "12+", l: "Varieties" },
              { n: "100%", l: "Traditional" },
              { n: "All Days", l: "Open" },
              { n: "Free", l: `≤${DELIVERY.freeKm} km` },
            ].map((s) => (
              <div key={s.l} className="stat-pop">
                <p
                  className="text-2xl font-bold text-[#f5a623]"
                  style={{ fontFamily: "var(--font-yeseva)" }}
                >
                  {s.n}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-white/50">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Annaporani */}
        <div className="hero-item relative mx-auto w-full max-w-sm lg:max-w-md">
          <div className="hero-glow-ring absolute inset-0 rounded-full" aria-hidden />
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#f5a623]/40 bg-[#1a0f05]/60 p-3 shadow-2xl shadow-[#f5a623]/20 backdrop-blur-md animate-float">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
              <Image
                src={IMAGES.annapurna}
                alt="Goddess Annapurna (Annaporani) — Hindu goddess of food and nourishment"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 1024px) 80vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f05]/80 via-transparent to-transparent" />
            </div>
            <div className="mt-3 text-center">
              <p
                className="text-lg font-bold text-[#f5a623]"
                style={{ fontFamily: "var(--font-yeseva)" }}
              >
                அன்னபூரணி · Annaporani
              </p>
              <p
                className="mt-1 text-xs text-white/60"
                style={{ fontFamily: "var(--font-tamil)" }}
              >
                உணவின் தெய்வம் — நெல்லும் அரிசியும் அவள் அருள்
              </p>
              <p className="mt-1 text-[10px] text-white/40">
                Goddess of nourishment · Blessing every grain we mill
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
