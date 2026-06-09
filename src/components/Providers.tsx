"use client";

import { CartProvider } from "@/context/CartContext";
import { OfferPopup } from "@/components/OfferPopup";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <OfferPopup />
    </CartProvider>
  );
}
