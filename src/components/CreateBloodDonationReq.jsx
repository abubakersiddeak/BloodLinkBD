"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  IconDroplet,
  IconUser,
  IconMapPin,
  IconBuildingHospital,
  IconCalendar,
  IconClock,
  IconPhone,
  IconMessage,
  IconArrowLeft,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormInput from "./FormInput";
import server from "@/lib/api";
import districtData from "../data/district.json";
import upazilaData from "../data/upazila.json";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function CreateBloodReq() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [upazilas, setUpazilas] = useState([]);
  const {
    register,
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const selectedDistrict = watch("district");
  const handleDistrictChange = (e) => {
    const districtId = e.target.value;

    // Upazila filter
    const filteredUpazilas = upazilaData.filter(
      (upa) => upa.district_id === districtId
    );
    setUpazilas(filteredUpazilas);

    // Clear previous upazila selection
    setValue("upazila", "");
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const fullAddress = {
        district: districtData.find((d) => d.id === data.district)?.name || "",
        upazila: upazilas.find((u) => u.id === data.upazila)?.name || "",
        streetAddress: data.streetAddress,
      };

      const payload = { ...data, fullAddress };

      const res = await server.post("/api/bloodDonationReq/create", payload);

      if (res.data.success) {
        reset();
        Swal.fire({
          icon: "success",
          title: "Request Created!",
          text: "Your blood donation request was created successfully.",
          confirmButtonColor: "#dc2626",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: res.data.message || "Something went wrong!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-2 hover:bg-gray-100 cursor-pointer"
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <IconDroplet className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Create Blood Donation Request
              </h1>
              <p className="text-sm text-gray-600">
                Fill the required information carefully
              </p>
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
          <IconAlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-900">
            Provide correct hospital & contact information for better response.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Recipient Information */}
            <Card>
              <CardHeader className="border-b bg-gray-50 py-3">
                <CardTitle className="text-base flex items-center gap-1">
                  <IconUser className="h-4 w-4 text-red-600" />
                  Recipient Information
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormInput
                    id="recipientName"
                    label="Recipient Name"
                    icon={IconUser}
                    placeholder="Full name"
                    register={register}
                    error={errors.recipientName}
                    validation={{
                      required: "Required",
                    }}
                  />

                  <FormInput
                    id="recipientPhone"
                    label="Phone"
                    icon={IconPhone}
                    placeholder="01XXXXXXXXX"
                    register={register}
                    error={errors.recipientPhone}
                    validation={{
                      required: "Required",
                      pattern: {
                        value: /^01[0-9]{9}$/,
                        message: "Invalid number",
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Blood Requirements */}
            <Card>
              <CardHeader className="border-b bg-gray-50 py-3">
                <CardTitle className="text-base flex items-center gap-1">
                  <IconDroplet className="h-4 w-4 text-red-600" />
                  Blood Requirements
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Blood Group */}
                  <div>
                    <label className="text-sm mb-1 block">Blood Group *</label>
                    <select
                      {...register("bloodGroup", { required: "Required" })}
                      className="w-full p-2 border border-gray-300 text-sm"
                    >
                      <option value="">Choose</option>
                      {bloodGroups.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    {errors.bloodGroup && (
                      <p className="text-xs text-red-500">
                        {errors.bloodGroup.message}
                      </p>
                    )}
                  </div>

                  <FormInput
                    id="recipientLocation"
                    label="Recipient Location"
                    icon={IconMapPin}
                    placeholder="e.g., Dhaka"
                    register={register}
                    error={errors.recipientLocation}
                    validation={{ required: "Required" }}
                  />

                  <FormInput
                    id="donationDate"
                    label="Donation Date"
                    icon={IconCalendar}
                    type="date"
                    register={register}
                    error={errors.donationDate}
                    validation={{ required: "Required" }}
                  />

                  <FormInput
                    id="donationTime"
                    label="Donation Time"
                    icon={IconClock}
                    type="time"
                    register={register}
                    error={errors.donationTime}
                    validation={{ required: "Required" }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Hospital Details */}
            <Card>
              <CardHeader className="border-b bg-gray-50 py-3">
                <CardTitle className="text-base flex items-center gap-1">
                  <IconBuildingHospital className="h-4 w-4 text-red-600" />
                  Hospital Details
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <FormInput
                  id="hospitalName"
                  label="Hospital Name"
                  icon={IconBuildingHospital}
                  placeholder="e.g., Dhaka Medical"
                  register={register}
                  error={errors.hospitalName}
                  validation={{ required: "Required" }}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm mb-1 block">District *</label>
                    <select
                      {...register("district", { required: "Required" })}
                      onChange={handleDistrictChange}
                      className="w-full p-2 border border-gray-300 text-sm"
                    >
                      <option value="">Select District</option>
                      {districtData.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    {errors.district && (
                      <p className="text-xs text-red-500">
                        {errors.district.message}
                      </p>
                    )}
                  </div>
                  {/* Upazila */}
                  <div>
                    <label className="block mb-1 text-sm">Upazila *</label>
                    <select
                      {...register("upazila", { required: "Required" })}
                      className="w-full p-2 border border-gray-300"
                    >
                      <option value="">Select Upazila</option>
                      {upazilas.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                    {errors.upazila && (
                      <p className="text-xs text-red-500">
                        {errors.upazila.message}
                      </p>
                    )}
                  </div>
                </div>

                <FormInput
                  id="streetAddress"
                  label="Street Address"
                  icon={IconMapPin}
                  placeholder="House, Road, Block..."
                  register={register}
                  error={errors.streetAddress}
                  validation={{ required: "Required" }}
                />
              </CardContent>
            </Card>

            {/* Additional Message */}
            <Card>
              <CardHeader className="border-b bg-gray-50 py-3">
                <CardTitle className="text-base flex items-center gap-1">
                  <IconMessage className="h-4 w-4 text-red-600" />
                  Additional Message (Optional)
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4">
                <textarea
                  {...register("additionalMessage")}
                  className="w-full border border-gray-300 p-2 text-sm min-h-20"
                  placeholder="Write something if needed..."
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Processing..." : "Create Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
