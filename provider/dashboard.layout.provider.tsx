"use client";
import Loader from "@/components/loader";
import Footer from "@/components/partials/footer";
import Header from "@/components/partials/header";
import Sidebar from "@/components/partials/sidebar";
import MobileSidebar from "@/components/partials/sidebar/mobile-sidebar";

import { adminConfig, MenuItemProps } from "@/config/menus";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";
import { cn, Role } from "@/lib/utils";
import { useSidebar } from "@/store";
import { UserRole } from "@/types/common";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";

const DashBoardLayoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { collapsed } = useSidebar();
  const [open, setOpen] = React.useState(false);
  const location = usePathname();
  const isMobile = useMediaQuery("(min-width: 768px)");
  const mounted = useMounted();

  return (
    <div>
      <Header />
      <Sidebar />
      <div className={`${!collapsed ? "collapsed" : "not-collapsed"}`}>
        <div className={cn("layout-padding px-4 pt-4 page-min-height")}>
          <div className="flex items-center justify-center h-full">
            {mounted ?? <Loader />}
          </div>

          <LayoutWrapper
            isMobile={isMobile}
            setOpen={setOpen}
            open={open}
            location={location}
          >
            {children}
          </LayoutWrapper>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashBoardLayoutProvider;

interface LayoutWrapperProps {
  children: React.ReactNode;
  isMobile: boolean;
  setOpen: (open: boolean) => void;
  open: boolean;
  location: string;
  role?: UserRole;
}

const LayoutWrapper = ({ children, location }: LayoutWrapperProps) => {
  const user = useSession();
  const userRole = user?.data?.user?.role;
  const getMenuConfig = (): MenuItemProps[] => {
    switch (userRole) {
      case Role.ADMIN:
        return adminConfig;

      default:
        return [];
    }
  };

  const menus = getMenuConfig();

  return (
    <>
      <motion.div
        key={location}
        initial="pageInitial"
        animate="pageAnimate"
        exit="pageExit"
        variants={{
          pageInitial: {
            opacity: 0,
            y: 50,
          },
          pageAnimate: {
            opacity: 1,
            y: 0,
          },
          pageExit: {
            opacity: 0,
            y: -50,
          },
        }}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: 0.5,
        }}
      >
        <main>{children}</main>
      </motion.div>
      <MobileSidebar menus={menus} className="left-[300px]" />
    </>
  );
};
