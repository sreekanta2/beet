"use client";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Entrepreneurship",
    description: "The journey of starting, developing and scaling a business.",
    img: "/icons/EntrepreneurShip (1).png", // replace with your actual image path
    href: "#",
  },
  {
    title: "Leadership",
    description: "Motivating team members to achieve a common goal.",
    img: "/icons/leadership.png",
    href: "#",
  },
  {
    title: "Own Business",
    description: "The best way to build a successful business step by step.",
    img: "/icons/own-business.png",
    href: "#",
  },
  {
    title: "Stable Income",
    description: "Exploring options for income stability in elderly life.",
    img: "/icons/stable_income_01.png",
    href: "#",
  },
];

export default function AboutBeetech() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          More about BEETECH
        </h2>
      </div>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
          >
            <div className="mb-4 w-44 h-44 relative">
              <Image
                src={feature.img}
                alt={feature.title}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-medium text-orange-500 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <Link
              href={feature.href}
              className="text-pink-500 font-medium hover:underline"
            >
              More Details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
