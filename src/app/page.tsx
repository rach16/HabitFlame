"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useHabitStore } from "@/hooks/useHabitStore";
import { HabitWithStats } from "@/lib/types";
import { formatDisplayDate } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";
import EmptyState from "@/components/EmptyState";
import DailyProgress from "@/components/DailyProgress";
import ContributionGraph from "@/components/ContributionGraph";

// Distinct colors for each category section
const CATEGORY_COLORS: Record<string, string> = {
  coding: "#6366f1",
  gym: "#ef4444",
  running: "#f59e0b",
  work: "#3b82f6",
  reading: "#8b5cf6",
  cleaning: "#14b8a6",
  health: "#22c55e",
  other: "#6b7280",
};

export default function HomePage() {
  const { getAllHabitsWithStats, toggleCompletion, completions, isLoaded } =
    useHabitStore();
  const [habitsWithStats, setHabitsWithStats] = useState(
    getAllHabitsWithStats()
  );

  useEffect(() => {
    setHabitsWithStats(getAllHabitsWithStats());
  }, [getAllHabitsWithStats]);

  const today = new Date();
  const completedCount = habitsWithStats.filter(
    (h) => h.completedToday
  ).length;
  const totalCount = habitsWithStats.length;
  const allDone = completedCount === totalCount && totalCount > 0;

  // Group habits by category
  const categoryGroups = useMemo(() => {
    const groups = new Map<
      string,
      { emoji: string; name: string; habits: HabitWithStats[]; color: string }
    >();

    habitsWithStats.forEach((habit) => {
      const catId = habit.category.id;
      if (!groups.has(catId)) {
        groups.set(catId, {
          emoji: habit.category.emoji,
          name: habit.category.name,
          habits: [],
          color: CATEGORY_COLORS[catId] || "#6b7280",
        });
      }
      groups.get(catId)!.habits.push(habit);
    });

    return Array.from(groups.entries());
  }, [habitsWithStats]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
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
        {/* Hero header */}
        <div className="gradient-header text-white px-4 pt-8 pb-10 -mb-6 rounded-b-3xl shadow-lg shadow-forest-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-8 w-20 h-20 bg-white/5 rounded-full translate-y-1/2" />

          <div className="max-w-2xl mx-auto relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🔥</span>
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                    HabitFlame
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Today</h1>
                <p className="text-sm text-white/70 mt-0.5">
                  {formatDisplayDate(today)}
                </p>
              </div>
              {totalCount > 0 && (
                <DailyProgress completed={completedCount} total={totalCount} />
              )}
            </div>
            {allDone && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2"
              >
                <Sparkles size={16} className="text-yellow-300" />
                <span className="text-sm font-medium">
                  All habits done today! Keep the flame alive!
                </span>
              </motion.div>
            )}
          </div>
        </div>

        <main className="max-w-2xl mx-auto px-4 pt-8 pb-4">
          {totalCount === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-5">
              {/* Per-category sections */}
              {categoryGroups.map(([catId, group], groupIdx) => {
                const catHabitIds = new Set(group.habits.map((h) => h.id));
                const catCompletions = completions.filter((c) =>
                  catHabitIds.has(c.habitId)
                );
                const catCompleted = group.habits.filter(
                  (h) => h.completedToday
                ).length;

                return (
                  <motion.div
                    key={catId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIdx * 0.08 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl border border-earth-100 shadow-md shadow-earth-200/20 overflow-hidden"
                  >
                    {/* Category header */}
                    <div className="px-4 pt-4 pb-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: group.color + "18" }}
                          >
                            <span className="text-base">{group.emoji}</span>
                          </div>
                          <div>
                            <h2 className="text-sm font-bold text-earth-800">
                              {group.name}
                            </h2>
                            <p className="text-[10px] text-earth-400">
                              {catCompleted}/{group.habits.length} today
                            </p>
                          </div>
                        </div>
                        <div
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            color: group.color,
                            backgroundColor: group.color + "15",
                          }}
                        >
                          {catCompletions.length} total
                        </div>
                      </div>
                    </div>

                    {/* Contribution graph */}
                    <div className="px-3 pb-3">
                      <ContributionGraph
                        completions={catCompletions}
                        totalHabits={group.habits.length}
                        weeks={14}
                        accentColor={group.color}
                      />
                    </div>

                    {/* Habit list */}
                    <div className="border-t border-earth-50 px-3 pb-3 pt-2">
                      <AnimatePresence>
                        {group.habits.map((habit) => (
                          <Link
                            key={habit.id}
                            href={`/habit/${habit.id}`}
                            className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-earth-50/50 transition-colors group"
                          >
                            <div className="flex-1 min-w-0">
                              <span
                                className={`text-sm font-medium truncate block ${
                                  habit.completedToday
                                    ? "text-earth-400 line-through"
                                    : "text-earth-700"
                                }`}
                              >
                                {habit.name}
                              </span>
                            </div>
                            {habit.currentStreak > 0 && (
                              <span className="text-[10px] font-bold text-flame-500 tabular-nums">
                                🔥 {habit.currentStreak}
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleCompletion(habit.id);
                                setTimeout(
                                  () =>
                                    setHabitsWithStats(getAllHabitsWithStats()),
                                  50
                                );
                              }}
                              className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                                habit.completedToday
                                  ? "border-forest-500 bg-forest-500 text-white"
                                  : "border-earth-200 hover:border-forest-300"
                              }`}
                            >
                              {habit.completedToday && (
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>
                            <ChevronRight
                              size={14}
                              className="text-earth-200 group-hover:text-earth-400 transition-colors"
                            />
                          </Link>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>

        {/* FAB */}
        <motion.div
          className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link
            href="/add"
            className="flex items-center justify-center w-14 h-14 rounded-full gradient-forest text-white shadow-xl shadow-forest-700/40 hover:shadow-forest-700/60 transition-shadow"
          >
            <Plus size={26} strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
