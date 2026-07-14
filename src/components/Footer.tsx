import Image from "next/image";
import Link from "next/link";
import { Truck, Clock, ShieldCheck } from "lucide-react";
import { MILL, DELIVERY } from "@/lib/mill-config";
import { IMAGES } from "@/lib/images";

export function Footer() {
  return (
    <footer id="contact" className="mt-auto scroll-mt-24 bg-[#14261C] text-stone-400">
      {/* Full-width banner — aspect ratio preserves entire artwork */}
      <div className="footer-banner-wrap relative w-full overflow-hidden border-b border-white/5 bg-[#1B3328]">
        <div className="relative mx-auto aspect-[1024/426] w-full max-h-[220px] sm:max-h-[280px] md:max-h-[320px]">
          <Image
            src="/images/footer-banner.png"
            alt="Tradition you can taste, quality you can trust"
            fill
            className="object-contain object-center"
            sizes="100vw"
            priority={false}
          />
          <div className="footer-banner-shimmer pointer-events-none absolute inset-0" aria-hidden />
        </div>
        <div className="footer-banner-glow pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8C547]/50 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src={IMAGES.logo}
              alt="Jayalakshmi Vilas Rice Mill"
              width={56}
              height={56}
              className="rounded-full object-cover ring-2 ring-[#E8C547]/30"
            />
            <p className="text-lg font-bold text-[#E8C547]" style={{ fontFamily: "var(--font-yeseva)" }}>
              {MILL.fullName}
            </p>
          </div>
          <p className="mt-2 text-sm leading-relaxed">
            Traditional rice varieties from Melur, Madurai. Stone-milled, hand-sorted — direct from
            our mill to your kitchen.
          </p>
        </div>

        <div>
          <p className="font-semibold text-white">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-[#E8C547]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-[#E8C547]">
                Products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-[#E8C547]">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-[#E8C547]">
                Checkout
              </Link>
            </li>
            <li>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-1.5 font-semibold text-[#2F6B3A] hover:text-[#E8C547]"
              >
                <Truck className="h-3.5 w-3.5" />
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">Order & Delivery</p>
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs leading-relaxed text-stone-300">
              Free delivery within {DELIVERY.freeKm} km · ₹{DELIVERY.ratePerKm}/km up to{" "}
              {DELIVERY.maxKm} km · Ekart for outstation · Online payment only
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                `Free ≤${DELIVERY.freeKm} km`,
                `₹${DELIVERY.ratePerKm}/km`,
                "Ekart",
                "No COD",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#E8C547]/25 bg-[#E8C547]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#E8C547]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <ul className="mt-3 space-y-2 border-t border-white/10 pt-3 text-xs">
              <li className="flex items-center gap-2 text-stone-400">
                <Clock className="h-3.5 w-3.5 shrink-0 text-[#E8C547]" />
                {MILL.hours}
              </li>
              <li className="flex items-center gap-2 text-stone-400">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#2F6B3A]" />
                Min {DELIVERY.minKgBeyondMaxKm} kg beyond {DELIVERY.maxKm} km
              </li>
            </ul>
          </div>
        </div>

        <div>
          <p className="font-semibold text-white">Get in Touch</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`tel:${MILL.phone}`} className="font-semibold text-[#E8C547]">
                {MILL.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${MILL.email}`} className="hover:text-[#E8C547]">
                {MILL.email}
              </a>
            </li>
            <li>
              {MILL.address}
              <br />
              {MILL.city} – {MILL.pincode}, {MILL.state}
            </li>
            <li>
              <a
                href={MILL.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E8C547] hover:underline"
              >
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
