"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import server from "@/lib/api";

const FundDetailsPage = () => {
  const router = useRouter();

  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9; // Reduced slightly to fit grid better

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        setLoading(true);
        const response = await server.get("/api/fund/userFund");
        setFunds(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching funds:", err);
        setError("Failed to load donations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, []);

  // Pagination Logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = funds.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(funds.length / cardsPerPage);

  // Formatting Helpers
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  // --- Render States ---

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black mb-4" />
        <p className="text-sm uppercase tracking-widest text-gray-500">
          Loading Data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-red-500 p-8 text-center">
          <p className="text-red-600 mb-6 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white hover:bg-red-600 px-6 py-3 text-sm uppercase tracking-widest transition-colors duration-300 w-full"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" text-gray-900">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-black mb-4">
              Donation <span className="font-bold">History</span>
            </h1>
            <p className="text-gray-500 max-w-xl font-light text-lg">
              Transparent tracking of all contributions supporting our blood
              donation initiative.
            </p>
          </div>

          <button
            onClick={() => router.push("/payment")}
            className="group cursor-pointer rounded-lg flex items-center gap-3 bg-black text-white hover:bg-red-600 px-8 py-4 transition-all duration-300"
          >
            <span className="uppercase tracking-widest text-sm font-medium">
              Donate Fund
            </span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* Empty State */}
        {funds.length === 0 ? (
          <div className="border border-dashed border-gray-300 p-16 text-center">
            <p className="text-xl text-gray-400 font-light">
              No donations recorded yet.
            </p>
          </div>
        ) : (
          <>
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-16">
              {currentCards.map((fund) => (
                <div
                  key={fund._id}
                  className="group relative border rounded-lg border-gray-200 bg-white hover:border-black transition-all duration-300 p-6 sm:p-8 flex flex-col h-full"
                >
                  {/* Status Indicator (Top Right) */}
                  <div className="absolute top-6 right-6">
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${
                        fund.paymentStatus === "paid"
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {fund.paymentStatus}
                    </span>
                  </div>

                  {/* Main Amount */}
                  <div className="mb-6 mt-2">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                      Total Contribution
                    </p>
                    <h3 className="text-3xl sm:text-4xl font-light text-black">
                      {formatCurrency(fund.amountTotal, fund.currency)}
                    </h3>
                  </div>

                  <div className="w-full h-px bg-gray-100 mb-6 group-hover:bg-gray-200 transition-colors" />

                  {/* Details List */}
                  <div className="space-y-4 grow">
                    {/* Donor Info */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                        Donor
                      </p>
                      <p className="text-lg font-medium truncate">
                        {fund.funderName}
                      </p>
                    </div>

                    {/* Cause */}
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <DollarSign size={14} className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{fund.fundFor}</p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Mail size={14} />
                        <span className="truncate">{fund.funderEmail}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{fund.funderPhone}</span>
                      </div>
                    </div>

                    {/* Message (Conditional) */}
                    {fund.message && (
                      <div className="pt-2">
                        <div className="flex gap-3">
                          <MessageCircle
                            size={14}
                            className="text-gray-400 mt-1 shrink-0"
                          />
                          <p className="text-sm text-gray-500 italic font-light leading-relaxed">
                            {fund.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Date */}
                  <div className="mt-8 pt-4 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider">
                    <Calendar size={12} />
                    <span>{formatDate(fund.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center border-t border-gray-100 pt-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-red-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={16} /> Previous
                </button>

                <div className="hidden sm:flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-10 h-10 flex items-center justify-center text-sm font-medium transition-colors ${
                            currentPage === pageNumber
                              ? "bg-black text-white"
                              : "bg-white text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="w-10 h-10 flex items-center justify-center text-gray-300"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Mobile Page Indicator */}
                <div className="sm:hidden text-xs text-gray-500 uppercase tracking-widest">
                  Page {currentPage} / {totalPages}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-red-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            )}

            <div className="text-center mt-12">
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                Showing {indexOfFirstCard + 1}-
                {Math.min(indexOfLastCard, funds.length)} of {funds.length}{" "}
                records
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FundDetailsPage;
