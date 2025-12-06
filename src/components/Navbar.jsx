"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 lg:px-0 ">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-red-500 flex items-center gap-2"
          >
            <span className="text-2xl">
              <Image
                src={"/bloodlinkLogo.webp"}
                alt="blood logo "
                height={30}
                width={30}
              />
            </span>
            BloodLink BD
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/donation-requests"
              className="text-gray-600 hover:text-red-500 px-3 py-2"
            >
              Donation Requests
            </Link>
            <Link
              href="/search"
              className="text-gray-600 hover:text-red-500 px-3 py-2"
            >
              Search Donors
            </Link>
            <Link
              href="/login"
              className="bg-red-500 text-white px-4 py-2 hover:bg-red-600"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <Link
              href="/donation-requests"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              Donation Requests
            </Link>
            <Link
              href="/search"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              Search Donors
            </Link>
            <Link
              href="/login"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
