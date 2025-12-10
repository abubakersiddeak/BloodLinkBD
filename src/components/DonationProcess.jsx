"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Stethoscope,
  Droplet,
  Coffee,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function DonationProcess() {
  const processSteps = [
    {
      step: "1",
      title: "Registration",
      description: "Fill out a form with your basic information",
      icon: ClipboardList,
      color: "bg-red-600",
    },
    {
      step: "2",
      title: "Screening",
      description:
        "Quick physical check of temperature, blood pressure, and hemoglobin",
      icon: Stethoscope,
      color: "bg-black",
    },
    {
      step: "3",
      title: "Donation",
      description: "The actual donation takes only 8-10 minutes",
      icon: Droplet,
      color: "bg-red-600",
    },
    {
      step: "4",
      title: "Recovery",
      description: "Rest and refresh with provided snacks and drinks",
      icon: Coffee,
      color: "bg-black",
    },
  ];

  const beforeDonation = [
    "Get enough sleep (at least 7-8 hours)",
    "Eat a healthy, iron-rich meal",
    "Drink plenty of water (16 oz extra)",
    "Bring valid ID and donor card",
  ];

  const afterDonation = [
    "Rest for 10-15 minutes minimum",
    "Have snacks and drinks provided",
    "Avoid heavy lifting for 5 hours",
    "Keep the bandage on for 4-5 hours",
  ];

  return (
    <section className="py-8 md:py-12 lg:py-20 bg-white">
      <div className="max-w-7xl px-4 md:px-6 lg:px-3 2xl:px-0 mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12 border-b border-black/10 pb-4 md:pb-6">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-black uppercase tracking-tight text-center md:text-left">
            Simple Donation Process
          </h2>
          <p className="text-gray-500 mt-2 text-xs md:text-sm lg:text-base max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            Donating blood is a simple and straightforward process that takes
            about 30-45 minutes
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {processSteps.map((process, index) => {
            const IconComponent = process.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 hover:border-black transition-colors group"
              >
                {/* Step Header */}
                <div
                  className={`${process.color} text-white p-4 md:p-5 border-b border-gray-200`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base font-bold uppercase tracking-wider">
                      Step {process.step}
                    </span>
                    <div className="bg-white/20 p-1.5 md:p-2">
                      <IconComponent size={20} className="md:w-6 md:h-6" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-bold text-black mb-2 md:mb-3 uppercase">
                    {process.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                    {process.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                    className={`h-full ${process.color}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Before & After Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Before Donation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 hover:border-red-600 transition-colors"
          >
            <div className="bg-red-600 text-white p-4 md:p-5 border-b border-gray-200">
              <h3 className="text-base md:text-lg lg:text-xl font-bold uppercase tracking-wide flex items-center gap-2 md:gap-3">
                <CheckCircle2 size={20} className="md:w-6 md:h-6" />
                Before Donation
              </h3>
            </div>
            <div className="p-4 md:p-6 lg:p-8">
              <ul className="space-y-3 md:space-y-4">
                {beforeDonation.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 group/item"
                  >
                    <div className="bg-red-600 text-white p-1 mt-0.5 shrink-0">
                      <CheckCircle2 size={14} className="md:w-4 md:h-4" />
                    </div>
                    <span className="text-gray-700 text-xs md:text-sm lg:text-base group-hover/item:text-black transition-colors">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* After Donation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 hover:border-black transition-colors"
          >
            <div className="bg-black text-white p-4 md:p-5 border-b border-gray-200">
              <h3 className="text-base md:text-lg lg:text-xl font-bold uppercase tracking-wide flex items-center gap-2 md:gap-3">
                <CheckCircle2 size={20} className="md:w-6 md:h-6" />
                After Donation
              </h3>
            </div>
            <div className="p-4 md:p-6 lg:p-8">
              <ul className="space-y-3 md:space-y-4">
                {afterDonation.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 group/item"
                  >
                    <div className="bg-black text-white p-1 mt-0.5 shrink-0">
                      <CheckCircle2 size={14} className="md:w-4 md:h-4" />
                    </div>
                    <span className="text-gray-700 text-xs md:text-sm lg:text-base group-hover/item:text-black transition-colors">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
