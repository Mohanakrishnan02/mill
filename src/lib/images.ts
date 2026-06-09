/** Centralized natural / realistic image URLs (Pexels + Wikimedia Commons). */

const pexels = (id: number, w = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const IMAGES = {
  /** Goddess Annapurna (Annaporani) — traditional devotional art */
  annapurna: "/images/annapurna.png",

  heroBg: pexels(1072824, 1920),

  journey: {
    fields: "/images/paddy-field.png",
    harvest: "/images/hand-harvest.png",
    drying: pexels(24991359),
    milling: pexels(4110256),
    sorting: pexels(4110251),
    packing: "/images/packed-delivered.png",
    /** Father-to-son generational legacy illustration */
    legacyFatherSon: "/images/father-son-legacy.png",
    /** Pure Rice. Pure Trust. banner */
    pureRiceTrust: "/images/pure-rice-trust.png",
  },

  products: {
    seeragaSamba: pexels(4110140),
    mappillaiSamba: pexels(360941),
    kichiliSamba: pexels(4110150),
    ponniRaw: pexels(209487),
    ponniBoiled: pexels(2882154),
    kattuyanam: pexels(1279330),
    illupaiPoo: pexels(8386683),
    thooyamalli: pexels(2673356),
    kuruva: pexels(4110140, 600),
    redRaw: pexels(360941, 600),
    bamboo: pexels(1181717),
    kavuni: pexels(1379640),
  },
} as const;

export function isImageUrl(src: string): boolean {
  return src.startsWith("http") || src.startsWith("/");
}
