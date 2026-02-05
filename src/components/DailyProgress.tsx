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
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-14 h-14">
        {/* Glow effect when complete */}
        {percentage === 100 && (
          <motion.div
            className="absolute inset-0 rounded-full bg-yellow-300/20 blur-md"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 52 52">
          {/* Track */}
          <circle
            cx="26"
            cy="26"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="4"
          />
          {/* Progress */}
          <motion.circle
            cx="26"
            cy="26"
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">
            {completed}/{total}
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">
          {completed === total && total > 0
            ? "All done! 🎉"
            : `${total - completed} left`}
        </p>
        <p className="text-[10px] text-white/50">today&apos;s habits</p>
      </div>
    </div>
  );
}
