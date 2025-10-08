import { useMediaQuery } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";
import { useSidebar } from "@/store";

import MobileFooter from "./mobile-footer";

const Footer = () => {
  const { collapsed } = useSidebar();
  const mounted = useMounted();
  const isMobile = useMediaQuery("(min-width: 768px)");

  if (!mounted) {
    return null;
  }
  if (!isMobile) {
    return <MobileFooter />;
  }

  return (
    <div
      className={`
      sticky bottom-0 
      
      text-muted-foreground 
      bg-card 
      p-4 
      ${collapsed ? "lg:ml-[72px]" : "lg:ml-[248px]"}
      transition-[margin] duration-300
    `}
    >
      <div className="flex items-center gap-4">
        <p className="sm:mb-0 text-xs md:text-base">
          COPYRIGHT © {new Date().getFullYear()}
        </p>
        <p className="mb-0 text-xs md:text-base">
          Hand-crafted & Made by{" "}
          <a
            className="text-primary"
            target="__blank"
            href="https://srikanto.site"
          >
            Srikanto
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
