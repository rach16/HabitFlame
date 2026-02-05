"use client";

import { useState, useEffect, useCallback } from "react";
import { Habit, HabitCompletion, HabitWithStats } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { generateId, formatDate } from "@/lib/utils";
import {
  calculateCurrentStreak,
  calculateBestStreak,
  calculateCompletionRate,
  isCompletedToday,
} from "./useStreaks";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or unavailable
  }
}

export function useHabitStore() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setHabits(loadFromStorage<Habit[]>(STORAGE_KEYS.HABITS, []));
    setCompletions(
      loadFromStorage<HabitCompletion[]>(STORAGE_KEYS.COMPLETIONS, [])
    );
    setIsLoaded(true);
  }, []);

  // Persist habits
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.HABITS, habits);
    }
  }, [habits, isLoaded]);

  // Persist completions
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.COMPLETIONS, completions);
    }
  }, [completions, isLoaded]);

  const addHabit = useCallback(
    (habit: Omit<Habit, "id" | "createdAt" | "archived">) => {
      const newHabit: Habit = {
        ...habit,
        id: generateId(),
        createdAt: new Date().toISOString(),
        archived: false,
      };
      setHabits((prev) => [...prev, newHabit]);
      return newHabit;
    },
    []
  );

  const editHabit = useCallback(
    (id: string, updates: Partial<Omit<Habit, "id" | "createdAt">>) => {
      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
      );
    },
    []
  );

  const deleteHabit = useCallback(
    (id: string) => {
      setHabits((prev) => prev.filter((h) => h.id !== id));
      setCompletions((prev) => prev.filter((c) => c.habitId !== id));
    },
    []
  );

  const archiveHabit = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, archived: true } : h))
    );
  }, []);

  const toggleCompletion = useCallback(
    (habitId: string, date?: string) => {
      const targetDate = date || formatDate(new Date());
      const existing = completions.find(
        (c) => c.habitId === habitId && c.date === targetDate
      );

      if (existing) {
        setCompletions((prev) =>
          prev.filter(
            (c) => !(c.habitId === habitId && c.date === targetDate)
          )
        );
        return false; // uncompleted
      } else {
        setCompletions((prev) => [
          ...prev,
          {
            habitId,
            date: targetDate,
            completedAt: new Date().toISOString(),
          },
        ]);
        return true; // completed
      }
    },
    [completions]
  );

  const getHabitStats = useCallback(
    (habitId: string): HabitWithStats | null => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return null;

      return {
        ...habit,
        currentStreak: calculateCurrentStreak(habitId, completions),
        bestStreak: calculateBestStreak(habitId, completions),
        totalCompletions: completions.filter((c) => c.habitId === habitId)
          .length,
        completedToday: isCompletedToday(habitId, completions),
        completionRate: calculateCompletionRate(habitId, completions),
      };
    },
    [habits, completions]
  );

  const getAllHabitsWithStats = useCallback((): HabitWithStats[] => {
    return habits
      .filter((h) => !h.archived)
      .map((habit) => ({
        ...habit,
        currentStreak: calculateCurrentStreak(habit.id, completions),
        bestStreak: calculateBestStreak(habit.id, completions),
        totalCompletions: completions.filter((c) => c.habitId === habit.id)
          .length,
        completedToday: isCompletedToday(habit.id, completions),
        completionRate: calculateCompletionRate(habit.id, completions),
      }));
  }, [habits, completions]);

  const getCompletionsForHabit = useCallback(
    (habitId: string): HabitCompletion[] => {
      return completions.filter((c) => c.habitId === habitId);
    },
    [completions]
  );

  return {
    habits: habits.filter((h) => !h.archived),
    completions,
    isLoaded,
    addHabit,
    editHabit,
    deleteHabit,
    archiveHabit,
    toggleCompletion,
    getHabitStats,
    getAllHabitsWithStats,
    getCompletionsForHabit,
  };
}
