import React from "react";

export default function WhyDonateBlood() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Donate Blood?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your blood donation can help patients in need, from cancer treatment
            to traumatic injuries.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🏥",
              title: "Emergency Care",
              description:
                "Blood is essential for surgeries and emergency treatments",
            },
            {
              icon: "💪",
              title: "Cancer Treatment",
              description:
                "Cancer patients may need blood daily during chemotherapy",
            },
            {
              icon: "🚗",
              title: "Accident Victims",
              description:
                "A single car accident victim can require up to 100 units",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 border border-gray-100 hover:border-red-100 transition-colors"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Blood Type Compatibility Chart */}
        <div className="mt-16 p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Blood Type Compatibility Chart
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                type: "A+",
                canGiveTo: "A+, AB+",
                canReceiveFrom: "A+, A-, O+, O-",
              },
              {
                type: "O+",
                canGiveTo: "O+, A+, B+, AB+",
                canReceiveFrom: "O+, O-",
              },
              {
                type: "B+",
                canGiveTo: "B+, AB+",
                canReceiveFrom: "B+, B-, O+, O-",
              },
              { type: "AB+", canGiveTo: "AB+", canReceiveFrom: "All Types" },
            ].map((blood, index) => (
              <div
                key={index}
                className="text-center p-4 border border-gray-100"
              >
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {blood.type}
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    <span className="font-semibold">Can give to:</span>
                    <br />
                    {blood.canGiveTo}
                  </p>
                  <p>
                    <span className="font-semibold">Can receive from:</span>
                    <br />
                    {blood.canReceiveFrom}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Facts */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Did You Know?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-red-600">•</span>
                <span className="text-gray-600">
                  Every 2 seconds someone needs blood in the U.S.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600">•</span>
                <span className="text-gray-600">
                  One donation can save up to three lives
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600">•</span>
                <span className="text-gray-600">
                  Less than 38% of the population is eligible to donate blood
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Requirements to Donate
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-red-600">•</span>
                <span className="text-gray-600">Be at least 17 years old</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600">•</span>
                <span className="text-gray-600">Weigh at least 110 pounds</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600">•</span>
                <span className="text-gray-600">Be in good general health</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
