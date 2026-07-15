import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { isRazorpayConfigured } from "@/lib/payment";

export async function POST(request: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const { amount } = await request.json();

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Free mode — no Razorpay keys on server (works for demo / offline / UPI confirm)
    if (!isRazorpayConfigured(keyId, keySecret)) {
      return NextResponse.json({
        mode: "free",
        orderId: `free_${Date.now()}`,
        amount: Math.round(amount),
        currency: "INR",
        message: "Free checkout — no payment gateway required",
      });
    }

    const razorpay = new Razorpay({ key_id: keyId!, key_secret: keySecret! });

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency: "INR",
      receipt: `mill_${Date.now()}`,
    });

    return NextResponse.json({
      mode: "razorpay",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
