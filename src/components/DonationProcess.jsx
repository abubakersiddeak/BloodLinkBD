import Link from "next/link";
import React from "react";

export default function DonationProcess() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl px-3 lg:px-3 2xl:px-0 2xl:max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple Donation Process
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Donating blood is a simple and straightforward process that takes
            about 30-45 minutes
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Registration",
              description: "Fill out a form with your basic information",
              icon: "📝",
            },
            {
              step: "2",
              title: "Screening",
              description:
                "Quick physical check of temperature, blood pressure, and hemoglobin",
              icon: "🩺",
            },
            {
              step: "3",
              title: "Donation",
              description: "The actual donation takes only 8-10 minutes",
              icon: "💉",
            },
            {
              step: "4",
              title: "Recovery",
              description: "Rest and refresh with provided snacks and drinks",
              icon: "🍪",
            },
          ].map((process, index) => (
            <div key={index} className="bg-white p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-red-600">
                  Step {process.step}
                </span>
                <span className="text-3xl">{process.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {process.title}
              </h3>
              <p className="text-gray-600">{process.description}</p>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Before Donation
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-red-600">✓</span>
                <span className="text-gray-600">Get enough sleep</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-600">✓</span>
                <span className="text-gray-600">Eat a healthy meal</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-600">✓</span>
                <span className="text-gray-600">Drink plenty of water</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-600">✓</span>
                <span className="text-gray-600">Bring ID and donor card</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              After Donation
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-red-600">✓</span>
                <span className="text-gray-600">Rest for 10-15 minutes</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-600">✓</span>
                <span className="text-gray-600">
                  Have snacks and drinks provided
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-600">✓</span>
                <span className="text-gray-600">
                  Avoid heavy lifting for 5 hours
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-600">✓</span>
                <span className="text-gray-600">
                  Keep the bandage on for 4-5 hours
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            href="/register"
            className="inline-block bg-red-600 text-white px-8 py-3 text-lg hover:bg-red-700 transition-colors"
          >
            Schedule Your Donation
          </Link>
        </div>
      </div>
    </section>
  );
}
