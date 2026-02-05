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
    <div className="bg-white rounded-xl border border-earth-100 p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
          className="p-2 rounded-lg hover:bg-earth-50 text-earth-500"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-sm font-semibold text-earth-700">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
          className="p-2 rounded-lg hover:bg-earth-50 text-earth-500"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-medium text-earth-400 py-1"
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
              className="aspect-square flex items-center justify-center relative"
            >
              {isToday && (
                <div className="absolute inset-1 rounded-lg border-2 border-forest-300" />
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                  isCompleted
                    ? "text-white font-medium"
                    : "text-earth-500"
                }`}
                style={isCompleted ? { backgroundColor: habitColor } : {}}
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
