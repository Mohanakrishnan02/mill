"use client";

import { useEffect, useState } from "react";

export function useSectionHighlight(sectionId: string) {
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    const run = () => {
      if (window.location.hash !== `#${sectionId}`) {
        setHighlighted(false);
        return undefined;
      }
      setHighlighted(true);
      return window.setTimeout(() => setHighlighted(false), 3200);
    };

    let timer = run();
    const onHash = () => {
      if (timer) window.clearTimeout(timer);
      timer = run();
    };

    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      if (timer) window.clearTimeout(timer);
    };
  }, [sectionId]);

  return highlighted;
}
