import Navbar from "@/components/Navbar";
import Hero from "../components/Hero";
import Footer from "@/components/Footer";
import WhyDonateBlood from "@/components/WhyDonateBlood";
import DonationProcess from "@/components/DonationProcess";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <WhyDonateBlood />
      <DonationProcess />
      <Footer />
    </div>
  );
}
