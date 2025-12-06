"use client";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Lock, Heart, Eye, EyeOff } from "lucide-react";

// Reusable Input Component
const FormInput = ({
  id,
  label,
  icon: Icon,
  error,
  register,
  type = "text",
  placeholder,
  validation,
  rightIcon,
  onRightIconClick,
}) => (
  <div>
    <label className="block text-gray-700 text-sm mb-1" htmlFor={id}>
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon
          className={`w-4 h-4 ${error ? "text-red-400" : "text-gray-400"}`}
        />
      </div>
      <input
        type={type}
        id={id}
        {...register(id, validation)}
        className={`w-full pl-10 ${
          rightIcon ? "pr-10" : "pr-3"
        } py-2.5 border ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 focus:border-red-500"
        } focus:outline-none text-sm`}
        placeholder={placeholder}
      />
      {rightIcon && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          onClick={onRightIconClick}
        >
          {rightIcon}
        </button>
      )}
    </div>
    {error && <p className="mt-1 text-red-500 text-xs">{error.message}</p>}
  </div>
);

const Page = () => {
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

        const loginData = {
          email: data.email,
          password: data.password,
          rememberMe: rememberMe,
        };

        console.log("Login Data:", loginData);

        // API call here
        // const response = await fetch('/api/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(loginData)
        // });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        reset();
        alert("Login successful!");
      } catch (error) {
        console.error(error);
        alert("Login failed. Please try again.");
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
                <FormInput
                  id="password"
                  label="Password"
                  icon={Lock}
                  error={errors.password}
                  register={register}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  validation={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  rightIcon={
                    showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    )
                  }
                  onRightIconClick={togglePassword}
                />

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
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
                  <a
                    href="/forgot-password"
                    className="text-sm text-red-600 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </a>
                </div>

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

              {/* Divider */}
              {/* <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div> */}

              {/* Social Login Buttons */}
              {/* <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer text-sm text-gray-700"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer text-sm text-gray-700"
                >
                  <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div> */}

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
};

export default Page;
