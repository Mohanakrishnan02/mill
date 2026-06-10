import Image from "next/image";
import { IMAGES } from "@/lib/images";

export function LegacyGenerationImage() {
  return (
    <div className="legacy-gen-wrap relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a1a08] shadow-2xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[5/4]">
        <Image
          src={IMAGES.journey.legacyFatherSon}
          alt="Father and son — two generations of traditional rice milling at Jayalakshmi Vilas, Melur"
          fill
          className="object-contain p-4 transition-transform duration-700 hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      <div className="border-t border-white/10 bg-[#0a1a08]/90 px-4 py-3 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#F5A962]">
          Father → Son · 20 Years of Trust
        </p>
        <p className="text-[11px] text-white/50" style={{ fontFamily: "var(--font-tamil)" }}>
          தந்தையிடமிருந்து மகன் வரை — அதே பாரம்பரிய அரைப்பு முறை
        </p>
      </div>
      <div className="journey-shimmer pointer-events-none absolute inset-0" aria-hidden />
    </div>
  );
}
