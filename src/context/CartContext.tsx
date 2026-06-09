"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadCartFromStorage, saveCartToStorage } from "@/lib/cart-storage";
import { computeOrderSummary } from "@/lib/order-summary";
import { CartItem, CartState, OrderSummary } from "@/types";

interface CartContextValue {
  items: CartItem[];
  savedForLater: CartItem[];
  itemCount: number;
  summary: OrderSummary;
  deliveryDistanceKm: number | null;
  setDeliveryDistanceKm: (km: number | null) => void;
  isHydrated: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  saveForLater: (productId: string, variantId: string) => void;
  moveToCart: (productId: string, variantId: string) => void;
  removeSaved: (productId: string, variantId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function findItemKey(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [], savedForLater: [] });
  const [deliveryDistanceKm, setDeliveryDistanceKm] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setState(loadCartFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(state);
    }
  }, [state, isHydrated]);

  const persist = useCallback((updater: (prev: CartState) => CartState) => {
    setState(updater);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      persist((prev) => {
        const existing = prev.items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (existing) {
          return {
            ...prev,
            items: prev.items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          };
        }
        return { ...prev, items: [...prev.items, { ...item, quantity }] };
      });
      setIsDrawerOpen(true);
    },
    [persist]
  );

  const removeItem = useCallback(
    (productId: string, variantId: string) => {
      persist((prev) => ({
        ...prev,
        items: prev.items.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        ),
      }));
    },
    [persist]
  );

  const updateQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId, variantId);
        return;
      }
      persist((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity }
            : i
        ),
      }));
    },
    [persist, removeItem]
  );

  const saveForLater = useCallback(
    (productId: string, variantId: string) => {
      persist((prev) => {
        const item = prev.items.find(
          (i) => i.productId === productId && i.variantId === variantId
        );
        if (!item) return prev;

        const alreadySaved = prev.savedForLater.some(
          (s) => s.productId === productId && s.variantId === variantId
        );

        return {
          items: prev.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
          savedForLater: alreadySaved
            ? prev.savedForLater
            : [...prev.savedForLater, item],
        };
      });
    },
    [persist]
  );

  const moveToCart = useCallback(
    (productId: string, variantId: string) => {
      persist((prev) => {
        const saved = prev.savedForLater.find(
          (s) => s.productId === productId && s.variantId === variantId
        );
        if (!saved) return prev;

        const inCart = prev.items.find(
          (i) => i.productId === productId && i.variantId === variantId
        );

        let items = prev.items.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        );

        if (inCart) {
          items = [
            ...items,
            { ...inCart, quantity: inCart.quantity + saved.quantity },
          ];
        } else {
          items = [...items, saved];
        }

        return {
          items,
          savedForLater: prev.savedForLater.filter(
            (s) => !(s.productId === productId && s.variantId === variantId)
          ),
        };
      });
    },
    [persist]
  );

  const removeSaved = useCallback(
    (productId: string, variantId: string) => {
      persist((prev) => ({
        ...prev,
        savedForLater: prev.savedForLater.filter(
          (s) => !(s.productId === productId && s.variantId === variantId)
        ),
      }));
    },
    [persist]
  );

  const clearCart = useCallback(() => {
    persist((prev) => ({ ...prev, items: [] }));
  }, [persist]);

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const summary = useMemo(
    () => computeOrderSummary(state.items, deliveryDistanceKm),
    [state.items, deliveryDistanceKm]
  );

  const value: CartContextValue = {
    items: state.items,
    savedForLater: state.savedForLater,
    itemCount,
    summary,
    deliveryDistanceKm,
    setDeliveryDistanceKm,
    isHydrated,
    isDrawerOpen,
    openDrawer: () => setIsDrawerOpen(true),
    closeDrawer: () => setIsDrawerOpen(false),
    addItem,
    removeItem,
    updateQuantity,
    saveForLater,
    moveToCart,
    removeSaved,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { findItemKey };
