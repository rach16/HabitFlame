"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit3,
  Archive,
  Trash2,
  Trophy,
  Target,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useHabitStore } from "@/hooks/useHabitStore";
import { HabitWithStats, HabitCategory } from "@/lib/types";
import { PRESET_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FlameIcon from "@/components/FlameIcon";
import StreakBadge from "@/components/StreakBadge";
import CalendarView from "@/components/CalendarView";
import CategoryPicker from "@/components/CategoryPicker";
import ColorPicker from "@/components/ColorPicker";
import ConfirmDialog from "@/components/ConfirmDialog";
import BottomNav from "@/components/BottomNav";

export default function HabitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const {
    getHabitStats,
    getCompletionsForHabit,
    editHabit,
    deleteHabit,
    archiveHabit,
    isLoaded,
  } = useHabitStore();

  const id = params.id as string;
  const [habit, setHabit] = useState<HabitWithStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState<HabitCategory | null>(null);
  const [editColor, setEditColor] = useState(PRESET_COLORS[0]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const stats = getHabitStats(id);
      if (stats) {
        setHabit(stats);
        setEditName(stats.name);
        setEditCategory(stats.category);
        setEditColor(stats.color);
      }
    }
  }, [id, isLoaded, getHabitStats]);

  const handleSaveEdit = () => {
    if (!editName.trim() || !editCategory) return;
    editHabit(id, {
      name: editName.trim(),
      category: editCategory,
      color: editColor,
    });
    setHabit(getHabitStats(id));
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteHabit(id);
    router.push("/");
  };

  const handleArchive = () => {
    archiveHabit(id);
    router.push("/");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">🔥</div>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="min-h-screen bg-earth-50">
        <div className="md:ml-20 lg:ml-56">
          <main className="max-w-2xl mx-auto px-4 pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-earth-500 hover:text-earth-700 mb-4"
            >
              <ArrowLeft size={18} />
              Back
            </Link>
            <p className="text-earth-400">Habit not found.</p>
          </main>
        </div>
        <BottomNav />
      </div>
    );
  }

  const completions = getCompletionsForHabit(id);

  return (
    <div className="min-h-screen bg-earth-50">
      <div className="md:ml-20 lg:ml-56">
        <main className="max-w-2xl mx-auto px-4 pt-6 pb-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-lg hover:bg-earth-100 text-earth-500"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xl">{habit.category.emoji}</span>
              <h1 className="text-xl font-bold text-earth-800 truncate">
                {habit.name}
              </h1>
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: habit.color }}
              />
            </div>
          </div>

          {/* Streak hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border border-earth-100 p-6 mb-4 text-center"
          >
            <div className="flex justify-center mb-3">
              <FlameIcon streak={habit.currentStreak} size={48} />
            </div>
            <div className="text-3xl font-bold text-earth-800 mb-1">
              {habit.currentStreak} day streak
            </div>
            <StreakBadge streak={habit.currentStreak} size="lg" showLabel />
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-earth-100 p-4 text-center">
              <Trophy size={18} className="mx-auto mb-1 text-flame-500" />
              <div className="text-lg font-bold text-earth-800">
                {habit.bestStreak}
              </div>
              <div className="text-[10px] text-earth-400">Best streak</div>
            </div>
            <div className="bg-white rounded-xl border border-earth-100 p-4 text-center">
              <Target size={18} className="mx-auto mb-1 text-forest-500" />
              <div className="text-lg font-bold text-earth-800">
                {habit.completionRate}%
              </div>
              <div className="text-[10px] text-earth-400">30-day rate</div>
            </div>
            <div className="bg-white rounded-xl border border-earth-100 p-4 text-center">
              <Calendar size={18} className="mx-auto mb-1 text-earth-500" />
              <div className="text-lg font-bold text-earth-800">
                {habit.totalCompletions}
              </div>
              <div className="text-[10px] text-earth-400">Total days</div>
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-earth-700 mb-3">
              Completion History
            </h2>
            <CalendarView completions={completions} habitColor={habit.color} />
          </div>

          {/* Edit section */}
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-white rounded-xl border border-earth-100 p-4 mb-4 space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-earth-700">Habit name</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={50}
                  className="bg-white border-earth-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-earth-700">Category</Label>
                <CategoryPicker
                  selected={editCategory}
                  onSelect={setEditCategory}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-earth-700">Color</Label>
                <ColorPicker selected={editColor} onSelect={setEditColor} />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-forest-500 hover:bg-forest-600 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="w-full justify-start gap-2 border-earth-200 text-earth-600"
              >
                <Edit3 size={16} />
                Edit Habit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowArchiveDialog(true)}
                className="w-full justify-start gap-2 border-earth-200 text-earth-400"
              >
                <Archive size={16} />
                Archive Habit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full justify-start gap-2 border-red-200 text-red-500 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Delete Habit
              </Button>
            </div>
          )}
        </main>
      </div>

      <BottomNav />

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete habit?"
        description="This will permanently delete this habit and all its completion history. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        destructive
      />

      <ConfirmDialog
        open={showArchiveDialog}
        onOpenChange={setShowArchiveDialog}
        title="Archive habit?"
        description="This habit will be hidden from your daily view. You can restore it later."
        confirmLabel="Archive"
        onConfirm={handleArchive}
      />
    </div>
  );
}
