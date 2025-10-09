"use client";
import AboutBeetech from "@/components/landing-page/features";
import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import { Button } from "@/components/ui/button";
import { Home, LogIn, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
const HeroSlides = [
  { src: "/images/ill-think-about-it.png", alt: "Hero 1" },
  { src: "/images/outlet_button.png", alt: "Hero 2" },
  { src: "/images/customer_think (2).png", alt: "Hero 3" },
  { src: "/images/customer_regis_button.png", alt: "Hero 3" },
];
function HeroCarousel() {
  return (
    <section className="relative bg-background py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
          {HeroSlides.map((m, index) => (
            <div
              key={index}
              className="relative w-full aspect-[4/3]  px-6   rounded-2xl shadow-md"
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
  const router = useRouter();
  const handleRoute = (url: string) => {
    router.push(url);
  };
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main>
        {/* nav */}
        <div className="md:hidden  space-y-4  py-8   bg-[#e9e9e9] p-3 border-b border-gray-300">
          <div className="w-full   flex  gap-4">
            <Button
              className="bg-[#1e96c8] min-w-[130px]  w-fit  hover:bg-[#187aa5] text-white font-light md:font-medium rounded-sm px-4 py-2 flex items-center gap-2 shadow-sm"
              onClick={() => handleRoute("/auth/sign-up")}
            >
              <User size={16} /> Register
            </Button>
            <Button
              className="bg-[#1e96c8]  w-full hover:bg-[#187aa5] text-white font-light md:font-medium rounded-sm px-4 py-2 flex items-center gap-2 shadow-sm"
              onClick={() => handleRoute("/auth/shoper")}
            >
              <Home size={16} /> Register Shopper
            </Button>
          </div>
          <div className="w-full  flex gap-4">
            <Button
              className="bg-[#1e96c8] min-w-[130px]  w-fit  hover:bg-[#187aa5] text-white font-light md:font-medium rounded-sm px-4 py-2 flex items-center gap-2 shadow-sm"
              onClick={() => handleRoute("/auth/sign-in")}
            >
              <LogIn size={16} /> Login
            </Button>
            <Button
              className="bg-[#1e96c8] w-full hover:bg-[#187aa5] text-white font-light md:font-medium rounded-sm px-4 py-2 flex items-center gap-2 shadow-sm"
              onClick={() => handleRoute("/auth/sign-in")}
            >
              <LogIn size={16} /> Login Shopper
            </Button>
          </div>

          <div className="w-full flex justify-center">
            <Button className="bg-[#1e96c8] min-w-[250px]   hover:bg-[#187aa5] text-white font-medium rounded-sm px-4 py-2 flex items-center gap-2 shadow-sm">
              Download App
            </Button>
          </div>
        </div>
        <div className="block md:hidden space-y-6 px-4 my-6">
          <div className="border bg-primary p-2 rounded-md">
            <Image
              src="/images/video-marketing (1).jpg"
              alt="video "
              width={600}
              height={400}
            />
          </div>
          <div className="border bg-primary p-2 rounded-md">
            <Image
              src="/images/online-img.jpg"
              alt="video "
              width={600}
              height={400}
            />
          </div>
        </div>
        <HeroCarousel />
        <AboutBeetech />
      </main>
      <Footer />
    </div>
  );
}
