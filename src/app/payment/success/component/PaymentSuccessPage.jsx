"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import server from "@/lib/api";
import { CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [fundData, setFundData] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSessionData = async () => {
      try {
        setLoading(true);

        const res = await server.post(
          `/api/payment/payment-session/${sessionId}`
        );

        setFundData(res.data.fund);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Failed to load fund data",
          text: "Please contact support if your payment went through.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  return (
    <div className="bg-gray-50">
      <Navbar />

      <div className="py-22 min-h-screen">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white border border-gray-200 shadow-sm p-8">
            {loading ? (
              <p className="text-gray-600">
                Loading your fund donation details...
              </p>
            ) : fundData ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Fund Successful!
                </h2>

                <p className="text-gray-600 mb-2">
                  Thank you,{" "}
                  <span className="font-semibold">{fundData.funderName}</span>,
                  for supporting{" "}
                  <span className="font-semibold">
                    {fundData.fundFor || "General Fund"}
                  </span>
                  .
                </p>

                <p className="text-gray-700 mb-2">
                  Amount Funded:{" "}
                  <span className="font-semibold">${fundData.amountTotal}</span>
                </p>

                {fundData.message && (
                  <p className="text-gray-500 mt-2 italic">
                    “{fundData.message}”
                  </p>
                )}

                <Link
                  href="/"
                  className="inline-block mt-6 bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition"
                >
                  Back to Home Page
                </Link>
              </>
            ) : (
              <p>No fund data available.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
