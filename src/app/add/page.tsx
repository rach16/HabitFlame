"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useHabitStore } from "@/hooks/useHabitStore";
import { HabitCategory } from "@/lib/types";
import { PRESET_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CategoryPicker from "@/components/CategoryPicker";
import ColorPicker from "@/components/ColorPicker";
import BottomNav from "@/components/BottomNav";

export default function AddHabitPage() {
  const router = useRouter();
  const { addHabit } = useHabitStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<HabitCategory | null>(null);
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a habit name");
      return;
    }
    if (name.trim().length > 50) {
      setError("Habit name must be 50 characters or less");
      return;
    }
    if (!category) {
      setError("Please select a category");
      return;
    }

    addHabit({
      name: name.trim(),
      category,
      color,
      frequency,
    });

    router.push("/");
  };

  return (
    <div className="min-h-screen">
      <div className="md:ml-20 lg:ml-56">
        {/* Header band */}
        <div className="gradient-header text-white px-4 pt-6 pb-8 -mb-4 rounded-b-3xl shadow-lg shadow-forest-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="max-w-lg mx-auto flex items-center gap-3 relative z-10">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-300" />
              <h1 className="text-xl font-bold">New Habit</h1>
            </div>
          </div>
        </div>

        <main className="max-w-lg mx-auto px-4 pt-6 pb-4">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-earth-700">
                Habit name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Meditate for 10 min"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                className="bg-white/90 backdrop-blur-sm border-earth-200 focus:border-forest-400 focus:ring-forest-400 h-12 rounded-xl shadow-sm"
              />
              <p className="text-xs text-earth-300 text-right">
                {name.length}/50
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-earth-700">Category</Label>
              <CategoryPicker selected={category} onSelect={setCategory} />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-earth-700">Color</Label>
              <ColorPicker selected={color} onSelect={setColor} />
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-earth-700">Frequency</Label>
              <div className="flex gap-3">
                {(["daily", "weekly"] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                      frequency === freq
                        ? "border-forest-500 bg-forest-50 text-forest-700 shadow-sm shadow-forest-200/30"
                        : "border-earth-100 bg-white/80 text-earth-400 hover:border-earth-200"
                    }`}
                  >
                    {freq === "daily" ? "📅 Daily" : "📆 Weekly"}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full gradient-forest text-white rounded-xl h-13 text-base font-semibold shadow-lg shadow-forest-600/30 hover:shadow-xl hover:shadow-forest-600/40 transition-shadow"
            >
              <Sparkles size={18} className="mr-2" />
              Create Habit
            </Button>
          </motion.form>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
