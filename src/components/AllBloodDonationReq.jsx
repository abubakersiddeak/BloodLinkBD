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
        } text-[10px] sm:text-xs px-2 py-0.5 whitespace-nowrap`}
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

  // Permission Checks (Updated for ID safety)
  const canEdit = (req) => {
    const userId = user?._id || user?.id;
    const requesterId = req.requesterId?._id || req.requesterId;
    // Only allow editing if user owns the request AND it is pending
    return userId === requesterId && req.donationStatus === "pending";
  };

  const canDelete = (req) => {
    const userId = user?._id || user?.id;
    const requesterId = req.requesterId?._id || req.requesterId;
    return (
      (userId === requesterId && req.donationStatus === "pending") ||
      user?.role === "admin"
    );
  };

  const canChangeStatus = () =>
    user?.role === "volunteer" || user?.role === "admin";

  const resetFilters = () => {
    setStatusFilter("all");
    setBloodFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full p-2 sm:p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
            {user?.role === "user" ? "My Requests" : "Donation Requests"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage and track blood donation activities
          </p>
        </div>
        <Button
          onClick={() => fetchRequests(false)}
          variant="outline"
          size="sm"
          disabled={refreshing}
          className="w-full sm:w-auto cursor-pointer"
        >
          <IconRefresh
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {[
          {
            label: "Total",
            value: stats.total,
            color: "text-gray-700",
            border: "border-gray-200",
          },
          {
            label: "Pending",
            value: stats.pending,
            color: "text-amber-600",
            border: "border-amber-200",
          },
          {
            label: "In Progress",
            value: stats.inProgress,
            color: "text-blue-600",
            border: "border-blue-200",
          },
          {
            label: "Completed",
            value: stats.success,
            color: "text-emerald-600",
            border: "border-emerald-200",
          },
          {
            label: "Canceled",
            value: stats.cancel,
            color: "text-rose-600",
            border: "border-rose-200",
          },
        ].map((stat) => (
          <Card key={stat.label} className={`${stat.border} shadow-sm`}>
            <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center">
              <span className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide mt-1 text-center">
                {stat.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Section */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2 text-gray-700">
              <IconFilter className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Filters</h3>
            </div>
            {(statusFilter !== "all" ||
              bloodFilter !== "all" ||
              searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
              >
                <IconX className="h-3 w-3 mr-1" /> Clear
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Search
              </label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Name, hospital..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white cursor-pointer"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-medium text-gray-600">
                Blood Group
              </label>
              <select
                value={bloodFilter}
                onChange={(e) => {
                  setBloodFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white cursor-pointer"
              >
                <option value="all">All Blood Groups</option>
                {bloodGroups.slice(1).map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-lg shadow-sm border border-gray-100">
          <IconDroplet className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">
            No requests found
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Try adjusting your filters or create a new request.
          </p>
          <Button
            onClick={resetFilters}
            variant="outline"
            className="cursor-pointer"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
            {requests.map((req) => (
              <Card
                key={req._id}
                className=" hover:shadow-md transition-all active:scale-[0.99]"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <span className="text-red-700 font-bold text-sm">
                          {req.bloodGroup}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">
                          {req.recipientName}
                        </h4>
                        <span className="text-xs text-gray-500 flex items-center gap-1 truncate">
                          {req.hospitalName}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(req.donationStatus)}
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 mb-4 bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <IconMapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {req.fullAddress?.district}, {req.fullAddress?.upazila}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconCalendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span>
                        {req.donationDate} at {req.donationTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs cursor-pointer"
                      onClick={() =>
                        router.push(`/dashboard/bloodDonation-req/${req._id}`)
                      }
                    >
                      Details
                    </Button>

                    {canEdit(req) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 shrink-0 cursor-pointer bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                        onClick={() => handleEdit(req._id)}
                        title="Edit Request"
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                    )}

                    {canDelete(req) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 shrink-0 border-red-200 bg-red-50 hover:bg-red-100 cursor-pointer"
                        onClick={() => handleDelete(req._id, req.recipientName)}
                      >
                        <IconTrash className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>

                  {canChangeStatus() && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <select
                        value={req.donationStatus}
                        onChange={(e) =>
                          handleStatusChange(req._id, e.target.value)
                        }
                        className="w-full text-xs p-2 bg-gray-50 border rounded-md cursor-pointer"
                      >
                        <option value="pending">Mark as Pending</option>
                        <option value="in-progress">Mark as In Progress</option>
                        <option value="success">Mark as Completed</option>
                        <option value="cancel">Mark as Canceled</option>
                      </select>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden lg:block bg-white rounded-lg border border-gray-200 shadow-sm w-full overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Group</th>
                    <th className="px-4 py-3 min-w-[150px]">Recipient</th>
                    <th className="px-4 py-3 min-w-[150px]">Location</th>
                    <th className="px-4 py-3 whitespace-nowrap">Date & Time</th>
                    <th className="px-4 py-3 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((req) => (
                    <tr
                      key={req._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Badge className="bg-red-600 text-white hover:bg-red-700">
                          {req.bloodGroup}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 truncate max-w-[150px]">
                          {req.recipientName}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 truncate max-w-[150px]">
                          <IconBuildingHospital className="h-3 w-3 shrink-0" />{" "}
                          {req.hospitalName}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-700 truncate max-w-[150px]">
                          {req.fullAddress?.district}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">
                          {req.fullAddress?.upazila}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-900">{req.donationDate}</div>
                        <div className="text-xs text-gray-500">
                          {req.donationTime}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(req.donationStatus)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/dashboard/bloodDonation-req/${req._id}`
                              )
                            }
                          >
                            <IconEye className="h-4 w-4 text-gray-500" />
                          </Button>

                          {canEdit(req) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => handleEdit(req._id)}
                              title="Edit Request"
                            >
                              <IconEdit className="h-4 w-4" />
                            </Button>
                          )}

                          {canDelete(req) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 cursor-pointer hover:bg-red-50"
                              onClick={() =>
                                handleDelete(req._id, req.recipientName)
                              }
                            >
                              <IconTrash className="h-4 w-4 text-red-600" />
                            </Button>
                          )}

                          {canChangeStatus() && (
                            <select
                              value={req.donationStatus}
                              onChange={(e) =>
                                handleStatusChange(req._id, e.target.value)
                              }
                              className="ml-2 text-xs border border-gray-200 rounded p-1 cursor-pointer bg-transparent max-w-[100px]"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="success">Success</option>
                              <option value="cancel">Cancel</option>
                            </select>
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm w-full">
          <div className="text-sm text-gray-500 order-2 md:order-1 text-center md:text-left">
            Page{" "}
            <span className="font-medium text-gray-900">{currentPage}</span> of{" "}
            <span className="font-medium text-gray-900">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2 order-1 md:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer"
            >
              <IconChevronLeft className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Previous</span>
            </Button>
            <div className="hidden sm:flex items-center gap-1">
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
                    className={`h-8 w-8 rounded-md text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-red-600 text-white"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="cursor-pointer"
            >
              <span className="sr-only sm:not-sr-only sm:mr-2">Next</span>
              <IconChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
