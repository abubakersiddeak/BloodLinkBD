"use client";
import server from "@/lib/api";
import { useState } from "react";
import {
  Search,
  Droplet,
  MapPin,
  RotateCcw,
  Phone,
  User,
  Calendar,
  XCircle,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Data Definitions (moved outside for cleanliness, but kept here for completeness)
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const districts = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Gazipur",
  "Narayanganj",
  "Tangail",
  "Jamalpur",
  "Sherpur",
  "Netrokona",
];
const upazilas = {
  Dhaka: [
    "Dhanmondi",
    "Gulshan",
    "Uttara",
    "Mirpur",
    "Wari",
    "Tejgaon",
    "Ramna",
    "Lalbagh",
  ],
  Chittagong: [
    "Chittagong Sadar",
    "Hathazari",
    "Rangunia",
    "Sitakunda",
    "Mirsharai",
    "Fatikchhari",
  ],
  Rajshahi: [
    "Rajshahi Sadar",
    "Paba",
    "Durgapur",
    "Mohonpur",
    "Charghat",
    "Puthia",
  ],
  Khulna: [
    "Khulna Sadar",
    "Sonadanga",
    "Khalishpur",
    "Doulatpur",
    "Rupsha",
    "Paikgachha",
  ],
  Barisal: [
    "Barisal Sadar",
    "Bakerganj",
    "Babuganj",
    "Wazirpur",
    "Banaripara",
    "Gournadi",
  ],
  Sylhet: [
    "Sylhet Sadar",
    "Osmani Nagar",
    "Dakshin Surma",
    "Bishwanath",
    "Balaganj",
    "Companiganj",
  ],
  Rangpur: [
    "Rangpur Sadar",
    "Gangachara",
    "Taraganj",
    "Badarganj",
    "Mithapukur",
    "Pirgachha",
  ],
  Mymensingh: [
    "Mymensingh Sadar",
    "Trishal",
    "Bhaluka",
    "Gaffargaon",
    "Gauripur",
    "Haluaghat",
  ],
};

export default function SearchPage() {
  const [formData, setFormData] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset upazila if district changes
      ...(name === "district" && { upazila: "" }),
    }));
  };

  const resetFilters = () => {
    setFormData({
      bloodGroup: "",
      district: "",
      upazila: "",
    });
    setFilteredDonors([]); // Clear results on reset
    setHasSearched(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true); // Indicate that a search has been attempted
    setFilteredDonors([]); // Clear previous results immediately

    try {
      const queryParams = new URLSearchParams();
      if (formData.bloodGroup)
        queryParams.append("bloodGroup", formData.bloodGroup);
      if (formData.district) queryParams.append("district", formData.district);
      if (formData.upazila) queryParams.append("upazila", formData.upazila);
      queryParams.append("limit", "1000"); // Keep the limit for demonstration

      const response = await server.get(
        `/api/user/search-donors?${queryParams}`
      );

      if (response.data.success) {
        setFilteredDonors(response.data.data);
      } else {
        // Handle API success:false case
        setFilteredDonors([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setFilteredDonors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="bg-white min-h-screen py-20 ">
        <div className="max-w-7xl px-4 2xl:px-0 mx-auto">
          {/* --- Header & Search Section --- */}
          <div className="mb-12 space-y-8">
            <div className="border-b border-black/10 pb-6">
              <h2 className="text-2xl md:text-4xl font-bold text-black uppercase tracking-tight">
                Find Blood Donors
              </h2>
              <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">
                Search for potential donors based on location and blood group.
              </p>
            </div>

            {/* Filter Bar/Form */}
            <form
              onSubmit={handleSearch}
              className="bg-gray-50 p-6 border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Blood Group Filter */}
                <div className="relative">
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full h-12 pl-4 pr-10 bg-white border border-gray-300 text-black appearance-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none cursor-pointer font-medium"
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Droplet size={18} />
                  </div>
                </div>

                {/* District Filter */}
                <div className="relative">
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full h-12 pl-4 pr-10 bg-white border border-gray-300 text-black appearance-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none cursor-pointer font-medium"
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                </div>

                {/* Upazila Filter */}
                <div className="relative">
                  <select
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleInputChange}
                    className={`w-full h-12 pl-4 pr-10 bg-white border border-gray-300 text-black appearance-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none cursor-pointer font-medium ${
                      !formData.district ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!formData.district}
                  >
                    <option value="">Select Upazila</option>
                    {formData.district &&
                      upazilas[formData.district]?.map((upazila) => (
                        <option key={upazila} value={upazila}>
                          {upazila}
                        </option>
                      ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 cursor-pointer bg-black text-white hover:bg-red-600 border border-black hover:border-red-600 font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2 rounded-none disabled:bg-gray-400 disabled:border-gray-400"
                >
                  <Search size={18} />{" "}
                  {loading ? "Searching..." : "Search Donors"}
                </button>
              </div>
              {/* Reset Button (placed below for better visibility) */}
              <button
                onClick={resetFilters}
                type="button"
                className="mt-4 text-xs font-bold uppercase text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <RotateCcw size={14} /> Clear Filters
              </button>
            </form>
          </div>

          {/* --- Results Section --- */}
          {hasSearched && (
            <div>
              {loading ? (
                <div className="w-full h-32 flex items-center justify-center border border-gray-200 bg-gray-50">
                  <div className="animate-pulse text-gray-400 font-mono text-sm">
                    LOADING DONORS...
                  </div>
                </div>
              ) : filteredDonors.length === 0 ? (
                <div className="border border-black p-12 text-center bg-gray-50">
                  <XCircle size={32} className="text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold uppercase text-black">
                    No Donors Found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your search criteria or check back later.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-block mt-6 cursor-pointer text-red-600 font-bold hover:underline underline-offset-4"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-black uppercase tracking-tight mb-6 border-b border-black/10 pb-2">
                    Found{" "}
                    <span className="text-red-600">
                      {filteredDonors.length}
                    </span>{" "}
                    Donor{filteredDonors.length !== 1 ? "s" : ""}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
                    {filteredDonors.map((donor) => (
                      <DonorCard key={donor._id} donor={donor} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

// Donor Card Component (styled to match MinimalCard)
function DonorCard({ donor }) {
  const lastDonationDate = donor.lastDonation
    ? new Date(donor.lastDonation).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="relative border border-gray-200 bg-white flex flex-col h-full hover:border-black/50 transition-colors duration-200 shadow-sm hover:shadow-lg">
      <div className="flex border-b border-gray-200">
        {/* Blood Group Badge - Left side, prominent */}
        <div className="bg-red-600 text-white w-20 h-20 flex items-center justify-center text-2xl font-bold shrink-0">
          {donor.bloodGroup}
        </div>

        <div className="flex-1 p-4 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Donor Name
          </span>
          <h3 className="text-lg font-bold text-black leading-tight truncate">
            {donor.name}
          </h3>
        </div>
      </div>

      <div className="p-5 grow space-y-4">
        <div className="space-y-2">
          {/* Phone */}
          {donor.phone && (
            <div className="flex items-start gap-3">
              <Phone size={16} className="mt-0.5 text-gray-400 shrink-0" />
              <a
                href={`tel:${donor.phone}`}
                className="text-sm text-gray-800 line-clamp-1 hover:text-red-600 font-medium"
              >
                {donor.phone}
              </a>
            </div>
          )}

          {/* Address */}
          {donor.address && (
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-600 line-clamp-2">
                {donor.address}
              </span>
            </div>
          )}

          {/* Last Donation */}
          <div className="flex items-start gap-3">
            <Calendar size={16} className="mt-0.5 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-600 font-medium">
              <span className="font-bold text-gray-800">Last Donation:</span>{" "}
              {lastDonationDate}
            </span>
          </div>
        </div>
      </div>

      {/* Footer/Action */}
      <div className="p-4 border-t border-gray-100 mt-auto bg-gray-50">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-black">
          <span>{donor.email}</span>
          <User size={16} />
        </div>
      </div>
    </div>
  );
}
