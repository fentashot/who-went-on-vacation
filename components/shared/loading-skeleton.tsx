"use client";

import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  const shimmer = {
    hidden: { x: "-100%" },
    visible: {
      x: "100%",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear" as const,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="w-full max-w-7xl px-2 mx-auto">
      {/* Profile Skeleton */}
      <div>
        <Skeleton className="max-w-3xl mx-auto col-span-2 bg-zinc-900/40 border-zinc-800/50 backdrop-blur-md overflow-hidden h-116 rounded-2xl " />
      </div>

      {/* Stats and Results Skeleton */}
      <div className="mt-14">
        {/* Title Skeleton */}
        <motion.div
          className="text-center space-y-2 mb-12"
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeIn}
        >
          <div className="h-10 w-96 bg-zinc-800/50 rounded mx-auto overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent "
              animate="visible"
              variants={shimmer}
            />
          </div>
          <div className="h-8 w-80 bg-zinc-800/50 rounded mx-auto overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              initial="hidden"
              animate="visible"
              variants={shimmer}
            />
          </div>
        </motion.div>

        {/* Search and Sort Skeleton */}
        <motion.div
          className="mb-6 flex flex-col sm:flex-row gap-3 lg:px-2"
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeIn}
        >
          <div className="flex-1 h-10 bg-zinc-800/50 rounded-lg overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              initial="hidden"
              animate="visible"
              variants={shimmer}
            />
          </div>
          <div className="flex gap-2">
            <div className="w-28 h-10 bg-zinc-800/50 rounded-lg overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                initial="hidden"
                animate="visible"
                variants={shimmer}
              />
            </div>
            <div className="w-28 h-10 bg-zinc-800/50 rounded-lg overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                initial="hidden"
                animate="visible"
                variants={shimmer}
              />
            </div>
          </div>
        </motion.div>

        {/* Cards Grid Skeleton */}
        <div className="grid lg:px-2 grid-cols-1 lg:grid-cols-2 gap-3">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial="hidden"
              animate="visible"
              custom={3 + i}
              variants={fadeIn}
            >
              <div className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md overflow-hidden rounded-lg h-[124px]">
                <CardContent className="p-6 h-32 relative">
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    initial="hidden"
                    animate="visible"
                    variants={shimmer}
                  />

                  {/* Avatar */}
                  <div className="absolute left-6 top-6 w-16 h-16 rounded-full bg-zinc-800/50" />

                  {/* Content lines */}
                  <div className="absolute left-28 top-6 space-y-2">
                    <div className="h-5 w-32 bg-zinc-800/50 rounded" />
                    <div className="h-4 w-24 bg-zinc-800/50 rounded" />
                    <div className="h-4 w-28 bg-zinc-800/50 rounded" />
                  </div>

                  {/* Badge */}
                  <div className="absolute right-6 top-6 w-20 h-8 bg-zinc-800/50 rounded-full" />
                </CardContent>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
