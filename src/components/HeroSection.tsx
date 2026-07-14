"use client";

import Image from "next/image";
import Link from "next/link";
import { MILL, DELIVERY } from "@/lib/mill-config";
import { IMAGES } from "@/lib/images";

export function HeroSection() {
  return (
    <section className="relative min-h-[520px] overflow-hidden bg-[#1E4D2B] text-white lg:min-h-[580px]">
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
      <div className="absolute inset-0 bg-gradient-to-r from-[#14261C]/95 via-[#14261C]/75 to-[#14261C]/40" />
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
          <p className="hero-item inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-[#E8C547] backdrop-blur-sm">
            🌾 Traditional Rice · Melur, Madurai
          </p>
          <h1
            className="hero-item mt-4 text-4xl font-bold leading-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-yeseva)" }}
          >
            ஜெயலட்சுமி விலாஸ்
            <br />
            <em className="not-italic text-[#E8C547]">Rice Mill, Melur</em>
          </h1>
          <p
            className="hero-item mt-2 text-sm text-[#E8C547]/80"
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
              className="btn-shimmer rounded bg-[#D4A017] px-6 py-3 text-sm font-bold text-[#14261C] shadow-lg shadow-[#D4A017]/30 transition hover:scale-[1.03] hover:bg-[#E8C547]"
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
              { n: "5", l: "Varieties" },
              { n: "100%", l: "Traditional" },
              { n: "All Days", l: "Open" },
              { n: "Free", l: `≤${DELIVERY.freeKm} km` },
            ].map((s) => (
              <div key={s.l} className="stat-pop">
                <p
                  className="text-2xl font-bold text-[#E8C547]"
                  style={{ fontFamily: "var(--font-yeseva)" }}
                >
                  {s.n}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-white/50">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Annaporani (traditional art) */}
        <div className="hero-item relative mx-auto w-full max-w-xl lg:max-w-2xl">
          <div className="hero-glow-ring absolute -inset-4 rounded-3xl opacity-60" aria-hidden />
          <div className="annapurna-frame relative overflow-hidden rounded-2xl border-2 border-[#E8C547]/50 shadow-2xl shadow-[#E8C547]/25 animate-float">
            <div className="relative aspect-[1000/666] w-full overflow-hidden bg-[#14261C]">
              <Image
                src={IMAGES.annapurna}
                alt="Annapurna — Hindu goddess of nourishment and abundance, feeding the world"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 95vw, 640px"
              />
              {/* Subtle sparkle overlay like reference art */}
              <div className="annapurna-sparkles pointer-events-none absolute inset-0" aria-hidden />
            </div>
            <div className="border-t border-[#E8C547]/30 bg-gradient-to-r from-[#14261C] via-[#14261C] to-[#14261C] px-4 py-3 text-center">
              <p
                className="text-base font-bold text-[#E8C547] sm:text-lg"
                style={{ fontFamily: "var(--font-yeseva)" }}
              >
                அன்னபூரணி · Annaporani
              </p>
              <p
                className="mt-1 text-xs text-white/70 sm:text-sm"
                style={{ fontFamily: "var(--font-tamil)" }}
              >
                உலகத்தை உணவால் நிரப்பும் தெய்வம் — நெல்லும் அரிசியும் அவள் அருள்
              </p>
              <p className="mt-1 text-[10px] text-white/45">
                The Goddess who feeds the world · Blessing every grain we mill
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
