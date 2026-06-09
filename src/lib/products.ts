import { Product } from "@/types";
import { IMAGES } from "./images";

type PriceMap = Record<number, number>;

function variantsFromPrices(prices: PriceMap, prefix: string) {
  return Object.entries(prices).map(([kg, price]) => {
    const k = parseInt(kg, 10);
    const perKg = price / k;
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

export const products: Product[] = [
  makeProduct(1, "Seeraga Samba", "சீரக சம்பா", "popular", "Best Seller",
    "Tiny ultra-fragrant rice for biryanis & pulavs. Pride of Tamil Nadu kitchens.",
    { 1: 80, 5: 370, 10: 720, 25: 1700 }, IMAGES.products.seeragaSamba),
  makeProduct(2, "Mappillai Samba", "மாப்பிள்ளை சம்பா", "organic", "Organic",
    "Dark-red heritage rice rich in iron and fibre. A nutritional powerhouse.",
    { 1: 90, 5: 420, 10: 820, 25: 1950 }, IMAGES.products.mappillaiSamba),
  makeProduct(3, "Kichili Samba", "கிச்சிலி சம்பா", "popular", "Popular",
    "Short-grain fragrant rice, soft and sticky. Great for pongal and sweet rice.",
    { 1: 75, 5: 340, 10: 660, 25: 1550 }, IMAGES.products.kichiliSamba),
  makeProduct(4, "Ponni Raw Rice", "பொன்னி பச்சரிசி", "raw", "Raw Rice",
    "Classic Ponni variety — everyday Tamil Nadu rice. Fluffy, non-sticky.",
    { 1: 55, 5: 255, 10: 490, 25: 1150 }, IMAGES.products.ponniRaw),
  makeProduct(5, "Ponni Boiled Rice", "பொன்னி புழுங்கல்", "raw", "Boiled",
    "Steam-cooked Ponni for better nutrients. Most-used rice in South Indian homes.",
    { 1: 60, 5: 270, 10: 520, 25: 1200 }, IMAGES.products.ponniBoiled),
  makeProduct(6, "Kattuyanam", "காட்டுயானம்", "organic", "Heritage",
    "Ancient forest rice — black-pigmented, high in antioxidants. Truly rare.",
    { 1: 110, 5: 520, 10: 1020, 25: 2400 }, IMAGES.products.kattuyanam),
  makeProduct(7, "Illupai Poo Samba", "இலுப்பைப்பூ சம்பா", "organic", "Rare",
    "Aromatic heritage rice with floral scent resembling illupai flowers.",
    { 1: 95, 5: 440, 10: 860, 25: 2050 }, IMAGES.products.illupaiPoo),
  makeProduct(8, "Thooyamalli", "தூயமல்லி", "popular", "Fragrant",
    "Long-grain white rice with jasmine-like aroma. Premium variety.",
    { 1: 85, 5: 390, 10: 760, 25: 1800 }, IMAGES.products.thooyamalli),
  makeProduct(9, "Kuruva Rice", "குறுவை அரிசி", "raw", "Short Crop",
    "Short-duration variety. Light on the stomach — ideal for elderly.",
    { 1: 65, 5: 290, 10: 560, 25: 1300 }, IMAGES.products.kuruva),
  makeProduct(10, "Red Raw Rice", "சிவப்பு பச்சரிசி", "organic", "Red Rice",
    "Unpolished red rice full of fibre and minerals. Earthy taste.",
    { 1: 80, 5: 370, 10: 720, 25: 1700 }, IMAGES.products.redRaw),
  makeProduct(11, "Bamboo Rice", "மூங்கில் அரிசி", "organic", "Tribal",
    "Rare bamboo seed rice. Extremely nutritious — packed with phosphorus.",
    { 1: 150, 5: 720, 10: 1400, 25: 3300 }, IMAGES.products.bamboo),
  makeProduct(12, "Kavuni Rice", "கவுநி அரிசி", "organic", "Black Rice",
    "Black glutinous rice — treasure of Tamil medicine. Rich in anthocyanins.",
    { 1: 120, 5: 560, 10: 1100, 25: 2600 }, IMAGES.products.kavuni),
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

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.tamil?.includes(q) ?? false) ||
      p.description.toLowerCase().includes(q)
  );
}
