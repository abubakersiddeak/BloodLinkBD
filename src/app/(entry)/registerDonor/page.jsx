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
  ChevronDown,
  X,
} from "lucide-react";

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
        className={`w-full pl-10 pr-3 py-2.5 border ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 focus:border-red-500"
        } focus:outline-none text-sm`}
        placeholder={placeholder}
      />
    </div>
    {error && <p className="mt-1 text-red-500 text-xs">{error.message}</p>}
  </div>
);

// Reusable Select Component
const FormSelect = ({
  id,
  label,
  icon: Icon,
  error,
  register,
  options,
  placeholder,
  validation,
  disabled = false,
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
      <select
        id={id}
        disabled={disabled}
        {...register(id, validation)}
        className={`w-full pl-10 pr-8 py-2.5 border appearance-none ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 focus:border-red-500"
        } focus:outline-none text-sm bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
    </div>
    {error && <p className="mt-1 text-red-500 text-xs">{error.message}</p>}
  </div>
);

// Avatar Upload Component
const AvatarUpload = ({
  previewImage,
  onImageChange,
  onRemove,
  error,
  fileInputRef,
  register,
}) => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <div
        className={`w-24 h-24 border-2 ${
          error ? "border-red-500" : "border-gray-300"
        } overflow-hidden bg-gray-100 cursor-pointer hover:border-red-500 transition-colors`}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <User className="w-8 h-8" />
          </div>
        )}
      </div>

      <button
        type="button"
        className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-600 flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Camera className="w-4 h-4 text-white" />
      </button>

      {previewImage && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-1 -right-1 w-6 h-6 bg-gray-800 flex items-center justify-center text-white hover:bg-gray-900 transition-colors cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>

    <input
      type="file"
      id="avatar"
      ref={fileInputRef}
      {...register("avatar", { required: "Profile picture is required" })}
      className="hidden"
      accept="image/*"
      onChange={onImageChange}
    />
    {error && <p className="mt-2 text-red-500 text-xs">{error.message}</p>}
    <p className="text-gray-500 text-xs mt-2">Upload your photo</p>
  </div>
);

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
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
      avatar: null,
    },
  });

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const selectedDistrict = watch("district");

  const upazilaOptions = useMemo(() => {
    return selectedDistrict
      ? DISTRICTS_WITH_UPAZILAS[selectedDistrict] || []
      : [];
  }, [selectedDistrict]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = useCallback(() => {
    setPreviewImage(null);
    setValue("avatar", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [setValue]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("bloodGroup", data.bloodGroup);
        formData.append("district", data.district);
        formData.append("upazila", data.upazila);
        formData.append("password", data.password);

        if (data.avatar?.[0]) {
          formData.append("avatar", data.avatar[0]);
        }

        console.log("Form Data:", Object.fromEntries(formData));

        // API call here
        // await fetch('/api/register', { method: 'POST', body: formData });

        reset();
        setPreviewImage(null);
        alert("Registration successful!");
      } catch (error) {
        console.error(error);
        alert("Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [reset]
  );

  return (
    <div className="min-h-screen  bg-gray-50">
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
                  error={errors.avatar}
                  fileInputRef={fileInputRef}
                  register={register}
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

                {/* Password - Full Width */}
                <div className="md:col-span-2">
                  <FormInput
                    id="password"
                    label="Password"
                    icon={Lock}
                    error={errors.password}
                    register={register}
                    type="password"
                    placeholder="Create a password"
                    validation={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    }}
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
