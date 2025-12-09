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
  IconShieldCheck,
  IconBan,
  IconCircleCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Permission checks
  const permissions = {
    isAdmin: currentUser?.role === "admin",
    isVolunteer: currentUser?.role === "volunteer",
    canBlockUsers:
      currentUser?.role === "admin" || currentUser?.role === "volunteer",
    canManageRoles: currentUser?.role === "admin",
  };

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
    // Check permissions
    if (!permissions.canBlockUsers) {
      toast.error("You don't have permission to perform this action");
      return;
    }

    // Volunteers can only block regular users (not volunteers or admins)
    if (permissions.isVolunteer && user.role !== "user") {
      toast.error(
        `You cannot block ${user.role} users. Only regular users can be blocked by volunteers.`
      );
      return;
    }

    // Prevent blocking self
    if (currentUser?._id === user._id) {
      toast.error("You cannot block yourself");
      return;
    }

    try {
      const response = await userApi.updateUserStatus(params.id, newStatus);
      if (response.success) {
        toast.success(
          `User ${
            newStatus === "blocked" ? "blocked" : "unblocked"
          } successfully`
        );
        setUser({ ...user, status: newStatus });
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
      console.error(error);
    }
  };

  const handleRoleChange = async (newRole) => {
    // Only admins can change roles
    if (!permissions.canManageRoles) {
      toast.error("You don't have permission to perform this action");
      return;
    }

    // Prevent changing own role
    if (currentUser?._id === user._id) {
      toast.error("You cannot change your own role");
      return;
    }

    try {
      const response = await userApi.updateUserRole(params.id, newRole);
      if (response.success) {
        const roleNames = {
          user: "User",
          volunteer: "Volunteer",
          admin: "Admin",
        };
        toast.success(`User role updated to ${roleNames[newRole]}`);
        setUser({ ...user, role: newRole });
      } else {
        toast.error(response.message || "Failed to update role");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
      console.error(error);
    }
  };

  // Check if can block this specific user
  const canBlockThisUser = () => {
    if (!permissions.canBlockUsers) return false;
    if (currentUser?._id === user._id) return false;

    // Admins can block anyone
    if (permissions.isAdmin) return true;

    // Volunteers can ONLY block regular users (not volunteers or admins)
    if (permissions.isVolunteer && user.role === "user") return true;

    return false;
  };

  // Check if can change this specific user's role
  const canChangeThisUserRole = () => {
    if (!permissions.canManageRoles) return false;
    if (currentUser?._id === user._id) return false;
    if (user.role === "admin") return false; // Can't change admin role
    return true;
  };

  // Get restriction message for volunteers
  const getVolunteerRestrictionMessage = () => {
    if (!permissions.isVolunteer) return null;
    if (user.role === "admin") {
      return "You cannot block admin users";
    }
    if (user.role === "volunteer") {
      return "You cannot block other volunteer users";
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-3"></div>
          <p className="text-gray-500">Loading user details...</p>
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

  const isSelf = currentUser?._id === user._id;
  const volunteerRestrictionMsg = getVolunteerRestrictionMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-gray-100 cursor-pointer"
        >
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>

        {/* Permission Notice */}
        {isSelf && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <IconShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 text-sm">
                Your Profile
              </h4>
              <p className="text-xs text-blue-700 mt-1">
                You are viewing your own profile. Some actions are restricted.
              </p>
            </div>
          </div>
        )}

        {/* Volunteer Permission Notice */}
        {permissions.isVolunteer && !isSelf && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <IconShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 text-sm">
                Volunteer Permissions
              </h4>
              <p className="text-xs text-blue-700 mt-1">
                As a volunteer, you can only block/unblock{" "}
                <strong>regular users</strong>. You cannot block volunteers or
                admins.
              </p>
            </div>
          </div>
        )}

        {/* Regular User Permission Notice */}
        {!permissions.canBlockUsers && !permissions.canManageRoles && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <IconShieldCheck className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 text-sm">
                Limited Permissions
              </h4>
              <p className="text-xs text-amber-700 mt-1">
                You can only view user details. Managing users requires
                volunteer or admin permissions.
              </p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 md:p-8">
            {/* Profile Section */}
            <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="relative">
                  <Image
                    height={200}
                    width={200}
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-md"
                  />
                  {isSelf && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 shadow-lg">
                      <IconUser className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {user.name}
                    {isSelf && <span className="text-blue-600"> (You)</span>}
                  </h1>
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700">
                    <IconDroplet className="h-3 w-3 mr-1" />
                    {user.bloodGroup}
                  </Badge>
                  <Badge variant="outline" className="capitalize font-semibold">
                    <IconShieldCheck className="h-3 w-3 mr-1" />
                    {user.role}
                  </Badge>
                  <Badge
                    className={
                      user.status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }
                  >
                    {user.status === "active" ? (
                      <IconCircleCheck className="h-3 w-3 mr-1" />
                    ) : (
                      <IconBan className="h-3 w-3 mr-1" />
                    )}
                    {user.status}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <IconMail className="h-4 w-4 text-red-600" />
                    <a
                      href={`mailto:${user.email}`}
                      className="hover:text-red-600 transition-colors"
                    >
                      {user.email}
                    </a>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <IconPhone className="h-4 w-4 text-red-600" />
                      <a
                        href={`tel:${user.phone}`}
                        className="hover:text-red-600 transition-colors"
                      >
                        {user.phone}
                      </a>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-2">
                      <IconMapPin className="h-4 w-4 text-red-600" />
                      <span>
                        {user.location.upazila}, {user.location.district}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!isSelf && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
                    <h4 className="w-full text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Quick Actions
                    </h4>

                    {/* Block/Unblock Button - Admin & Volunteer (with restrictions) */}
                    {canBlockThisUser() && (
                      <Button
                        size="sm"
                        variant={
                          user.status === "active" ? "destructive" : "default"
                        }
                        onClick={() =>
                          handleStatusChange(
                            user.status === "active" ? "blocked" : "active"
                          )
                        }
                        className="cursor-pointer"
                      >
                        {user.status === "active" ? (
                          <>
                            <IconBan className="h-4 w-4 mr-1.5" />
                            Block User
                          </>
                        ) : (
                          <>
                            <IconCircleCheck className="h-4 w-4 mr-1.5" />
                            Unblock User
                          </>
                        )}
                      </Button>
                    )}

                    {/* Role Management - Admin Only */}
                    {canChangeThisUserRole() && (
                      <>
                        {user.role === "user" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRoleChange("volunteer")}
                              className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                            >
                              <IconShieldCheck className="h-4 w-4 mr-1.5" />
                              Make Volunteer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRoleChange("admin")}
                              className="cursor-pointer hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                            >
                              <IconShieldCheck className="h-4 w-4 mr-1.5" />
                              Promote to Admin
                            </Button>
                          </>
                        )}

                        {user.role === "volunteer" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRoleChange("user")}
                              className="cursor-pointer hover:bg-gray-50"
                            >
                              <IconUser className="h-4 w-4 mr-1.5" />
                              Demote to User
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRoleChange("admin")}
                              className="cursor-pointer hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                            >
                              <IconShieldCheck className="h-4 w-4 mr-1.5" />
                              Promote to Admin
                            </Button>
                          </>
                        )}
                      </>
                    )}

                    {/* Restriction Messages */}
                    {volunteerRestrictionMsg && (
                      <div className="w-full mt-2">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                          <IconBan className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-700">
                            <strong>Restricted:</strong>{" "}
                            {volunteerRestrictionMsg}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Show message if no actions available */}
                    {!canBlockThisUser() &&
                      !canChangeThisUserRole() &&
                      !volunteerRestrictionMsg && (
                        <p className="text-xs text-gray-500 italic w-full mt-2">
                          {isSelf
                            ? "You cannot modify your own account"
                            : "No actions available with your current permissions"}
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b">
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg">
                <IconDroplet className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">
                  {user.bloodGroup}
                </div>
                <div className="text-xs text-gray-500 mt-1">Blood Group</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <IconCalendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {user.donationHistory?.length || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">Donations</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <IconShieldCheck className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 capitalize">
                  {user.role}
                </div>
                <div className="text-xs text-gray-500 mt-1">Role</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                {user.status === "active" ? (
                  <IconCircleCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
                ) : (
                  <IconBan className="h-6 w-6 text-red-600 mx-auto mb-2" />
                )}
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
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-gray-500 text-xs">Member Since:</span>
                  <div className="font-medium text-gray-900 mt-1">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-gray-500 text-xs">Last Updated:</span>
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
            <div className="py-6 border-b">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IconDroplet className="h-4 w-4 text-red-600" />
                Donation History ({user.donationHistory?.length || 0})
              </h3>

              {user.donationHistory && user.donationHistory.length > 0 ? (
                <div className="space-y-2">
                  {user.donationHistory.map((donation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-red-50 rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <IconDroplet className="h-5 w-5 text-red-600" />
                        </div>
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
                      <Badge
                        variant="outline"
                        className="text-red-600 border-red-300"
                      >
                        {user.bloodGroup}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                  <IconDroplet className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    No donations yet
                  </p>
                  <p className="text-xs text-gray-500">
                    Donation history will appear here
                  </p>
                </div>
              )}
            </div>

            {/* Activity Timeline */}
            <div className="pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IconClock className="h-4 w-4 text-red-600" />
                Activity Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 ring-4 ring-green-100"></div>
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
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 ring-4 ring-blue-100"></div>
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
                    className={`w-3 h-3 ${
                      user.status === "active"
                        ? "bg-green-500 ring-green-100"
                        : "bg-red-500 ring-red-100"
                    } rounded-full mt-1.5 ring-4`}
                  ></div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium text-gray-900">
                      Current Status
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.status} • Role: {user.role}
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
