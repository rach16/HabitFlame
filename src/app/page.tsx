"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useHabitStore } from "@/hooks/useHabitStore";
import { formatDisplayDate } from "@/lib/utils";
import HabitCard from "@/components/HabitCard";
import BottomNav from "@/components/BottomNav";
import EmptyState from "@/components/EmptyState";
import DailyProgress from "@/components/DailyProgress";

export default function HomePage() {
  const { getAllHabitsWithStats, toggleCompletion, isLoaded } = useHabitStore();
  const [habitsWithStats, setHabitsWithStats] = useState(getAllHabitsWithStats());

  useEffect(() => {
    setHabitsWithStats(getAllHabitsWithStats());
  }, [getAllHabitsWithStats]);

  const today = new Date();
  const completedCount = habitsWithStats.filter((h) => h.completedToday).length;
  const totalCount = habitsWithStats.length;

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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-earth-800">Today</h1>
              <p className="text-sm text-earth-400">
                {formatDisplayDate(today)}
              </p>
            </div>
            {totalCount > 0 && (
              <DailyProgress completed={completedCount} total={totalCount} />
            )}
          </div>

          {/* Habit list */}
          {totalCount === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {habitsWithStats.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
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
          )}
        </main>

        {/* FAB for mobile */}
        <motion.div
          className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/add"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-forest-500 text-white shadow-lg hover:bg-forest-600 transition-colors"
          >
            <Plus size={24} />
          </Link>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
