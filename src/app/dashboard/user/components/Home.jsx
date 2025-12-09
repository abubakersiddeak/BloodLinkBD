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
  IconCheck,
  IconX,
  IconArrowRight,
  IconAlertCircle,
  IconBuildingHospital,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
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
        params: { page: 1, limit: 3 },
      });

      if (res.data.success) {
        setRecentRequests(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const res = await server.patch(
        `/api/bloodDonationReq/${requestId}/status`,
        { donationStatus: newStatus }
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
        className: "bg-amber-100 text-amber-700 border-amber-200",
        label: "Pending",
      },
      "in-progress": {
        className: "bg-blue-100 text-blue-700 border-blue-200",
        label: "In Progress",
      },
      success: {
        className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        label: "Completed",
      },
      cancel: {
        className: "bg-rose-100 text-rose-700 border-rose-200",
        label: "Canceled",
      },
    };
    const style = config[status] || config.pending;
    return (
      <Badge variant="outline" className={`${style.className} font-medium`}>
        {style.label}
      </Badge>
    );
  };

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 py-6 md:py-8">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 md:px-0">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <IconDroplet className="text-red-600 fill-current" />
          My Recent Requests
        </h2>
        {recentRequests.length > 0 && (
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/user/allDonationRequest")}
            className="hidden md:flex cursor-pointer"
          >
            View All <IconArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {recentRequests.length === 0 ? (
        // Empty State
        <Card className="mx-4 md:mx-0 bg-gray-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <IconDroplet className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No requests found
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mt-1 mb-6">
              You haven't created any blood donation requests yet.
            </p>
            <Button
              onClick={() =>
                router.push("/dashboard/user/createBloodDonationRequest")
              }
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              Create Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg border shadow-sm overflow-hidden mx-4 md:mx-0">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead>Recipient Info</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Date Needed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.map((req) => (
                  <TableRow key={req._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-semibold">{req.recipientName}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <IconBuildingHospital className="h-3 w-3" />{" "}
                        {req.hospitalName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {req.fullAddress?.upazila}, {req.fullAddress?.district}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-600 hover:bg-red-700">
                        {req.bloodGroup}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{req.donationDate}</div>
                      <div className="text-xs text-gray-500">
                        {req.donationTime}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(req.donationStatus)}</TableCell>
                    <TableCell className="text-right">
                      {/* Action Buttons Group */}
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(
                              `/dashboard/bloodDonation-req/${req._id}`
                            )
                          }
                          title="View Details"
                          className="cursor-pointer"
                        >
                          <IconEye className="h-4 w-4 text-gray-600" />
                        </Button>

                        {req.donationStatus === "pending" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(
                                `/dashboard/bloodDonation-req/${req._id}/edit`
                              )
                            }
                            title="Edit"
                            className="cursor-pointer"
                          >
                            <IconEdit className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}

                        {req.donationStatus === "in-progress" ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(req._id, "success")
                                }
                                className="text-green-600 cursor-pointer"
                              >
                                <IconCheck className="mr-2 h-4 w-4" /> Mark
                                Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(req._id, "cancel")
                                }
                                className="text-red-600 cursor-pointer"
                              >
                                <IconX className="mr-2 h-4 w-4" /> Cancel
                                Request
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                requestId: req._id,
                                requestName: req.recipientName,
                              })
                            }
                            title="Delete"
                            className="cursor-pointer"
                          >
                            <IconTrash className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View (Grid) */}
          <div className="grid grid-cols-1 gap-4 md:hidden px-4">
            {recentRequests.map((req) => (
              <Card key={req._id} className="border shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gray-50/50 border-b">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600 text-white font-bold h-8 w-8 flex items-center justify-center rounded-full p-0">
                      {req.bloodGroup}
                    </Badge>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-gray-900">
                        {req.recipientName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {req.donationDate}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(req.donationStatus)}
                </div>

                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <IconBuildingHospital className="h-4 w-4 mt-0.5 text-red-500" />
                      <span className="flex-1">{req.hospitalName}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <IconMapPin className="h-4 w-4 mt-0.5 text-red-500" />
                      <span className="flex-1">
                        {req.fullAddress?.district || "Location N/A"},{" "}
                        {req.fullAddress?.upazila}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconClock className="h-4 w-4 text-red-500" />
                      <span>{req.donationTime}</span>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="pt-3 flex items-center gap-2 border-t mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 cursor-pointer"
                      onClick={() =>
                        router.push(`/dashboard/bloodDonation-req/${req._id}`)
                      }
                    >
                      View
                    </Button>

                    {req.donationStatus === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-blue-600 border-blue-200 bg-blue-50 cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/dashboard/bloodDonation-req/${req._id}/edit`
                          )
                        }
                      >
                        Edit
                      </Button>
                    )}

                    {req.donationStatus === "in-progress" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 cursor-pointer"
                          >
                            Manage
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              handleStatusChange(req._id, "success")
                            }
                          >
                            <IconCheck className="mr-2 h-4 w-4 text-green-600" />{" "}
                            Mark Done
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              handleStatusChange(req._id, "cancel")
                            }
                          >
                            <IconX className="mr-2 h-4 w-4 text-red-600" />{" "}
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer flex-0 px-3 text-red-600 border-red-200 bg-red-50"
                        onClick={() =>
                          setDeleteDialog({
                            open: true,
                            requestId: req._id,
                            requestName: req.recipientName,
                          })
                        }
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* View All Button Mobile */}
            <Button
              variant="ghost"
              className="w-full mt-2 text-gray-500 cursor-pointer"
              onClick={() => router.push("/dashboard/user/allDonationRequest")}
            >
              View All Requests <IconArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent className="max-w-[90%] md:max-w-lg rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <IconAlertCircle className="h-5 w-5" />
              Delete Request?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the request for{" "}
              <strong>{deleteDialog.requestName}</strong>? This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2 justify-end">
            <AlertDialogCancel className="mt-0 flex-1 md:flex-none cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 flex-1 md:flex-none cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
