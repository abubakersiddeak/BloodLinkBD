"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { userApi } from "../../../../../lib/userApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconArrowLeft,
  IconPhone,
  IconMail,
  IconMapPin,
  IconCalendar,
  IconDroplet,
  IconUser,
  IconClock,
} from "@tabler/icons-react";
import { toast } from "sonner";
import Image from "next/image";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await userApi.getUserById(params.id);

        if (response.success) {
          setUser(response.data);
        } else {
          setUser(response.data || response);
        }
      } catch (error) {
        toast.error("Failed to fetch user details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchUserDetails();
    }
  }, [params.id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await userApi.updateUserStatus(params.id, newStatus);
      if (response.success) {
        toast.success("Status updated successfully");
        setUser({ ...user, status: newStatus });
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleRoleChange = async (newRole) => {
    try {
      const response = await userApi.updateUserRole(params.id, newRole);
      if (response.success) {
        toast.success("Role updated successfully");
        setUser({ ...user, role: newRole });
      }
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-3"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <IconUser className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          User Not Found
        </h2>
        <p className="text-gray-500 mb-6">This user does not exist</p>
        <Button
          onClick={() => router.back()}
          className="bg-red-600 hover:bg-red-700 cursor-pointer"
        >
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-gray-100 cursor-pointer"
        >
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Main Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 md:p-8">
            {/* Profile Section */}
            <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
              {/* Avatar */}
              <div className="shrink-0">
                <Image
                  height={200}
                  width={200}
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-100"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <Badge className="bg-red-600 text-white hover:bg-red-700">
                    {user.bloodGroup}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                  <Badge
                    className={
                      user.status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }
                  >
                    {user.status}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <IconMail className="h-4 w-4 text-red-600" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconPhone className="h-4 w-4 text-red-600" />
                    <span>{user.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconMapPin className="h-4 w-4 text-red-600" />
                    <span>
                      {user.location?.upazila}, {user.location?.district}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleStatusChange(
                        user.status === "active" ? "blocked" : "active"
                      )
                    }
                    className="cursor-pointer"
                  >
                    {user.status === "active" ? "Block" : "Unblock"}
                  </Button>

                  {user.role === "user" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRoleChange("volunteer")}
                      className="cursor-pointer"
                    >
                      Make Volunteer
                    </Button>
                  )}

                  {(user.role === "user" || user.role === "volunteer") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRoleChange("admin")}
                      className="cursor-pointer"
                    >
                      Make Admin
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {user.bloodGroup}
                </div>
                <div className="text-xs text-gray-500 mt-1">Blood Group</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {user.donationHistory?.length || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">Donations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 capitalize">
                  {user.role}
                </div>
                <div className="text-xs text-gray-500 mt-1">Role</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 capitalize">
                  {user.status}
                </div>
                <div className="text-xs text-gray-500 mt-1">Status</div>
              </div>
            </div>

            {/* Account Details */}
            <div className="py-6 border-b">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IconUser className="h-4 w-4 text-red-600" />
                Account Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Member Since:</span>
                  <div className="font-medium text-gray-900 mt-1">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Last Updated:</span>
                  <div className="font-medium text-gray-900 mt-1">
                    {new Date(user.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Donation History */}
            <div className="py-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IconDroplet className="h-4 w-4 text-red-600" />
                Donation History ({user.donationHistory?.length || 0})
              </h3>

              {user.donationHistory && user.donationHistory.length > 0 ? (
                <div className="space-y-2">
                  {user.donationHistory.map((donation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <IconDroplet className="h-4 w-4 text-red-600" />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            Donation #{index + 1}
                          </div>
                          <div className="text-xs text-gray-500">
                            {donation.date
                              ? new Date(donation.date).toLocaleDateString()
                              : "Date not available"}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-red-600">
                        {user.bloodGroup}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <IconDroplet className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No donations yet</p>
                </div>
              )}
            </div>

            {/* Activity Timeline */}
            <div className="pt-6 border-t">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IconClock className="h-4 w-4 text-red-600" />
                Activity Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium text-gray-900">
                      Account Created
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium text-gray-900">
                      Last Updated
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(user.updatedAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 ${
                      user.status === "active" ? "bg-green-500" : "bg-red-500"
                    } rounded-full mt-1.5`}
                  ></div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium text-gray-900">
                      Current Status
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
