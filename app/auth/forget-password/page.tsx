"use client";

import { resetPasswordAction, sendOtp, verifyOtp } from "@/action/auth.action";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EmailSchema, ResetPasswordSchema } from "@/zod-validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { OTPCountdown } from "../sign-up/components/resend-button";

const OTP_LENGTH = 6;
const RESEND_TIMEOUT = 60;

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"EMAIL" | "OTP" | "RESET">("EMAIL");
  const [userEmail, setUserEmail] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [isPending, startTransition] = useTransition();

  // ========== Forms ==========
  const emailForm = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // ========== Countdown ==========
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const startCountdown = useCallback(() => setCountdown(RESEND_TIMEOUT), []);

  // ========== OTP Helpers ==========
  const resetOTPState = useCallback(
    () => setOtpValues(Array(OTP_LENGTH).fill("")),
    []
  );

  const focusOTPInput = useCallback(
    (index: number) => otpInputRefs.current[index]?.focus(),
    []
  );

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1 || (value && !/^\d$/.test(value))) return;
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);
    if (value && index < OTP_LENGTH - 1) focusOTPInput(index + 1);
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      focusOTPInput(index - 1);
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .slice(0, OTP_LENGTH)
      .split("")
      .filter((c) => /^\d$/.test(c));
    const newOtp = [...otpValues];
    pasted.forEach((digit, i) => (newOtp[i] = digit));
    setOtpValues(newOtp);
    const nextEmpty = newOtp.findIndex((v) => !v);
    focusOTPInput(nextEmpty !== -1 ? nextEmpty : OTP_LENGTH - 1);
  };

  // ========== Handlers ==========
  const handleSendOtp = (values: z.infer<typeof EmailSchema>) => {
    startTransition(async () => {
      try {
        const result = await sendOtp(values.email);
        if (result?.success) {
          setUserEmail(values.email);
          setStep("OTP");
          startCountdown();
          toast.success("OTP sent to your email");
          setTimeout(() => focusOTPInput(0), 200);
        } else {
          toast.error(result?.message || "Failed to send OTP");
        }
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  const handleVerifyOtp = () => {
    const otpCode = otpValues.join("");
    if (otpCode.length !== OTP_LENGTH) return toast.error("Enter complete OTP");

    startTransition(async () => {
      try {
        const result = await verifyOtp(userEmail, otpCode);
        if (result?.success) {
          setStep("RESET");
          toast.success("OTP verified successfully");
        } else {
          toast.error(result?.message || "Invalid OTP");
          resetOTPState();
          focusOTPInput(0);
        }
      } catch {
        toast.error("OTP verification failed");
      }
    });
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    startTransition(async () => {
      try {
        const result = await sendOtp(userEmail);
        if (result?.success) {
          toast.success("OTP resent");
          resetOTPState();
          startCountdown();
          focusOTPInput(0);
        } else {
          toast.error("Failed to resend OTP");
        }
      } catch {
        toast.error("Error while resending OTP");
      }
    });
  };

  const handleResetPassword = (values: z.infer<typeof ResetPasswordSchema>) => {
    startTransition(async () => {
      try {
        const result = await resetPasswordAction({
          email: userEmail,
          newPassword: values.password,
        });
        if (result?.success) {
          toast.success("Password reset successfully");
          router.push("/auth/sign-in");
        } else {
          toast.error(result?.message || "Failed to reset password");
        }
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  // ========== Renders ==========
  if (step === "EMAIL") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="text-center text-2xl font-bold mb-4">
            Forgot Password
          </h2>
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleSendOtp)}
              className="space-y-4"
            >
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  {...emailForm.register("email")}
                  placeholder="your@email.com"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  if (step === "OTP") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">Verify OTP</h2>
            <p className="text-sm text-gray-600">
              Enter the code sent to <br />
              <span className="font-medium">{userEmail}</span>
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex justify-center gap-3 mb-4">
            {otpValues.map((v, i) => (
              <Input
                key={i}
                ref={(el) => {
                  otpInputRefs.current[i] = el;
                }}
                value={v}
                onChange={(e) => handleOTPChange(i, e.target.value)}
                onKeyDown={(e) => handleOTPKeyDown(i, e)}
                onPaste={handleOTPPaste}
                maxLength={1}
                className="h-12 w-12 text-center text-lg font-bold"
              />
            ))}
          </div>
          <OTPCountdown countdown={countdown} onResend={handleResendOtp} />
          <Button
            onClick={handleVerifyOtp}
            className="w-full mt-4 mx-auto"
            disabled={otpValues.join("").length !== OTP_LENGTH || isPending}
          >
            {isPending ? "Verifying..." : "Verify OTP"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep("EMAIL")}
            className="mt-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>
      </div>
    );
  }

  if (step === "RESET") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="text-center text-2xl font-bold mb-4">
            Reset Password
          </h2>
          <Form {...resetForm}>
            <form
              onSubmit={resetForm.handleSubmit(handleResetPassword)}
              className="space-y-4"
            >
              <CustomFormField
                control={resetForm.control}
                fieldType={FormFieldType.INPUT}
                type="password"
                name="password"
                label="New password"
              />
              <CustomFormField
                control={resetForm.control}
                fieldType={FormFieldType.INPUT}
                type="password"
                name="confirmPassword"
                label="Confirm password"
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  }
}
