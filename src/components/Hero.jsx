"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <main className="bg-white  pt-4 sm:pt-5">
      {/* Hero Section */}
      <section className="bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl px-3 lg:px-3 2xl:px-0 mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1"
            >
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 leading-tight">
                Every Blood Donation
                <span className="block mt-1 sm:mt-2 text-red-600">
                  Saves A Life
                </span>
              </h1>

              {/* Description */}
              <p className="text-gray-700 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                Join our community of blood donors and be a hero. Your single
                donation can save up to three lives.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 justify-center lg:justify-start">
                <Link
                  href="/registerDonor"
                  className="bg-red-600 text-white px-6 sm:px-8 py-3 text-base sm:text-lg hover:bg-red-700 transition-colors text-center font-medium"
                >
                  Become a Donor
                </Link>
                <Link
                  href="/search"
                  className="border-2 border-red-600 text-red-600 px-6 sm:px-8 py-3 text-base sm:text-lg hover:bg-red-50 transition-colors text-center font-medium"
                >
                  Find Donors
                </Link>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-6 sm:pt-8 border-t border-gray-200">
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-bold text-red-600">
                    1,000+
                  </div>
                  <div className="text-gray-600 text-sm sm:text-base lg:text-sm xl:text-base">
                    Donors
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-bold text-red-600">
                    500+
                  </div>
                  <div className="text-gray-600 text-sm sm:text-base lg:text-sm xl:text-base">
                    Lives Saved
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-bold text-red-600">
                    24/7
                  </div>
                  <div className="text-gray-600 text-sm sm:text-base lg:text-sm xl:text-base">
                    Support
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="relative max-w-md sm:max-w-lg lg:max-w-none mx-auto">
                {/* Mobile Image */}
                <div className="block lg:hidden">
                  <Image
                    height={400}
                    width={400}
                    src="https://i.ibb.co.com/yBGfjN6r/photo-1615461066159-fea0960485d5.jpg"
                    alt="Blood Donation"
                    className="w-full h-64 sm:h-80 md:h-96 object-cover border-4 sm:border-6 border-white shadow-lg"
                  />
                </div>

                {/* Desktop Image */}
                <div className="hidden lg:block">
                  <Image
                    height={500}
                    width={500}
                    src="https://i.ibb.co.com/yBGfjN6r/photo-1615461066159-fea0960485d5.jpg"
                    alt="Blood Donation"
                    className="w-full h-80 lg:h-96 xl:h-[500px] object-cover border-6 lg:border-8 border-white shadow-lg"
                  />
                </div>

                {/* Emergency Contact Box - Only on larger screens */}
                <div className="hidden xl:block absolute -bottom-4 lg:-bottom-6 -right-4 lg:-right-6 bg-white p-4 lg:p-6 border border-gray-100 shadow-lg max-w-48">
                  <div className="text-red-600 font-bold text-sm lg:text-base">
                    Emergency Hotline
                  </div>
                  <div className="text-gray-700 text-sm lg:text-base">
                    +880 1790884776
                  </div>
                </div>

                {/* Mobile Emergency Contact - Below image */}
                <div className="block xl:hidden mt-4 sm:mt-6 bg-white p-4 border border-gray-100 shadow-lg text-center">
                  <div className="text-red-600 font-bold text-sm sm:text-base">
                    Emergency Hotline
                  </div>
                  <div className="text-gray-700 text-sm sm:text-base">
                    +880 1790884776
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
