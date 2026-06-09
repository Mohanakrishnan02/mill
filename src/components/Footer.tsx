import Image from "next/image";
import Link from "next/link";
import { Truck, MapPin, Scale, CreditCard, Package } from "lucide-react";
import { MILL, DELIVERY } from "@/lib/mill-config";
import { IMAGES } from "@/lib/images";

const deliveryPolicies = [
  {
    icon: MapPin,
    title: "Free ≤ 5 km",
    desc: "Melur area — no delivery charge",
    accent: "from-green-500/20 to-green-600/5",
    iconColor: "text-[#2e7d32]",
  },
  {
    icon: Truck,
    title: `₹${DELIVERY.ratePerKm}/km`,
    desc: `Up to ${DELIVERY.maxKm} km from mill`,
    accent: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-[#2874f0]",
  },
  {
    icon: Package,
    title: "Ekart Logistics",
    desc: "Outstation & bulk from Melur hub",
    accent: "from-orange-500/20 to-orange-600/5",
    iconColor: "text-[#e07b00]",
  },
  {
    icon: Scale,
    title: `Min ${DELIVERY.minKgBeyondMaxKm} kg`,
    desc: `Orders beyond ${DELIVERY.maxKm} km`,
    accent: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-[#f5a623]",
  },
  {
    icon: CreditCard,
    title: "Online Only",
    desc: "UPI · Cards · No COD",
    accent: "from-purple-500/20 to-purple-600/5",
    iconColor: "text-purple-400",
  },
];

export function Footer() {
  return (
    <footer id="contact" className="mt-auto scroll-mt-24 bg-[#1a0f05] text-stone-400">
      {/* Animated banner */}
      <div className="footer-banner-wrap relative overflow-hidden border-b border-white/5">
        <div className="footer-banner-zoom relative h-36 sm:h-44 md:h-52">
          <Image
            src="/images/footer-banner.png"
            alt="Traditional rice — quality you can trust"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="footer-banner-shimmer pointer-events-none absolute inset-0" aria-hidden />
          <div className="footer-banner-grain pointer-events-none absolute inset-0" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f05] via-[#1a0f05]/30 to-transparent" />
        </div>
        <div className="footer-banner-glow pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f5a623]/60 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src={IMAGES.logo}
              alt="Jayalakshmi Vilas Rice Mill"
              width={56}
              height={56}
              className="rounded-full object-cover ring-2 ring-[#f5a623]/30"
            />
            <p className="text-lg font-bold text-[#f5a623]" style={{ fontFamily: "var(--font-yeseva)" }}>
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
              <Link href="/" className="hover:text-[#f5a623]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-[#f5a623]">
                Products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-[#f5a623]">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-[#f5a623]">
                Checkout
              </Link>
            </li>
            <li>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-1.5 font-semibold text-[#2874f0] hover:text-[#f5a623]"
              >
                <Truck className="h-3.5 w-3.5" />
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white">Delivery Policy</p>
          <div className="mt-3 space-y-2">
            {deliveryPolicies.map((item, i) => (
              <div
                key={item.title}
                className={`footer-policy-card group flex items-start gap-3 rounded-lg border border-white/10 bg-gradient-to-br ${item.accent} p-3 transition hover:border-[#f5a623]/30`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/30">
                  <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{item.title}</p>
                  <p className="text-[11px] leading-snug text-stone-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold text-white">Get in Touch</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`tel:${MILL.phone}`} className="font-semibold text-[#f5a623]">
                {MILL.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${MILL.email}`} className="hover:text-[#f5a623]">
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
                className="text-[#f5a623] hover:underline"
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
