"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import Swal from "sweetalert2";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Show loading alert
    Swal.fire({
      title: "SENDING MESSAGE...",
      didOpen: () => Swal.showLoading(),
      customClass: { popup: "rounded-none border-2 border-black" },
    });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await Swal.fire({
        title: "MESSAGE SENT!",
        text: "Thank you for reaching out. We'll get back to you soon.",
        icon: "success",
        confirmButtonColor: "#dc2626",
        customClass: {
          popup: "rounded-none border-2 border-black",
          confirmButton: "rounded-none font-bold uppercase cursor-pointer",
        },
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      Swal.fire({
        title: "ERROR",
        text: "Failed to send message. Please try again.",
        icon: "error",
        confirmButtonColor: "#000000",
        customClass: {
          popup: "rounded-none border-2 border-black",
          confirmButton: "rounded-none font-bold uppercase cursor-pointer",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white min-h-screen py-8 md:py-12 lg:py-20">
      <div className="max-w-7xl px-4 md:px-6 lg:px-3 2xl:px-0 mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12 border-b border-black/10 pb-4 md:pb-6">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-black uppercase tracking-tight">
            Get In Touch
          </h2>
          <p className="text-gray-500 mt-2 text-xs md:text-sm lg:text-base max-w-2xl">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Contact Information Cards - Mobile First */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="border border-gray-200 bg-white hover:border-red-600 transition-colors group"
            >
              <div className="bg-black text-white p-3 md:p-4 flex items-center gap-2 md:gap-3 border-b border-gray-200">
                <div className="bg-white/20 p-1.5 md:p-2">
                  <Phone size={20} className="md:w-6 md:h-6" />
                </div>
                <h3 className="font-bold uppercase text-xs md:text-sm tracking-wider">
                  Phone Number
                </h3>
              </div>
              <div className="p-4 md:p-6 space-y-2">
                <a
                  href="tel:+8801234567890"
                  className="block text-gray-700 hover:text-red-600 font-medium transition-colors text-xs md:text-sm cursor-pointer"
                >
                  +880 1560045388
                </a>
                <a
                  href="tel:+8801987654321"
                  className="block text-gray-700 hover:text-red-600 font-medium transition-colors text-xs md:text-sm cursor-pointer"
                >
                  +880 1790884776
                </a>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="border border-gray-200 bg-white hover:border-red-600 transition-colors group"
            >
              <div className="bg-red-600 text-white p-3 md:p-4 flex items-center gap-2 md:gap-3 border-b border-gray-200">
                <div className="bg-white/20 p-1.5 md:p-2">
                  <Mail size={20} className="md:w-6 md:h-6" />
                </div>
                <h3 className="font-bold uppercase text-xs md:text-sm tracking-wider">
                  Email Address
                </h3>
              </div>
              <div className="p-4 md:p-6 space-y-2">
                <a
                  href="mailto:support@blooddonation.com"
                  className="block text-gray-700 hover:text-red-600 font-medium transition-colors break-all text-xs md:text-sm cursor-pointer"
                >
                  abubakarsiddik@gmail.com
                </a>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="border border-gray-200 bg-gray-50 p-4 md:p-6"
            >
              <h3 className="font-bold uppercase text-xs md:text-sm tracking-wider mb-3 md:mb-4 text-black">
                Follow Us
              </h3>
              <div className="flex gap-2 md:gap-3">
                <a
                  href="#"
                  className="bg-white border border-gray-300 p-2.5 md:p-3 hover:bg-black hover:text-white hover:border-black transition-colors cursor-pointer"
                  aria-label="Facebook"
                >
                  <Facebook size={18} className="md:w-5 md:h-5" />
                </a>
                <a
                  href="#"
                  className="bg-white border border-gray-300 p-2.5 md:p-3 hover:bg-black hover:text-white hover:border-black transition-colors cursor-pointer"
                  aria-label="Twitter"
                >
                  <Twitter size={18} className="md:w-5 md:h-5" />
                </a>
                <a
                  href="#"
                  className="bg-white border border-gray-300 p-2.5 md:p-3 hover:bg-black hover:text-white hover:border-black transition-colors cursor-pointer"
                  aria-label="Instagram"
                >
                  <Instagram size={18} className="md:w-5 md:h-5" />
                </a>
                <a
                  href="#"
                  className="bg-white border border-gray-300 p-2.5 md:p-3 hover:bg-black hover:text-white hover:border-black transition-colors cursor-pointer"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} className="md:w-5 md:h-5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Contact Form - Mobile First */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 border border-gray-200 bg-white"
          >
            <div className="bg-black text-white p-4 md:p-6 border-b border-gray-200">
              <h3 className="font-bold uppercase text-sm md:text-base lg:text-lg tracking-wider flex items-center gap-2 md:gap-3">
                <MessageSquare size={20} className="md:w-6 md:h-6" />
                Send Us A Message
              </h3>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6"
            >
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="relative group">
                  <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-2">
                    Your Name *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black pointer-events-none">
                      <User size={16} className="md:w-[18px] md:h-[18px]" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full h-11 md:h-12 pl-10 md:pl-12 pr-3 md:pr-4 bg-white border border-gray-300 text-black text-sm md:text-base placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-none"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black pointer-events-none">
                      <Mail size={16} className="md:w-[18px] md:h-[18px]" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full h-11 md:h-12 pl-10 md:pl-12 pr-3 md:pr-4 bg-white border border-gray-300 text-black text-sm md:text-base placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-none"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Subject Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="relative group">
                  <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black pointer-events-none">
                      <Phone size={16} className="md:w-[18px] md:h-[18px]" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1234-567890"
                      className="w-full h-11 md:h-12 pl-10 md:pl-12 pr-3 md:pr-4 bg-white border border-gray-300 text-black text-sm md:text-base placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-none"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this about?"
                    className="w-full h-11 md:h-12 px-3 md:px-4 bg-white border border-gray-300 text-black text-sm md:text-base placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-none"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="relative group">
                <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-2">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Write your message here..."
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-white border border-gray-300 text-black text-sm md:text-base placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 md:h-14 bg-red-600 text-white font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 md:gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-none cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>SENDING...</span>
                  ) : (
                    <>
                      <Send size={18} className="md:w-5 md:h-5" />
                      <span className="hidden sm:inline">Send Message</span>
                      <span className="sm:hidden">Send</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    })
                  }
                  className="w-full sm:w-auto px-6 md:px-8 h-12 md:h-14 bg-white border border-gray-300 text-black font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-black hover:text-white hover:border-black transition-colors rounded-none cursor-pointer"
                >
                  Clear
                </button>
              </div>

              <p className="text-[10px] md:text-xs text-gray-500 italic">
                * Required fields. We'll get back to you within 24-48 hours.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
