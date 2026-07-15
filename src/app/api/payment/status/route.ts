import { NextResponse } from "next/server";
import { getUpiId, getUpiPayeeName, isRazorpayConfigured } from "@/lib/payment";

export async function GET() {
  const razorpay = isRazorpayConfigured(
    process.env.RAZORPAY_KEY_ID,
    process.env.RAZORPAY_KEY_SECRET
  );
  const upiId = getUpiId();

  return NextResponse.json({
    razorpay,
    upi: Boolean(upiId),
    upiId: upiId || null,
    upiName: getUpiPayeeName(),
    /** Prefer Free UPI when configured; else Razorpay; else free checkout */
    mode: upiId ? "upi" : razorpay ? "razorpay" : "free",
  });
}
