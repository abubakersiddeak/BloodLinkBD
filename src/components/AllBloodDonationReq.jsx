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

  // Fetch requests with useCallback
  const fetchRequests = useCallback(
    async (showLoader = true) => {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };

        if (statusFilter !== "all") {
          params.status = statusFilter;
        }

        if (bloodFilter !== "all") {
          params.bloodGroup = bloodFilter;
        }

        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        const res = await server.get("/api/bloodDonationReq", { params });

        if (res.data.success) {
          setRequests(res.data.data || []);
          setTotalPages(res.data.pagination?.pages || 1);
          setTotalRecords(res.data.pagination?.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);

        // Only show error if it's not a 401 (unauthorized)
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

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    const result = await Swal.fire({
      title: "Change Status",
      text: `Change status to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, change it!",
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

          // Update local state instead of refetching
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
      html: `Delete request for <strong>${recipientName}</strong>?<br/>This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      focusCancel: true,
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

          // If last item on page and not first page, go back
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
          text: error.response?.data?.message || "Failed to delete request",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
      success: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancel: "bg-rose-50 text-rose-700 border-rose-200",
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
        className={`${config[status] || config.pending} text-xs px-2 py-0.5`}
      >
        {label[status] || status}
      </Badge>
    );
  };

  // Calculate stats from current page data
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

  // Check permissions
  const canEdit = useCallback(
    (req) => {
      return (
        user?._id === req.requesterId?._id && req.donationStatus === "pending"
      );
    },
    [user]
  );

  const canDelete = useCallback(
    (req) => {
      return (
        (user?._id === req.requesterId?._id &&
          req.donationStatus === "pending") ||
        user?.role === "admin"
      );
    },
    [user]
  );

  const canChangeStatus = useCallback(() => {
    return user?.role === "volunteer" || user?.role === "admin";
  }, [user]);

  // Reset filters
  const resetFilters = () => {
    setStatusFilter("all");
    setBloodFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-rose-50/20 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {user?.role === "user"
                  ? "My Requests"
                  : "All Donation Requests"}
              </h1>
              <p className="text-sm text-gray-600">
                {user?.role === "user"
                  ? "Manage your blood donation requests"
                  : "Manage all blood donation requests"}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => fetchRequests(false)}
                variant="outline"
                size="sm"
                disabled={refreshing}
                className="cursor-pointer"
              >
                <IconRefresh
                  className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              {
                label: "Total",
                value: stats.total,
                color: "gray",
                bg: "bg-gray-50",
                border: "border-gray-200",
              },
              {
                label: "Pending",
                value: stats.pending,
                color: "amber",
                bg: "bg-amber-50",
                border: "border-amber-200",
              },
              {
                label: "In Progress",
                value: stats.inProgress,
                color: "blue",
                bg: "bg-blue-50",
                border: "border-blue-200",
              },
              {
                label: "Completed",
                value: stats.success,
                color: "emerald",
                bg: "bg-emerald-50",
                border: "border-emerald-200",
              },
              {
                label: "Canceled",
                value: stats.cancel,
                color: "rose",
                bg: "bg-rose-50",
                border: "border-rose-200",
              },
            ].map((stat) => (
              <Card
                key={stat.label}
                className={`${stat.border} hover:shadow-md transition-shadow`}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`text-2xl sm:text-3xl font-bold text-${stat.color}-700 mb-1`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-4 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IconFilter className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-sm">Filters</h3>
              </div>

              {(statusFilter !== "all" ||
                bloodFilter !== "all" ||
                searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs cursor-pointer"
                >
                  <IconX className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Status Filter */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Blood Group Filter */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Blood Group
                </label>
                <select
                  value={bloodFilter}
                  onChange={(e) => {
                    setBloodFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Blood Groups</option>
                  {bloodGroups.slice(1).map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Search
                </label>
                <div className="relative">
                  <IconSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Name, hospital, phone..."
                    className="w-full pl-10 pr-10 p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-3 hover:bg-gray-100 rounded p-0.5"
                    >
                      <IconX className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table/Cards */}
        {loading ? (
          <Card className="shadow-md">
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-500">Loading requests...</p>
            </CardContent>
          </Card>
        ) : requests.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="p-12 text-center">
              <IconDroplet
                className="h-16 w-16 text-gray-300 mx-auto mb-4"
                strokeWidth={1.5}
              />
              <p className="text-gray-900 font-semibold text-lg mb-2">
                No requests found
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery || statusFilter !== "all" || bloodFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first blood donation request"}
              </p>
              {(searchQuery ||
                statusFilter !== "all" ||
                bloodFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="cursor-pointer"
                >
                  <IconX className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
              {requests.map((req) => (
                <Card
                  key={req._id}
                  className="border-l-4 border-l-red-500 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() =>
                    router.push(`/dashboard/bloodDonation-req/${req._id}`)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-14 h-14 bg-linear-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                        <span className="text-white font-bold text-base">
                          {req.bloodGroup}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-bold text-base truncate flex-1">
                            {req.recipientName}
                          </h4>
                          {getStatusBadge(req.donationStatus)}
                        </div>

                        <p className="text-xs text-gray-600 truncate mb-1">
                          🏥 {req.hospitalName}
                        </p>
                        <p className="text-xs text-gray-600 truncate mb-1">
                          📍 {req.fullAddress?.district},{" "}
                          {req.fullAddress?.upazila}
                        </p>
                        <p className="text-xs text-gray-500">
                          📅 {req.donationDate} • ⏰ {req.donationTime}
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex gap-2 pt-3 border-t"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/dashboard/bloodDonation-req/${req._id}`)
                        }
                        className="flex-1 cursor-pointer"
                      >
                        <IconEye className="h-4 w-4 mr-1" />
                        View
                      </Button>

                      {canEdit(req) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            router.push(
                              `/dashboard/bloodDonation-req/${req._id}/edit`
                            )
                          }
                          className="flex-1 cursor-pointer"
                        >
                          <IconEdit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}

                      {canDelete(req) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={() =>
                            handleDelete(req._id, req.recipientName)
                          }
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {canChangeStatus() && (
                      <div
                        className="mt-2 pt-2 border-t"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <label className="text-xs text-gray-600 block mb-1">
                          Change Status:
                        </label>
                        <select
                          value={req.donationStatus}
                          onChange={(e) =>
                            handleStatusChange(req._id, e.target.value)
                          }
                          className="w-full text-xs p-2 border rounded-lg"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="success">Completed</option>
                          <option value="cancel">Cancel</option>
                        </select>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table */}
            <Card className="hidden md:block overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Blood
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Recipient
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Hospital
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Location
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Date & Time
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Phone
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req, index) => (
                      <tr
                        key={req._id}
                        className={`border-b hover:bg-red-50/50 cursor-pointer transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                        onClick={() =>
                          router.push(`/dashboard/bloodDonation-req/${req._id}`)
                        }
                      >
                        <td className="p-3">
                          <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">
                              {req.bloodGroup}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-gray-900">
                            {req.recipientName}
                          </div>
                          {req.requesterId?.name && (
                            <div className="text-xs text-gray-500">
                              By: {req.requesterId.name}
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          <div
                            className="max-w-xs truncate"
                            title={req.hospitalName}
                          >
                            {req.hospitalName}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            {req.fullAddress?.district}
                            {req.fullAddress?.upazila &&
                              `, ${req.fullAddress.upazila}`}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">{req.donationDate}</div>
                          <div className="text-xs text-gray-500">
                            {req.donationTime}
                          </div>
                        </td>
                        <td className="p-3">
                          <a
                            href={`tel:${req.recipientPhone}`}
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {req.recipientPhone}
                          </a>
                        </td>
                        <td className="p-3">
                          {getStatusBadge(req.donationStatus)}
                        </td>
                        <td
                          className="p-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              title="View Details"
                              onClick={() =>
                                router.push(
                                  `/dashboard/bloodDonation-req/${req._id}`
                                )
                              }
                              className="cursor-pointer"
                            >
                              <IconEye className="h-4 w-4" />
                            </Button>

                            {canEdit(req) && (
                              <Button
                                size="sm"
                                variant="outline"
                                title="Edit"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/admin/bloodDonation-req/${req._id}/edit`
                                  )
                                }
                                className="cursor-pointer hover:bg-emerald-50"
                              >
                                <IconEdit className="h-4 w-4" />
                              </Button>
                            )}

                            {canChangeStatus() && (
                              <select
                                value={req.donationStatus}
                                onChange={(e) =>
                                  handleStatusChange(req._id, e.target.value)
                                }
                                className="text-xs p-1.5 border rounded hover:border-gray-400 cursor-pointer"
                                title="Change Status"
                              >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="success">Completed</option>
                                <option value="cancel">Cancel</option>
                              </select>
                            )}

                            {canDelete(req) && (
                              <Button
                                size="sm"
                                variant="outline"
                                title="Delete"
                                className="text-red-600 hover:bg-red-50 cursor-pointer"
                                onClick={() =>
                                  handleDelete(req._id, req.recipientName)
                                }
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(currentPage * itemsPerPage, totalRecords)}
              </span>{" "}
              of <span className="font-semibold">{totalRecords}</span> results
            </p>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="cursor-pointer"
              >
                <IconChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </Button>

              <div className="flex gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum =
                    totalPages <= 5
                      ? i + 1
                      : currentPage <= 3
                      ? i + 1
                      : currentPage >= totalPages - 2
                      ? totalPages - 4 + i
                      : currentPage - 2 + i;

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 text-sm rounded-lg font-medium transition-all ${
                        currentPage === pageNum
                          ? "bg-red-600 text-white shadow-md"
                          : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="cursor-pointer"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <IconChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
