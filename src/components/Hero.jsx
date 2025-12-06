"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <main className="bg-white pt-6">
      {/* Hero Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl px-3 lg:px-0 mx-auto ">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left space-y-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Every Blood Donation
                <span className="block mt-2 text-red-600">Saves A Life</span>
              </h1>

              <p className="text-gray-700 text-lg leading-relaxed max-w-lg">
                Join our community of blood donors and be a hero. Your single
                donation can save up to three lives.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/register"
                  className="bg-red-600 text-white px-8 py-3 text-lg hover:bg-red-700 transition-colors"
                >
                  Become a Donor
                </Link>
                <Link
                  href="/search"
                  className="border-2 border-red-600 text-red-600 px-8 py-3 text-lg hover:bg-red-50 transition-colors"
                >
                  Find Donors
                </Link>
              </div>

              {/* Simple Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-red-600">1,000+</div>
                  <div className="text-gray-600">Donors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">500+</div>
                  <div className="text-gray-600">Lives Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <img
                  src="https://ichef.bbci.co.uk/news/480/cpsprodpb/3c41/live/4914eb10-c6c5-11f0-82b1-6148fee2770d.jpg.webp"
                  alt="Blood Donation"
                  className="w-full h-[500px] object-cover border-8 border-white shadow-lg"
                />
                {/* Emergency Contact Box */}
                <div className="absolute -bottom-6 -right-6 bg-white p-6 border border-gray-100 shadow-lg">
                  <div className="text-red-600 font-bold">
                    Emergency Hotline
                  </div>
                  <div className="text-gray-700">+880 1790884776</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of your sections... */}
    </main>
  );
}
