"use client";

import server from "@/lib/api";
import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Hospital,
  UserCheck,
  Clock,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function AcceptedReq() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const requestsResponse = await server.get(
          `/api/bloodDonationReq/myBloodDonationReq`
        );
        setRequests(requestsResponse.data.data);

        const localStats = {
          total: requestsResponse.data.data.length,
          pending: requestsResponse.data.data.filter(
            (r) => r.donationStatus === "pending"
          ).length,
          "in-progress": requestsResponse.data.data.filter(
            (r) => r.donationStatus === "in-progress"
          ).length,
          success: requestsResponse.data.data.filter(
            (r) => r.donationStatus === "success"
          ).length,
          cancel: requestsResponse.data.data.filter(
            (r) => r.donationStatus === "cancel"
          ).length,
        };
        setStats(localStats);
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast(
          error.response?.data?.message || "Failed to fetch requests",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  console.log(requests);
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleMarkAsComplete = async (id) => {
    try {
      await server.patch(`/api/bloodDonationReq/${id}/complete`);
      showToast("Request marked as complete!", "success");
      setShowModal(false);
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update", "error");
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this request?")) return;
    try {
      await server.patch(`/api/bloodDonationReq/${id}/cancel`);
      showToast("Request cancelled successfully", "success");
      setShowModal(false);
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to cancel", "error");
    }
  };

  const handleCardClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const filteredRequests = requests.filter((request) => {
    if (filter === "all") return true;
    return request.donationStatus === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black mb-6"></div>
        <p className="text-xs uppercase tracking-widest text-gray-400">
          Loading Requests...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-2xl text-white font-medium transition-all duration-300 flex items-center gap-3 ${
            toast.type === "success" ? "bg-black" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
          {toast.message}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedRequest && (
        <RequestModal
          request={selectedRequest}
          onClose={() => setShowModal(false)}
          onMarkAsComplete={handleMarkAsComplete}
          onCancel={handleCancel}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
        />
      )}

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-12 border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-light text-black">
            My <span className="font-bold">Blood Requests</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest">
            Track and manage your donation requests
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
            {[
              {
                label: "Total Requests",
                value: stats.total,
                icon: AlertCircle,
              },
              { label: "Pending", value: stats.pending, icon: Clock },
              {
                label: "Accepted",
                value: stats["in-progress"],
                icon: UserCheck,
              },
              { label: "Completed", value: stats.success, icon: CheckCircle },
              { label: "Cancelled", value: stats.cancel, icon: XCircle },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-gray-200 p-8 flex flex-col justify-between hover:border-black transition-colors duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-gray-100 text-black inline-block">
                    <stat.icon size={20} />
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <h2 className="text-5xl font-light text-black">
                    {stat.value || 0}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-10 flex flex-wrap gap-3">
          {["all", "pending", "in-progress", "success", "cancel"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-3 text-sm font-medium uppercase tracking-widest transition-colors border ${
                  filter === status
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-500 border-gray-200 hover:border-black"
                }`}
              >
                {status === "in-progress"
                  ? "Accepted"
                  : status === "success"
                  ? "Completed"
                  : status === "cancel"
                  ? "Cancelled"
                  : status === "all"
                  ? "All Requests"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Requests List - Card on mobile, Table on larger screens */}
        {filteredRequests.length === 0 ? (
          <div className="border border-gray-200 p-16 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <p className="text-xl font-light text-gray-500">
              No requests found
            </p>
            <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest">
              {filter === "all"
                ? "You haven't created any requests yet"
                : `No ${filter.replace("in-progress", "accepted")} requests`}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="block md:hidden space-y-6">
              {filteredRequests.map((request) => (
                <RequestCardMobile
                  key={request._id}
                  request={request}
                  onClick={() => handleCardClick(request)}
                  formatDate={formatDate}
                />
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Date
                    </th>
                    <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Recipient
                    </th>
                    <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Location
                    </th>
                    <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Blood Group
                    </th>
                    <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Donor
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request._id}
                      onClick={() => handleCardClick(request)}
                      className="hover:bg-red-50/30 transition-colors cursor-pointer group"
                    >
                      <td className="p-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar
                            size={14}
                            className="text-gray-400 group-hover:text-red-600"
                          />
                          {formatDate(request.donationDate)}
                        </div>
                      </td>
                      <td className="p-6 font-medium">
                        {request.recipientName}
                      </td>
                      <td className="p-6 text-sm text-gray-600">
                        {request.recipientLocation}
                      </td>
                      <td className="p-6">
                        <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                          {request.bloodGroup}
                        </span>
                      </td>
                      <td className="p-6">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                            request.donationStatus === "in-progress"
                              ? "bg-black text-white"
                              : request.donationStatus === "success"
                              ? "bg-green-100 text-green-800"
                              : request.donationStatus === "cancel"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {request.donationStatus === "in-progress"
                            ? "Accepted"
                            : request.donationStatus}
                        </span>
                      </td>
                      <td className="p-6 text-sm">
                        {request.donorId &&
                        request.donationStatus === "in-progress"
                          ? request.donorId.name
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Mobile Card
function RequestCardMobile({ request, onClick, formatDate }) {
  const statusConfig = {
    pending: { label: "Pending", color: "gray" },
    "in-progress": { label: "Accepted", color: "black" },
    success: { label: "Completed", color: "green" },
    cancel: { label: "Cancelled", color: "red" },
  }[request.donationStatus] || { label: "Unknown", color: "gray" };

  return (
    <div
      onClick={onClick}
      className="border border-gray-200 p-6 hover:border-black transition-colors cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <span
          className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border ${
            statusConfig.color === "black"
              ? "bg-black text-white border-black"
              : statusConfig.color === "green"
              ? "border-green-200 text-green-800 bg-green-50"
              : statusConfig.color === "red"
              ? "border-red-200 text-red-800 bg-red-50"
              : "border-gray-200 text-gray-800 bg-gray-50"
          }`}
        >
          {statusConfig.label}
        </span>
        <span className="bg-red-600 text-white px-5 py-3 rounded-lg text-xl font-bold">
          {request.bloodGroup}
        </span>
      </div>

      <h3 className="text-xl font-medium mb-3">{request.recipientName}</h3>
      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <MapPin size={16} /> {request.recipientLocation}
        </p>
        <p className="flex items-center gap-2">
          <Hospital size={16} /> {request.hospitalName}
        </p>
        <p className="flex items-center gap-2">
          <Calendar size={16} /> {formatDate(request.donationDate)} at{" "}
          {request.donationTime}
        </p>
      </div>

      {request.donorId && request.donationStatus === "in-progress" && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-bold text-green-800 flex items-center gap-2">
            <UserCheck size={16} /> Donor: {request.donorId.name}
          </p>
        </div>
      )}
    </div>
  );
}

// Modal
function RequestModal({
  request,
  onClose,
  onMarkAsComplete,
  onCancel,
  formatDate,
  formatDateTime,
}) {
  const statusLabel =
    request.donationStatus === "in-progress"
      ? "Accepted"
      : request.donationStatus === "success"
      ? "Completed"
      : request.donationStatus === "cancel"
      ? "Cancelled"
      : request.donationStatus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl shadow-2xl border-t-4 border-red-600">
        {/* Header */}
        <div className="flex justify-between items-start p-8 border-b border-gray-100">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Request Details
            </p>
            <h2 className="text-2xl font-light text-black">
              {request.recipientName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          {/* Blood Group & Status */}
          <div className="flex justify-between items-center">
            <div className="bg-red-600 text-white px-8 py-4 rounded-xl text-3xl font-bold shadow-lg">
              {request.bloodGroup}
            </div>
            <span
              className={`px-6 py-3 text-sm font-bold uppercase tracking-widest border ${
                request.donationStatus === "in-progress"
                  ? "bg-black text-white border-black"
                  : request.donationStatus === "success"
                  ? "border-green-200 text-green-800 bg-green-50"
                  : request.donationStatus === "cancel"
                  ? "border-red-200 text-red-800 bg-red-50"
                  : "border-gray-200 text-gray-800 bg-gray-50"
              }`}
            >
              {statusLabel}
            </span>
          </div>

          {/* Recipient Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
              Recipient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase">Name</p>
                <p className="font-medium">{request.recipientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Phone</p>
                <a
                  href={`tel:${request.recipientPhone}`}
                  className="font-medium text-red-600"
                >
                  {request.recipientPhone}
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Location</p>
                <p className="font-medium">{request.recipientLocation}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Hospital</p>
                <p className="font-medium">{request.hospitalName}</p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
              Donation Schedule
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase">Date</p>
                <p className="text-xl font-light">
                  {formatDate(request.donationDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Time</p>
                <p className="text-xl font-light">{request.donationTime}</p>
              </div>
            </div>
          </div>

          {/* Donor Info */}
          {request.donorId && request.donationStatus === "in-progress" && (
            <div className="bg-green-50 border border-green-200 p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
                Donor Accepted
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase">Name</p>
                  <p className="font-medium">{request.donorId.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Phone</p>
                  <a
                    href={`tel:${request.donorId.phone}`}
                    className="font-medium text-green-700"
                  >
                    {request.donorId.phone}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
            {request.donationStatus === "in-progress" && (
              <>
                <button
                  onClick={() => onMarkAsComplete(request._id)}
                  className="flex-1 bg-black text-white py-4 uppercase tracking-widest font-medium hover:bg-gray-800 transition"
                >
                  Mark as Complete
                </button>
                <button
                  onClick={() => onCancel(request._id)}
                  className="flex-1 bg-red-600 text-white py-4 uppercase tracking-widest font-medium hover:bg-red-700 transition"
                >
                  Cancel Request
                </button>
              </>
            )}
            {request.donationStatus === "pending" && (
              <button
                onClick={() => onCancel(request._id)}
                className="flex-1 bg-red-600 text-white py-4 uppercase tracking-widest font-medium hover:bg-red-700 transition"
              >
                Cancel Request
              </button>
            )}
            <button
              onClick={onClose}
              className="px-8 py-4 bg-gray-100 text-black uppercase tracking-widest font-medium hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
