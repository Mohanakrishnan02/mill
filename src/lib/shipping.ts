import { DELIVERY, MILL } from "./mill-config";

/** Haversine distance in km between mill and delivery point */
export function distanceFromMill(lat: number, lng: number): number {
  const R = 6371;
  const dLat = ((lat - MILL.lat) * Math.PI) / 180;
  const dLng = ((lng - MILL.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((MILL.lat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calcDeliveryCharge(distanceKm: number): number {
  if (distanceKm <= DELIVERY.freeKm) return 0;
  return Math.ceil((distanceKm - DELIVERY.freeKm) * DELIVERY.ratePerKm);
}

export function isOutstation(distanceKm: number): boolean {
  return distanceKm > DELIVERY.maxKm;
}

export function deliveryLabel(distanceKm: number | null, charge: number): string {
  if (distanceKm === null) return "Calculated after address";
  if (isOutstation(distanceKm)) return "Outstation — contact us";
  if (charge === 0) return `FREE (within ${DELIVERY.freeKm} km)`;
  return `₹${charge} (${distanceKm.toFixed(1)} km × ₹${DELIVERY.ratePerKm}/km beyond ${DELIVERY.freeKm} km)`;
}
