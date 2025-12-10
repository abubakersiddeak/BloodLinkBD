"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { X } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="py-22">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white border border-gray-200 shadow-sm p-8">
            <div className="text-red-600 text-4xl mb-4">
              <X className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Fund Payment Cancelled
            </h2>
            <p className="text-gray-600 mb-4">
              Your fund process was not completed. You can try again anytime.
            </p>
            <a
              href="/fund"
              className="inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Go Back to Fund Page
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
