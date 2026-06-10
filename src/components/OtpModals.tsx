"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

const OTP_LEN = 6;

type OtpEntryModalProps = {
  open: boolean;
  phone: string;
  demoOtp: string;
  onClose: () => void;
  onSubmit: (otp: string) => boolean;
};

export function OtpEntryModal({ open, phone, demoOtp, onClose, onSubmit }: OtpEntryModalProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LEN).fill(""));
  const [error, setError] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setDigits(Array(OTP_LEN).fill(""));
      setError("");
      const t = setTimeout(() => inputsRef.current[0]?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open, demoOtp]);

  if (!open) return null;

  const updateDigit = (index: number, value: string) => {
    const d = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = d;
    setDigits(next);
    setError("");
    if (d && index < OTP_LEN - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Enter") handleSubmit();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
    if (!pasted) return;
    const next = Array(OTP_LEN).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LEN - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  const handleSubmit = () => {
    const otp = digits.join("");
    if (otp.length !== OTP_LEN) {
      setError("Enter all 6 digits");
      return;
    }
    const ok = onSubmit(otp);
    if (!ok) {
      setError("Incorrect OTP. Try again.");
      setDigits(Array(OTP_LEN).fill(""));
      inputsRef.current[0]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="otp-modal-overlay absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="otp-modal-in relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="pr-6 text-base font-bold text-stone-900">Verify Mobile OTP</h3>
        <p className="mt-1 text-xs text-stone-500">
          Enter the 6-digit code sent to <strong>+91 {phone}</strong>
        </p>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-900">
          Demo OTP: <strong className="text-sm tracking-widest">{demoOtp}</strong>
        </div>

        <div className="mt-4 flex justify-center gap-2" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => updateDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="h-11 w-10 rounded-lg border border-stone-300 text-center text-lg font-bold text-stone-900 outline-none focus:border-[#7A2E3A] focus:ring-2 focus:ring-[#7A2E3A]/20 sm:h-12 sm:w-11"
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        {error && <p className="mt-2 text-center text-xs font-semibold text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-5 w-full rounded-lg bg-[#7A2E3A] py-2.5 text-sm font-bold text-white hover:bg-[#5C1F28]"
        >
          Submit OTP
        </button>
      </div>
    </div>
  );
}

type OtpSuccessModalProps = {
  open: boolean;
  phone: string;
  onClose: () => void;
};

export function OtpSuccessModal({ open, phone, onClose }: OtpSuccessModalProps) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="otp-modal-overlay absolute inset-0 bg-black/40" />
      <div className="otp-success-pop relative w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-xl">
        <div className="otp-check-pop mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7A2E3A]">
          <CheckCircle2 className="h-8 w-8 text-white" strokeWidth={2.5} />
        </div>
        <h3 className="mt-4 text-base font-bold text-[#7A2E3A]">OTP Verified!</h3>
        <p className="mt-1 text-sm text-stone-600">
          +91 {phone} is confirmed
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-lg border border-stone-200 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          OK
        </button>
      </div>
    </div>
  );
}
