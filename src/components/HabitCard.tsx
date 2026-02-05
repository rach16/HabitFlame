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
  index?: number;
}

export default function HabitCard({ habit, onToggle, index = 0 }: HabitCardProps) {
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
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={`relative flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
        habit.completedToday
          ? "bg-gradient-to-r from-forest-50 to-forest-100/50 border border-forest-200 shadow-md shadow-forest-200/30"
          : "bg-white/90 backdrop-blur-sm border border-earth-100 shadow-md shadow-earth-200/20 hover:shadow-lg hover:shadow-earth-200/30 hover:-translate-y-0.5"
      }`}
      style={{ borderLeftWidth: 4, borderLeftColor: habit.color }}
    >
      {/* Category emoji with background */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: habit.color + "18" }}
          >
            <span className="text-lg">{habit.category.emoji}</span>
          </div>
          <div className="min-w-0">
            <h3
              className={`font-semibold truncate ${
                habit.completedToday
                  ? "text-forest-700 line-through decoration-forest-300"
                  : "text-earth-800"
              }`}
            >
              {habit.name}
            </h3>
            <p className="text-xs text-earth-400 mt-0.5">{habit.category.name}</p>
          </div>
        </div>
      </div>

      {/* Streak badge */}
      <StreakBadge streak={habit.currentStreak} size="sm" />

      {/* Completion checkbox */}
      <motion.button
        onClick={handleToggle}
        whileTap={{ scale: 0.8 }}
        animate={justCompleted ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.3 }}
        className={`flex-shrink-0 w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all ${
          habit.completedToday
            ? "border-forest-500 bg-forest-500 text-white shadow-md shadow-forest-500/30"
            : "border-earth-200 bg-earth-50 hover:border-forest-300 hover:bg-forest-50"
        }`}
        aria-label={
          habit.completedToday ? "Mark as incomplete" : "Mark as complete"
        }
      >
        {habit.completedToday && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Check size={20} strokeWidth={3} />
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
}
