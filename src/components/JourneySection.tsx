"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  JOURNEY,
  journeyMilestones,
  journeyStats,
  journeySteps,
} from "@/lib/journey-content";
import { IMAGES } from "@/lib/images";
import { useSectionHighlight } from "@/hooks/useSectionHighlight";
import { LegacyGenerationImage } from "@/components/LegacyGenerationImage";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function AnimatedCounter({
  target,
  suffix = "",
  active,
}: {
  target: number;
  suffix?: string;
  active: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target]);

  return (
    <span>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function JourneySection() {
  const highlighted = useSectionHighlight("journey");
  const hero = useInView(0.1);
  const story = useInView(0.12);
  const timeline = useInView(0.1);
  const steps = useInView(0.08);

  return (
    <section
      id="journey"
      className={`relative scroll-mt-24 overflow-hidden bg-[#0a1a08] text-white transition-shadow duration-500 ${highlighted ? "journey-section-spotlight" : ""}`}
    >
      {/* Background video */}
      <div className="pointer-events-none absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={JOURNEY.videoPoster}
          className="h-full w-full object-cover opacity-35"
        >
          <source src={JOURNEY.videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a08]/90 via-[#0a1a08]/75 to-[#0a1a08]" />
        <div className="journey-grain-field absolute inset-0 overflow-hidden" aria-hidden>
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="journey-grain"
              style={{
                left: `${(i * 5.5 + 2) % 100}%`,
                animationDelay: `${(i * 0.7) % 6}s`,
                animationDuration: `${5 + (i % 4)}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero intro */}
      <div
        ref={hero.ref}
        className={`relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20 ${hero.visible ? "journey-fade-up" : "opacity-0"}`}
      >
        <div className="mx-auto max-w-3xl text-center">
          <span className="journey-badge-pop inline-flex items-center gap-2 rounded-full border border-[#F5A962]/40 bg-[#F5A962]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#F5A962]">
            🌾 Our Journey · எங்கள் பயணம்
          </span>
          <h2
            className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-yeseva)" }}
          >
            <span className="text-[#F5A962]">
              <AnimatedCounter target={JOURNEY.yearsExperience} suffix="+" active={hero.visible} />
            </span>{" "}
            Years of
            <br />
            <em className="not-italic text-white">Traditional Rice Milling</em>
          </h2>
          <p
            className="mt-3 text-lg text-[#F5A962]/90"
            style={{ fontFamily: "var(--font-tamil)" }}
          >
            {JOURNEY.yearsExperience} ஆண்டுகள் பாரம்பரிய நெல் அரைப்பு அனுபவம்
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Since {JOURNEY.foundedYear}, Jayalakshmi Vilas Rice Mill has served Melur and Madurai
            with stone-milled, hand-sorted traditional rice — from our family to yours.
          </p>
          <p
            className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base"
            style={{ fontFamily: "var(--font-tamil)" }}
          >
            {JOURNEY.foundedYear} முதல், ஜெயலட்சுமி விலாஸ் நெல் ஆலை மேலூர் மற்றும் மதுரை
            மக்களுக்கு கல் அரைத்த, கையால் தேர்ந்தெடுக்கப்பட்ட பாரம்பரிய அரிசி வழங்கி
            வருகிறது — எங்கள் குடும்பத்திலிருந்து உங்கள் சமையலறைக்கு.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {journeyStats.map((stat, i) => (
            <div
              key={stat.labelEn}
              className={`journey-stat-card rounded-xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm ${hero.visible ? "journey-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            >
              <p
                className="text-3xl font-bold text-[#F5A962] sm:text-4xl"
                style={{ fontFamily: "var(--font-yeseva)" }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} active={hero.visible} />
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                {stat.labelEn}
              </p>
              <p
                className="mt-0.5 text-[11px] text-white/45"
                style={{ fontFamily: "var(--font-tamil)" }}
              >
                {stat.labelTa}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Story + image */}
      <div
        ref={story.ref}
        className={`relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 ${story.visible ? "journey-fade-up" : "opacity-0"}`}
      >
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <LegacyGenerationImage />

          <div className="space-y-5">
            <h3
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-yeseva)" }}
            >
              From Father to Son — <span className="text-[#F5A962]">Every Grain</span>
            </h3>
            <p
              className="text-base text-[#F5A962]/90"
              style={{ fontFamily: "var(--font-tamil)" }}
            >
              தந்தையிடமிருந்து மகன் வரை — தலைமுறை பாரம்பரியம்
            </p>
            <p className="text-sm leading-relaxed text-white/70">
              Our father started this rice mill and ran it for 20 years — stone-milled rice, honest
              weight, and no shortcuts. Today, his son carries forward the exact same process his
              father taught, from paddy fields to your kitchen.
            </p>
            <p
              className="text-sm leading-relaxed text-white/55"
              style={{ fontFamily: "var(--font-tamil)" }}
            >
              எங்கள் தந்தை இந்த நெல் ஆலையை தொடங்கி 20 ஆண்டுகள் நடத்தினார் — கல் அரைப்பு,
              நேர்மையான எடை, குறுக்கு வழி இல்லை. இன்று அவரது மகன் தந்தை கற்ற அதே முறையையே
              தொடர்கிறார் — நெல் வயலில் இருந்து உங்கள் சமையலறை வரை.
            </p>
            <ul className="space-y-3">
              {[
                {
                  en: "Father's generation — started and ran the mill for 20 years",
                  ta: "தந்தை தலைமுறை — 20 ஆண்டுகள் பாரம்பரிய முறையில் ஆலை நடத்தினார்",
                },
                {
                  en: "Son's generation — continues the same process his father taught",
                  ta: "மகன் தலைமுறை — தந்தை கற்ற அதே அரைப்பு முறையை தொடர்கிறார்",
                },
                {
                  en: "Trusted by homes, caterers & temples across Melur & Madurai",
                  ta: "மேலூர், மதுரை வீடுகள், உணவு விருந்து நிறுவனங்கள், கோவில்கள் நம்பும் தரம்",
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className={`flex gap-3 text-sm ${story.visible ? "journey-slide-in" : "opacity-0"}`}
                  style={{ animationDelay: `${0.2 + i * 0.12}s` }}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E07A2F] text-[10px]">
                    ✓
                  </span>
                  <div>
                    <p className="text-white/80">{item.en}</p>
                    <p
                      className="mt-0.5 text-xs text-white/45"
                      style={{ fontFamily: "var(--font-tamil)" }}
                    >
                      {item.ta}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div
        ref={timeline.ref}
        className="relative border-y border-white/10 bg-black/30 py-14 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h3
              className="text-xl font-bold sm:text-2xl"
              style={{ fontFamily: "var(--font-yeseva)" }}
            >
              Our Milestones · <span className="text-[#F5A962]">முக்கிய நிகழ்வுகள்</span>
            </h3>
          </div>
          <div className="relative mt-10">
            <div
              className={`absolute left-4 top-0 hidden h-full w-0.5 bg-gradient-to-b from-[#E07A2F] via-[#F5A962] to-[#7A2E3A] sm:left-1/2 sm:block sm:-translate-x-px ${timeline.visible ? "journey-line-grow" : "opacity-0"}`}
            />
            <div className="space-y-8">
              {journeyMilestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative grid items-center gap-4 sm:grid-cols-2 sm:gap-8 ${timeline.visible ? "journey-fade-up" : "opacity-0"}`}
                  style={{ animationDelay: `${0.1 + i * 0.15}s` }}
                >
                  <div
                    className={`${i % 2 === 0 ? "sm:text-right sm:pr-10" : "sm:order-2 sm:pl-10"}`}
                  >
                    <span className="inline-block rounded-full bg-[#E07A2F] px-3 py-1 text-xs font-bold">
                      {m.year}
                    </span>
                    <h4 className="mt-2 text-lg font-bold">{m.titleEn}</h4>
                    <p
                      className="text-sm text-[#F5A962]/80"
                      style={{ fontFamily: "var(--font-tamil)" }}
                    >
                      {m.titleTa}
                    </p>
                    <p className="mt-1 text-sm text-white/55">{m.descEn}</p>
                    <p
                      className="mt-1 text-xs text-white/40"
                      style={{ fontFamily: "var(--font-tamil)" }}
                    >
                      {m.descTa}
                    </p>
                  </div>
                  <div
                    className={`hidden sm:block ${i % 2 === 0 ? "sm:order-2" : ""}`}
                    aria-hidden
                  />
                  <div
                    className={`absolute left-4 top-3 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#F5A962] bg-[#0a1a08] sm:left-1/2 sm:block ${timeline.visible ? "journey-dot-pulse" : ""}`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Process steps */}
      <div
        ref={steps.ref}
        className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20"
      >
        <div className="text-center">
          <h3
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-yeseva)" }}
          >
            From Soil to Your Plate
          </h3>
          <p className="mt-1 text-sm text-white/50">
            மண்ணிலிருந்து உங்கள் தட்டு வரை — ஒவ்வொரு அரிசி தானியத்தின் பயணம்
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {journeySteps.map((step, i) => (
            <article
              key={step.id}
              className={`journey-step-card group overflow-hidden rounded-xl border border-white/10 bg-white/5 ${steps.visible ? "journey-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${0.08 + i * 0.08}s` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.titleEn}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#E07A2F] text-sm font-bold shadow-lg">
                  {i + 1}
                </span>
                <span className="absolute right-3 top-3 text-2xl drop-shadow-lg">{step.icon}</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white">{step.titleEn}</h4>
                <p
                  className="text-sm text-[#F5A962]/90"
                  style={{ fontFamily: "var(--font-tamil)" }}
                >
                  {step.titleTa}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-white/60">{step.descEn}</p>
                <p
                  className="mt-1 text-[11px] leading-relaxed text-white/40"
                  style={{ fontFamily: "var(--font-tamil)" }}
                >
                  {step.descTa}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Pure Rice. Pure Trust. banner */}
        <div className="journey-video-strip relative mt-14 overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={IMAGES.journey.pureRiceTrust}
            alt="Pure rice from paddy fields to your bowl — Jayalakshmi Vilas Rice Mill, Melur"
            width={1920}
            height={640}
            className="h-48 w-full object-cover sm:h-64"
            sizes="100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <div className="text-center px-4">
              <p
                className="text-xl font-bold sm:text-2xl"
                style={{ fontFamily: "var(--font-yeseva)" }}
              >
                Pure Rice. Pure Trust. · <span className="text-[#F5A962]">தூய அரிசி. தூய நம்பிக்கை.</span>
              </p>
              <p
                className="mt-2 text-sm text-white/70"
                style={{ fontFamily: "var(--font-tamil)" }}
              >
                {JOURNEY.yearsExperience} ஆண்டுகள் — மேலூரின் நம்பிக்கைக்குரிய நெல் ஆலை
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
