import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

export const OTPCountdown = ({
  countdown,
  onResend,
}: {
  countdown: number;
  onResend: () => void;
}) => {
  return countdown > 0 ? (
    <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
      <Timer className="h-4 w-4" />
      Resend OTP in {countdown}s
    </p>
  ) : (
    <Button
      type="button"
      variant="ghost"
      onClick={onResend}
      className="text-blue-600 hover:text-blue-700"
    >
      Resend OTP
    </Button>
  );
};
