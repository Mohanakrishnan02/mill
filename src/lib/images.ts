/** Centralized image URLs — local product photos + Pexels for journey steps. */

const pexels = (id: number, w = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const IMAGES = {
  annapurna: "/images/annapurna.png",
  heroBg: pexels(1072824, 1920),

  journey: {
    fields: "/images/paddy-field.png",
    harvest: "/images/hand-harvest.png",
    drying: pexels(24991359),
    milling: pexels(4110256),
    sorting: pexels(4110251),
    packing: "/images/packed-delivered.png",
    legacyFatherSon: "/images/father-son-legacy.png",
    pureRiceTrust: "/images/pure-rice-trust.png",
  },

  products: {
    jgl: "/images/jgl.png",
    akshayaRice: "/images/akshaya-rice.png",
    ponniBoiled: "/images/ponni-boiled.png",
    ponniRaw: "/images/ponni-raw.png",
    rnr15048: "/images/rnr-15048.png",
  },
} as const;

export function isImageUrl(src: string): boolean {
  return src.startsWith("http") || src.startsWith("/");
}
