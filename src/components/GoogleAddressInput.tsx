"use client";

import { useEffect, useRef } from "react";
import { parseGoogleAddressComponents } from "@/lib/geocode";

type PlaceResult = {
  formatted_address?: string;
  address_components?: { long_name: string; types: string[] }[];
  geometry?: { location: { lat: () => number; lng: () => number } };
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: {
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  }) => void;
  placeholder?: string;
  className?: string;
};

declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: { componentRestrictions?: { country: string }; fields?: string[] }
          ) => {
            addListener: (event: string, handler: () => void) => void;
            getPlace: () => PlaceResult;
          };
        };
      };
    };
    initGooglePlaces?: () => void;
  }
}

export function GoogleAddressInput({
  value,
  onChange,
  onPlaceSelect,
  placeholder,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<{ getPlace: () => PlaceResult } | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const onPlaceSelectRef = useRef(onPlaceSelect);
  onPlaceSelectRef.current = onPlaceSelect;

  useEffect(() => {
    if (!apiKey || !inputRef.current) return;

    const initAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) return;
      if (autocompleteRef.current) return;

      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "in" },
        fields: ["formatted_address", "address_components", "geometry"],
      });

      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        const components = place.address_components ?? [];
        const parsed = parseGoogleAddressComponents(components, place.formatted_address);
        const lat = place.geometry?.location?.lat() ?? 0;
        const lng = place.geometry?.location?.lng() ?? 0;
        const line = parsed.addressLine1 || place.formatted_address?.split(",")[0] || "";

        onChange(line);
        onPlaceSelectRef.current({
          addressLine1: line,
          city: parsed.city || "Madurai",
          state: parsed.state || "Tamil Nadu",
          pincode: parsed.pincode,
          lat,
          lng,
        });
      });

      autocompleteRef.current = ac;
    };

    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    const existing = document.querySelector('script[data-google-places="1"]');
    if (existing) {
      window.initGooglePlaces = initAutocomplete;
      return;
    }

    window.initGooglePlaces = initAutocomplete;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlaces`;
    script.async = true;
    script.dataset.googlePlaces = "1";
    document.head.appendChild(script);

    return () => {
      window.initGooglePlaces = undefined;
    };
  }, [apiKey, onChange]);

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      autoComplete="off"
    />
  );
}
