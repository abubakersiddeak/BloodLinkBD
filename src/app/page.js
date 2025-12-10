"use client";
import Navbar from "@/components/Navbar";
import Hero from "../components/Hero";
import Footer from "@/components/Footer";
import WhyDonateBlood from "@/components/WhyDonateBlood";
import DonationProcess from "@/components/DonationProcess";
import useAuth from "@/hooks/useAuth";
import ShowDonationReq from "@/components/ShowDonationReq";
import Contact from "@/components/Contact";

export default function Home() {
  const { user } = useAuth();
  console.log("this is from cokie", user);
  return (
    <div>
      <Navbar />
      <Hero />
      <ShowDonationReq />
      <WhyDonateBlood />
      <DonationProcess />
      <Contact />
      <Footer />
    </div>
  );
}
