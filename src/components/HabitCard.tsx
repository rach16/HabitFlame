"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { HabitWithStats } from "@/lib/types";
import StreakBadge from "./StreakBadge";
import { useState } from "react";

interface HabitCardProps {
  habit: HabitWithStats;
  onToggle: () => boolean;
}

export default function HabitCard({ habit, onToggle }: HabitCardProps) {
  const router = useRouter();
  const [justCompleted, setJustCompleted] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const completed = onToggle();
    if (completed) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 600);
    }
  };

  const handleCardClick = () => {
    router.push(`/habit/${habit.id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={`relative flex items-center gap-3 p-4 rounded-xl bg-white border cursor-pointer transition-colors ${
        habit.completedToday
          ? "border-forest-200 bg-forest-50/50"
          : "border-earth-100 hover:border-earth-200"
      }`}
      style={{ borderLeftWidth: 4, borderLeftColor: habit.color }}
    >
      {/* Category emoji + info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">{habit.category.emoji}</span>
          <div className="min-w-0">
            <h3
              className={`font-medium truncate ${
                habit.completedToday
                  ? "text-earth-400 line-through"
                  : "text-earth-800"
              }`}
            >
              {habit.name}
            </h3>
            <p className="text-xs text-earth-400">{habit.category.name}</p>
          </div>
        </div>
      </div>

      {/* Streak badge */}
      <StreakBadge streak={habit.currentStreak} size="sm" />

      {/* Completion checkbox */}
      <motion.button
        onClick={handleToggle}
        whileTap={{ scale: 0.85 }}
        animate={justCompleted ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
        className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
          habit.completedToday
            ? "border-forest-500 bg-forest-500 text-white"
            : "border-earth-200 hover:border-forest-300"
        }`}
        aria-label={
          habit.completedToday ? "Mark as incomplete" : "Mark as complete"
        }
      >
        {habit.completedToday && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Check size={18} strokeWidth={3} />
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
}
