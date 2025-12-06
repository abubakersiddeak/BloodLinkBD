"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const districts = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Sylhet"];

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log(data); // Replace with your API call
      reset();
      // Add success toast/notification here
    } catch (error) {
      console.error(error);
      // Add error toast/notification here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Donor Registration
              </h2>
              <p className="text-gray-600">
                Join our community of blood donors and help save lives
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                  className={`w-full p-3 border ${
                    errors.fullName ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:border-red-500`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please enter a valid email",
                    },
                  })}
                  className={`w-full p-3 border ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:border-red-500`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{11}$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  className={`w-full p-3 border ${
                    errors.phone ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:border-red-500`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="bloodGroup"
                >
                  Blood Group
                </label>
                <select
                  id="bloodGroup"
                  {...register("bloodGroup", {
                    required: "Blood group is required",
                  })}
                  className={`w-full p-3 border ${
                    errors.bloodGroup ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:border-red-500 bg-white`}
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.bloodGroup.message}
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="district">
                  District
                </label>
                <select
                  id="district"
                  {...register("district", {
                    required: "District is required",
                  })}
                  className={`w-full p-3 border ${
                    errors.district ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:border-red-500 bg-white`}
                >
                  <option value="">Select district</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.district.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full p-3 border ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:border-red-500`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="avatar">
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="avatar"
                  {...register("avatar", {
                    required: "Profile picture is required",
                  })}
                  className="w-full p-3 border border-gray-200 focus:outline-none focus:border-red-500"
                  accept="image/*"
                />
                {errors.avatar && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.avatar.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 px-4 hover:bg-red-700 transition-colors disabled:bg-red-300"
              >
                {loading ? "Registering..." : "Register as Donor"}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-gray-600">
              Already registered?{" "}
              <a href="/login" className="text-red-600 hover:underline">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
