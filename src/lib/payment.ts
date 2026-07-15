/** Free payment helpers — UPI intent (no gateway fees) */

export function isRazorpayConfigured(keyId?: string | null, keySecret?: string | null): boolean {
  return Boolean(keyId?.trim() && keySecret?.trim());
}

export function getUpiId(): string {
  return (process.env.NEXT_PUBLIC_UPI_ID || "").trim();
}

export function getUpiPayeeName(): string {
  return (process.env.NEXT_PUBLIC_UPI_NAME || "Jayalakshmi Vilas Rice Mill").trim();
}

/** Build free UPI deep-link used by GPay / PhonePe / Paytm (no paid API) */
export function buildUpiPayUrl(opts: {
  amount: number;
  orderId: string;
  note?: string;
}): string | null {
  const pa = getUpiId();
  if (!pa) return null;

  const params = new URLSearchParams({
    pa,
    pn: getUpiPayeeName(),
    am: opts.amount.toFixed(2),
    cu: "INR",
    tn: (opts.note || `Order ${opts.orderId}`).slice(0, 50),
  });

  return `upi://pay?${params.toString()}`;
}

export function buildUpiQrImageUrl(upiPayUrl: string, size = 220): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(upiPayUrl)}`;
}
