"use client";
import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import { Loader } from "@/components/loader";

import { useMounted } from "@/hooks/use-mounted"; // ✅ use your hook
import { Home, LogIn, User, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HeroSlides = [
  { src: "/images/businessworld.jpg", alt: "Hero 1" },
  { src: "/images/easytect.jpg", alt: "Hero 2" },
  { src: "/images/marketing.jpg", alt: "Hero 3" },
];

function HeroCarousel() {
  return (
    <section className="relative bg-background py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
          {HeroSlides.map((m, index) => (
            <div
              key={index}
              className="relative w-full aspect-[4/3] px-6 rounded-2xl shadow-md"
            >
              <Image
                src={m.src}
                alt={m.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-300 hover:scale-105"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BeetcHomeReplica() {
  const { data: session } = useSession();
  const router = useRouter();
  const mounted = useMounted(); // ✅ checks if the page is hydrated

  const handleRoute = (url: string) => router.push(url);

  // 🌀 Show Loader until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main>
        <div className="flex justify-end gap-3 max-w-5xl mx-auto p-3">
          {!session?.user && (
            <div className="flex flex-wrap md:hidden gap-2 p-3">
              {/* Register Button */}
              <button
                onClick={() => handleRoute("/auth/sign-up")}
                className="relative group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-xl px-6 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 overflow-hidden w-full max-w-[150px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <User size={18} className="relative z-10" />
                <span className="relative z-10">Register</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </button>

              {/* Register Shopper */}
              <button
                onClick={() => handleRoute("/auth/shoper")}
                className="relative group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl px-6 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Home size={18} className="relative z-10" />
                <span className="relative z-10">Register Shopper</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </button>

              {/* Login */}
              <button
                onClick={() => handleRoute("/auth/sign-in")}
                className="relative group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-xl px-6 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 overflow-hidden w-full max-w-[150px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <LogIn size={18} className="relative z-10" />
                <span className="relative z-10">Login</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </button>

              {/* Tutorial */}
              <button className="relative group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl px-6 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Video size={18} className="relative z-10" />
                <span className="relative z-10">Watch Tutorial</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </button>
            </div>
          )}
        </div>

        <HeroCarousel />
      </main>
      <Footer />
    </div>
  );
}
