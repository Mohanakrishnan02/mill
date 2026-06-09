import { Product } from "@/types";
import { IMAGES } from "./images";

type PriceMap = Record<number, number>;

function variantsFromPrices(prices: PriceMap, prefix: string) {
  return Object.entries(prices).map(([kg, price]) => {
    const k = parseInt(kg, 10);
    const mrp = Math.round(price * 1.06);
    return {
      id: `${prefix}-${kg}kg`,
      label: `${kg} kg`,
      weight: `${kg}kg`,
      weightKg: k,
      price,
      mrp,
      inStock: true,
    };
  });
}

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function makeProduct(
  id: number,
  name: string,
  tamil: string,
  badge: "popular" | "organic" | "raw",
  badgeLabel: string,
  desc: string,
  prices: PriceMap,
  image: string
): Product {
  const slug = slugify(name);
  return {
    id: String(id),
    slug,
    name,
    tamil,
    category: badgeLabel,
    description: desc,
    image,
    badge,
    badgeLabel,
    tags: [badgeLabel],
    variants: variantsFromPrices(prices, slug),
  };
}

/** Shown on home page (3 cards + carousel starts here) */
export const HOME_FEATURED_SLUGS = ["jgl", "akshaya-rice", "ponni-boiled-rice"] as const;

export const products: Product[] = [
  makeProduct(1, "JGL", "ஜே.ஜி.எல்", "raw", "Daily Rice",
    "Everyday rice variety from our mill — stone-milled, honest weight, fair price.",
    { 1: 60, 5: 270, 10: 520, 25: 1200 }, IMAGES.products.jgl),
  makeProduct(2, "Akshaya Rice", "அக்ஷயா அரிசி", "popular", "Daily Rice",
    "Soft, white everyday rice — light on the stomach, perfect for daily meals.",
    { 1: 65, 5: 290, 10: 560, 25: 1300 }, IMAGES.products.akshayaRice),
  makeProduct(3, "Ponni Boiled Rice", "பொன்னி புழுங்கல்", "raw", "Boiled",
    "Steam-cooked Ponni for better nutrients. Most-used rice in South Indian homes.",
    { 1: 60, 5: 270, 10: 520, 25: 1200 }, IMAGES.products.ponniBoiled),
  makeProduct(4, "Ponni Raw Rice", "பொன்னி பச்சரிசி", "raw", "Raw Rice",
    "Classic Ponni variety — everyday Tamil Nadu rice. Fluffy, non-sticky.",
    { 1: 55, 5: 255, 10: 490, 25: 1150 }, IMAGES.products.ponniRaw),
  makeProduct(5, "RNR 15048", "ஆர்.என்.ஆர் 15048", "popular", "High Yield",
    "Popular high-yield rice variety — fluffy, non-sticky, ideal for everyday meals.",
    { 1: 65, 5: 290, 10: 560, 25: 1300 }, IMAGES.products.rnr15048),
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getVariant(product: Product, variantId: string) {
  return product.variants.find((v) => v.id === variantId);
}

export function getFeaturedProducts(): Product[] {
  return HOME_FEATURED_SLUGS.map((slug) => products.find((p) => p.slug === slug)).filter(
    (p): p is Product => Boolean(p)
  );
}

export function getAdjacentProducts(slug: string): { prev?: Product; next?: Product } {
  const idx = products.findIndex((p) => p.slug === slug);
  if (idx < 0) return {};
  return {
    prev: idx > 0 ? products[idx - 1] : undefined,
    next: idx < products.length - 1 ? products[idx + 1] : undefined,
  };
}

function fieldMatches(field: string | undefined, q: string): boolean {
  return field?.toLowerCase().includes(q) ?? false;
}

/** Score for ranking; null = no match */
function productMatchScore(product: Product, q: string): number | null {
  const name = product.name.toLowerCase();
  const slug = product.slug.toLowerCase();

  if (name === q) return 100;
  if (name.startsWith(q)) return 90;
  if (name.includes(q)) return 80;
  if (slug.includes(q)) return 75;
  if (fieldMatches(product.tamil, q)) return 70;

  if (q.length < 2) return null;

  if (fieldMatches(product.category, q)) return 55;
  if (fieldMatches(product.badgeLabel, q)) return 50;
  if (product.tags?.some((t) => fieldMatches(t, q))) return 45;

  if (q.length >= 3 && fieldMatches(product.description, q)) return 25;

  return null;
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return products;

  return products
    .map((p) => ({ product: p, score: productMatchScore(p, q) }))
    .filter((row) => row.score !== null)
    .sort(
      (a, b) =>
        b.score! - a.score! ||
        a.product.name.localeCompare(b.product.name, "en", { sensitivity: "base" })
    )
    .map((row) => row.product);
}
