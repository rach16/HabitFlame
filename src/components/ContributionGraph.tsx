"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { HabitCompletion } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { format, subDays, startOfWeek, addDays } from "date-fns";

interface ContributionGraphProps {
  completions: HabitCompletion[];
  totalHabits: number;
  weeks?: number;
  accentColor?: string;
}

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

// Opacity levels for custom color mode
const INTENSITY_OPACITIES = [0.08, 0.25, 0.5, 0.75, 1.0];

export default function ContributionGraph({
  completions,
  totalHabits,
  weeks: weeksToShow = 16,
  accentColor,
}: ContributionGraphProps) {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const completionCounts = new Map<string, number>();
    completions.forEach((c) => {
      completionCounts.set(c.date, (completionCounts.get(c.date) || 0) + 1);
    });

    const startDate = startOfWeek(
      subDays(today, weeksToShow * 7),
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
          week.push({ date: d, dateStr: "", count: -1, level: -1 });
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

        if (d.getMonth() !== lastMonth && d <= today) {
          lastMonth = d.getMonth();
          months.push({ label: format(d, "MMM"), colIndex: weekIndex });
        }
      }
      weeksData.push(week);
      currentDate = addDays(currentDate, 7);
      weekIndex++;
    }

    return { weeks: weeksData, monthLabels: months };
  }, [completions, totalHabits, weeksToShow]);

  const todayStr = formatDate(new Date());
  const baseColor = accentColor || "#3d8b3d";

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <div className="inline-flex flex-col gap-0 min-w-fit">
        {/* Month labels */}
        <div className="flex mb-1" style={{ paddingLeft: "24px" }}>
          {weeks.map((_, weekIdx) => {
            const monthLabel = monthLabels.find((m) => m.colIndex === weekIdx);
            return (
              <div
                key={`month-${weekIdx}`}
                className="text-[9px] text-earth-400 font-medium"
                style={{ width: "13px", minWidth: "13px" }}
              >
                {monthLabel ? monthLabel.label : ""}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        {Array.from({ length: 7 }).map((_, dayIdx) => (
          <div key={`row-${dayIdx}`} className="flex items-center">
            <div
              className="text-[8px] text-earth-300 font-medium pr-1 text-right"
              style={{ width: "24px", minWidth: "24px" }}
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
                      className="w-[11px] h-[11px] rounded-[2px]"
                      style={{ backgroundColor: `${baseColor}0a` }}
                    />
                  );
                }

                const isToday = day.dateStr === todayStr;

                return (
                  <motion.div
                    key={`cell-${weekIdx}-${dayIdx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (weekIdx * 7 + dayIdx) * 0.001 }}
                    className={`w-[11px] h-[11px] rounded-[2px] ${
                      isToday ? "ring-1 ring-earth-800 ring-offset-1" : ""
                    }`}
                    style={{
                      backgroundColor: `${baseColor}${Math.round(INTENSITY_OPACITIES[day.level] * 255).toString(16).padStart(2, "0")}`,
                    }}
                    title={`${format(day.date, "MMM d, yyyy")}: ${day.count} completion${day.count !== 1 ? "s" : ""}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
