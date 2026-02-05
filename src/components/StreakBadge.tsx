"use client";

import { motion, AnimatePresence } from "framer-motion";
import FlameIcon from "./FlameIcon";
import { getStreakTier, STREAK_TIER_CONFIG } from "@/lib/constants";

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function StreakBadge({
  streak,
  size = "md",
  showLabel = false,
}: StreakBadgeProps) {
  const tier = getStreakTier(streak);
  const config = STREAK_TIER_CONFIG[tier];

  const sizeMap = {
    sm: { icon: 16, text: "text-xs", gap: "gap-0.5" },
    md: { icon: 20, text: "text-sm", gap: "gap-1" },
    lg: { icon: 28, text: "text-base", gap: "gap-1.5" },
  };

  const s = sizeMap[size];

  return (
    <div className={`flex items-center ${s.gap}`}>
      <FlameIcon streak={streak} size={s.icon} />
      <AnimatePresence mode="popLayout">
        <motion.span
          key={streak}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          className={`${s.text} font-semibold tabular-nums`}
          style={{ color: tier === "none" ? "#9ca3af" : config.color }}
        >
          {streak}
        </motion.span>
      </AnimatePresence>
      {showLabel && (
        <span className={`${s.text} text-earth-400`}>{config.label}</span>
      )}
    </div>
  );
}
