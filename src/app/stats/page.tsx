"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Target, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useHabitStore } from "@/hooks/useHabitStore";
import { HabitWithStats } from "@/lib/types";
import StreakBadge from "@/components/StreakBadge";
import BottomNav from "@/components/BottomNav";

type SortKey = "currentStreak" | "bestStreak" | "completionRate";

export default function StatsPage() {
  const { getAllHabitsWithStats, completions, isLoaded } = useHabitStore();
  const [habitsWithStats, setHabitsWithStats] = useState<HabitWithStats[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("currentStreak");

  useEffect(() => {
    if (isLoaded) {
      setHabitsWithStats(getAllHabitsWithStats());
    }
  }, [isLoaded, getAllHabitsWithStats]);

  const sortedHabits = useMemo(() => {
    return [...habitsWithStats].sort((a, b) => b[sortBy] - a[sortBy]);
  }, [habitsWithStats, sortBy]);

  const overallStats = useMemo(() => {
    if (habitsWithStats.length === 0) {
      return {
        totalHabits: 0,
        avgCompletionRate: 0,
        longestStreak: 0,
        totalCompletions: completions.length,
      };
    }

    const avgRate =
      habitsWithStats.reduce((sum, h) => sum + h.completionRate, 0) /
      habitsWithStats.length;
    const longestStreak = Math.max(
      ...habitsWithStats.map((h) => h.currentStreak),
      0
    );

    return {
      totalHabits: habitsWithStats.length,
      avgCompletionRate: Math.round(avgRate),
      longestStreak,
      totalCompletions: completions.length,
    };
  }, [habitsWithStats, completions]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">🔥</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50">
      <div className="md:ml-20 lg:ml-56">
        <main className="max-w-2xl mx-auto px-4 pt-6 pb-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-lg hover:bg-earth-100 text-earth-500 md:hidden"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-earth-800">Stats</h1>
          </div>

          {/* Overall stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="bg-white rounded-xl border border-earth-100 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-forest-500" />
                <span className="text-xs text-earth-400">Active Habits</span>
              </div>
              <div className="text-2xl font-bold text-earth-800">
                {overallStats.totalHabits}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-xl border border-earth-100 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-forest-500" />
                <span className="text-xs text-earth-400">Avg Rate (30d)</span>
              </div>
              <div className="text-2xl font-bold text-earth-800">
                {overallStats.avgCompletionRate}%
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-earth-100 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Flame size={16} className="text-flame-500" />
                <span className="text-xs text-earth-400">
                  Best Active Streak
                </span>
              </div>
              <div className="text-2xl font-bold text-earth-800">
                {overallStats.longestStreak}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-xl border border-earth-100 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-earth-500" />
                <span className="text-xs text-earth-400">
                  Total Completions
                </span>
              </div>
              <div className="text-2xl font-bold text-earth-800">
                {overallStats.totalCompletions}
              </div>
            </motion.div>
          </div>

          {/* Sort tabs */}
          {habitsWithStats.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-earth-400 mr-1">Sort by:</span>
                {(
                  [
                    { key: "currentStreak", label: "Current Streak" },
                    { key: "bestStreak", label: "Best Streak" },
                    { key: "completionRate", label: "Completion %" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setSortBy(option.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      sortBy === option.key
                        ? "bg-forest-500 text-white"
                        : "bg-white text-earth-500 border border-earth-200 hover:border-earth-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Per-habit list */}
              <div className="space-y-2">
                {sortedHabits.map((habit, i) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={`/habit/${habit.id}`}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-earth-100 hover:border-earth-200 transition-colors"
                    >
                      <span className="text-lg">{habit.category.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-earth-800 truncate">
                          {habit.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-0.5">
                          <div className="flex-1 h-1.5 bg-earth-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-forest-400"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${habit.completionRate}%`,
                              }}
                              transition={{ delay: i * 0.03 + 0.2 }}
                            />
                          </div>
                          <span className="text-[10px] text-earth-400 tabular-nums w-8">
                            {habit.completionRate}%
                          </span>
                        </div>
                      </div>
                      <StreakBadge streak={habit.currentStreak} size="sm" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {habitsWithStats.length === 0 && (
            <div className="text-center py-12 text-earth-400">
              <p>No habits yet. Create one to see your stats!</p>
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
