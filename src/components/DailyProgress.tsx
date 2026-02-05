"use client";

import { motion } from "framer-motion";

interface DailyProgressProps {
  completed: number;
  total: number;
}

export default function DailyProgress({
  completed,
  total,
}: DailyProgressProps) {
  const percentage = total === 0 ? 0 : (completed / total) * 100;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="#f0e8dc"
            strokeWidth="4"
          />
          <motion.circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="#3d8b3d"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-earth-700">
            {completed}/{total}
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-earth-700">
          {completed === total && total > 0
            ? "All done! 🎉"
            : `${total - completed} left`}
        </p>
        <p className="text-xs text-earth-400">today&apos;s habits</p>
      </div>
    </div>
  );
}
