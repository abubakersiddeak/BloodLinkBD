"use client";
import { useForm } from "react-hook-form";
import { useState, useRef, useCallback, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  User,
  Mail,
  Phone,
  Droplets,
  MapPin,
  Lock,
  Camera,
  Heart,
  X,
} from "lucide-react";
import Image from "next/image";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import server from "@/lib/api";
import axios from "axios";
import Swal from "sweetalert2";

// Constants moved outside component to prevent recreation
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DISTRICTS_WITH_UPAZILAS = {
  Dhaka: [
    "Dhamrai",
    "Dohar",
    "Keraniganj",
    "Nawabganj",
    "Savar",
    "Tejgaon",
    "Gulshan",
    "Mirpur",
    "Mohammadpur",
    "Uttara",
  ],
  Chittagong: [
    "Anwara",
    "Banshkhali",
    "Boalkhali",
    "Chandanaish",
    "Fatikchhari",
    "Hathazari",
    "Lohagara",
    "Mirsharai",
    "Patiya",
    "Rangunia",
  ],
  Rajshahi: [
    "Bagha",
    "Bagmara",
    "Charghat",
    "Durgapur",
    "Godagari",
    "Mohanpur",
    "Paba",
    "Puthia",
    "Tanore",
  ],
  Khulna: [
    "Batiaghata",
    "Dacope",
    "Daulatpur",
    "Dighalia",
    "Dumuria",
    "Khalishpur",
    "Khan Jahan Ali",
    "Koyra",
    "Paikgachha",
    "Rupsa",
  ],
  Sylhet: [
    "Balaganj",
    "Beanibazar",
    "Bishwanath",
    "Companiganj",
    "Fenchuganj",
    "Golapganj",
    "Gowainghat",
    "Jaintiapur",
    "Kanaighat",
    "Zakiganj",
  ],
  Barishal: [
    "Agailjhara",
    "Babuganj",
    "Bakerganj",
    "Banaripara",
    "Gaurnadi",
    "Hizla",
    "Mehendiganj",
    "Muladi",
    "Wazirpur",
  ],
  Rangpur: [
    "Badarganj",
    "Gangachara",
    "Kaunia",
    "Mithapukur",
    "Pirgachha",
    "Pirganj",
    "Rangpur Sadar",
    "Taraganj",
  ],
  Mymensingh: [
    "Bhaluka",
    "Dhobaura",
    "Fulbaria",
    "Gaffargaon",
    "Gauripur",
    "Haluaghat",
    "Ishwarganj",
    "Muktagachha",
    "Mymensingh Sadar",
    "Nandail",
  ],
};

const DISTRICTS = Object.keys(DISTRICTS_WITH_UPAZILAS);

// Avatar Upload Component
const AvatarUpload = ({
  previewImage,
  onImageChange,
  onRemove,
  error,
  fileInputRef,
}) => {
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    },
    [fileInputRef]
  );

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Clickable Avatar Area */}
        <div
          role="button"
          tabIndex={0}
          className={`w-24 h-24 border-2 ${
            error ? "border-red-500" : "border-gray-300"
          } overflow-hidden bg-gray-100 cursor-pointer hover:border-red-500 hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          aria-label="Click to upload profile picture"
        >
          {previewImage ? (
            <Image
              src={previewImage}
              alt="Preview"
              height={96}
              width={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <User className="w-8 h-8" />
              <span className="text-xs mt-1">Click to upload</span>
            </div>
          )}
        </div>

        {/* Camera Button */}
        <button
          type="button"
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-600 flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={handleClick}
          aria-label="Upload photo"
        >
          <Camera className="w-4 h-4 text-white" />
        </button>

        {/* Remove Button */}
        {previewImage && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-1 -right-1 w-6 h-6 bg-gray-800 flex items-center justify-center text-white hover:bg-gray-900 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Remove photo"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        id="avatar"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={onImageChange}
      />

      {error && <p className="mt-2 text-red-500 text-xs">{error}</p>}
      <p className="text-gray-500 text-xs mt-2">
        Click avatar or camera icon to upload (Optional)
      </p>
      <p className="text-gray-400 text-xs">Max 5MB (JPG, PNG, GIF, WebP)</p>
    </div>
  );
};

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      bloodGroup: "",
      district: "",
      upazila: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarError, setAvatarError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  const selectedDistrict = watch("district");

  const upazilaOptions = useMemo(() => {
    return selectedDistrict
      ? DISTRICTS_WITH_UPAZILAS[selectedDistrict] || []
      : [];
  }, [selectedDistrict]);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setAvatarError("Please upload a valid image (JPG, PNG, GIF, WebP)");
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Please upload a valid image (JPG, PNG, GIF, WebP)",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("File size should be less than 5MB");
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "File size should be less than 5MB",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    // Clear any previous errors
    setAvatarError(null);

    // Store the file
    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const removeImage = useCallback(() => {
    setPreviewImage(null);
    setAvatarFile(null);
    setAvatarError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);

        let imageUrl = null;

        // Only upload image if user has selected one
        if (avatarFile) {
          try {
            // Show uploading image alert
            Swal.fire({
              title: "Uploading Image...",
              text: "Please wait while we upload your profile picture",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });

            const imageFormData = new FormData();
            imageFormData.append("image", avatarFile);

            const imageBBapiUrl = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_HOST_KEY}`;
            const imgbbRes = await axios.post(imageBBapiUrl, imageFormData);

            // Check if upload was successful
            if (!imgbbRes.data.success) {
              setAvatarError("Failed to upload image. Please try again.");
              Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "Failed to upload image. Please try again.",
                confirmButtonColor: "#dc2626",
              });
              setLoading(false);
              return;
            }

            imageUrl = imgbbRes.data.data.display_url;
            Swal.close(); // Close the loading alert
          } catch (imageError) {
            console.error("Image upload error:", imageError);
            setAvatarError("Failed to upload image. Please try again.");
            Swal.fire({
              icon: "error",
              title: "Upload Error",
              text: "Failed to upload image. Please try again.",
              confirmButtonColor: "#dc2626",
            });
            setLoading(false);
            return;
          }
        }

        // Show registering alert
        Swal.fire({
          title: "Registering...",
          text: "Please wait while we create your account",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Send JSON data to server (with or without avatar)
        const userData = {
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          bloodGroup: data.bloodGroup,
          district: data.district,
          upazila: data.upazila,
          password: data.password,
          ...(imageUrl && { avatar: imageUrl }), // Only include avatar if it exists
        };

        console.log("Sending to server:", userData);

        // API call - sending JSON
        const res = await server.post("api/auth/signup", userData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Server Response:", res.data);

        // Success - reset form
        reset();
        setPreviewImage(null);
        setAvatarFile(null);
        setAvatarError(null);
        setShowPassword(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          html: `
            <p class="text-gray-600">Welcome to our blood donation community!</p>
            <p class="text-sm text-gray-500 mt-2">You can now login with your credentials.</p>
          `,
          confirmButtonText: "Go to Home",
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to login page
            window.location.href = "/";
          }
        });
      } catch (error) {
        console.error("Error:", error);

        // Show error message
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text:
            error.response?.data?.message ||
            "Registration failed. Please try again.",
          confirmButtonColor: "#dc2626",
        });
      } finally {
        setLoading(false);
      }
    },
    [reset, avatarFile]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-22">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-200 p-5 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 mb-3">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Donor Registration
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Join our community and help save lives
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-5">
              {/* Avatar Upload */}
              <div className="mb-6">
                <AvatarUpload
                  previewImage={previewImage}
                  onImageChange={handleImageChange}
                  onRemove={removeImage}
                  error={avatarError}
                  fileInputRef={fileInputRef}
                />
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <FormInput
                  id="fullName"
                  label="Full Name"
                  icon={User}
                  error={errors.fullName}
                  register={register}
                  placeholder="Enter your full name"
                  validation={{
                    required: "Full name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  }}
                />

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

                {/* Phone */}
                <FormInput
                  id="phone"
                  label="Phone Number"
                  icon={Phone}
                  error={errors.phone}
                  register={register}
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  validation={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{11}$/,
                      message: "Enter valid 11-digit number",
                    },
                  }}
                />

                {/* Blood Group */}
                <FormSelect
                  id="bloodGroup"
                  label="Blood Group"
                  icon={Droplets}
                  error={errors.bloodGroup}
                  register={register}
                  options={BLOOD_GROUPS}
                  placeholder="Select blood group"
                  validation={{ required: "Blood group is required" }}
                />

                {/* District */}
                <FormSelect
                  id="district"
                  label="District"
                  icon={MapPin}
                  error={errors.district}
                  register={register}
                  options={DISTRICTS}
                  placeholder="Select district"
                  validation={{ required: "District is required" }}
                />

                {/* Upazila */}
                <FormSelect
                  id="upazila"
                  label="Upazila"
                  icon={MapPin}
                  error={errors.upazila}
                  register={register}
                  options={upazilaOptions}
                  placeholder={
                    selectedDistrict
                      ? "Select upazila"
                      : "Select district first"
                  }
                  validation={{ required: "Upazila is required" }}
                  disabled={!selectedDistrict}
                />

                {/* Password - Full Width with Show/Hide */}
                <div className="md:col-span-2">
                  <FormInput
                    id="password"
                    label="Password"
                    icon={Lock}
                    error={errors.password}
                    register={register}
                    placeholder="Create a password"
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

                {/* Submit Button - Full Width */}
                <div className="md:col-span-2 mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-2.5 px-4 font-medium hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        <span>Register as Donor</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Login Link */}
              <div className="mt-5 pt-4 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm">
                  Already registered?{" "}
                  <a
                    href="/login"
                    className="text-red-600 font-medium hover:underline cursor-pointer"
                  >
                    Login here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
