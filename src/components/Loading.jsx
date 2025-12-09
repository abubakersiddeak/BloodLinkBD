"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, #DC2626 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Rotating Rings Around Blood Drops */}
        <div className="relative w-48 h-48 mb-8">
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-red-600"
          />

          {/* Middle Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-6 rounded-full border-4 border-gray-100 border-r-red-500"
          />

          {/* Animated Blood Drops in Center */}
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            {[0, 1, 2].map((index) => (
              <motion.svg
                key={index}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.5, 1, 0.5],
                  filter: [
                    "drop-shadow(0 0 0px #DC2626)",
                    "drop-shadow(0 0 8px #DC2626)",
                    "drop-shadow(0 0 0px #DC2626)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                  fill="#DC2626"
                  stroke="#DC2626"
                  strokeWidth="2"
                />
              </motion.svg>
            ))}
          </div>
        </div>

        {/* Text Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl font-bold text-gray-900 tracking-wide">
            Loading
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-red-600"
            >
              ...
            </motion.span>
          </h2>

          {/* Futuristic Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative">
              <motion.div
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute h-full w-1/2 bg-linear-to-r from-transparent via-red-600 to-transparent"
                style={{
                  boxShadow: "0 0 20px rgba(220, 38, 38, 0.5)",
                }}
              />
            </div>
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                  backgroundColor: [
                    "rgba(220, 38, 38, 0.3)",
                    "rgba(220, 38, 38, 1)",
                    "rgba(220, 38, 38, 0.3)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.15,
                }}
                className="w-3 h-3 rounded-full"
                style={{
                  boxShadow: "0 0 10px rgba(220, 38, 38, 0.5)",
                }}
              />
            ))}
          </div>

          <motion.p
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-gray-600 mt-4"
          >
            Please wait a moment
          </motion.p>
        </motion.div>
      </div>

      {/* Corner Accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        className="absolute top-10 left-10 w-20 h-20 border-t-4 border-l-4 border-red-600"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        className="absolute bottom-10 right-10 w-20 h-20 border-b-4 border-r-4 border-red-600"
      />
    </div>
  );
}
