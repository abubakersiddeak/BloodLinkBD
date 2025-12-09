"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconDroplet,
  IconEye,
  IconEdit,
  IconTrash,
  IconMapPin,
  IconCalendar,
  IconClock,
  IconUser,
  IconMail,
  IconCheck,
  IconX,
  IconArrowRight,
  IconAlertCircle,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import server from "@/lib/api";
import useAuth from "@/hooks/useAuth";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    requestId: null,
    requestName: "",
  });

  useEffect(() => {
    if (user) {
      fetchRecentRequests();
    }
  }, [user]);

  const fetchRecentRequests = async () => {
    setLoading(true);
    try {
      const res = await server.get("/api/bloodDonationReq/myBloodDonationReq", {
        params: {
          page: 1,
          limit: 3,
        },
      });

      if (res.data.success) {
        setRecentRequests(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch recent requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const res = await server.patch(
        `/api/bloodDonationReq/${requestId}/status`,
        {
          donationStatus: newStatus,
        }
      );

      if (res.data.success) {
        toast.success(`Request marked as ${newStatus}`);
        fetchRecentRequests();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await server.delete(
        `/api/bloodDonationReq/${deleteDialog.requestId}`
      );

      if (res.data.success) {
        toast.success("Request deleted successfully");
        fetchRecentRequests();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete request");
    } finally {
      setDeleteDialog({ open: false, requestId: null, requestName: "" });
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        label: "Pending",
      },
      "in-progress": {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        label: "In Progress",
      },
      success: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        label: "Done",
      },
      cancel: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        label: "Canceled",
      },
    };

    const style = config[status] || config.pending;

    return (
      <Badge
        variant="outline"
        className={`${style.bg} ${style.text} ${style.border} text-xs px-2 py-1`}
      >
        {style.label}
      </Badge>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Recent Donation Requests Section */}
      {recentRequests.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-red-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <IconDroplet className="h-6 w-6 text-red-600" />
                  My Recent Donation Requests
                </CardTitle>
                <Badge variant="outline" className="text-sm">
                  Last 3 requests
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-semibold">
                            Recipient
                          </TableHead>
                          <TableHead className="font-semibold">
                            Location
                          </TableHead>
                          <TableHead className="font-semibold">
                            Date & Time
                          </TableHead>
                          <TableHead className="font-semibold">
                            Blood Group
                          </TableHead>
                          <TableHead className="font-semibold">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold">
                            Donor Info
                          </TableHead>
                          <TableHead className="font-semibold text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentRequests.map((request) => (
                          <TableRow
                            key={request._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            {/* Recipient */}
                            <TableCell>
                              <div className="font-medium text-gray-900">
                                {request.recipientName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {request.hospitalName}
                              </div>
                            </TableCell>

                            {/* Location */}
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <IconMapPin className="h-3 w-3 text-red-600" />
                                <span>
                                  {request.fullAddress?.district},{" "}
                                  {request.fullAddress?.upazila}
                                </span>
                              </div>
                            </TableCell>

                            {/* Date & Time */}
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm mb-1">
                                <IconCalendar className="h-3 w-3 text-blue-600" />
                                <span>{request.donationDate}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <IconClock className="h-3 w-3" />
                                <span>{request.donationTime}</span>
                              </div>
                            </TableCell>

                            {/* Blood Group */}
                            <TableCell>
                              <Badge className="bg-red-600 text-white hover:bg-red-700">
                                {request.bloodGroup}
                              </Badge>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                              {getStatusBadge(request.donationStatus)}
                            </TableCell>

                            {/* Donor Info */}
                            <TableCell>
                              {request.donationStatus === "in-progress" &&
                              request.requesterId ? (
                                <div className="text-xs">
                                  <div className="flex items-center gap-1 mb-1">
                                    <IconUser className="h-3 w-3 text-gray-600" />
                                    <span className="font-medium">
                                      {request.requesterId.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <IconMail className="h-3 w-3" />
                                    <span>{request.requesterId.email}</span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400 italic">
                                  Not available
                                </span>
                              )}
                            </TableCell>

                            {/* Actions */}
                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                {/* View Button */}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/bloodDonation-req/${request._id}`
                                    )
                                  }
                                  className="cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                                  title="View Details"
                                >
                                  <IconEye className="h-4 w-4" />
                                </Button>

                                {/* Edit Button */}
                                {request.donationStatus === "pending" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/bloodDonation-req/${request._id}/edit`
                                      )
                                    }
                                    className="cursor-pointer hover:bg-green-50 hover:text-green-700"
                                    title="Edit"
                                  >
                                    <IconEdit className="h-4 w-4" />
                                  </Button>
                                )}

                                {/* Status Change Buttons - Only for in-progress */}
                                {request.donationStatus === "in-progress" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        handleStatusChange(
                                          request._id,
                                          "success"
                                        )
                                      }
                                      className="cursor-pointer hover:bg-green-50 hover:text-green-700"
                                      title="Mark as Done"
                                    >
                                      <IconCheck className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        handleStatusChange(
                                          request._id,
                                          "cancel"
                                        )
                                      }
                                      className="cursor-pointer hover:bg-red-50 hover:text-red-700"
                                      title="Cancel"
                                    >
                                      <IconX className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}

                                {/* Delete Button */}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    setDeleteDialog({
                                      open: true,
                                      requestId: request._id,
                                      requestName: request.recipientName,
                                    })
                                  }
                                  className="cursor-pointer hover:bg-red-50 hover:text-red-700"
                                  title="Delete"
                                >
                                  <IconTrash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4 p-4">
                    {recentRequests.map((request) => (
                      <Card
                        key={request._id}
                        className="border-l-4 border-l-red-500 shadow-sm"
                      >
                        <CardContent className="p-4">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 mb-1">
                                {request.recipientName}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {request.hospitalName}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className="bg-red-600 text-white">
                                {request.bloodGroup}
                              </Badge>
                              {getStatusBadge(request.donationStatus)}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-2 mb-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <IconMapPin className="h-4 w-4 text-red-600" />
                              <span>
                                {request.fullAddress?.district},{" "}
                                {request.fullAddress?.upazila}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <IconCalendar className="h-4 w-4 text-blue-600" />
                              <span>
                                {request.donationDate} at {request.donationTime}
                              </span>
                            </div>

                            {/* Donor Info for in-progress */}
                            {request.donationStatus === "in-progress" &&
                              request.requesterId && (
                                <div className="bg-blue-50 rounded p-2 mt-2">
                                  <p className="text-xs font-semibold text-blue-900 mb-1">
                                    Donor Information:
                                  </p>
                                  <p className="text-xs text-blue-700">
                                    {request.requesterId.name} •{" "}
                                    {request.requesterId.email}
                                  </p>
                                </div>
                              )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-3 border-t">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                router.push(
                                  `/dashboard/bloodDonation-req/${request._id}`
                                )
                              }
                              className="flex-1 cursor-pointer"
                            >
                              <IconEye className="h-4 w-4 mr-1" />
                              View
                            </Button>

                            {request.donationStatus === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/bloodDonation-req/${request._id}/edit`
                                  )
                                }
                                className="flex-1 cursor-pointer"
                              >
                                <IconEdit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            )}

                            {request.donationStatus === "in-progress" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleStatusChange(request._id, "success")
                                  }
                                  className="flex-1 cursor-pointer hover:bg-green-50 hover:text-green-700"
                                >
                                  <IconCheck className="h-4 w-4 mr-1" />
                                  Done
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleStatusChange(request._id, "cancel")
                                  }
                                  className="flex-1 cursor-pointer hover:bg-red-50 hover:text-red-700"
                                >
                                  <IconX className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  requestId: request._id,
                                  requestName: request.recipientName,
                                })
                              }
                              className="cursor-pointer text-red-600 hover:bg-red-50"
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* View All Button */}
                  <div className="p-4 bg-gray-50 border-t">
                    <Button
                      onClick={() =>
                        router.push("/dashboard/user/allDonationRequest")
                      }
                      className="w-full bg-red-600 hover:bg-red-700 cursor-pointer"
                      size="lg"
                    >
                      View All My Requests
                      <IconArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State - When no requests */}
      {!loading && recentRequests.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconDroplet className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Donation Requests Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't created any blood donation requests. Start saving
                lives today!
              </p>
              <Button
                onClick={() =>
                  router.push("/dashboard/user/createBloodDonationRequest")
                }
                className="bg-red-600 hover:bg-red-700 cursor-pointer"
                size="lg"
              >
                <IconDroplet className="h-5 w-5 mr-2" />
                Create Your First Request
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <IconAlertCircle className="h-5 w-5 text-red-600" />
              Delete Donation Request
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the donation request for{" "}
              <strong>{deleteDialog.requestName}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Delete Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
