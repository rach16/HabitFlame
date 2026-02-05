"use client";

import { HabitCompletion } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  subDays,
  differenceInCalendarDays,
  parseISO,
} from "date-fns";

export function calculateCurrentStreak(
  habitId: string,
  completions: HabitCompletion[]
): number {
  const habitCompletions = completions
    .filter((c) => c.habitId === habitId)
    .map((c) => c.date)
    .sort()
    .reverse();

  if (habitCompletions.length === 0) return 0;

  const uniqueDates = Array.from(new Set(habitCompletions));
  const today = formatDate(new Date());
  const yesterday = formatDate(subDays(new Date(), 1));

  // Determine start point
  let startDate: string;
  if (uniqueDates.includes(today)) {
    startDate = today;
  } else if (uniqueDates.includes(yesterday)) {
    startDate = yesterday;
  } else {
    return 0;
  }

  let streak = 0;
  let checkDate = startDate;

  while (uniqueDates.includes(checkDate)) {
    streak++;
    checkDate = formatDate(subDays(parseISO(checkDate), 1));
  }

  return streak;
}

export function calculateBestStreak(
  habitId: string,
  completions: HabitCompletion[]
): number {
  const habitCompletions = completions
    .filter((c) => c.habitId === habitId)
    .map((c) => c.date);

  const uniqueDates = Array.from(new Set(habitCompletions)).sort();

  if (uniqueDates.length === 0) return 0;

  let bestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = differenceInCalendarDays(
      parseISO(uniqueDates[i]),
      parseISO(uniqueDates[i - 1])
    );
    if (diff === 1) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return bestStreak;
}

export function calculateCompletionRate(
  habitId: string,
  completions: HabitCompletion[],
  days: number = 30
): number {
  const startDate = subDays(new Date(), days - 1);
  const habitCompletions = completions.filter((c) => {
    if (c.habitId !== habitId) return false;
    const date = parseISO(c.date);
    return date >= startDate;
  });
  const uniqueDays = new Set(habitCompletions.map((c) => c.date));
  return Math.round((uniqueDays.size / days) * 100);
}

export function isCompletedToday(
  habitId: string,
  completions: HabitCompletion[]
): boolean {
  const today = formatDate(new Date());
  return completions.some((c) => c.habitId === habitId && c.date === today);
}
