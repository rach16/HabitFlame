"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { getStreakTier, STREAK_TIER_CONFIG } from "@/lib/constants";
import { StreakTier } from "@/lib/types";

interface FlameIconProps {
  streak: number;
  size?: number;
  animate?: boolean;
  className?: string;
}

export default function FlameIcon({
  streak,
  size = 24,
  animate = true,
  className = "",
}: FlameIconProps) {
  const tier = getStreakTier(streak);
  const config = STREAK_TIER_CONFIG[tier];

  if (tier === "none") {
    return (
      <Flame
        size={size}
        className={`text-gray-300 ${className}`}
        strokeWidth={1.5}
      />
    );
  }

  const ease = "easeInOut" as const;

  const getAnimation = (tier: StreakTier) => {
    if (!animate) return undefined;

    switch (tier) {
      case "spark":
        return undefined;
      case "warm":
        return {
          rotate: [0, 2, -2, 0],
          transition: { duration: 3, repeat: Infinity, ease },
        };
      case "fire":
        return {
          rotate: [-3, 3, -3],
          scale: [1, 1.05, 1],
          transition: { duration: 2, repeat: Infinity, ease },
        };
      case "blaze":
        return {
          rotate: [-4, 4, -4],
          scale: [1, 1.1, 1],
          transition: { duration: 1.5, repeat: Infinity, ease },
        };
      case "inferno":
        return {
          rotate: [-5, 5, -5],
          scale: [1, 1.15, 0.95, 1.1, 1],
          transition: { duration: 1.2, repeat: Infinity, ease },
        };
      default:
        return undefined;
    }
  };

  const glowTiers: StreakTier[] = ["blaze", "inferno"];
  const hasGlow = glowTiers.includes(tier);

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      animate={getAnimation(tier)}
      style={{ transformOrigin: "bottom center" }}
    >
      {hasGlow && (
        <motion.div
          className="absolute inset-0 rounded-full blur-md"
          style={{ backgroundColor: config.color, opacity: 0.4 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <Flame
        size={size * config.scale}
        style={{ color: config.color }}
        strokeWidth={2}
        fill={config.color}
        fillOpacity={0.3}
      />
    </motion.div>
  );
}
