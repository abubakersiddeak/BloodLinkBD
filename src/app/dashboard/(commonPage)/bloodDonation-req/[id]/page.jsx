"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconDroplet,
  IconUser,
  IconPhone,
  IconMail,
  IconMapPin,
  IconCalendar,
  IconClock,
  IconBuildingHospital,
  IconMessage,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconCheck,
  IconLoader2,
  IconHeartHandshake,
  IconUserCheck,
} from "@tabler/icons-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import server from "@/lib/api";
import useAuth from "@/hooks/useAuth";

// Status Configuration
const STATUS_CONFIG = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    label: "Pending",
    icon: IconClock,
  },
  "in-progress": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    label: "In Progress",
    icon: IconLoader2,
  },
  success: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    label: "Completed",
    icon: IconCheck,
  },
  cancel: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    label: "Canceled",
    icon: IconAlertCircle,
  },
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-linear-to-br from-gray-50 to-rose-50/30 py-4 px-3 sm:p-6">
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-white rounded-xl shadow-sm animate-pulse"
            />
          ))}
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-48 bg-white rounded-xl shadow-sm animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Info Card Component
const InfoCard = ({ icon: Icon, label, value, href, isEmail }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center shrink-0">
      <Icon className="h-5 w-5 text-rose-600" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      {href ? (
        <a
          href={href}
          className={`font-semibold text-gray-900 hover:text-rose-600 transition-colors ${
            isEmail ? "text-sm truncate block" : ""
          }`}
        >
          {value}
        </a>
      ) : (
        <p className="font-semibold text-gray-900 text-sm">{value}</p>
      )}
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.bg} ${config.text} ${config.border} text-sm px-3 py-1.5 font-medium flex items-center gap-1.5 w-fit`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
};

// Main Component
export default function BloodDonationRequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Memoized permission checks
  const permissions = useMemo(() => {
    if (!request || !user) return {};

    const isOwner = user._id === request.requesterId?._id;
    const isPending = request.donationStatus === "pending";

    return {
      canEdit: isOwner && isPending,
      canDelete: (isOwner && isPending) || user.role === "admin",
      canChangeStatus:
        isOwner || user.role === "volunteer" || user.role === "admin",
    };
  }, [request, user]);

  // Fetch request details
  const fetchRequestDetails = useCallback(async () => {
    if (!params.id) return;

    setLoading(true);
    try {
      const res = await server.get(`/api/bloodDonationReq/${params.id}`);

      if (res.data.success) {
        setRequest(res.data.data);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "Request not found",
          confirmButtonColor: "#dc2626",
        });
        router.push("/dashboard/admin/allDonationRequest");
      }
    } catch (error) {
      console.error("Failed to fetch request:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message || "Failed to fetch request details",
        confirmButtonColor: "#dc2626",
      });
      router.push("/dashboard/admin/allDonationRequest");
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);
  console.log(request);

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (actionLoading) return;

    const result = await Swal.fire({
      title: "Change Status",
      text: `Change status to ${STATUS_CONFIG[newStatus].label}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const res = await server.patch(
          `/api/bloodDonationReq/${params.id}/status`,
          {
            donationStatus: newStatus,
          }
        );

        if (res.data.success) {
          setRequest((prev) => ({ ...prev, donationStatus: newStatus }));
          await Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Status updated successfully",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to update status",
          confirmButtonColor: "#dc2626",
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (actionLoading) return;

    const result = await Swal.fire({
      title: "Delete Request",
      html: "This action <strong>cannot be undone</strong>.<br/>Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      focusCancel: true,
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const res = await server.delete(`/api/bloodDonationReq/${params.id}`);

        if (res.data.success) {
          await Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Request deleted successfully",
            timer: 1500,
            showConfirmButton: false,
          });
          router.push("/dashboard/admin/allDonationRequest");
        }
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to delete request",
          confirmButtonColor: "#dc2626",
        });
        setActionLoading(false);
      }
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6">
          <IconDroplet
            className="h-20 w-20 text-gray-300 mx-auto mb-4"
            strokeWidth={1.5}
          />
          <p className="text-gray-900 font-semibold text-xl mb-2">
            Request not found
          </p>
          <p className="text-gray-500 text-sm">
            The request you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push("/dashboard/admin/allDonationRequest")}
            className="mt-4 cursor-pointer"
            variant="outline"
          >
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-rose-50/20 py-4 px-3 sm:py-6 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white/80 cursor-pointer -ml-2"
            size="sm"
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                Donation Request
              </h1>
              <p className="text-sm text-gray-500">
                ID: <span className="font-mono">{params.id}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {permissions.canEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/dashboard/admin/allDonationRequest/${params.id}/edit`
                    )
                  }
                  disabled={actionLoading}
                  className="cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
                >
                  <IconEdit className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
              )}

              {permissions.canDelete && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="cursor-pointer text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                >
                  <IconTrash className="h-4 w-4 mr-1.5" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Recipient Card */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                  {/* Blood Group Badge */}
                  <div className="w-20 h-20 bg-linear-to-br from-rose-500 via-rose-600 to-rose-700 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ring-4 ring-rose-100">
                    <div className="text-center">
                      <IconDroplet className="h-6 w-6 text-white mx-auto mb-1" />
                      <span className="text-white font-bold text-xl">
                        {request.bloodGroup}
                      </span>
                    </div>
                  </div>

                  {/* Recipient Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-3 mb-3">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 wrap-break-word">
                        {request.recipientName}
                      </h2>
                      <StatusBadge status={request.donationStatus} />
                    </div>
                    <p className="text-gray-600 flex items-start sm:items-center gap-2 text-sm">
                      <IconMapPin className="h-4 w-4 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
                      <span className="wrap-break-word">
                        {request.recipientLocation}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 pt-6 border-t">
                  <InfoCard
                    icon={IconCalendar}
                    label="Date Needed"
                    value={request.donationDate}
                  />
                  <InfoCard
                    icon={IconClock}
                    label="Time"
                    value={request.donationTime}
                  />
                </div>
              </CardContent>
            </Card>

            {request.donorId &&
              (request.donationStatus === "in-progress" ||
                request.donationStatus === "success") && (
                <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 border-emerald-200 bg-linear-to-br from-emerald-50 to-white">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-emerald-200">
                      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                        <IconHeartHandshake className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                          Donor Information
                          <IconUserCheck className="h-5 w-5 text-emerald-600" />
                        </h3>
                        <p className="text-xs text-emerald-700 font-medium">
                          {request.donationStatus === "success"
                            ? "Completed Donation"
                            : "Accepted Your Request"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Donor Details Grid */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-4 border border-emerald-100">
                          <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                            <IconUser className="h-3 w-3" />
                            Donor Name
                          </p>
                          <p className="font-bold text-gray-900 text-base">
                            {request.donorId.name || "N/A"}
                          </p>
                        </div>

                        {request.donorId.bloodGroup && (
                          <div className="bg-white rounded-lg p-4 border border-emerald-100">
                            <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                              <IconDroplet className="h-3 w-3" />
                              Blood Group
                            </p>
                            <p className="font-bold text-rose-600 text-xl">
                              {request.donorId.bloodGroup}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-3">
                        {request.donorId.phone && (
                          <InfoCard
                            icon={IconPhone}
                            label="Donor Phone"
                            value={request.donorId.phone}
                            href={`tel:${request.donorId.phone}`}
                          />
                        )}

                        {request.donorId.email && (
                          <InfoCard
                            icon={IconMail}
                            label="Donor Email"
                            value={request.donorId.email}
                            href={`mailto:${request.donorId.email}`}
                            isEmail
                          />
                        )}

                        {request.donorId.address && (
                          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-emerald-100">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                              <IconMapPin className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-500 mb-0.5">
                                Donor Address
                              </p>
                              <p className="font-semibold text-gray-900 text-sm">
                                {typeof request.donorId.address === "object"
                                  ? `${
                                      request.donorId.address.district || ""
                                    }, ${request.donorId.address.upazila || ""}`
                                  : request.donorId.address}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Contact Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-emerald-200">
                        {request.donorId.phone && (
                          <a
                            href={`tel:${request.donorId.phone}`}
                            className="block"
                          >
                            <Button
                              className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-sm"
                              size="sm"
                            >
                              <IconPhone className="h-4 w-4 mr-1.5" />
                              Call Donor
                            </Button>
                          </a>
                        )}
                        {request.donorId.email && (
                          <a
                            href={`mailto:${request.donorId.email}`}
                            className="block"
                          >
                            <Button
                              variant="outline"
                              className="w-full cursor-pointer hover:bg-emerald-50 border-emerald-300"
                              size="sm"
                            >
                              <IconMail className="h-4 w-4 mr-1.5" />
                              Email
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Pending Status Message */}
            {request.donationStatus === "pending" && (
              <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 border-amber-200 bg-linear-to-br from-amber-50 to-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <IconClock className="h-6 w-6 text-amber-600 animate-pulse" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">
                        Waiting for Donor
                      </p>
                      <p className="text-sm text-gray-600">
                        No donor has accepted this request yet
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hospital Information */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                    <IconBuildingHospital className="h-5 w-5 text-rose-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Hospital Information
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                      Hospital Name
                    </p>
                    <p className="font-semibold text-gray-900 text-base sm:text-lg wrap-break-word">
                      {request.hospitalName}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                        District
                      </p>
                      <p className="font-medium text-gray-900">
                        {request.fullAddress?.district || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                        Upazila
                      </p>
                      <p className="font-medium text-gray-900">
                        {request.fullAddress?.upazila || "N/A"}
                      </p>
                    </div>
                  </div>

                  {request.fullAddress?.streetAddress && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                        Street Address
                      </p>
                      <p className="font-medium text-gray-900 wrap-break-word">
                        {request.fullAddress.streetAddress}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {request.additionalMessage && (
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                      <IconMessage className="h-5 w-5 text-rose-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      Additional Message
                    </h3>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base wrap-break-word whitespace-pre-wrap">
                      {request.additionalMessage}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Contact & Status */}
          <div className="space-y-4 sm:space-y-6 z-40">
            {/* Contact Information */}
            <Card className="shadow-lg lg:top-6 hover:shadow-xl transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                    <IconPhone className="h-5 w-5 text-rose-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Contact Details
                  </h3>
                </div>

                <div className="space-y-3">
                  <InfoCard
                    icon={IconPhone}
                    label="Phone"
                    value={request.recipientPhone}
                    href={`tel:${request.recipientPhone}`}
                  />

                  {request.requesterId?.name && (
                    <InfoCard
                      icon={IconUser}
                      label="Requested By"
                      value={request.requesterId.name}
                    />
                  )}

                  {request.requesterId?.email && (
                    <InfoCard
                      icon={IconMail}
                      label="Email"
                      value={request.requesterId.email}
                      href={`mailto:${request.requesterId.email}`}
                      isEmail
                    />
                  )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2 mt-5 z-50 pt-5 border-t">
                  <a href={`tel:${request.recipientPhone}`} className="block">
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-sm"
                      size="sm"
                    >
                      <IconPhone className="h-4 w-4 mr-1.5" />
                      Call
                    </Button>
                  </a>
                  {request.requesterId?.email && (
                    <a
                      href={`mailto:${request.requesterId.email}`}
                      className="block"
                    >
                      <Button
                        variant="outline"
                        className="w-full cursor-pointer hover:bg-gray-50"
                        size="sm"
                      >
                        <IconMail className="h-4 w-4 mr-1.5" />
                        Email
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Management */}
            {permissions.canChangeStatus && (
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <IconEdit className="h-5 w-5 text-rose-600" />
                    Manage Status
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                      const Icon = config.icon;
                      const isActive = request.donationStatus === key;

                      return (
                        <Button
                          key={key}
                          className={`justify-center cursor-pointer transition-all ${
                            isActive
                              ? `${config.bg} ${config.text} ${config.border} ring-2 ring-offset-1`
                              : `${config.bg} ${config.text} hover:ring-2 hover:ring-offset-1`
                          } ${config.border}`}
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(key)}
                          disabled={isActive || actionLoading}
                        >
                          <Icon className="h-4 w-4 mr-1.5" />
                          {config.label}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <IconClock className="h-5 w-5 text-rose-600" />
                  Timeline
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 relative">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1.5 shrink-0 ring-4 ring-emerald-100" />
                    <div className="flex-1 pb-4 border-l-2 border-gray-200 ml-1.5 pl-4 -mt-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Request Created
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 relative">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 shrink-0 ring-4 ring-blue-100" />
                    <div className="flex-1 pl-4 ml-1.5 -mt-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Last Updated
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(request.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
