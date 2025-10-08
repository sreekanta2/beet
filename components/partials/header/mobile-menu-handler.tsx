"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/store";
import { Menu, X } from "lucide-react";

const MobileMenuHandler = () => {
  const { mobileMenu, setMobileMenu } = useSidebar();

  return (
    <div>
      <Button
        onClick={() => setMobileMenu(!mobileMenu)}
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 hover:bg-primary-100 dark:hover:bg-default-300 hover:text-primary text-default-500 dark:text-default-800 rounded-full transition-all duration-300"
      >
        {/* Menu icon with rotation animation */}
        <Menu
          className={`h-5 w-5 absolute transition-all duration-300 ${
            mobileMenu ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
          }`}
        />

        {/* Close (X) icon with rotation animation */}
        <X
          className={`h-5 w-5 absolute transition-all duration-300 ${
            mobileMenu ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
          }`}
        />
      </Button>
    </div>
  );
};

export default MobileMenuHandler;
