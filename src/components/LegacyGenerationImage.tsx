import Image from "next/image";
import { IMAGES } from "@/lib/images";

export function LegacyGenerationImage() {
  return (
    <div className="legacy-gen-wrap relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr]">
        {/* Father's generation */}
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[3/4]">
          <Image
            src={IMAGES.journey.storyFather}
            alt="Father's generation — founding Jayalakshmi Vilas Rice Mill, Melur"
            fill
            className="object-cover legacy-gen-sepia transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 640px) 100vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-[#e07b00] px-2.5 py-0.5 text-[10px] font-bold text-white">
              2003
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm font-bold text-white">Father&apos;s Generation</p>
            <p className="text-xs font-semibold text-[#f5a623]" style={{ fontFamily: "var(--font-tamil)" }}>
              தந்தை தலைமுறை
            </p>
            <p className="mt-1 text-[10px] text-white/65">Founded the mill · Melur</p>
          </div>
        </div>

        {/* Bridge arrow */}
        <div className="legacy-gen-bridge flex flex-row items-center justify-center gap-2 bg-[#0a1a08] px-4 py-3 sm:flex-col sm:py-8">
          <span className="legacy-gen-arrow text-2xl text-[#f5a623] sm:rotate-0" aria-hidden>
            →
          </span>
          <p
            className="text-center text-[10px] font-bold uppercase tracking-wider text-[#f5a623]/80"
            style={{ fontFamily: "var(--font-tamil)" }}
          >
            தலைமுறை → தலைமுறை
          </p>
        </div>

        {/* Son's generation */}
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[3/4]">
          <Image
            src={IMAGES.journey.storySon}
            alt="Son's generation — continuing Jayalakshmi Vilas Rice Mill tradition"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 640px) 100vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-[#2e7d32] px-2.5 py-0.5 text-[10px] font-bold text-white">
              Today
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm font-bold text-white">Son&apos;s Generation</p>
            <p className="text-xs font-semibold text-[#f5a623]" style={{ fontFamily: "var(--font-tamil)" }}>
              மகன் தலைமுறை
            </p>
            <p className="mt-1 text-[10px] text-white/65">23+ years of trust continues</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#0a1a08]/90 px-4 py-3 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#f5a623]">
          Melur · Madurai · Tamil Nadu
        </p>
        <p className="text-[11px] text-white/50" style={{ fontFamily: "var(--font-tamil)" }}>
          தந்தையிடமிருந்து மகன் வரை — ஜெயலட்சுமி விலாஸ் பாரம்பரியம்
        </p>
      </div>
      <div className="journey-shimmer pointer-events-none absolute inset-0" aria-hidden />
    </div>
  );
}
