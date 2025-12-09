"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Building2,
  X,
  ArrowRight,
  Droplet,
  Phone,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import server from "@/lib/api";

export default function ShowDonationReq() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 12; // Max 12 cards

  // Filter States
  const [filters, setFilters] = useState({
    search: "",
    bloodGroup: "all",
    district: "",
  });

  // Fetch when filters or page changes
  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {
        status: "pending",
        page: page,
        limit: LIMIT,
        ...(filters.search && { search: filters.search }),
        ...(filters.district && { district: filters.district }),
        ...(filters.bloodGroup !== "all" && { bloodGroup: filters.bloodGroup }),
      };

      const response = await server.get(
        "/api/bloodDonationReq/totalBloodDonationReqPublic",
        { params }
      );

      if (response.data.success) {
        setRequests(response.data.data);
        // Backend returns pagination info
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error("Failed to fetch donation requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset to page 1 on filter change
  };

  const resetFilters = () => {
    setFilters({ search: "", bloodGroup: "all", district: "" });
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll to top of grid smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white min-h-screen py-12 md:py-20">
      <div className="max-w-7xl px-4 2xl:px-0 mx-auto">
        {/* --- Header & Search Section --- */}
        <div className="mb-12 space-y-8">
          <div className="border-b border-black/10 pb-6">
            <h2 className="text-2xl md:text-4xl font-bold text-black uppercase tracking-tight">
              Urgent Requests
            </h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">
              Direct donor-to-patient connections.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black">
                <Search size={18} />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search name, hospital..."
                className="w-full h-12 pl-12 pr-4 bg-white border border-gray-300 text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-none"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black">
                <MapPin size={18} />
              </div>
              <input
                type="text"
                name="district"
                value={filters.district}
                onChange={handleFilterChange}
                placeholder="District (e.g. Dhaka)"
                className="w-full h-12 pl-12 pr-4 bg-white border border-gray-300 text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-none"
              />
            </div>

            <div className="relative">
              <select
                name="bloodGroup"
                value={filters.bloodGroup}
                onChange={handleFilterChange}
                className="w-full h-12 pl-4 pr-10 bg-white border border-gray-300 text-black appearance-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none cursor-pointer"
              >
                <option value="all">All Blood Groups</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  )
                )}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Droplet size={18} />
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="h-12 cursor-pointer bg-gray-100 hover:bg-black hover:text-white border border-gray-300 hover:border-black text-black font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2 rounded-none"
            >
              <RotateCcw size={18} /> Reset
            </button>
          </div>
        </div>

        {/* --- Loading State --- */}
        {loading && (
          <div className="w-full h-64 flex items-center justify-center border border-gray-200 bg-gray-50">
            <div className="animate-pulse text-gray-400 font-mono text-sm">
              LOADING DATA...
            </div>
          </div>
        )}

        {/* --- Requests Grid --- */}
        {!loading && requests.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
              {requests.map((req) => (
                <MinimalCard
                  key={req._id}
                  request={req}
                  onClick={() => setSelectedRequest(req)}
                />
              ))}
            </div>

            {/* --- Pagination Controls --- */}
            <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-8 gap-4">
              <p className="text-sm text-gray-500 font-medium">
                Showing page{" "}
                <span className="text-black font-bold">{page}</span> of{" "}
                <span className="text-black font-bold">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="h-10 px-4 cursor-pointer border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-400 disabled:hover:border-gray-300 rounded-none flex items-center gap-2 font-bold text-sm uppercase"
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                {/* Page Numbers (Simple logic: show active) */}
                <div className="hidden md:flex gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Only show first, last, current, and adjacent pages
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`h-10 cursor-pointer w-10 flex items-center justify-center border transition-colors font-bold text-sm rounded-none ${
                            page === pageNum
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-600 border-gray-300 hover:border-black"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      (pageNum === page - 2 && pageNum > 1) ||
                      (pageNum === page + 2 && pageNum < totalPages)
                    ) {
                      return (
                        <span
                          key={pageNum}
                          className="h-10 w-10 flex items-center justify-center text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="h-10 cursor-pointer px-4 border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-400 disabled:hover:border-gray-300 rounded-none flex items-center gap-2 font-bold text-sm uppercase"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* --- Empty State --- */}
        {!loading && requests.length === 0 && (
          <div className="border border-black p-12 text-center bg-gray-50">
            <h3 className="text-xl font-bold uppercase text-black">
              No Requests Found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your filters or check back later.
            </p>
            <button
              onClick={resetFilters}
              className="inline-block mt-6 cursor-pointer text-red-600 font-bold hover:underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* --- Detail Modal --- */}
      <AnimatePresence>
        {selectedRequest && (
          <SquareModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function MinimalCard({ request, onClick }) {
  const formattedDate = new Date(request.donationDate).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative border border-gray-200 bg-white transition-colors duration-200 flex flex-col h-full cursor-pointer hover:border-red-100 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="flex border-b border-gray-200 group-hover:border-black/10">
        <div className="bg-red-600 text-white w-20 h-20 flex items-center justify-center text-2xl font-bold shrink-0">
          {request.bloodGroup}
        </div>
        <div className="flex-1 p-4 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Required By
          </span>
          <div className="flex items-center gap-2 text-black font-medium text-sm">
            <Calendar size={14} /> {formattedDate}
            <span className="text-gray-300">|</span>
            <Clock size={14} /> {request.donationTime}
          </div>
        </div>
      </div>

      <div className="p-5 grow space-y-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
            Patient
          </p>
          <h3 className="text-lg font-bold text-black leading-tight flex items-center gap-2 truncate">
            {request.recipientName}
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Building2 size={16} className="mt-1 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-800 line-clamp-1">
              {request.hospitalName}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={16} className="mt-1 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-600 line-clamp-1">
              {request.fullAddress?.district}, {request.fullAddress?.upazila}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 mt-auto bg-gray-50 group-hover:bg-red-50 transition-colors duration-200">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
          <span>View Details</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </motion.div>
  );
}

// --- Detail Modal ---
function SquareModal({ request, onClose }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleDonate = async () => {
    const result = await Swal.fire({
      title: "CONFIRM DONATION?",
      text: `Are you sure you want to donate to ${request.recipientName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#000000",
      confirmButtonText: "YES, I WILL DONATE",
      cancelButtonText: "CANCEL",
      customClass: {
        popup: "rounded-none border-2 border-black",
        confirmButton: "rounded-none font-bold uppercase px-6 py-3",
        cancelButton: "rounded-none font-bold uppercase px-6 py-3",
        title: "font-bold uppercase",
      },
    });

    if (result.isConfirmed) {
      setIsProcessing(true);
      Swal.fire({
        title: "PROCESSING...",
        didOpen: () => Swal.showLoading(),
        customClass: { popup: "rounded-none border-2 border-black" },
      });

      try {
        const response = await server.put(
          `/api/bloodDonationReq/${request._id}/donate`
        );

        if (response.data.success) {
          await Swal.fire({
            title: "ACCEPTED!",
            text: "Thank you! Check your history for details.",
            icon: "success",
            confirmButtonColor: "#dc2626",
            customClass: {
              popup: "rounded-none border-2 border-black",
              confirmButton: "rounded-none font-bold uppercase",
            },
          });
          window.location.reload();
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          Swal.fire({
            title: "REGISTRATION REQUIRED",
            html: "You must be a registered donor to accept requests.<br/>It only takes a minute!",
            icon: "info",
            confirmButtonText: "REGISTER AS DONOR",
            confirmButtonColor: "#000000",
            showCancelButton: true,
            cancelButtonText: "LATER",
            customClass: {
              popup: "rounded-none border-2 border-black",
              confirmButton: "rounded-none font-bold uppercase",
              cancelButton: "rounded-none font-bold uppercase",
            },
          }).then((res) => {
            if (res.isConfirmed) {
              router.push("/registerDonor");
            }
          });
        } else {
          const errorMsg =
            error.response?.data?.message || "Something went wrong.";
          Swal.fire({
            title: "ERROR",
            text: errorMsg,
            icon: "error",
            confirmButtonColor: "#000000",
            customClass: {
              popup: "rounded-none border-2 border-black",
              confirmButton: "rounded-none font-bold uppercase",
            },
          });
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-0 md:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full md:max-w-3xl md:h-auto h-full flex flex-col md:border md:border-gray-500 shadow-2xl overflow-y-auto"
      >
        <div className="flex justify-between items-stretch border-b border-black/30 h-20 shrink-0">
          <div className="bg-red-600 text-white px-6 md:px-10 flex items-center justify-center text-3xl font-bold">
            {request.bloodGroup}
          </div>
          <button
            onClick={onClose}
            className="px-6 cursor-pointer hover:bg-black hover:text-white transition-colors border-l border-gray-200"
          >
            <X size={28} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full">
          <div className="p-6 md:p-10 w-full md:w-1/2 space-y-8 border-b md:border-b-0 md:border-r border-gray-200">
            <div>
              <span className="inline-block bg-black text-white text-xs font-bold px-2 py-1 mb-4 uppercase">
                Urgent Request
              </span>
              <h2 className="text-3xl font-bold text-black mb-1">
                {request.recipientName}
              </h2>
              <p className="text-gray-500 text-sm">Patient</p>
            </div>
            <div className="space-y-4">
              <InfoRow
                icon={<Building2 size={18} />}
                label="Hospital"
                value={request.hospitalName}
              />
              <InfoRow
                icon={<MapPin size={18} />}
                label="Address"
                value={`${request.fullAddress?.streetAddress || ""}, ${
                  request.fullAddress?.district
                }`}
              />
              <InfoRow
                icon={<Calendar size={18} />}
                label="Date Needed"
                value={`${request.donationDate} at ${request.donationTime}`}
              />
            </div>
            {request.additionalMessage && (
              <div className="bg-gray-50 p-4 border border-gray-200 text-sm italic text-gray-600">
                {request.additionalMessage}
              </div>
            )}
          </div>

          <div className="p-6 md:p-10 w-full md:w-1/2 flex flex-col justify-between bg-gray-50/50">
            <div className="space-y-6">
              <h3 className="text-lg font-bold uppercase border-b border-gray-300 pb-2">
                Contact Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Recipient Phone
                  </p>
                  <a
                    href={`tel:${request.recipientPhone}`}
                    className="text-xl font-bold text-black hover:text-red-600 underline decoration-1 underline-offset-4"
                  >
                    {request.recipientPhone}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Posted By
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <User size={16} />
                    <span className="font-medium text-gray-800">
                      {request.requesterId?.name || "Volunteer"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 md:mt-0 space-y-3">
              <button
                onClick={handleDonate}
                disabled={isProcessing}
                className="w-full cursor-pointer bg-red-600 text-white h-14 font-bold uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                {isProcessing ? (
                  <span>Wait...</span>
                ) : (
                  <>
                    <Droplet size={20} /> I will Donate
                  </>
                )}
              </button>
              <a
                href={`tel:${request.recipientPhone}`}
                className="w-full bg-white border border-black text-black h-14 font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={20} /> Call Now
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 text-black">{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase">{label}</p>
        <p className="text-sm font-bold text-gray-900 leading-snug">{value}</p>
      </div>
    </div>
  );
}
