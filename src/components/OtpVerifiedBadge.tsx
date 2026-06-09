"use client";

import { CheckCircle2 } from "lucide-react";

export function OtpVerifiedBadge({ phone }: { phone: string }) {
  return (
    <div className="otp-verified-pop mt-3 overflow-hidden rounded-xl border border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="otp-check-bounce flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2e7d32] shadow-lg shadow-green-200">
          <CheckCircle2 className="h-7 w-7 text-white" strokeWidth={2.5} />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-[#2e7d32]">Mobile Verified!</p>
          <p className="text-xs text-green-800">
            +91 {phone} is confirmed
          </p>
          <p className="otp-shimmer-text mt-1 text-[10px] font-semibold uppercase tracking-wider text-green-600">
            ✓ OTP validation successful
          </p>
        </div>
      </div>
      <div className="otp-progress-bar mt-3 h-1 overflow-hidden rounded-full bg-green-100">
        <div className="otp-progress-fill h-full rounded-full bg-[#2e7d32]" />
      </div>
    </div>
  );
}
