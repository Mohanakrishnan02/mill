import Link from "next/link";
import { MILL } from "@/lib/mill-config";

export function Footer() {
  return (
    <footer id="contact" className="mt-auto scroll-mt-24 bg-[#1a0f05] text-stone-400">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div>
          <p className="text-lg font-bold text-[#f5a623]" style={{ fontFamily: "var(--font-yeseva)" }}>
            {MILL.fullName}
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            Traditional rice varieties from Melur, Madurai. Stone-milled, hand-sorted — direct from our mill to your kitchen.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/" className="hover:text-[#f5a623]">Home</Link></li>
            <li><Link href="/products" className="hover:text-[#f5a623]">Products</Link></li>
            <li><Link href="/cart" className="hover:text-[#f5a623]">Cart</Link></li>
            <li><Link href="/checkout" className="hover:text-[#f5a623]">Checkout</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Delivery Policy</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Free delivery ≤ 5 km</li>
            <li>₹5/km beyond · up to 25 km</li>
            <li>Beyond 25 km: min 50 kg order</li>
            <li>Online payment only — No COD</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Get in Touch</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`tel:${MILL.phone}`} className="font-semibold text-[#f5a623]">{MILL.phoneDisplay}</a>
            </li>
            <li>
              <a href={`mailto:${MILL.email}`} className="hover:text-[#f5a623]">{MILL.email}</a>
            </li>
            <li>{MILL.address}<br />{MILL.city} – {MILL.pincode}, {MILL.state}</li>
            <li>
              <a href={MILL.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-[#f5a623] hover:underline">
                📍 Open in Google Maps
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-white/25">
        © {new Date().getFullYear()} {MILL.fullName}, Melur, Madurai – {MILL.pincode}
      </div>
    </footer>
  );
}
