"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, ShoppingBag, Phone, MapPin, Store } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MILL } from "@/lib/mill-config";
import { scrollToHome, scrollToSection } from "@/hooks/useActiveSection";

export function BottomNav() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const { itemCount, openDrawer, isHydrated } = useCart();

  useEffect(() => {
    const readHash = () => setHash(window.location.hash);
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  const items = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/products", icon: Store, label: "Shop" },
    { action: "cart" as const, icon: ShoppingBag, label: "Cart" },
    { href: `tel:${MILL.phone}`, icon: Phone, label: "Call" },
    { href: "/#contact", icon: MapPin, label: "Contact", sectionId: "contact" as const },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(0,0,0,0.08)] md:hidden">
      {items.map((item) => {
        const Icon = item.icon;

        if (item.action === "cart") {
          return (
            <button
              key="cart"
              onClick={openDrawer}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[#D4A017]"
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

        const isHome = item.href === "/";
        const isContact = "sectionId" in item && item.sectionId === "contact";
        const active = isHome
          ? pathname === "/" && !hash
          : isContact
            ? pathname === "/" && hash === "#contact"
            : pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href!}
            onClick={(e) => {
              if (isHome && pathname === "/") {
                e.preventDefault();
                scrollToHome();
                return;
              }
              if (isContact && pathname === "/") {
                e.preventDefault();
                scrollToSection("contact");
              }
            }}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 ${active ? "text-[#2F6B3A]" : "text-stone-500"}`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
