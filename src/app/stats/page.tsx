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
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-4xl"
        >
          🔥
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="md:ml-20 lg:ml-56">
        {/* Header */}
        <div className="gradient-header text-white px-4 pt-6 pb-8 -mb-4 rounded-b-3xl shadow-lg shadow-forest-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="max-w-2xl mx-auto flex items-center gap-3 relative z-10">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 text-white md:hidden"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Stats</h1>
              <p className="text-sm text-white/60">Your habit overview</p>
            </div>
          </div>
        </div>

        <main className="max-w-2xl mx-auto px-4 pt-6 pb-4">
          {/* Overall stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: Target, color: "text-forest-500", bg: "from-forest-50 to-forest-100/30", label: "Active Habits", value: overallStats.totalHabits, delay: 0 },
              { icon: TrendingUp, color: "text-forest-500", bg: "from-forest-50 to-forest-100/30", label: "Avg Rate (30d)", value: `${overallStats.avgCompletionRate}%`, delay: 0.05 },
              { icon: Flame, color: "text-flame-500", bg: "from-orange-50 to-flame-100/30", label: "Best Active Streak", value: overallStats.longestStreak, delay: 0.1 },
              { icon: Calendar, color: "text-earth-500", bg: "from-earth-50 to-earth-100/30", label: "Total Completions", value: overallStats.totalCompletions, delay: 0.15 },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay }}
                className={`bg-gradient-to-br ${stat.bg} rounded-2xl border border-white/60 p-4 shadow-md shadow-earth-200/20`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={16} className={stat.color} />
                  <span className="text-[11px] font-medium text-earth-400">
                    {stat.label}
                  </span>
                </div>
                <div className="text-2xl font-bold text-earth-800">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sort tabs */}
          {habitsWithStats.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                <span className="text-xs text-earth-400 mr-1 flex-shrink-0">Sort:</span>
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
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                      sortBy === option.key
                        ? "gradient-forest text-white shadow-sm shadow-forest-600/20"
                        : "bg-white/80 text-earth-500 border border-earth-100 hover:border-earth-200"
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
                      className="flex items-center gap-3 p-3 bg-white/90 backdrop-blur-sm rounded-2xl border border-earth-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: habit.color + "18" }}
                      >
                        <span className="text-base">{habit.category.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-earth-800 truncate">
                          {habit.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex-1 h-2 bg-earth-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${habit.color}88, ${habit.color})`,
                              }}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${habit.completionRate}%`,
                              }}
                              transition={{ delay: i * 0.03 + 0.2 }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-earth-400 tabular-nums w-8">
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
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-earth-400">
                No habits yet. Create one to see your stats!
              </p>
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
