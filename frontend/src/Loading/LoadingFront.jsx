import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black font-sans">
      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <div className="relative w-24 h-24 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-4 border-t-purple-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-8 bg-gradient-to-br from-white to-gray-400 rounded-full shadow-inner"
          />
        </div>

        {/* Text */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white text-xl font-medium tracking-[0.2em] uppercase mb-4"
          >
            Loading Experience
          </motion.h1>

          <div className="flex gap-2 justify-center">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
      </div>
    </div>
  );
}
