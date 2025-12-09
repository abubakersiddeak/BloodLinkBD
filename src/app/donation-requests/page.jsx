import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ShowDonationReq from "@/components/ShowDonationReq";
import React from "react";

export default function page() {
  return (
    <div>
      <Navbar />
      <ShowDonationReq />
      <Footer />
    </div>
  );
}
