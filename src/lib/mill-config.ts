export const MILL = {
  name: "Jayalakshmi Vilas",
  fullName: "Jayalakshmi Vilas Rice Mill",
  tagline: "Rice Mill · Melur, Madurai",
  siteUrl: "https://jayalakshmivilas.vercel.app",
  phone: "7339604011",
  phoneDisplay: "+91 7339604011",
  whatsapp: "917339604011",
  /** Mill team order alerts — sent automatically on every order */
  millAlertPhone: "9941876024",
  millAlertDisplay: "+91 9941876024",
  millAlertWhatsapp: "919941876024",
  email: "jayalakshmivilasricemill@gmail.com",
  address: "Sivagangai Main Road, Melur",
  city: "Madurai",
  pincode: "625106",
  state: "Tamil Nadu",
  lat: 10.0447,
  lng: 78.3336,
  hours: "Every Day · 9 AM – 6 PM",
  mapsUrl:
    "https://maps.google.com?q=Jayalakshmi+Vilas+Rice+Mill+Sivagangai+Main+Road+Melur+Madurai+625106",
} as const;

export const DELIVERY = {
  freeKm: 5,
  ratePerKm: 5,
  maxKm: 25,
  minKgBeyondMaxKm: 50,
  discountPercent: 3,
} as const;

export const CART_STORAGE_KEY = "jv_cart_v1";
