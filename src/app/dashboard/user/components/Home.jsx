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
  IconUser,
  IconMail,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { PhoneCall } from "lucide-react";
import server from "@/lib/api";
import useAuth from "@/hooks/useAuth";

export default function DashboardHome() {
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
      toast.error("Failed to load your requests");
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
        toast.success(
          newStatus === "success"
            ? "Donation marked as completed!"
            : "Request canceled"
        );
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
        variant: "secondary",
        label: "Pending",
        color: "text-amber-700 bg-amber-100 border-amber-200",
      },
      "in-progress": {
        variant: "default",
        label: "In Progress",
        color: "text-blue-700 bg-blue-100 border-blue-200",
      },
      success: {
        variant: "default",
        label: "Completed",
        color: "text-emerald-700 bg-emerald-100 border-emerald-200",
      },
      cancel: {
        variant: "destructive",
        label: "Canceled",
        color: "text-rose-700 bg-rose-100 border-rose-200",
      },
    };
    const style = config[status] || config.pending;
    return (
      <Badge variant="outline" className={`${style.color} font-medium border`}>
        {style.label}
      </Badge>
    );
  };

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 py-8 md:py-12 max-w-7xl mx-auto px-4 md:px-0">
      {/* Recent Requests Section */}
      {recentRequests.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
              <IconDroplet className="text-red-600 fill-current" size={32} />
              My Recent Requests
            </h2>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Donor Info</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.map((req) => (
                  <TableRow key={req._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div>{req.recipientName}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <IconBuildingHospital size={14} /> {req.hospitalName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-700">
                        <IconMapPin size={16} />
                        {req.fullAddress?.upazila}, {req.fullAddress?.district}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-600 text-white font-bold">
                        {req.bloodGroup}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconCalendar size={16} />
                        <span>
                          {new Date(req.donationDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <IconClock size={14} /> {req.donationTime}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(req.donationStatus)}</TableCell>

                    {/* --- UPDATED DONOR INFO LOGIC (Desktop) --- */}
                    <TableCell>
                      {(req.donationStatus === "in-progress" ||
                        req.donationStatus === "success") &&
                      req.donorId ? (
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <IconUser
                              size={14}
                              className={
                                req.donationStatus === "success"
                                  ? "text-green-600"
                                  : "text-blue-600"
                              }
                            />
                            <span className="font-medium">
                              {req.donorId.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <PhoneCall size={14} />
                            <span>{req.donorId.phone}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </TableCell>
                    {/* ------------------------------------------- */}

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/bloodDonation-req/${req._id}`
                            )
                          }
                          className="cursor-pointer text-gray-600 hover:text-gray-900"
                          title="View Details"
                        >
                          <IconEye size={18} />
                        </Button>

                        {req.donationStatus === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/dashboard/bloodDonation-req/${req._id}/edit`
                              )
                            }
                            className="text-blue-600 cursor-pointer hover:bg-blue-50"
                            title="Edit Request"
                          >
                            <IconEdit size={18} />
                          </Button>
                        )}

                        {req.donationStatus === "in-progress" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(req._id, "success")
                              }
                              className="text-green-600 cursor-pointer hover:bg-green-50"
                              title="Mark as Completed"
                            >
                              <IconCheck size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(req._id, "cancel")
                              }
                              className="text-amber-600 cursor-pointer hover:bg-amber-50"
                              title="Cancel Request"
                            >
                              <IconX size={18} />
                            </Button>
                          </>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              requestId: req._id,
                              requestName: req.recipientName,
                            })
                          }
                          className="text-red-600 cursor-pointer hover:bg-red-50"
                          title="Delete Request"
                        >
                          <IconTrash size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-6 md:hidden">
            {recentRequests.map((req) => (
              <Card key={req._id} className="overflow-hidden border shadow-md">
                <div className="bg-linear-to-r from-red-50 to-red-100 p-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{req.recipientName}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <IconMapPin size={16} />
                        {req.fullAddress?.upazila}, {req.fullAddress?.district}
                      </p>
                    </div>
                    <Badge className="bg-red-600 text-white text-lg font-bold px-4">
                      {req.bloodGroup}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <IconCalendar className="text-red-600" size={18} />
                      <span>
                        {new Date(req.donationDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconClock className="text-red-600" size={18} />
                      <span>{req.donationTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(req.donationStatus)}
                  </div>

                  {/* --- UPDATED DONOR INFO LOGIC (Mobile) --- */}
                  {(req.donationStatus === "in-progress" ||
                    req.donationStatus === "success") &&
                    req.donorId && (
                      <div
                        className={`border rounded-lg p-4 ${
                          req.donationStatus === "success"
                            ? "bg-green-50 border-green-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <p
                          className={`font-semibold mb-2 ${
                            req.donationStatus === "success"
                              ? "text-green-900"
                              : "text-blue-900"
                          }`}
                        >
                          {req.donationStatus === "success"
                            ? "Donated By"
                            : "Donor Accepted"}
                        </p>
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-2">
                            <IconUser size={16} /> {req.donorId.name}
                          </p>
                          <p className="flex items-center gap-2 text-gray-700">
                            <IconMail size={16} /> {req.donorId.email}
                          </p>
                          <a
                            href={`tel:${req.donorId.phone}`}
                            className={`flex items-center gap-2 font-medium pt-1 ${
                              req.donationStatus === "success"
                                ? "text-green-700"
                                : "text-blue-700"
                            }`}
                          >
                            <PhoneCall size={16} /> {req.donorId.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  {/* ------------------------------------------- */}

                  <div className="flex gap-3 pt-3 border-t overflow-x-auto">
                    <Button
                      variant="outline"
                      className="flex-1 cursor-pointer min-w-[80px]"
                      onClick={() =>
                        router.push(`/dashboard/bloodDonation-req/${req._id}`)
                      }
                    >
                      <IconEye className="mr-2" size={16} /> View
                    </Button>

                    {req.donationStatus === "pending" && (
                      <Button
                        variant="outline"
                        className="flex-1 cursor-pointer text-blue-600 border-blue-300 min-w-[80px]"
                        onClick={() =>
                          router.push(
                            `/dashboard/bloodDonation-req/${req._id}/edit`
                          )
                        }
                      >
                        <IconEdit className="mr-2" size={16} /> Edit
                      </Button>
                    )}

                    {req.donationStatus === "in-progress" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 cursor-pointer border-blue-300 bg-blue-50 text-blue-700 min-w-[90px]"
                          >
                            Update
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(req._id, "success")
                            }
                            className="text-green-600 cursor-pointer"
                          >
                            <IconCheck className="mr-2" size={16} /> Mark Done
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(req._id, "cancel")
                            }
                            className="text-amber-600 cursor-pointer"
                          >
                            <IconX className="mr-2" size={16} /> Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    <Button
                      variant="outline"
                      className="px-4 cursor-pointer text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          requestId: req._id,
                          requestName: req.recipientName,
                        })
                      }
                    >
                      <IconTrash size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              size="lg"
              onClick={() => router.push("/dashboard/user/allDonationRequest")}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              View My All Requests
              <IconArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <IconAlertCircle size={24} />
              Delete Blood Donation Request?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the request for{" "}
              <strong>{deleteDialog.requestName}</strong>?
              <br />
              This action cannot be undone.
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
