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
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Clock,
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

    Swal.fire({
      title: "SENDING...",
      didOpen: () => Swal.showLoading(),
      customClass: { popup: "rounded-none border-2 border-black" },
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await Swal.fire({
        title: "SENT!",
        text: "We will respond shortly.",
        icon: "success",
        confirmButtonColor: "#000",
        customClass: {
          popup: "rounded-none border-2 border-black",
          confirmButton: "rounded-none cursor-pointer",
        },
      });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 md:py-20 bg-white font-sans text-gray-900 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-3 lg:px-3 2xl:px-0">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 border-b border-gray-200 pb-6 gap-4">
          <div className="max-w-lg">
            <div className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 mb-3">
              Support
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
              Get In <span className="text-red-600">Touch</span>
            </h2>
          </div>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            Response time: Approx. 24 Hours
          </p>
        </div>

        {/* --- Main Content Split --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-gray-200 shadow-sm">
          {/* --- LEFT: Contact Info (Red Theme) --- */}
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
            {/* Header Strip */}
            <div className="bg-red-600 text-white p-4 md:p-5 border-b border-gray-200">
              <h3 className="text-sm md:text-base font-bold uppercase tracking-wide flex items-center gap-3">
                <MapPin size={18} /> Contact Details
              </h3>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 bg-red-50 grow">
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-white p-2.5 border border-red-100 text-red-600 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-900 mb-1">
                      Call Us
                    </h4>
                    <a
                      href="tel:+8801790884776"
                      className="text-sm font-medium text-gray-800 hover:text-red-600 cursor-pointer transition-colors block"
                    >
                      +880 1790-884776
                    </a>
                    <p className="text-xs text-gray-500 mt-1">
                      Mon-Fri: 9am - 6pm
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-white p-2.5 border border-red-100 text-red-600 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-900 mb-1">
                      Email Us
                    </h4>
                    <a
                      href="mailto:support@bloodlink.com"
                      className="text-sm font-medium text-gray-800 hover:text-red-600 cursor-pointer transition-colors block break-all"
                    >
                      support@bloodlink.com
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Online 24/7</p>
                  </div>
                </div>

                {/* Socials */}
                <div className="pt-6 mt-6 border-t border-red-200">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-800 mb-3">
                    Follow Us
                  </h4>
                  <div className="flex gap-2">
                    {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="p-2.5 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-colors border border-red-100 cursor-pointer"
                      >
                        <Icon size={16} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT: Form (Black Theme) --- */}
          <div className="lg:col-span-2 bg-white flex flex-col">
            {/* Header Strip */}
            <div className="bg-black text-white p-4 md:p-5 border-b border-gray-200">
              <h3 className="text-sm md:text-base font-bold uppercase tracking-wide flex items-center gap-3">
                <MessageSquare size={18} /> Send Message
              </h3>
            </div>

            {/* Form Body */}
            <div className="p-6 md:p-8 grow">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Name *
                    </label>
                    <div className="relative group">
                      <User
                        className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black"
                        size={16}
                      />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-50 border border-gray-200 p-3 pl-10 text-sm focus:border-black focus:bg-white outline-none transition-colors rounded-none placeholder:text-gray-400"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Email *
                    </label>
                    <div className="relative group">
                      <Mail
                        className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black"
                        size={16}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-50 border border-gray-200 p-3 pl-10 text-sm focus:border-black focus:bg-white outline-none transition-colors rounded-none placeholder:text-gray-400"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone & Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Phone
                    </label>
                    <div className="relative group">
                      <Phone
                        className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black"
                        size={16}
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 p-3 pl-10 text-sm focus:border-black focus:bg-white outline-none transition-colors rounded-none placeholder:text-gray-400"
                        placeholder="+880..."
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:border-black focus:bg-white outline-none transition-colors rounded-none placeholder:text-gray-400"
                      placeholder="Inquiry Topic"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:border-black focus:bg-white outline-none transition-colors resize-none rounded-none placeholder:text-gray-400"
                    placeholder="How can we help?"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-none"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && <Send size={14} />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
