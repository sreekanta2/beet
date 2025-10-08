"use client";

import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 relative">
                <Image src="/images/logo.png" alt="logo" fill sizes="40px" />
              </div>
              <div className="font-semibold">Bee Tech Communication OPC</div>
            </div>
            <div>Powered By BEETECH — www.beetc24.com</div>
            <div className="mt-2">© {new Date().getFullYear()}</div>
          </div>

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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
