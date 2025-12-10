"use client";

import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart } from "lucide-react";
import FormInput from "@/components/FormInput";
import server from "@/lib/api";
import Swal from "sweetalert2";

export default function PaymentPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      amount: "",
      cause: "",
      message: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);

        // Show processing alert
        Swal.fire({
          title: "Redirecting to payment...",
          text: "Please wait while we create your payment session",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // API call to backend
        const res = await server.post(
          "/api/payment/create-checkout-session",
          data,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        // Redirect to Stripe Checkout
        if (res.data?.url) {
          window.location.href = res.data.url;
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: "Something went wrong while creating the payment session.",
        });
      } finally {
        setLoading(false);
      }
    },
    [reset]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="py-22">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-200 p-5 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 mb-3">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Make a Fund</h2>
              <p className="text-gray-600 text-sm mt-1">
                Support our cause with your generous contribution
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              {/* Name */}
              <FormInput
                id="name"
                label="Your Name"
                error={errors.name}
                register={register}
                type="text"
                placeholder="Enter your name"
                validation={{ required: "Name is required" }}
              />

              {/* Email */}
              <FormInput
                id="email"
                label="Email Address"
                error={errors.email}
                register={register}
                type="email"
                placeholder="Enter your email"
                validation={{
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please enter a valid email",
                  },
                }}
              />

              {/* Phone */}
              <FormInput
                id="phone"
                label="Phone Number"
                error={errors.phone}
                register={register}
                type="text"
                placeholder="Enter your phone number"
                validation={{ required: "Phone is required" }}
              />

              {/* Amount */}
              <FormInput
                id="amount"
                label="Fund Amount ($)"
                error={errors.amount}
                register={register}
                type="number"
                placeholder="Enter amount in USD"
                validation={{
                  required: "Amount is required",
                  min: { value: 1, message: "Minimum amount is $1" },
                }}
              />

              {/* Cause */}
              <FormInput
                id="cause"
                label="Fund For (optional)"
                error={errors.cause}
                register={register}
                type="text"
                placeholder="E.g., School Fund"
              />

              {/* Message */}
              <FormInput
                id="message"
                label="Message (optional)"
                error={errors.message}
                register={register}
                type="text"
                placeholder="Leave a message"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full bg-red-600 text-white py-2.5 px-4 font-medium hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
