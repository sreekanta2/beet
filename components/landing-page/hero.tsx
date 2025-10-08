"use client";

import { Banner } from "@prisma/client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "swiper/css";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const Testimonial = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  useEffect(() => {
    const fetchBanners = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`);
      const banners = await res.json();
      setBanners(banners?.data);
    };
    fetchBanners();
  }, [banners]);
  const testimonials = [
    {
      name: "রফিকুল ইসলাম",
      feedback:
        "প্যাকেজ কেনার পর প্রতিদিন বিজ্ঞাপন দেখে সহজে আয় করতে পারছি। সত্যিই দারুণ প্ল্যাটফর্ম।",
    },
    {
      name: "সাবিনা ইয়াসমিন",
      feedback:
        "এখানে রেজিস্ট্রেশন করা খুব সহজ ছিল, আর এখন প্রতিদিন নিয়মিত ইনকাম পাচ্ছি।",
    },
    {
      name: "মাহমুদ হাসান",
      feedback:
        "কোনো ঝামেলা ছাড়াই বিজ্ঞাপন দেখে আয় করা যায়। খুবই বিশ্বাসযোগ্য সাইট।",
    },
    {
      name: "ফারজানা আক্তার",
      feedback:
        "আমি স্টুডেন্ট, এখানে ছোট প্যাকেজ কিনে দিনে ভালো পরিমাণ টাকা আয় করছি।",
    },
    {
      name: "আল আমিন হোসেন",
      feedback:
        "রেফারেল সিস্টেমের মাধ্যমে আরও বেশি আয় করতে পারছি। অসাধারণ অভিজ্ঞতা।",
    },
    {
      name: "নুসরাত জাহান",
      feedback:
        "প্যাকেজ কেনার পর সাথে সাথেই বিজ্ঞাপন শো করতে শুরু করেছি। খুবই ইউজার ফ্রেন্ডলি।",
    },
    {
      name: "শাহিনুর রহমান",
      feedback:
        "অনলাইনে ইনকামের জন্য এটি একটি নিরাপদ ও সহজ মাধ্যম। আমি খুব সন্তুষ্ট।",
    },
    {
      name: "তানিয়া আক্তার",
      feedback:
        "এখানে আমার প্রথম ইনকাম হাতে পাওয়ার পর আমি আত্মবিশ্বাসী হয়েছি। সত্যিই ভালো।",
    },
    {
      name: "ইমরান হোসেন",
      feedback:
        "বিজ্ঞাপন দেখে প্রতিদিন আয় করার সুযোগ আমাকে অনেক সাহায্য করেছে।",
    },
    {
      name: "মোস্তাফিজুর রহমান",
      feedback: "খুব দ্রুত পেমেন্ট পাই। ইনকামের জন্য চমৎকার একটি সল্যুশন।",
    },
  ];

  return (
    <motion.section className="bg-card/30   py-14 ">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          What Our{" "}
          <span className="text-blue-600 dark:text-blue-400">Users Say</span>
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">
          Thousands of members across Bangladesh are earning daily by purchasing
          packages and showing ads. Here’s what some of them shared about their
          journey.
        </p>
      </div>

      <div className="relative px-2  max-w-5xl mx-auto ">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          speed={1000}
          loop={true}
          grabCursor={true}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Navigation, Autoplay]}
          breakpoints={{
            768: { slidesPerView: 2 },
            640: { slidesPerView: 1 },
            0: { slidesPerView: 1 },
          }}
          className="!py-4"
        >
          {testimonials?.map((item, index) => {
            return (
              <SwiperSlide key={item.feedback}>
                <blockquote className="p-6 rounded-xl shadow-md bg-gray-50 hover:shadow-lg transition">
                  <p className="text-gray-700 italic">“`{item.feedback}`”</p>
                  <footer className="mt-4 font-semibold text-blue-600">
                    —{item.name}.
                  </footer>
                </blockquote>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </motion.section>
  );
};

export default Testimonial;
