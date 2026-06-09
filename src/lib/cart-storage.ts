import { CART_STORAGE_KEY } from "./mill-config";
import { CartState } from "@/types";

const emptyState: CartState = { items: [], savedForLater: [] };

export function loadCartFromStorage(): CartState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as CartState;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      savedForLater: Array.isArray(parsed.savedForLater) ? parsed.savedForLater : [],
    };
  } catch {
    return emptyState;
  }
}

export function saveCartToStorage(state: CartState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}
