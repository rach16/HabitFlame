"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { HabitCompletion } from "@/lib/types";
import { formatDate, getDaysInMonth, getFirstDayOfMonth } from "@/lib/utils";

interface CalendarViewProps {
  completions: HabitCompletion[];
  habitColor: string;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarView({
  completions,
  habitColor,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = formatDate(new Date());

  const completionDates = new Set(completions.map((c) => c.date));

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-earth-100 p-5 shadow-md shadow-earth-200/20">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
          className="p-2 rounded-xl hover:bg-earth-50 text-earth-400 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="text-sm font-bold text-earth-700 uppercase tracking-wide">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
          className="p-2 rounded-xl hover:bg-earth-50 text-earth-400 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-bold text-earth-300 py-1 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isCompleted = completionDates.has(dateStr);
          const isToday = dateStr === today;

          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.01 }}
              className="aspect-square flex items-center justify-center relative"
            >
              {isToday && (
                <div className="absolute inset-0.5 rounded-xl border-2 border-forest-400/50" />
              )}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                  isCompleted
                    ? "text-white shadow-sm"
                    : isToday
                    ? "text-forest-600 font-bold"
                    : "text-earth-400"
                }`}
                style={
                  isCompleted
                    ? {
                        background: `linear-gradient(135deg, ${habitColor}, ${habitColor}cc)`,
                        boxShadow: `0 2px 8px ${habitColor}40`,
                      }
                    : {}
                }
              >
                {day}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
