"use client";

import SiteLogo from "@/components/sitelogo";
import Link from "next/link";
const MobileFooter = () => {
  return (
    <footer className="bg-card bg-no-repeat   shadow-[0_-4px_29px_#9595952b] dark:shadow-[0_-4px_29px_#000000cc] footer-bg  border-t dark:border-none flex justify-around items-center backdrop-filter backdrop-blur-[40px] fixed left-0 w-full z-50 bottom-0 py-[12px] px-4">
      <div className="relative shadow-[0_-4px_10px_#9595952b] dark:shadow-[0_-4px_10px_#0000004d] bg-card border-t dark:border-none bg-no-repeat backdrop-filter backdrop-blur-[40px] rounded-full footer-bg  h-[70px] w-[70px] z-[-1] -mt-[40px] flex justify-center items-center">
        <div className="rounded-full bg-primary p-3 h-[60px] w-[60px] flex items-center justify-center  relative left-0 top-0 custom-dropshadow  text-center">
          <Link href="/">
            <SiteLogo className="text-blue" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
