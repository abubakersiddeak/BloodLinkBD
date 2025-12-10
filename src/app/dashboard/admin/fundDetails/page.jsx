"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Search,
  ArrowUpRight,
  Download,
  DollarSign,
  Users,
  Calendar,
  AlertCircle,
  X,
  CreditCard,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import server from "@/lib/api";

const AdminFundDashboard = () => {
  const router = useRouter();

  // --- State ---
  const [data, setData] = useState({ totalFund: 0, donations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [selectedFund, setSelectedFund] = useState(null);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await server.get("/api/fund");
        setData({
          totalFund: response.data.data.totalFund,
          donations: response.data.data.donations,
        });
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        if (err.response && err.response.status === 403) {
          setError(
            "Access Denied: You do not have permission to view this data."
          );
        } else {
          setError("Failed to load financial data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Filtering & Pagination Logic ---

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredDonations = data.donations.filter(
    (item) =>
      item.funderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.funderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fundFor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDonations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

  // --- Formatters ---
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- Modal Component ---
  const DonationModal = ({ fund, onClose }) => {
    if (!fund) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 border-t-4 border-red-600">
          {/* Modal Header */}
          <div className="flex justify-between items-start p-8 border-b border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Transaction Details
              </p>
              <h2 className="text-2xl font-light text-black">
                {fund.funderName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Amount & Status */}
            <div className="col-span-1 md:col-span-2 bg-gray-50 p-6 flex justify-between items-center border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                  Amount
                </p>
                <p className="text-3xl font-light text-black">
                  {formatCurrency(fund.amountTotal, fund.currency)}
                </p>
              </div>
              <span
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border ${
                  fund.paymentStatus === "paid"
                    ? "border-black text-black bg-white"
                    : "border-red-200 text-red-600 bg-red-50"
                }`}
              >
                {fund.paymentStatus}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold border-b border-gray-200 pb-2 mb-4">
                Contact Info
              </h3>
              <div>
                <p className="text-xs text-gray-400 uppercase">Email</p>
                <p className="text-sm font-medium">{fund.funderEmail}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Phone</p>
                <p className="text-sm font-medium">
                  {fund.funderPhone || "N/A"}
                </p>
              </div>
            </div>

            {/* Technical Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold border-b border-gray-200 pb-2 mb-4">
                Payment Details
              </h3>
              <div>
                <p className="text-xs text-gray-400 uppercase">Date</p>
                <p className="text-sm font-medium">
                  {formatDate(fund.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Session ID</p>
                <p className="text-xs font-mono text-gray-600 break-all">
                  {fund.sessionId}
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="col-span-1 md:col-span-2 mt-2">
              <h3 className="text-sm font-bold border-b border-gray-200 pb-2 mb-4 flex items-center gap-2">
                <MessageSquare size={16} /> Donor Message
              </h3>
              <div className="bg-white border border-gray-200 p-4 text-gray-600 italic text-sm">
                "{fund.message || "No message provided."}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- Render States ---
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black mb-4" />
        <p className="text-xs uppercase tracking-widest text-gray-400">
          Syncing Database...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="border border-red-500 p-8 max-w-lg w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-light text-black mb-2">
            Restricted Area
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-black text-white hover:bg-red-600 px-6 py-3 text-sm uppercase tracking-widest transition-colors w-full cursor-pointer"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-gray-900 font-sans relative">
      {/* Modal Overlay */}
      {selectedFund && (
        <DonationModal
          fund={selectedFund}
          onClose={() => setSelectedFund(null)}
        />
      )}

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-12 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-light text-black">
              Financial <span className="font-bold">Overview</span>
            </h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="border border-gray-200 p-8 flex flex-col justify-between h-48 hover:border-black transition-colors duration-300">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-black text-white inline-block">
                <DollarSign size={20} />
              </div>
              <ArrowUpRight className="text-gray-300" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                Total Funds Collected
              </p>
              <h2 className="text-5xl font-light text-black">
                {formatCurrency(data.totalFund)}
              </h2>
            </div>
          </div>

          <div className="border border-gray-200 p-8 flex flex-col justify-between h-48 hover:border-black transition-colors duration-300">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-gray-100 text-black inline-block">
                <Users size={20} />
              </div>
              <ArrowUpRight className="text-gray-300" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                Total Transactions
              </p>
              <h2 className="text-5xl font-light text-black">
                {data.donations.length}
              </h2>
            </div>
          </div>
        </div>

        {/* Search & Table Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-light">Transactions</h3>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search name, email, cause..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-b border-gray-300 p-3 pl-10 focus:outline-none focus:border-black transition-colors placeholder:text-gray-400 text-sm"
            />
            <Search className="absolute left-0 top-3 text-gray-400" size={18} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-100 mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Date
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Donor
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Contact
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Cause
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length > 0 ? (
                currentItems.map((fund) => (
                  <tr
                    key={fund._id}
                    onClick={() => setSelectedFund(fund)}
                    className="hover:bg-red-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar
                          size={14}
                          className="text-gray-300 group-hover:text-red-500 transition-colors"
                        />
                        {new Date(fund.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-medium text-black">
                        {fund.funderName}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-800">
                          {fund.funderEmail}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-sm text-gray-600">
                      {fund.fundFor || "General"}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-bold uppercase tracking-widest ${
                          fund.paymentStatus === "paid"
                            ? "bg-black text-white"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {fund.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-right">
                      <span className="text-lg font-light text-black">
                        {formatCurrency(fund.amountTotal, fund.currency)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-12 text-center text-gray-400 font-light"
                  >
                    No records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredDonations.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              Showing {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filteredDonations.length)} of{" "}
              {filteredDonations.length}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:border-black disabled:opacity-30 disabled:hover:border-gray-200 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Simple Page Numbers */}
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Only show 5 pages max logic for simplicity in this snippet,
                // or just show all if pages < 7.
                if (
                  totalPages > 7 &&
                  (page < currentPage - 2 || page > currentPage + 2) &&
                  page !== 1 &&
                  page !== totalPages
                ) {
                  if (page === currentPage - 3 || page === currentPage + 3)
                    return (
                      <span
                        key={page}
                        className="w-10 h-10 flex items-center justify-center text-gray-300"
                      >
                        ...
                      </span>
                    );
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 text-sm font-medium transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-black text-white border border-black"
                        : "bg-white text-gray-500 border border-gray-200 hover:border-black"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:border-black disabled:opacity-30 disabled:hover:border-gray-200 transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFundDashboard;
