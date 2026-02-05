"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useHabitStore } from "@/hooks/useHabitStore";
import { formatDisplayDate } from "@/lib/utils";
import HabitCard from "@/components/HabitCard";
import BottomNav from "@/components/BottomNav";
import EmptyState from "@/components/EmptyState";
import DailyProgress from "@/components/DailyProgress";
import ContributionGraph from "@/components/ContributionGraph";

export default function HomePage() {
  const { getAllHabitsWithStats, toggleCompletion, completions, isLoaded } = useHabitStore();
  const [habitsWithStats, setHabitsWithStats] = useState(getAllHabitsWithStats());

  useEffect(() => {
    setHabitsWithStats(getAllHabitsWithStats());
  }, [getAllHabitsWithStats]);

  const today = new Date();
  const completedCount = habitsWithStats.filter((h) => h.completedToday).length;
  const totalCount = habitsWithStats.length;
  const allDone = completedCount === totalCount && totalCount > 0;

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
        {/* Hero header with gradient */}
        <div className="gradient-header text-white px-4 pt-8 pb-10 -mb-6 rounded-b-3xl shadow-lg shadow-forest-900/20 relative overflow-hidden">
          {/* Decorative circles */}
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
          {/* Contribution graph */}
          {totalCount > 0 && (
            <div className="mb-6">
              <ContributionGraph
                completions={completions}
                totalHabits={totalCount}
              />
            </div>
          )}

          {/* Habit list */}
          {totalCount === 0 ? (
            <EmptyState />
          ) : (
            <>
              <h2 className="text-xs font-bold text-earth-400 uppercase tracking-wider mb-3">
                Today&apos;s Habits
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {habitsWithStats.map((habit, i) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      index={i}
                      onToggle={() => {
                        const result = toggleCompletion(habit.id);
                        setTimeout(
                          () => setHabitsWithStats(getAllHabitsWithStats()),
                          50
                        );
                        return result;
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
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
