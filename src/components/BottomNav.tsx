"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Phone, MapPin, Store } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MILL } from "@/lib/mill-config";

export function BottomNav() {
  const pathname = usePathname();
  const { itemCount, openDrawer, isHydrated } = useCart();

  const items = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/products", icon: Store, label: "Shop" },
    { action: "cart" as const, icon: ShoppingBag, label: "Cart", highlight: true },
    { href: `tel:${MILL.phone}`, icon: Phone, label: "Call" },
    { href: "/#contact", icon: MapPin, label: "Contact" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(0,0,0,0.08)] md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.href ? pathname === item.href : false;
        if (item.action === "cart") {
          return (
            <button
              key="cart"
              onClick={openDrawer}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[#e07b00]"
            >
              <Icon className="h-5 w-5" />
              {isHydrated && itemCount > 0 && (
                <span className="absolute right-[calc(50%-18px)] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-700 text-[9px] font-bold text-white">
                  {itemCount}
                </span>
              )}
              <span className="text-[10px] font-semibold">Cart</span>
            </button>
          );
        }
        return (
          <Link
            key={item.label}
            href={item.href!}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 ${active ? "text-[#2e7d32]" : "text-stone-500"}`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
