import { MILL } from "./mill-config";

/** Third-party logistics — Ekart pickup from Melur mill */
export const EKART = {
  name: "Ekart Logistics",
  /** Register at https://www.ekartlogistics.in/shipping-partner */
  signupUrl: "https://www.ekartlogistics.in/shipping-partner",
  /** Ekart Large for rice sacks > 20 kg; standard Ekart for smaller packs */
  largeShipmentKgThreshold: 20,
  trackingBaseUrl: "https://www.ekartlogistics.in/track/",
} as const;

export type DeliveryProvider = "local" | "ekart";

/** Pick delivery mode based on distance and order weight */
export function selectDeliveryProvider(
  distanceKm: number | null,
  totalKg: number,
): DeliveryProvider {
  // Outstation or heavy bulk → Ekart (pan-India from Melur hub)
  if (distanceKm !== null && distanceKm > 25) return "ekart";
  if (totalKg >= EKART.largeShipmentKgThreshold) return "ekart";
  // Near mill → own/local delivery for now (can switch to Ekart anytime)
  if (distanceKm !== null && distanceKm <= 25) return "local";
  return "ekart";
}

export function deliveryProviderLabel(provider: DeliveryProvider): string {
  return provider === "ekart"
    ? `Ekart Logistics (pickup from ${MILL.city})`
    : `Direct delivery from ${MILL.name}, Melur`;
}

export function isEkartConfigured(): boolean {
  return Boolean(
    process.env.EKART_MERCHANT_CODE &&
      process.env.EKART_AUTH_TOKEN &&
      process.env.EKART_API_BASE_URL,
  );
}
