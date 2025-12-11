"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  IconDroplet,
  IconEye,
  IconEdit,
  IconTrash,
  IconFilter,
  IconSearch,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconRefresh,
  IconPhone,
  IconCalendar,
  IconMapPin,
  IconBuildingHospital,
  IconUser,
  IconChevronDown,
  IconCheck,
} from "@tabler/icons-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import server from "@/lib/api";
import useAuth from "@/hooks/useAuth";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "success", label: "Completed" },
  { value: "cancel", label: "Canceled" },
];

const bloodGroups = ["all", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function AllBloodDonationReq() {
  const router = useRouter();
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [bloodFilter, setBloodFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 10;

  // Fetch requests
  const fetchRequests = useCallback(
    async (showLoader = true) => {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };

        if (statusFilter !== "all") params.status = statusFilter;
        if (bloodFilter !== "all") params.bloodGroup = bloodFilter;
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const res = await server.get("/api/bloodDonationReq", { params });

        if (res.data.success) {
          setRequests(res.data.data || []);
          setTotalPages(res.data.pagination?.pages || 1);
          setTotalRecords(res.data.pagination?.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        if (error.response?.status !== 401) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to fetch requests",
            confirmButtonColor: "#dc2626",
          });
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage, statusFilter, bloodFilter, searchQuery]
  );

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, fetchRequests]);

  // --- EDIT FUNCTIONALITY ---
  const handleEdit = (id) => {
    router.push(`/dashboard/bloodDonation-req/${id}/edit`);
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    const result = await Swal.fire({
      title: newStatus === "success" ? "Mark as Completed?" : "Cancel Request?",
      text: `Are you sure you want to change the status to ${
        newStatus === "success" ? "Completed" : "Canceled"
      }?`,
      icon: newStatus === "success" ? "success" : "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "success" ? "#10b981" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText:
        newStatus === "success" ? "Yes, Complete it!" : "Yes, Cancel it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await server.patch(`/api/bloodDonationReq/${id}/status`, {
          donationStatus: newStatus,
        });

        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Status updated successfully",
            timer: 1500,
            showConfirmButton: false,
          });
          setRequests((prev) =>
            prev.map((req) =>
              req._id === id ? { ...req, donationStatus: newStatus } : req
            )
          );
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to update status",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  // Handle delete
  const handleDelete = async (id, recipientName) => {
    const result = await Swal.fire({
      title: "Delete Request",
      html: `Delete request for <strong>${recipientName}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await server.delete(`/api/bloodDonationReq/${id}`);
        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Request deleted successfully",
            timer: 1500,
            showConfirmButton: false,
          });
          if (requests.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            fetchRequests(false);
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete request",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  // Utilities
  const getStatusBadge = (status) => {
    const config = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
      success: "bg-emerald-100 text-emerald-800 border-emerald-200",
      cancel: "bg-rose-100 text-rose-800 border-rose-200",
    };
    const label = {
      pending: "Pending",
      "in-progress": "In Progress",
      success: "Completed",
      cancel: "Canceled",
    };
    return (
      <Badge
        variant="outline"
        className={`${
          config[status] || config.pending
        } text-[10px] sm:text-xs px-2.5 py-1 whitespace-nowrap font-semibold shadow-sm`}
      >
        {label[status] || status}
      </Badge>
    );
  };

  const stats = useMemo(
    () => ({
      total: totalRecords,
      pending: requests.filter((r) => r.donationStatus === "pending").length,
      inProgress: requests.filter((r) => r.donationStatus === "in-progress")
        .length,
      success: requests.filter((r) => r.donationStatus === "success").length,
      cancel: requests.filter((r) => r.donationStatus === "cancel").length,
    }),
    [requests, totalRecords]
  );

  // --- PERMISSION CHECKS ---

  const canEdit = (req) => {
    const userId = user?._id || user?.id;
    const requesterId = req.requesterId?._id || req.requesterId;
    return userId === requesterId && req.donationStatus === "pending";
  };

  const canDelete = (req) => {
    const userId = user?._id || user?.id;
    const requesterId = req.requesterId?._id || req.requesterId;
    return (
      (userId === requesterId && req.donationStatus !== "in-progress") ||
      user?.role === "admin"
    );
  };

  // General Admin/Volunteer permission for dropdown
  const canChangeStatus = () =>
    user?.role === "volunteer" || user?.role === "admin";

  // New Permission: Allow Owner OR Admin/Volunteer to see In-Progress Action Buttons
  const canActionInProgress = (req) => {
    const userId = user?._id || user?.id;
    const requesterId = req.requesterId?._id || req.requesterId;

    // Check if user is owner OR admin OR volunteer
    return (
      userId === requesterId ||
      user?.role === "admin" ||
      user?.role === "volunteer"
    );
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setBloodFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {user?.role === "user"
              ? "My Blood Requests"
              : "Blood Donation Requests"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage donation activities and status updates.
          </p>
        </div>
        <Button
          onClick={() => fetchRequests(false)}
          variant="outline"
          size="sm"
          disabled={refreshing}
          className="cursor-pointer bg-white hover:bg-gray-50 border-gray-300 shadow-sm"
        >
          <IconRefresh
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh List
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          {
            label: "Total",
            value: stats.total,
            color: "text-gray-800",
            bg: "bg-white",
            border: "border-gray-200",
          },
          {
            label: "Pending",
            value: stats.pending,
            color: "text-amber-600",
            bg: "bg-amber-50/50",
            border: "border-amber-100",
          },
          {
            label: "In Progress",
            value: stats.inProgress,
            color: "text-blue-600",
            bg: "bg-blue-50/50",
            border: "border-blue-100",
          },
          {
            label: "Completed",
            value: stats.success,
            color: "text-emerald-600",
            bg: "bg-emerald-50/50",
            border: "border-emerald-100",
          },
          {
            label: "Canceled",
            value: stats.cancel,
            color: "text-rose-600",
            bg: "bg-rose-50/50",
            border: "border-rose-100",
          },
        ].map((stat, idx) => (
          <Card
            key={stat.label}
            className={`shadow-sm hover:shadow-md transition-all duration-200 border ${
              stat.border
            } ${stat.bg} ${idx === 4 ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center">
              <span
                className={`text-2xl sm:text-3xl font-extrabold ${stat.color}`}
              >
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">
                {stat.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconFilter className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-700 text-sm">
              Filter Requests
            </h3>
          </div>
          {(statusFilter !== "all" || bloodFilter !== "all" || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer h-8 text-xs sm:text-sm"
            >
              <IconX className="h-3.5 w-3.5 mr-1.5" /> Clear Filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 lg:col-span-5 relative">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by recipient or hospital..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="md:col-span-3 lg:col-span-3 relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2.5 pl-3.5 pr-10 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none appearance-none cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <IconChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="md:col-span-3 lg:col-span-4 relative">
            <select
              value={bloodFilter}
              onChange={(e) => {
                setBloodFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2.5 pl-3.5 pr-10 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Blood Groups</option>
              {bloodGroups.slice(1).map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <IconChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">
            Loading requests...
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-center px-4">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <IconDroplet className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No requests found
          </h3>
          <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
            We couldn't find any blood donation requests matching your criteria.
            Try adjusting your filters.
          </p>
          <Button
            variant="outline"
            onClick={resetFilters}
            className="mt-6 cursor-pointer"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          {/* Mobile/Tablet Card View (< 1024px) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-5">
            {requests.map((req) => (
              <Card
                key={req._id}
                className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full ring-1 ring-gray-200"
              >
                <div className="p-0">
                  {/* Card Header */}
                  <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white font-bold text-lg shadow-red-200 shadow-lg">
                        {req.bloodGroup}
                      </span>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-base text-gray-900 truncate">
                          {req.recipientName}
                        </h4>
                        <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                          <IconBuildingHospital className="h-3 w-3" />
                          {req.hospitalName}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(req.donationStatus)}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4 grow">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                          Date & Time
                        </p>
                        <p className="text-gray-700 font-medium flex items-center gap-1.5">
                          <IconCalendar className="h-4 w-4 text-gray-400" />
                          {new Date(req.donationDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-500 text-xs pl-5.5">
                          {req.donationTime}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                          Location
                        </p>
                        <p className="text-gray-700 font-medium flex items-center gap-1.5 truncate">
                          <IconMapPin className="h-4 w-4 text-gray-400" />
                          {req.fullAddress?.upazila}
                        </p>
                        <p className="text-gray-500 text-xs pl-5.5 truncate">
                          {req.fullAddress?.district}
                        </p>
                      </div>
                    </div>

                    {/* Donor Section */}
                    {(req.donationStatus === "in-progress" ||
                      req.donationStatus === "success") &&
                      req.donorId && (
                        <div
                          className={`rounded-lg p-3 border ${
                            req.donationStatus === "success"
                              ? "bg-green-50/80 border-green-100"
                              : "bg-blue-50/80 border-blue-100"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-xs font-bold uppercase flex items-center gap-1 ${
                                req.donationStatus === "success"
                                  ? "text-green-800"
                                  : "text-blue-800"
                              }`}
                            >
                              <IconUser className="h-3.5 w-3.5" />
                              {req.donationStatus === "success"
                                ? "Donated By"
                                : "Assigned Donor"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-800 truncate mr-2">
                              {req.donorId.name}
                            </span>
                            <a
                              href={`tel:${req.donorId.phone}`}
                              className={`text-xs bg-white px-2 py-1 rounded border flex items-center gap-1 font-medium transition-colors ${
                                req.donationStatus === "success"
                                  ? "text-green-600 border-green-200 hover:bg-green-50"
                                  : "text-blue-600 border-blue-200 hover:bg-blue-50"
                              }`}
                            >
                              <IconPhone className="h-3 w-3" /> Call
                            </a>
                          </div>
                        </div>
                      )}

                    {/* NEW: Mobile In-Progress Action Buttons */}
                    {/* UPDATED: Checks permission correctly now */}
                    {canActionInProgress(req) &&
                      req.donationStatus === "in-progress" && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Button
                            onClick={() =>
                              handleStatusChange(req._id, "success")
                            }
                            className="bg-green-600 hover:bg-green-700 text-white cursor-pointer h-8 text-xs"
                          >
                            <IconCheck className="h-3.5 w-3.5 mr-1" /> Mark Done
                          </Button>
                          <Button
                            onClick={() =>
                              handleStatusChange(req._id, "cancel")
                            }
                            variant="destructive"
                            className="cursor-pointer h-8 text-xs"
                          >
                            <IconX className="h-3.5 w-3.5 mr-1" /> Cancel
                          </Button>
                        </div>
                      )}

                    {/* Standard Status Changer for Admins (Fallback/Other statuses) */}
                    {canChangeStatus() &&
                      req.donationStatus !== "in-progress" && (
                        <div className="pt-2">
                          <label className="text-xs text-gray-500 block mb-1.5">
                            Update Status
                          </label>
                          <div className="relative">
                            <select
                              value={req.donationStatus}
                              onChange={(e) =>
                                handleStatusChange(req._id, e.target.value)
                              }
                              className="w-full text-sm p-2 pr-8 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 outline-none appearance-none cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="success">Completed</option>
                              <option value="cancel">Canceled</option>
                            </select>
                            <IconChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer h-9 text-xs bg-white hover:bg-gray-100"
                    onClick={() =>
                      router.push(`/dashboard/bloodDonation-req/${req._id}`)
                    }
                  >
                    <IconEye className="h-3.5 w-3.5 mr-1.5" /> Details
                  </Button>

                  {canEdit(req) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-100 cursor-pointer"
                      onClick={() => handleEdit(req._id)}
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                  )}

                  {canDelete(req) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 cursor-pointer"
                      onClick={() => handleDelete(req._id, req.recipientName)}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table View (≥ 1024px) */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                      Blood
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Recipient Info
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date & Location
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Assigned Donor
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {requests.map((req) => (
                    <tr
                      key={req._id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-red-100 text-red-700 font-bold text-sm border border-red-200">
                          {req.bloodGroup}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top max-w-[250px]">
                        <div className="flex flex-col">
                          <span
                            className="font-semibold text-gray-900 text-sm truncate"
                            title={req.recipientName}
                          >
                            {req.recipientName}
                          </span>
                          <span
                            className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate"
                            title={req.hospitalName}
                          >
                            <IconBuildingHospital className="h-3 w-3" />{" "}
                            {req.hospitalName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <IconCalendar className="h-3.5 w-3.5 text-gray-400" />
                            <span className="font-medium">
                              {new Date(req.donationDate).toLocaleDateString()}
                            </span>
                            <span className="text-gray-400 text-xs">|</span>
                            <span className="text-xs">{req.donationTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <IconMapPin className="h-3.5 w-3.5 text-gray-400" />
                            {req.fullAddress?.upazila},{" "}
                            {req.fullAddress?.district}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top text-center">
                        {getStatusBadge(req.donationStatus)}

                        {canChangeStatus() &&
                          req.donationStatus !== "in-progress" && (
                            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <select
                                value={req.donationStatus}
                                onChange={(e) =>
                                  handleStatusChange(req._id, e.target.value)
                                }
                                className="text-[10px] py-1 px-1 border rounded bg-white text-gray-600 cursor-pointer outline-none focus:ring-1 focus:ring-red-300 w-full"
                              >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="success">Completed</option>
                                <option value="cancel">Canceled</option>
                              </select>
                            </div>
                          )}
                      </td>

                      {/* DONOR INFO */}
                      <td className="px-6 py-4 align-top">
                        {(req.donationStatus === "in-progress" ||
                          req.donationStatus === "success") &&
                        req.donorId ? (
                          <div
                            className={`flex flex-col p-2 rounded border ${
                              req.donationStatus === "success"
                                ? "bg-green-50/50 border-green-100/50"
                                : "bg-blue-50/50 border-blue-100/50"
                            }`}
                          >
                            <span
                              className={`text-sm font-medium flex items-center gap-1.5 ${
                                req.donationStatus === "success"
                                  ? "text-green-900"
                                  : "text-gray-900"
                              }`}
                            >
                              <IconUser
                                className={`h-3.5 w-3.5 ${
                                  req.donationStatus === "success"
                                    ? "text-green-600"
                                    : "text-blue-500"
                                }`}
                              />
                              {req.donorId.name}
                            </span>
                            <a
                              href={`tel:${req.donorId.phone}`}
                              className={`text-xs mt-1 flex items-center gap-1 pl-5 ${
                                req.donationStatus === "success"
                                  ? "text-green-600 hover:text-green-800"
                                  : "text-blue-600 hover:text-blue-800"
                              } hover:underline`}
                            >
                              <IconPhone className="h-3 w-3" />
                              {req.donorId.phone}
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic pl-2">
                            — No donor yet —
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                            onClick={() =>
                              router.push(
                                `/dashboard/bloodDonation-req/${req._id}`
                              )
                            }
                            title="View Details"
                          >
                            <IconEye className="h-4 w-4" />
                          </Button>

                          {/* NEW: Desktop In-Progress Action Buttons */}
                          {/* UPDATED: Checks permission correctly now */}
                          {canActionInProgress(req) &&
                          req.donationStatus === "in-progress" ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() =>
                                  handleStatusChange(req._id, "success")
                                }
                                title="Mark as Completed"
                              >
                                <IconCheck className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() =>
                                  handleStatusChange(req._id, "cancel")
                                }
                                title="Cancel Request"
                              >
                                <IconX className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              {canEdit(req) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-full text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() => handleEdit(req._id)}
                                  title="Edit"
                                >
                                  <IconEdit className="h-4 w-4" />
                                </Button>
                              )}

                              {canDelete(req) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() =>
                                    handleDelete(req._id, req.recipientName)
                                  }
                                  title="Delete"
                                >
                                  <IconTrash className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500 order-2 sm:order-1">
            Showing page{" "}
            <span className="font-semibold text-gray-900">{currentPage}</span>{" "}
            of <span className="font-semibold text-gray-900">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="cursor-pointer h-9 px-4 text-sm"
            >
              <IconChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="cursor-pointer h-9 px-4 text-sm"
            >
              Next <IconChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
