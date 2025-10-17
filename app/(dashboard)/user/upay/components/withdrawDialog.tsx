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
// import type { BankService } from "../page";

export default function WithdrawDialog({
  open,
  close,
  withdrawForm,
  setWithdrawForm,
  withdrawErrors,
  handleWithdraw,
  withdrawLoading,
}: // selectedService,
{
  open: boolean;
  close: () => void;
  withdrawForm: { amount: number; pin: string };
  setWithdrawForm: (f: any) => void;
  withdrawErrors: { amount?: string; pin?: string };
  handleWithdraw: () => void;
  withdrawLoading: boolean;
  // selectedService: BankService | null;
}) {
  const [step, setStep] = useState<"form" | "verify">("form");
  const [otp, setOtp] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // --- Simulate sending code ---
  const handleSendCode = async () => {
    if (!withdrawForm.amount || withdrawForm.amount <= 0) return;
    setSendingCode(true);

    try {
      setStep("verify");
      // // 👇 API call to send code (replace with your SMS endpoint)
      // const res = await fetch("/api/withdraw/send-code", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ amount: withdrawForm.amount }),
      // });
      // const data = await res.json();
      // if (data.success) {
      // } else {
      //   alert(data.message || "Failed to send verification code");
      // }
    } catch (err) {
      console.error(err);
      alert("Failed to send verification code");
    } finally {
      setSendingCode(false);
    }
  };

  // --- Verify code & proceed to withdraw ---
  const handleVerifyAndWithdraw = async () => {
    if (!otp) return alert("Enter verification code");
    setVerifying(true);

    try {
      // 👇 Verify OTP before withdrawing
      const res = await fetch("/api/withdraw/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, amount: withdrawForm.amount }),
      });

      const data = await res.json();
      if (data.success) {
        handleWithdraw(); // ✅ Proceed to withdraw order creation
      } else {
        alert(data.message || "Invalid verification code");
      }
    } catch (err) {
      console.error(err);
      alert("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {/* Withdraw from {selectedService?.name} */}
          </DialogTitle>
        </DialogHeader>

        {step === "form" ? (
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium">Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawForm.amount || ""}
                onChange={(e) =>
                  setWithdrawForm({
                    ...withdrawForm,
                    amount: Number(e.target.value),
                  })
                }
                className="mt-1"
              />
              {withdrawErrors.amount && (
                <p className="text-sm text-red-500 mt-1">
                  {withdrawErrors.amount}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button
                onClick={handleSendCode}
                disabled={sendingCode || withdrawLoading}
              >
                {sendingCode ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Continue
              </Button>
            </div>
          </div>
        ) : (
          // --- OTP Verification Step ---
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium">
                Verification Code (SMS)
              </Label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 text-center tracking-widest text-lg"
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={() => setStep("form")}>
                Back
              </Button>
              <Button
                onClick={handleVerifyAndWithdraw}
                disabled={verifying || withdrawLoading}
              >
                {verifying ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Verify & Withdraw
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
