import { HabitCategory, StreakTier } from "./types";

export const DEFAULT_CATEGORIES: HabitCategory[] = [
  { id: "health", name: "Health", emoji: "\u{1F4AA}" },
  { id: "learning", name: "Learning", emoji: "\u{1F4DA}" },
  { id: "finance", name: "Finance", emoji: "\u{1F4B0}" },
  { id: "mindfulness", name: "Mindfulness", emoji: "\u{1F9D8}" },
  { id: "productivity", name: "Productivity", emoji: "\u26A1" },
  { id: "social", name: "Social", emoji: "\u{1F465}" },
  { id: "creative", name: "Creative", emoji: "\u{1F3A8}" },
  { id: "other", name: "Other", emoji: "\u2728" },
];

export const PRESET_COLORS = [
  "#5a9e5a",
  "#8b6914",
  "#a8845a",
  "#7cba7c",
  "#c4a882",
  "#3d8b3d",
  "#6b4f10",
  "#2d6b2d",
];

export const STORAGE_KEYS = {
  HABITS: "habitflame_habits",
  COMPLETIONS: "habitflame_completions",
} as const;

export function getStreakTier(streak: number): StreakTier {
  if (streak === 0) return "none";
  if (streak <= 3) return "spark";
  if (streak <= 6) return "warm";
  if (streak <= 13) return "fire";
  if (streak <= 29) return "blaze";
  return "inferno";
}

export const STREAK_TIER_CONFIG: Record<
  StreakTier,
  { color: string; scale: number; label: string }
> = {
  none: { color: "#9ca3af", scale: 0, label: "No streak" },
  spark: { color: "#fef3c7", scale: 0.8, label: "Getting started" },
  warm: { color: "#fbbf24", scale: 1.0, label: "Warming up" },
  fire: { color: "#f97316", scale: 1.2, label: "On fire!" },
  blaze: { color: "#dc2626", scale: 1.4, label: "Blazing!" },
  inferno: { color: "#7c2d12", scale: 1.6, label: "Unstoppable!" },
};

export const STREAK_MILESTONES = [7, 14, 30, 60, 100];
