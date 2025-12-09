"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconMapPin,
  IconBuildingHospital,
  IconUser,
  IconPhone,
  IconCalendar,
  IconClock,
  IconDroplet,
  IconEdit,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import server from "@/lib/api";

// Helper for Blood Groups
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function EditDonationRequest() {
  const router = useRouter();
  const params = useParams(); // Get ID from URL
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientPhone: "",
    hospitalName: "",
    district: "",
    upazila: "",
    detailsAddress: "", // specific location
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    additionalMessage: "",
  });

  // Fetch Existing Data
  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const res = await server.get(`/api/bloodDonationReq/${id}`);
        if (res.data.success) {
          const data = res.data.data;

          // Populate form with existing data
          setFormData({
            recipientName: data.recipientName,
            recipientPhone: data.recipientPhone,
            hospitalName: data.hospitalName,
            district: data.fullAddress?.district || "",
            upazila: data.fullAddress?.upazila || "",
            detailsAddress: data.recipientLocation || "", // Assuming this is the specific address
            bloodGroup: data.bloodGroup,
            donationDate: data.donationDate,
            donationTime: data.donationTime,
            additionalMessage: data.additionalMessage || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load request details");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRequestData();
  }, [id, router]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Select Changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Construct payload matching backend expectation
    const payload = {
      recipientName: formData.recipientName,
      recipientPhone: formData.recipientPhone,
      hospitalName: formData.hospitalName,
      bloodGroup: formData.bloodGroup,
      donationDate: formData.donationDate,
      donationTime: formData.donationTime,
      additionalMessage: formData.additionalMessage,
      // Location data
      recipientLocation: formData.detailsAddress,
      fullAddress: {
        district: formData.district,
        upazila: formData.upazila,
      },
    };

    try {
      const res = await server.put(`/api/bloodDonationReq/${id}`, payload);

      if (res.data.success) {
        toast.success("Request updated successfully");
        router.push("/dashboard/user/allDonationRequest");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 cursor-pointer hover:bg-gray-100"
      >
        <IconArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
      </Button>

      <Card className=" shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <IconEdit className="h-6 w-6 text-red-600" />
            Edit Donation Request
          </CardTitle>
          <p className="text-sm text-gray-500">
            Update the details for your blood donation request.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Patient Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-1">
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="recipientName"
                    className="flex items-center gap-2"
                  >
                    <IconUser className="h-4 w-4 text-gray-500" /> Patient Name
                  </Label>
                  <Input
                    id="recipientName"
                    name="recipientName"
                    placeholder="Enter patient name"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="recipientPhone"
                    className="flex items-center gap-2"
                  >
                    <IconPhone className="h-4 w-4 text-gray-500" /> Phone Number
                  </Label>
                  <Input
                    id="recipientPhone"
                    name="recipientPhone"
                    placeholder="01XXXXXXXXX"
                    value={formData.recipientPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section: Medical Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-1">
                Medical Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="hospitalName"
                    className="flex items-center gap-2"
                  >
                    <IconBuildingHospital className="h-4 w-4 text-gray-500" />{" "}
                    Hospital Name
                  </Label>
                  <Input
                    id="hospitalName"
                    name="hospitalName"
                    placeholder="e.g. Dhaka Medical College"
                    value={formData.hospitalName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="bloodGroup"
                    className="flex items-center gap-2"
                  >
                    <IconDroplet className="h-4 w-4 text-red-500" /> Blood Group
                  </Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(val) =>
                      handleSelectChange("bloodGroup", val)
                    }
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((bg) => (
                        <SelectItem
                          key={bg}
                          value={bg}
                          className="cursor-pointer"
                        >
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section: Date & Time */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-1">
                Timing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="donationDate"
                    className="flex items-center gap-2"
                  >
                    <IconCalendar className="h-4 w-4 text-gray-500" /> Donation
                    Date
                  </Label>
                  <Input
                    id="donationDate"
                    name="donationDate"
                    type="date"
                    value={formData.donationDate}
                    onChange={handleInputChange}
                    className="cursor-pointer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="donationTime"
                    className="flex items-center gap-2"
                  >
                    <IconClock className="h-4 w-4 text-gray-500" /> Donation
                    Time
                  </Label>
                  <Input
                    id="donationTime"
                    name="donationTime"
                    type="time"
                    value={formData.donationTime}
                    onChange={handleInputChange}
                    className="cursor-pointer"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section: Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-1">
                Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  {/* You can replace this with a Select if you have district data */}
                  <Input
                    id="district"
                    name="district"
                    placeholder="e.g. Dhaka"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upazila">Upazila / Area</Label>
                  <Input
                    id="upazila"
                    name="upazila"
                    placeholder="e.g. Dhanmondi"
                    value={formData.upazila}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="detailsAddress"
                  className="flex items-center gap-2"
                >
                  <IconMapPin className="h-4 w-4 text-gray-500" /> Specific
                  Address Details
                </Label>
                <Textarea
                  id="detailsAddress"
                  name="detailsAddress"
                  placeholder="Ward number, floor number, room number etc."
                  value={formData.detailsAddress}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
            </div>

            {/* Section: Message */}
            <div className="space-y-2">
              <Label htmlFor="additionalMessage">
                Additional Message (Optional)
              </Label>
              <Textarea
                id="additionalMessage"
                name="additionalMessage"
                placeholder="Any special instructions for the donor..."
                value={formData.additionalMessage}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full md:w-auto cursor-pointer"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full md:w-auto bg-red-600 hover:bg-red-700 cursor-pointer"
                disabled={submitting}
              >
                {submitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <IconDeviceFloppy className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
