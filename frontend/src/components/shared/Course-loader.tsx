"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

export default function CourseLoader() {
  // Animation variants for the orbiting dots
  const orbitVariants = {
    animate: (i: number) => ({
      rotate: 360,
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 3,
        ease: "linear",
        delay: i * 0.2,
      },
    }),
  }

  // Animation for the pulsing effect
  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 2,
        ease: "easeInOut",
      },
    },
  }

  // Animation for the text
  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
      },
    },
  }

  // Create an array for the orbiting dots
  const orbitingDots = Array.from({ length: 5 }, (_, i) => i)

  return (
    <div className="flex flex-col items-center justify-center w-full py-12">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Background glow */}
        <motion.div
          className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-slate-100 to-white opacity-50 blur-md"
          variants={pulseVariants}
          animate="animate"
        />

        {/* Main circle */}
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-white border border-slate-200 shadow-sm"
          variants={pulseVariants}
          animate="animate"
          transition={{ delay: 0.1 }}
        />

        {/* Orbiting dots */}
        {orbitingDots.map((i) => (
          <motion.div key={i} className="absolute w-full h-full" custom={i} variants={orbitVariants} animate="animate">
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-b from-slate-300 to-slate-400"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              style={{
                boxShadow: "0 0 10px rgba(203, 213, 225, 0.5)",
              }}
            />
          </motion.div>
        ))}

        {/* Inner ring */}
        <motion.div
          className="absolute w-16 h-16 rounded-full border-2 border-slate-200"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Center icon with glow */}
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="absolute w-10 h-10 rounded-full bg-slate-100 opacity-70 blur-sm"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <BookOpen className="w-7 h-7 text-slate-500 relative z-10" />
        </motion.div>
      </div>

      {/* Text with animated dots */}
      <motion.div
        className="mt-6 text-slate-600 font-medium text-center"
        variants={textVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex items-center">
          <span>Loading courses</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.4 }}
          >
            .
          </motion.span>
        </div>
      </motion.div>
    </div>
  )
}
