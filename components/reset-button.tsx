import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  variant?: "soft" | "outline" | "ghost";
  color?:
    | "default"
    | "primary"
    | "info"
    | "warning"
    | "success"
    | "destructive"
    | "secondary"
    | "dark";
  onClick?: () => void;
  isLoading?: boolean;
}

const ResetButton = ({
  className,
  children,
  variant,
  color,
  onClick,
  isLoading,
}: ButtonProps) => {
  return (
    <Button
      type="button"
      variant={variant}
      color={color}
      className={className}
      onClick={onClick}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : children}
    </Button>
  );
};

export default ResetButton;
