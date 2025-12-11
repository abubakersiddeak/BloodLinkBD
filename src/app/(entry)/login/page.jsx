"use client";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Lock, Heart } from "lucide-react";
import FormInput from "@/components/FormInput";
import server from "@/lib/api";
import Swal from "sweetalert2";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);

        // Show logging in alert
        Swal.fire({
          title: "Logging in...",
          text: "Please wait while we verify your credentials",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const loginData = {
          email: data.email,
          password: data.password,
          rememberMe: rememberMe,
        };

        console.log("Login Data:", loginData);

        // API call
        const res = await server.post("api/auth/login", loginData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Server Response:", res.data);

        // Reset form
        reset();
        setShowPassword(false);

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          html: `
            <p class="text-gray-600">Welcome back to our blood donation community!</p>
            <p class="text-sm text-gray-500 mt-2">Redirecting to your dashboard...</p>
          `,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          willClose: () => {
            // Redirect to dashboard or home page
            window.location.href = "/"; // Change this to your dashboard route
          },
        });
      } catch (error) {
        console.error("Login Error:", error);

        // Determine error message
        let errorMessage = "Gmail or Password not valid.";
        let errorTitle = "Login Failed";

        if (error.response) {
          // Server responded with error
          if (error.response.status === 401) {
            errorTitle = "Invalid Credentials";
            errorMessage = "The email or password you entered is incorrect.";
          } else if (error.response.status === 404) {
            errorTitle = "Account Not Found";
            errorMessage = "No account found with this email address.";
          } else if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.request) {
          // Network error
          errorTitle = "Connection Error";
          errorMessage =
            "Unable to connect to the server. Please check your internet connection.";
        }

        // Show error message
        Swal.fire({
          icon: "error",
          title: errorTitle,
          text: errorMessage,
          confirmButtonColor: "#dc2626",
          footer:
            '<a href="/registerDonor" class="text-red-600 hover:underline">Don\'t have an account? Register here</a>',
        });
      } finally {
        setLoading(false);
      }
    },
    [reset, rememberMe]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-22">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-200 p-5 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 mb-3">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 text-sm mt-1">
                Login to your donor account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-5">
              <div className="space-y-4">
                {/* Email */}
                <FormInput
                  id="email"
                  label="Email Address"
                  icon={Mail}
                  error={errors.email}
                  register={register}
                  type="email"
                  placeholder="Enter your email"
                  validation={{
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please enter a valid email",
                    },
                  }}
                />

                {/* Password */}
                <div className="md:col-span-2">
                  <FormInput
                    id="password"
                    label="Password"
                    icon={Lock}
                    error={errors.password}
                    register={register}
                    placeholder="Enter your password"
                    validation={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    }}
                    showPasswordToggle={true}
                    showPassword={showPassword}
                    onTogglePassword={togglePassword}
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                {/* <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      Swal.fire({
                        title: "Forgot Password?",
                        html: `
                          <p class="text-gray-600 mb-4">Enter your email address and we'll send you instructions to reset your password.</p>
                          <input
                            type="email"
                            id="reset-email"
                            class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter your email"
                          />
                        `,
                        showCancelButton: true,
                        confirmButtonText: "Send Reset Link",
                        confirmButtonColor: "#dc2626",
                        cancelButtonColor: "#6b7280",
                        preConfirm: () => {
                          const emailInput =
                            document.getElementById("reset-email");
                          const email = emailInput ? emailInput.value : "";
                          if (!email) {
                            Swal.showValidationMessage(
                              "Please enter your email"
                            );
                            return false;
                          }
                          if (!/\S+@\S+\.\S+/.test(email)) {
                            Swal.showValidationMessage(
                              "Please enter a valid email"
                            );
                            return false;
                          }
                          return email;
                        },
                      }).then((result) => {
                        if (result.isConfirmed) {
                          // Here you would make an API call to send reset email
                          Swal.fire({
                            icon: "success",
                            title: "Email Sent!",
                            text: "If an account exists with this email, you will receive password reset instructions.",
                            confirmButtonColor: "#dc2626",
                          });
                        }
                      });
                    }}
                    className="text-sm text-red-600 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div> */}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-2.5 px-4 font-medium hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-sm mt-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      <span>Login</span>
                    </>
                  )}
                </button>
              </div>

              {/* Register Link */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/registerDonor"
                    className="text-red-600 font-medium hover:underline cursor-pointer"
                  >
                    Register here
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-xs">
              By logging in, you agree to our{" "}
              <a
                href="/terms"
                className="text-red-600 hover:underline cursor-pointer"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-red-600 hover:underline cursor-pointer"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
