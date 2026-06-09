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
          <span className="journey-badge-pop inline-flex items-center gap-2 rounded-full border border-[#f5a623]/40 bg-[#f5a623]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#f5a623]">
            🌾 Our Journey · எங்கள் பயணம்
          </span>
          <h2
            className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-yeseva)" }}
          >
            <span className="text-[#f5a623]">
              <AnimatedCounter target={JOURNEY.yearsExperience} suffix="+" active={hero.visible} />
            </span>{" "}
            Years of
            <br />
            <em className="not-italic text-white">Traditional Rice Milling</em>
          </h2>
          <p
            className="mt-3 text-lg text-[#f5a623]/90"
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
                className="text-3xl font-bold text-[#f5a623] sm:text-4xl"
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
              From Father to Son — <span className="text-[#f5a623]">Every Grain</span>
            </h3>
            <p
              className="text-base text-[#f5a623]/90"
              style={{ fontFamily: "var(--font-tamil)" }}
            >
              தந்தையிடமிருந்து மகன் வரை — தலைமுறை பாரம்பரியம்
            </p>
            <p className="text-sm leading-relaxed text-white/70">
              In 2003, our father founded Jayalakshmi Vilas on Sivagangai Main Road, Melur — with
              one promise: stone-milled rice, honest weight, and no shortcuts. Today, the next
              generation carries that same trust forward — from paddy fields to your kitchen.
            </p>
            <p
              className="text-sm leading-relaxed text-white/55"
              style={{ fontFamily: "var(--font-tamil)" }}
            >
              2003-ல் எங்கள் தந்தை மேலூரில் ஜெயலட்சுமி விலாஸ் நெல் ஆலையை தொடங்கினார் — கல்
              அரைப்பு, நேர்மையான எடை, குறுக்கு வழி இல்லை என்ற வாக்குறுதியுடன். இன்று அடுத்த
              தலைமுறை அதே நம்பிக்கையை நெல் வயலில் இருந்து உங்கள் சமையலறை வரை கொண்டு செல்கிறது.
            </p>
            <ul className="space-y-3">
              {[
                {
                  en: "Father's generation — founded the mill with traditional values",
                  ta: "தந்தை தலைமுறை — பாரம்பரிய முறையில் ஆலை தொடங்கியது",
                },
                {
                  en: "Son's generation — 23+ years of milling expertise continues",
                  ta: "மகன் தலைமுறை — 23+ ஆண்டு அனுபவம் தொடர்கிறது",
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
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e07b00] text-[10px]">
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
              Our Milestones · <span className="text-[#f5a623]">முக்கிய நிகழ்வுகள்</span>
            </h3>
          </div>
          <div className="relative mt-10">
            <div
              className={`absolute left-4 top-0 hidden h-full w-0.5 bg-gradient-to-b from-[#e07b00] via-[#f5a623] to-[#2e7d32] sm:left-1/2 sm:block sm:-translate-x-px ${timeline.visible ? "journey-line-grow" : "opacity-0"}`}
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
                    <span className="inline-block rounded-full bg-[#e07b00] px-3 py-1 text-xs font-bold">
                      {m.year}
                    </span>
                    <h4 className="mt-2 text-lg font-bold">{m.titleEn}</h4>
                    <p
                      className="text-sm text-[#f5a623]/80"
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
                    className={`absolute left-4 top-3 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#f5a623] bg-[#0a1a08] sm:left-1/2 sm:block ${timeline.visible ? "journey-dot-pulse" : ""}`}
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
                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#e07b00] text-sm font-bold shadow-lg">
                  {i + 1}
                </span>
                <span className="absolute right-3 top-3 text-2xl drop-shadow-lg">{step.icon}</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white">{step.titleEn}</h4>
                <p
                  className="text-sm text-[#f5a623]/90"
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

        {/* Secondary video strip */}
        <div className="journey-video-strip relative mt-14 overflow-hidden rounded-2xl border border-white/10">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-48 w-full object-cover sm:h-64"
            poster="https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=1920"
          >
            <source
              src="https://videos.pexels.com/video-files/4516279/4516279-hd_1920_1080_25fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center px-4">
              <p
                className="text-xl font-bold sm:text-2xl"
                style={{ fontFamily: "var(--font-yeseva)" }}
              >
                Pure Rice. Pure Trust. · <span className="text-[#f5a623]">தூய அரிசி. தூய நம்பிக்கை.</span>
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
