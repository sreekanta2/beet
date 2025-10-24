"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

import { formatBangladeshPhone } from "@/lib/utils";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Lock,
  Send,
  Shield,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

function WithdrawOtp() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const { data: session } = useSession();
  if (!session?.user?.telephone) {
    toast("Please login first");
    return;
  }
  const number = formatBangladeshPhone(session?.user?.telephone);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const container = document.getElementById("recaptcha-container");
    if (!container) return;
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    setRecaptchaVerifier(recaptchaVerifier);

    return () => {
      recaptchaVerifier.clear();
    };
  }, [auth]);

  useEffect(() => {
    const hasEnteredAllDigits = otp.length === 6;
    if (hasEnteredAllDigits) {
      verifyOtp();
    }
  }, [otp]);

  const verifyOtp = async () => {
    startTransition(async () => {
      setError("");

      if (!confirmationResult) {
        setError("Please request OTP first.");
        return;
      }

      try {
        await confirmationResult?.confirm(otp);
        router.replace("/");
      } catch (error) {
        console.log(error);

        setError("Failed to verify OTP. Please check the OTP.");
      }
    });
  };

  const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    setResendCountdown(60);

    startTransition(async () => {
      setError("");

      if (!recaptchaVerifier) {
        return setError("RecaptchaVerifier is not initialized.");
      }

      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          number,
          recaptchaVerifier
        );

        setConfirmationResult(confirmationResult);
        setSuccess("OTP sent successfully.");
      } catch (err: any) {
        console.log(err);
        setResendCountdown(0);

        if (err.code === "auth/invalid-phone-number") {
          setError("Invalid phone number. Please check the number.");
        } else if (err.code === "auth/too-many-requests") {
          setError("Too many requests. Please try again later.");
        } else {
          setError("Failed to send OTP. Please try again.");
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="relative w-full max-w-md">
        {/* Animated Background Elements */}

        {/* Main Card */}
        <div className="relative bg-white-500/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-500/20 overflow-hidden">
          {/* Header */}
          <div className="relative p-8 text-center border-b border-gray-500/10">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg">
                <Shield className="w-8 h-8 text-gray-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-500 mt-6 mb-2">
              {!confirmationResult ? "Secure Withdraw" : "Enter Code"}
            </h2>
            <p className="text-gray-500/70 text-sm">
              {!confirmationResult
                ? "Protect your withdraw with two-factor authentication"
                : `We sent a code to ${number}`}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {!confirmationResult ? (
              <form onSubmit={requestOtp} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <Input
                      className="   h-14 bg-gray-500/5 border-gray-500/20 text-gray-500 placeholder-gray-500/50 text-lg rounded-xl backdrop-blur-sm transition-all duration-300 focus:bg-gray-500/10 focus:border-gray-500/40 focus:ring-2 focus:ring-gray-500/30"
                      type="tel"
                      placeholder="Enter amount min 50"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <p className="text-gray-500/50 text-xs text-center">
                    Include country code (e.g., +44 for UK, +1 for US)
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={!amount || isPending || resendCountdown > 0}
                  className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-gray-500 font-semibold text-lg rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
                >
                  {resendCountdown > 0 ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Resend in {resendCountdown}s
                    </span>
                  ) : isPending ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Sending Code...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center text-white">
                      <Send className="w-5 h-5 mr-2" />
                      Send Verification Code
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-8">
                {/* OTP Input */}
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-gray-500/70 text-sm mb-4">
                      Enter 6-digit verification code
                    </p>
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      className="justify-center"
                    >
                      <InputOTPGroup className="gap-3">
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-14 h-16 text-2xl font-bold bg-gray-500/5 border-2 border-gray-500/20 text-gray-500 rounded-xl transition-all duration-300 data-[state=complete]:border-green-400 data-[state=active]:border-gray-500/60 data-[state=active]:ring-2 data-[state=active]:ring-gray-500/30 data-[state=complete]:bg-green-400/10"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {/* Resend Button */}
                  <Button
                    variant="ghost"
                    onClick={() => requestOtp()}
                    disabled={resendCountdown > 0 || isPending}
                    className="w-full text-gray-500/70 hover:text-gray-500 hover:bg-gray-500/10 border border-gray-500/10 rounded-xl py-3 transition-all duration-300"
                  >
                    {resendCountdown > 0
                      ? `Resend code in ${resendCountdown}s`
                      : "Didn't receive code? Resend"}
                  </Button>
                </div>

                {/* Change Number */}
                <Button
                  onClick={() => {
                    setConfirmationResult(null);
                    setOtp("");
                  }}
                  className="w-full text-gray-500/50 hover:text-gray-500 text-sm"
                >
                  ← Use different phone number
                </Button>
              </div>
            )}

            {/* Status Messages */}
            {(error || success) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-xl backdrop-blur-sm border ${
                  error
                    ? "bg-red-400/10 border-red-400/30 text-red-200"
                    : "bg-green-400/10 border-green-400/30 text-green-200"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {error ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">
                    {error || success}
                  </span>
                </div>
              </motion.div>
            )}

            {/* reCAPTCHA Container */}
            <div id="recaptcha-container" className="hidden" />

            {/* Enhanced Loading Indicator */}
            {isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-3xl flex items-center justify-center"
              >
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-500/20 border-t-gray-500 rounded-full animate-spin"></div>
                    {/* <Shield className="w-6 h-6 text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> */}
                  </div>
                  <p className="text-gray-500 font-medium">
                    {!confirmationResult
                      ? "Sending secure code..."
                      : "Verifying..."}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-500/5 border-t border-gray-500/10">
            <div className="flex items-center justify-center space-x-2 text-gray-500/40 text-xs">
              <Lock className="w-3 h-3" />
              <span>End-to-end encrypted • Your data is safe with us</span>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute -z-10 inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gray-500/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default WithdrawOtp;
