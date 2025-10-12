"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-200 border-t mt-10 w-full">
      <div className="max-w-7xl mx-auto p-4  text-sm text-gray-600">
        <div className="flex flex-col gap-6">
          <div className="flex gap-6 flex-wrap md:flex-nowrap">
            <div>
              <h4 className="font-semibold mb-2">Informations</h4>
              <ul className="space-y-1">
                <li>
                  <a href="/about">About Us</a>
                </li>
                <li>
                  <a href="/privacy-policy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms-and-conditions">Terms & Conditions</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-400 ">
            <h1 className="pt-2">Powered By EASYTECH </h1>
            <div className="  text-xs">
              {" "}
              Easytech business world {new Date().getFullYear()}
            </div>
            <Link href={"https://srikanto.site"} target="_blank">
              Made
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
