"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { HabitCompletion } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { format, subDays, startOfWeek, addDays } from "date-fns";

interface ContributionGraphProps {
  completions: HabitCompletion[];
  totalHabits: number;
}

const WEEKS_TO_SHOW = 20;
const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

function getIntensityLevel(count: number, totalHabits: number): number {
  if (count === 0) return 0;
  if (totalHabits === 0) return 1;
  const ratio = count / totalHabits;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

const INTENSITY_COLORS = [
  "bg-earth-100",
  "bg-forest-200",
  "bg-forest-400",
  "bg-forest-600",
  "bg-forest-800",
];

const INTENSITY_RING_COLORS = [
  "",
  "ring-forest-200/50",
  "ring-forest-400/50",
  "ring-forest-600/50",
  "ring-forest-800/50",
];

export default function ContributionGraph({
  completions,
  totalHabits,
}: ContributionGraphProps) {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const completionCounts = new Map<string, number>();
    completions.forEach((c) => {
      completionCounts.set(c.date, (completionCounts.get(c.date) || 0) + 1);
    });

    // Start from the Monday of (WEEKS_TO_SHOW) weeks ago
    const startDate = startOfWeek(
      subDays(today, WEEKS_TO_SHOW * 7),
      { weekStartsOn: 1 }
    );

    const weeksData: { date: Date; dateStr: string; count: number; level: number }[][] = [];
    const months: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;

    let currentDate = startDate;
    let weekIndex = 0;

    while (currentDate <= today) {
      const week: { date: Date; dateStr: string; count: number; level: number }[] = [];
      for (let day = 0; day < 7; day++) {
        const d = addDays(currentDate, day);
        if (d > today) {
          week.push({ date: d, dateStr: "", count: -1, level: -1 }); // future
        } else {
          const dateStr = formatDate(d);
          const count = completionCounts.get(dateStr) || 0;
          week.push({
            date: d,
            dateStr,
            count,
            level: getIntensityLevel(count, totalHabits),
          });
        }

        // Track month labels
        if (d.getMonth() !== lastMonth && d <= today) {
          lastMonth = d.getMonth();
          months.push({
            label: format(d, "MMM"),
            colIndex: weekIndex,
          });
        }
      }
      weeksData.push(week);
      currentDate = addDays(currentDate, 7);
      weekIndex++;
    }

    return { weeks: weeksData, monthLabels: months };
  }, [completions, totalHabits]);

  const totalDaysActive = useMemo(() => {
    const uniqueDates = new Set(completions.map((c) => c.date));
    return uniqueDates.size;
  }, [completions]);

  const todayStr = formatDate(new Date());

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-earth-100 p-5 shadow-md shadow-earth-200/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-earth-400 uppercase tracking-wider">
          Activity
        </h2>
        <div className="flex items-center gap-1.5 text-[10px] text-earth-400">
          <span>{totalDaysActive} active days</span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <div className="inline-flex flex-col gap-0 min-w-fit">
          {/* Month labels */}
          <div className="flex mb-1.5" style={{ paddingLeft: "28px" }}>
            {weeks.map((_, weekIdx) => {
              const monthLabel = monthLabels.find((m) => m.colIndex === weekIdx);
              return (
                <div
                  key={`month-${weekIdx}`}
                  className="text-[10px] text-earth-400 font-medium"
                  style={{ width: "14px", minWidth: "14px" }}
                >
                  {monthLabel ? monthLabel.label : ""}
                </div>
              );
            })}
          </div>

          {/* Grid: day labels + cells */}
          {Array.from({ length: 7 }).map((_, dayIdx) => (
            <div key={`row-${dayIdx}`} className="flex items-center">
              <div
                className="text-[9px] text-earth-300 font-medium pr-1.5 text-right"
                style={{ width: "28px", minWidth: "28px" }}
              >
                {DAY_LABELS[dayIdx]}
              </div>
              <div className="flex gap-[2px]">
                {weeks.map((week, weekIdx) => {
                  const day = week[dayIdx];
                  if (!day || day.count === -1) {
                    return (
                      <div
                        key={`cell-${weekIdx}-${dayIdx}`}
                        className="w-[12px] h-[12px] rounded-[2px] bg-earth-50/50"
                      />
                    );
                  }

                  const isToday = day.dateStr === todayStr;

                  return (
                    <motion.div
                      key={`cell-${weekIdx}-${dayIdx}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (weekIdx * 7 + dayIdx) * 0.002 }}
                      className={`w-[12px] h-[12px] rounded-[2px] transition-colors ${
                        INTENSITY_COLORS[day.level]
                      } ${
                        isToday
                          ? "ring-2 ring-forest-500 ring-offset-1"
                          : day.level > 0
                          ? `ring-1 ${INTENSITY_RING_COLORS[day.level]}`
                          : ""
                      }`}
                      title={`${format(day.date, "MMM d, yyyy")}: ${day.count} completion${day.count !== 1 ? "s" : ""}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[10px] text-earth-300 mr-1">Less</span>
        {INTENSITY_COLORS.map((color, i) => (
          <div
            key={i}
            className={`w-[10px] h-[10px] rounded-[2px] ${color}`}
          />
        ))}
        <span className="text-[10px] text-earth-300 ml-1">More</span>
      </div>
    </div>
  );
}
