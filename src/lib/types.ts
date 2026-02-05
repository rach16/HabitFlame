export interface HabitCategory {
  id: string;
  name: string;
  emoji: string;
}

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  color: string;
  icon?: string;
  frequency: "daily" | "weekly";
  createdAt: string;
  archived: boolean;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
  completedAt: string; // ISO datetime
}

export interface HabitWithStats extends Habit {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  completedToday: boolean;
  completionRate: number;
}

export type StreakTier =
  | "none"
  | "spark"
  | "warm"
  | "fire"
  | "blaze"
  | "inferno";
