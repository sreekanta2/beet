"use client";
import { Loader } from "@/components/loader";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

const DashBoardLayoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = usePathname();
  const mounted = useMounted(); // true after hydration (no delay)

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className={cn("page-min-height")}>
      <LayoutWrapper location={location}>{children}</LayoutWrapper>
    </div>
  );
};

export default DashBoardLayoutProvider;

interface LayoutWrapperProps {
  children: React.ReactNode;
  location: string;
}

const LayoutWrapper = ({ children, location }: LayoutWrapperProps) => (
  <motion.div
    key={location}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
  >
    <main>{children}</main>
  </motion.div>
);
