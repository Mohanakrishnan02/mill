"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Search, Menu, X, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "./CartDrawer";
import { MILL } from "@/lib/mill-config";
import { searchProducts } from "@/lib/products";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/#journey", label: "Our Journey" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const { itemCount, openDrawer, isHydrated } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const results = query.trim() ? searchProducts(query).slice(0, 6) : [];

  return (
    <>
      <div className="bg-[#5d3a1a] py-1.5 text-center text-xs text-white/85">
        📍 {MILL.address}, {MILL.city} – {MILL.pincode} &nbsp;|&nbsp;
        <a href={`tel:${MILL.phone}`} className="font-semibold text-[#f5a623]">
          📞 {MILL.phone}
        </a>
        &nbsp;|&nbsp; {MILL.hours} &nbsp;|&nbsp; Delivery ≤{25} km
      </div>

      <header className="sticky top-0 z-40 bg-[#2e7d32] shadow-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
          <Link href="/" className="shrink-0">
            <p className="font-serif text-lg font-bold leading-tight text-white" style={{ fontFamily: "var(--font-yeseva)" }}>
              {MILL.name}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-white/60">{MILL.tagline}</p>
          </Link>

          <div className="relative hidden flex-1 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowDrop(true); }}
              onFocus={() => setShowDrop(true)}
              onBlur={() => setTimeout(() => setShowDrop(false), 180)}
              placeholder="Search rice… Seeraga Samba, Kavuni…"
              className="w-full max-w-lg rounded border-0 py-2 pl-10 pr-4 text-sm outline-none"
            />
            {showDrop && query.trim() && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-md border border-stone-200 bg-white shadow-xl">
                {results.length === 0 ? (
                  <p className="p-3 text-sm text-stone-500">No varieties found</p>
                ) : (
                  results.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="flex gap-3 border-b border-stone-100 p-3 hover:bg-orange-50 last:border-0"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <span className="text-2xl">{p.image}</span>
                      <div>
                        <p className="text-sm font-bold">{p.name}</p>
                        <p className="text-xs text-stone-500" style={{ fontFamily: "var(--font-tamil)" }}>{p.tamil}</p>
                        <p className="text-xs font-bold text-[#e07b00]">
                          from ₹{Math.min(...p.variants.map((v) => v.price))}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <nav className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-white/90 hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden flex-col text-right text-xs text-white/75 sm:flex">
            <span>Call / WhatsApp</span>
            <a href={`tel:${MILL.phone}`} className="font-semibold text-[#f5a623]">{MILL.phone}</a>
          </div>

          <button
            onClick={openDrawer}
            className="relative flex items-center gap-2 rounded bg-[#e07b00] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#f5a623]"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {isHydrated && itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-700 px-1 text-[10px] font-bold">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          <button className="rounded p-1 text-white lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="border-t border-white/10 px-4 py-3 lg:hidden">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-white">
                {link.label}
              </Link>
            ))}
            <a href={`tel:${MILL.phone}`} className="mt-2 flex items-center gap-2 py-2 text-sm text-[#f5a623]">
              <Phone className="h-4 w-4" /> {MILL.phone}
            </a>
          </nav>
        )}
      </header>
      <CartDrawer />
    </>
  );
}
