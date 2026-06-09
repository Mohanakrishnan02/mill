"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Search, Menu, X, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "./CartDrawer";
import { MILL } from "@/lib/mill-config";
import { searchProducts, getProductBySlug } from "@/lib/products";
import { scrollToSection, scrollToHome, useActiveSection } from "@/hooks/useActiveSection";
import { ProductImage } from "./ProductImage";
import { IMAGES } from "@/lib/images";

type NavItem =
  | { type: "page"; href: string; label: string }
  | { type: "section"; sectionId: string; href: string; label: string };

const navItems: NavItem[] = [
  { type: "page", href: "/", label: "Home" },
  { type: "page", href: "/products", label: "Our Products" },
  { type: "section", sectionId: "journey", href: "/#journey", label: "Our Journey" },
  { type: "section", sectionId: "contact", href: "/#contact", label: "Our Contact" },
];

function NavLinks({
  mobile,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const journey = useActiveSection("journey");
  const contact = useActiveSection("contact");

  const isActive = (item: NavItem) => {
    if (item.type === "page") {
      if (item.href === "/") return pathname === "/" && !journey.active && !contact.active;
      return pathname === item.href;
    }
    return item.sectionId === "journey" ? journey.active : contact.active;
  };

  return (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          item={item}
          active={isActive(item)}
          mobile={mobile}
          onNavigate={onNavigate}
        />
      ))}
    </>
  );
}

function NavLink({
  item,
  active,
  mobile,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const desktopCls = active
    ? "bg-[#f5a623] text-[#1a0f05] shadow-md shadow-[#f5a623]/30 font-bold"
    : "text-white/90 hover:bg-white/10 hover:text-white";

  const mobileCls = active
    ? "bg-[#f5a623]/20 text-[#f5a623] font-bold border-l-2 border-[#f5a623]"
    : "text-white hover:bg-white/5";

  const className = mobile
    ? `block w-full px-3 py-2.5 text-sm transition-colors ${mobileCls}`
    : `relative rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 ${desktopCls}`;

  if (item.type === "section") {
    return (
      <Link
        href={item.href}
        onClick={(e) => {
          if (pathname === "/") {
            e.preventDefault();
            scrollToSection(item.sectionId);
          }
          onNavigate?.();
        }}
        className={className}
        aria-current={active ? "true" : undefined}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={(e) => {
        if (item.href === "/" && pathname === "/") {
          e.preventDefault();
          scrollToHome();
        }
        onNavigate?.();
      }}
      className={className}
      aria-current={active ? "true" : undefined}
    >
      {item.label}
    </Link>
  );
}

function SearchBox({
  query,
  setQuery,
  showDrop,
  setShowDrop,
  results,
  onNavigate,
  className = "",
  variant = "header",
  autoFocus = false,
}: {
  query: string;
  setQuery: (q: string) => void;
  showDrop: boolean;
  setShowDrop: (v: boolean) => void;
  results: ReturnType<typeof searchProducts>;
  onNavigate?: () => void;
  className?: string;
  variant?: "header" | "mobile";
  autoFocus?: boolean;
}) {
  const isMobile = variant === "mobile";
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pickingResultRef = useRef(false);

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  const openDrop = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    setShowDrop(true);
  };

  const scheduleCloseDrop = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    blurTimerRef.current = setTimeout(() => {
      if (!pickingResultRef.current) setShowDrop(false);
      pickingResultRef.current = false;
    }, 220);
  };

  const inputCls =
    "header-search-field w-full rounded-lg border-0 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-900 shadow-none outline-none ring-0 placeholder:text-stone-400";

  const handleResultPick = (productName?: string) => {
    pickingResultRef.current = false;
    if (productName) setQuery(productName);
    onNavigate?.();
    setShowDrop(false);
  };

  return (
    <div
      className={`relative rounded-lg bg-white shadow-md ring-1 ring-black/10 ${className}`}
    >
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          openDrop();
        }}
        onFocus={openDrop}
        onBlur={scheduleCloseDrop}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setShowDrop(false);
            inputRef.current?.blur();
          }
          if (e.key === "Enter" && query.trim() && results.length > 0) {
            const first = results[0];
            setQuery(first.name);
            router.push(`/products/${first.slug}`);
            handleResultPick();
          }
        }}
        placeholder="Search rice… JGL, Akshaya, Ponni…"
        className={inputCls}
        enterKeyHint="search"
      />
      {showDrop && query.trim() && (
        <div
          className={`absolute left-0 top-full z-[100] mt-1 w-full overflow-hidden rounded-md border border-stone-200 bg-white shadow-xl ${
            isMobile ? "max-h-[50vh] overflow-y-auto" : ""
          }`}
          onPointerDown={() => {
            pickingResultRef.current = true;
          }}
        >
          {results.length === 0 ? (
            <p className="p-3 text-sm text-stone-500">No varieties found</p>
          ) : (
            results.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="flex items-center gap-3 border-b border-stone-100 p-2.5 hover:bg-orange-50 active:bg-orange-100 last:border-0"
                onPointerDown={(e) => {
                  e.preventDefault();
                  pickingResultRef.current = true;
                }}
                onClick={() => handleResultPick(p.name)}
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-[#fdf8f0]">
                  <ProductImage
                    src={p.image}
                    alt={p.name}
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-stone-900">{p.name}</p>
                  <p className="truncate text-xs text-stone-500" style={{ fontFamily: "var(--font-tamil)" }}>
                    {p.tamil}
                  </p>
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
  );
}

export function Header() {
  const pathname = usePathname();
  const { itemCount, openDrawer, isHydrated } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const results = query.trim() ? searchProducts(query).slice(0, 6) : [];

  // Fill search with product name when opening a product page directly (not while typing)
  useEffect(() => {
    const match = pathname.match(/^\/products\/([^/]+)$/);
    if (!match) return;
    const product = getProductBySlug(match[1]);
    if (!product) return;
    setQuery((prev) => (prev.trim() === "" ? product.name : prev));
  }, [pathname]);

  const closeMobileSearch = () => setMobileSearchOpen(false);
  const searchActive = showDrop || mobileSearchOpen;

  return (
    <>
      <div className="bg-[#5d3a1a] py-1.5 text-center text-xs text-white/85">
        📍 {MILL.address}, {MILL.city} – {MILL.pincode} &nbsp;|&nbsp;
        <a href={`tel:${MILL.phone}`} className="font-semibold text-[#f5a623]">
          📞 {MILL.phone}
        </a>
        &nbsp;|&nbsp; {MILL.hours} &nbsp;|&nbsp; Delivery ≤{25} km
      </div>

      <header
        className={`sticky top-0 bg-[#2e7d32] shadow-md ${searchActive ? "z-50" : "z-40"}`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-6">
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                scrollToHome();
              }
            }}
            className="flex min-w-0 shrink items-center gap-2 sm:gap-2.5"
          >
            <Image
              src={IMAGES.logo}
              alt="Jayalakshmi Vilas Rice Mill"
              width={44}
              height={44}
              priority
              className="shrink-0 rounded-full object-cover ring-2 ring-[#f5a623]/40"
            />
            <div className="hidden min-w-0 sm:block">
              <p className="font-serif text-lg font-bold leading-tight text-white" style={{ fontFamily: "var(--font-yeseva)" }}>
                {MILL.name}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/60">{MILL.tagline}</p>
            </div>
          </Link>

          <div className="relative hidden max-w-lg flex-1 md:block">
            <SearchBox
              query={query}
              setQuery={setQuery}
              showDrop={showDrop}
              setShowDrop={setShowDrop}
              results={results}
              variant="header"
            />
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            <NavLinks />
          </nav>

          <div className="ml-auto hidden flex-col text-right text-xs text-white/75 sm:flex">
            <span>Call / WhatsApp</span>
            <a href={`tel:${MILL.phone}`} className="font-semibold text-[#f5a623]">{MILL.phone}</a>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 md:ml-0">
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen((v) => !v);
                if (mobileOpen) setMobileOpen(false);
              }}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition md:hidden ${
                mobileSearchOpen ? "bg-white/25" : "bg-white/15 hover:bg-white/25"
              }`}
              aria-label="Search products"
              aria-expanded={mobileSearchOpen}
            >
              <Search className="h-5 w-5" strokeWidth={2.25} />
            </button>

            <button
              onClick={openDrawer}
              className="relative flex shrink-0 items-center gap-2 rounded bg-[#e07b00] px-2.5 py-2 text-sm font-semibold text-white hover:bg-[#f5a623] sm:px-3.5"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {isHydrated && itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-700 px-1 text-[10px] font-bold">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10 lg:hidden"
              onClick={() => {
                setMobileOpen(!mobileOpen);
                if (mobileSearchOpen) setMobileSearchOpen(false);
              }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileSearchOpen && (
          <div className="border-t border-white/10 bg-[#2e7d32] px-3 py-3 md:hidden">
            <SearchBox
              query={query}
              setQuery={setQuery}
              showDrop={showDrop}
              setShowDrop={setShowDrop}
              results={results}
              onNavigate={closeMobileSearch}
              variant="mobile"
              autoFocus
            />
          </div>
        )}

        {mobileOpen && (
          <nav className="border-t border-white/10 px-2 py-2 lg:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setMobileSearchOpen(true);
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-white hover:bg-white/5"
            >
              <Search className="h-4 w-4 text-[#f5a623]" />
              Search products
            </button>
            <NavLinks mobile onNavigate={() => setMobileOpen(false)} />
            <a href={`tel:${MILL.phone}`} className="mt-2 flex items-center gap-2 px-3 py-2 text-sm text-[#f5a623]">
              <Phone className="h-4 w-4" /> {MILL.phone}
            </a>
          </nav>
        )}
      </header>
      <CartDrawer />
    </>
  );
}
