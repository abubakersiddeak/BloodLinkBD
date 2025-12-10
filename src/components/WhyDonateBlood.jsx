"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Activity,
  Users,
  AlertCircle,
  ArrowRight,
  Check,
  Info,
  Shield,
} from "lucide-react";

export default function WhyDonateBlood() {
  const reasons = [
    {
      icon: Activity,
      title: "Emergency Care",
      description: "Blood is essential for surgeries and emergency treatments",
      color: "bg-red-600",
      stats: "24/7 Need",
    },
    {
      icon: Heart,
      title: "Cancer Treatment",
      description: "Cancer patients may need blood daily during chemotherapy",
      color: "bg-black",
      stats: "Daily Support",
    },
    {
      icon: AlertCircle,
      title: "Accident Victims",
      description: "A single car accident victim can require up to 100 units",
      color: "bg-red-600",
      stats: "100 Units",
    },
  ];

  const bloodCompatibility = [
    {
      type: "A+",
      canGiveTo: "A+, AB+",
      canReceiveFrom: "A+, A-, O+, O-",
      percentage: "35.7%",
    },
    {
      type: "O+",
      canGiveTo: "O+, A+, B+, AB+",
      canReceiveFrom: "O+, O-",
      percentage: "37.4%",
    },
    {
      type: "B+",
      canGiveTo: "B+, AB+",
      canReceiveFrom: "B+, B-, O+, O-",
      percentage: "8.5%",
    },
    {
      type: "AB+",
      canGiveTo: "AB+",
      canReceiveFrom: "All Types",
      percentage: "3.4%",
    },
    {
      type: "A-",
      canGiveTo: "A+, A-, AB+, AB-",
      canReceiveFrom: "A-, O-",
      percentage: "6.3%",
    },
    {
      type: "O-",
      canGiveTo: "All Types",
      canReceiveFrom: "O-",
      percentage: "6.6%",
    },
    {
      type: "B-",
      canGiveTo: "B+, B-, AB+, AB-",
      canReceiveFrom: "B-, O-",
      percentage: "1.5%",
    },
    {
      type: "AB-",
      canGiveTo: "AB+, AB-",
      canReceiveFrom: "AB-, A-, B-, O-",
      percentage: "0.6%",
    },
  ];

  const didYouKnow = [
    "Every 2 seconds someone needs blood worldwide",
    "One donation can save up to three lives",
    "Less than 38% of population is eligible to donate",
    "Blood cannot be manufactured - only donated",
  ];

  const requirements = [
    "Be at least 17 years old (16 with consent)",
    "Weigh at least 110 pounds (50 kg)",
    "Be in good general health condition",
    "Not donated blood in last 56 days",
  ];

  return (
    <section className="py-8 md:py-12 lg:py-20 bg-gray-50">
      <div className="max-w-7xl px-4 md:px-6 lg:px-3 2xl:px-0 mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12 border-b border-black/10 pb-4 md:pb-6">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-black uppercase tracking-tight text-center md:text-left">
            Why Donate Blood?
          </h2>
          <p className="text-gray-500 mt-2 text-xs md:text-sm lg:text-base max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            Your blood donation can help patients in need, from cancer treatment
            to traumatic injuries.
          </p>
        </div>

        {/* Main Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 lg:mb-16">
          {reasons.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 hover:border-black transition-colors group"
              >
                {/* Icon Header */}
                <div
                  className={`${item.color} text-white p-4 md:p-6 border-b border-gray-200 flex items-center justify-between`}
                >
                  <div className="bg-white/20 p-2 md:p-3">
                    <IconComponent size={24} className="md:w-8 md:h-8" />
                  </div>
                  <span className="text-xs md:text-sm font-bold uppercase tracking-wider">
                    {item.stats}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-black mb-2 md:mb-3 uppercase">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Blood Type Compatibility Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-gray-200 mb-8 md:mb-12 lg:mb-16"
        >
          <div className="bg-black text-white p-4 md:p-6 border-b border-gray-200">
            <h3 className="text-base md:text-lg lg:text-2xl font-bold uppercase tracking-wide flex items-center gap-2 md:gap-3">
              <Users size={20} className="md:w-6 md:h-6" />
              Blood Type Compatibility Chart
            </h3>
            <p className="text-gray-300 text-xs md:text-sm mt-2">
              Universal donor: O- | Universal recipient: AB+
            </p>
          </div>

          <div className="p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {bloodCompatibility.map((blood, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 hover:border-red-600 transition-colors group"
                >
                  {/* Blood Type Header */}
                  <div className="bg-red-600 text-white p-3 md:p-4 text-center border-b border-gray-200">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold">
                      {blood.type}
                    </div>
                    <div className="text-[10px] md:text-xs text-red-100 mt-1">
                      {blood.percentage} Population
                    </div>
                  </div>

                  {/* Compatibility Info */}
                  <div className="p-3 md:p-4 text-xs md:text-sm space-y-2 md:space-y-3">
                    <div>
                      <p className="font-bold text-gray-400 uppercase mb-1 text-[10px] md:text-xs">
                        Can Give To:
                      </p>
                      <p className="text-gray-700 leading-snug">
                        {blood.canGiveTo}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-400 uppercase mb-1 text-[10px] md:text-xs">
                        Can Receive:
                      </p>
                      <p className="text-gray-700 leading-snug">
                        {blood.canReceiveFrom}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="border-t border-gray-200 bg-gray-50 p-4 md:p-6">
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="bg-red-600 text-white px-2 py-1 font-bold">
                  O-
                </div>
                <span className="text-gray-600">Universal Donor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-red-600 text-white px-2 py-1 font-bold">
                  AB+
                </div>
                <span className="text-gray-600">Universal Recipient</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Facts & Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Did You Know */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 hover:border-red-600 transition-colors"
          >
            <div className="bg-red-600 text-white p-4 md:p-5 border-b border-gray-200">
              <h3 className="text-base md:text-lg lg:text-xl font-bold uppercase tracking-wide flex items-center gap-2 md:gap-3">
                <Info size={20} className="md:w-6 md:h-6" />
                Did You Know?
              </h3>
            </div>
            <div className="p-4 md:p-6 lg:p-8">
              <ul className="space-y-3 md:space-y-4">
                {didYouKnow.map((fact, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 group/item"
                  >
                    <div className="bg-red-600 text-white p-1 mt-0.5 shrink-0">
                      <ArrowRight size={14} className="md:w-4 md:h-4" />
                    </div>
                    <span className="text-gray-700 text-xs md:text-sm lg:text-base group-hover/item:text-black transition-colors">
                      {fact}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Requirements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 hover:border-black transition-colors"
          >
            <div className="bg-black text-white p-4 md:p-5 border-b border-gray-200">
              <h3 className="text-base md:text-lg lg:text-xl font-bold uppercase tracking-wide flex items-center gap-2 md:gap-3">
                <Shield size={20} className="md:w-6 md:h-6" />
                Requirements to Donate
              </h3>
            </div>
            <div className="p-4 md:p-6 lg:p-8">
              <ul className="space-y-3 md:space-y-4">
                {requirements.map((req, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 group/item"
                  >
                    <div className="bg-black text-white p-1 mt-0.5 shrink-0">
                      <Check size={14} className="md:w-4 md:h-4" />
                    </div>
                    <span className="text-gray-700 text-xs md:text-sm lg:text-base group-hover/item:text-black transition-colors">
                      {req}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 md:mt-12 lg:mt-16 border-2 border-black/20 p-6 md:p-8 lg:p-12 bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-2">
                3
              </div>
              <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">
                Lives Saved Per Donation
              </p>
            </div>
            <div className="text-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-2">
                56
              </div>
              <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">
                Days Between Donations
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-2">
                38%
              </div>
              <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">
                Eligible Population
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
