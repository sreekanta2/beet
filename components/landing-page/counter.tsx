"use client";
import { motion, useInView } from "framer-motion";
import { Banknote, MonitorPlay, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CounterCard = ({
  icon: Icon,
  label,
  value,
  index,
}: {
  icon: any;
  label: string;
  value: number;
  index: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / end));

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group flex flex-col items-center justify-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-8 w-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative mb-5">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 group-hover:from-blue-100 group-hover:to-blue-200 dark:group-hover:from-blue-800/40 dark:group-hover:to-blue-700/40 transition-all duration-300">
          <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{index + 1}</span>
        </div>
      </div>

      <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {count.toLocaleString()}k+
      </h3>
      <p className="text-lg text-gray-600 dark:text-gray-400 font-medium text-center">
        {label}
      </p>

      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  );
};

export default function StatsCounters() {
  const stats = [
    { icon: Users, label: "Active Members", value: 12 },
    { icon: MonitorPlay, label: "Ads Displayed", value: 8 },
    { icon: Banknote, label: "Total Earnings", value: 250 },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-24 px-4">
      <div className="max-w-6xl mx-auto ">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Achievements
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Empowering users to earn by purchasing packages and showcasing ads —
            here’s what we’ve accomplished together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <CounterCard
              key={index}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
