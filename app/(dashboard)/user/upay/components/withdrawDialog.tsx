"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const withdrawSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  otp: z.string().length(6, "Verification code must be 6 digits"),
});

interface WithdrawDialogProps {
  open: boolean;
  close: () => void;
  userId: string;
  serviceId: number;
  onSuccess?: () => void;
}

export default function WithdrawDialog({
  open,
  close,
  userId,
  serviceId,
  onSuccess,
}: WithdrawDialogProps) {
  const [step, setStep] = useState<"form" | "verify">("form");
  const [form, setForm] = useState({ amount: "", pin: "", otp: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // --- Step 1: Send verification code ---
  const handleSendCode = async () => {
    setErrors({});

    if (!form.amount || Number(form.amount) <= 0) {
      setErrors({ amount: "Amount must be greater than 0" });
      return;
    }

    setLoading(true);
    try {
      // Simulate sending OTP
      await new Promise((r) => setTimeout(r, 1000));
      setStep("verify");
      toast.success("Verification code sent to your phone");
    } catch (err) {
      toast.error("Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Verify and withdraw ---
  const handleVerifyAndWithdraw = async () => {
    setErrors({});
    const parsed = withdrawSchema.safeParse({
      amount: Number(form.amount),
      pin: form.pin,
      otp: form.otp,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach(
        (err) => (fieldErrors[err.path[0]] = err.message)
      );
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      // 🔹 Verify OTP (example)
      const otpRes = await fetch("/api/withdraw/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: form.otp }),
      });
      const otpData = await otpRes.json();
      if (!otpData.success) {
        setErrors({ otp: otpData.message || "Invalid verification code" });
        return;
      }

      // 🔹 Proceed with withdraw
      const res = await fetch("/api/users/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(form.amount),
          userId,
          serviceId,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Withdrew ${form.amount} successfully`);
        onSuccess?.();
        close();
      } else {
        setErrors({ pin: data.message || "Withdrawal failed" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Withdraw Funds
          </DialogTitle>
        </DialogHeader>

        {step === "form" ? (
          <div className="space-y-4 py-2">
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button onClick={handleSendCode} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div>
              <Label>Verification Code (SMS)</Label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                className="text-center text-lg tracking-widest"
              />
              {errors.otp && (
                <p className="text-sm text-red-500 mt-1">{errors.otp}</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={() => setStep("form")}>
                Back
              </Button>
              <Button onClick={handleVerifyAndWithdraw} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Verify & Withdraw
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
