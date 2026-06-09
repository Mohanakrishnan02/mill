"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useActiveSection(sectionId: string) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const readHash = () => setHash(window.location.hash);
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setInView(false);
      return;
    }
    const el = document.getElementById(sectionId);
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "-20% 0px -55% 0px", threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pathname, sectionId]);

  const active =
    pathname === "/" && (hash === `#${sectionId}` || (inView && hash !== "#contact"));

  return { active, hash, pathname };
}

export function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.pushState(null, "", `/#${sectionId}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}
