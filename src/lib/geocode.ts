export type GeocodedAddress = {
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
};

type AddressComponent = { long_name: string; types: string[] };

function pickComponent(components: AddressComponent[], type: string): string {
  return components.find((c) => c.types.includes(type))?.long_name ?? "";
}

export function parseGoogleAddressComponents(
  components: AddressComponent[],
  formattedAddress?: string
): GeocodedAddress {
  const street = [
    pickComponent(components, "street_number"),
    pickComponent(components, "route"),
  ]
    .filter(Boolean)
    .join(" ");
  const area =
    pickComponent(components, "sublocality_level_1") || pickComponent(components, "sublocality");
  const city =
    pickComponent(components, "locality") ||
    pickComponent(components, "administrative_area_level_2") ||
    pickComponent(components, "administrative_area_level_3");
  const state = pickComponent(components, "administrative_area_level_1");
  const pincode = pickComponent(components, "postal_code");

  return {
    addressLine1: street || area || formattedAddress?.split(",")[0] || "",
    city,
    state,
    pincode,
  };
}

export async function reverseGeocodePincode(
  lat: number,
  lng: number
): Promise<Partial<GeocodedAddress>> {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (key) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`
      );
      const data = await res.json();
      const components = data.results?.[0]?.address_components as AddressComponent[] | undefined;
      if (components) {
        return parseGoogleAddressComponents(components);
      }
    } catch {
      /* fall through */
    }
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { Accept: "application/json" } }
    );
    const data = await res.json();
    const a = data.address ?? {};
    return {
      pincode: (a.postcode ?? "").replace(/\D/g, "").slice(0, 6),
      city: a.city || a.town || a.village || a.county || "",
      state: a.state || "Tamil Nadu",
    };
  } catch {
    return {};
  }
}
