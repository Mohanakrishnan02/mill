export interface ProductVariant {
  id: string;
  label: string;
  weight: string;
  weightKg?: number;
  price: number;
  mrp: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tamil?: string;
  category: string;
  description: string;
  image: string;
  badge?: "popular" | "organic" | "raw";
  badgeLabel?: string;
  variants: ProductVariant[];
  tags?: string[];
}

export interface CartItem {
  productId: string;
  productSlug: string;
  variantId: string;
  name: string;
  tamil?: string;
  variantLabel: string;
  weightKg: number;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
}

export interface SavedItem extends CartItem {}

export interface CartState {
  items: CartItem[];
  savedForLater: SavedItem[];
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderSummary {
  subtotal: number;
  mrpTotal: number;
  discount: number;
  promoDiscount: number;
  delivery: number;
  total: number;
  deliveryDistanceKm: number | null;
  isOutstation: boolean;
  totalKg: number;
}
