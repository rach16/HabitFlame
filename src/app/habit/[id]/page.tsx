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
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-4xl"
        >
          🔥
        </motion.div>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="min-h-screen">
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
    <div className="min-h-screen">
      <div className="md:ml-20 lg:ml-56">
        {/* Hero header with habit color gradient */}
        <div
          className="text-white px-4 pt-6 pb-12 -mb-8 rounded-b-3xl shadow-lg relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${habit.color}ee 0%, ${habit.color}88 50%, ${habit.color}44 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-2xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/"
                className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-2xl">{habit.category.emoji}</span>
                <h1 className="text-xl font-bold truncate">{habit.name}</h1>
              </div>
            </div>

            {/* Streak hero inline */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <FlameIcon streak={habit.currentStreak} size={52} />
              <div>
                <div className="text-4xl font-bold">
                  {habit.currentStreak}
                </div>
                <div className="text-sm text-white/70">day streak</div>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-2xl mx-auto px-4 pt-4 pb-4">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Trophy, color: "text-flame-500", bg: "from-orange-50 to-flame-100/30", label: "Best streak", value: habit.bestStreak },
              { icon: Target, color: "text-forest-500", bg: "from-forest-50 to-forest-100/30", label: "30-day rate", value: `${habit.completionRate}%` },
              { icon: Calendar, color: "text-earth-500", bg: "from-earth-50 to-earth-100/30", label: "Total days", value: habit.totalCompletions },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br ${stat.bg} rounded-2xl border border-white/60 p-4 text-center shadow-md shadow-earth-200/20`}
              >
                <stat.icon size={18} className={`mx-auto mb-1.5 ${stat.color}`} />
                <div className="text-xl font-bold text-earth-800">
                  {stat.value}
                </div>
                <div className="text-[10px] font-medium text-earth-400 mt-0.5">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Calendar */}
          <div className="mb-6">
            <h2 className="text-xs font-bold text-earth-400 uppercase tracking-wider mb-3">
              Completion History
            </h2>
            <CalendarView completions={completions} habitColor={habit.color} />
          </div>

          {/* Actions */}
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-earth-100 p-5 mb-4 space-y-4 shadow-md"
            >
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-earth-700">Habit name</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={50}
                  className="bg-white border-earth-200 h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-earth-700">Category</Label>
                <CategoryPicker
                  selected={editCategory}
                  onSelect={setEditCategory}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-earth-700">Color</Label>
                <ColorPicker selected={editColor} onSelect={setEditColor} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 rounded-xl h-11"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1 gradient-forest text-white rounded-xl h-11 shadow-md shadow-forest-600/20"
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="w-full justify-start gap-2 rounded-xl h-12 border-earth-100 bg-white/80 text-earth-600 hover:bg-white shadow-sm"
              >
                <Edit3 size={16} />
                Edit Habit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowArchiveDialog(true)}
                className="w-full justify-start gap-2 rounded-xl h-12 border-earth-100 bg-white/80 text-earth-400 hover:bg-white shadow-sm"
              >
                <Archive size={16} />
                Archive Habit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full justify-start gap-2 rounded-xl h-12 border-red-100 bg-red-50/50 text-red-500 hover:bg-red-50 shadow-sm"
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
