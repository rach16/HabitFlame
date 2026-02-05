"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-earth-50">
      <div className="md:ml-20 lg:ml-56">
        <main className="max-w-lg mx-auto px-4 pt-6 pb-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-lg hover:bg-earth-100 text-earth-500"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-earth-800">New Habit</h1>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-earth-700">
                Habit name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Meditate for 10 min"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                className="bg-white border-earth-200 focus:border-forest-400 focus:ring-forest-400"
              />
              <p className="text-xs text-earth-400 text-right">
                {name.length}/50
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-earth-700">Category</Label>
              <CategoryPicker selected={category} onSelect={setCategory} />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label className="text-earth-700">Color</Label>
              <ColorPicker selected={color} onSelect={setColor} />
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label className="text-earth-700">Frequency</Label>
              <div className="flex gap-2">
                {(["daily", "weekly"] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                      frequency === freq
                        ? "border-forest-500 bg-forest-50 text-forest-700"
                        : "border-earth-200 bg-white text-earth-500 hover:border-earth-300"
                    }`}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-forest-500 hover:bg-forest-600 text-white rounded-xl h-12 text-base"
            >
              Create Habit
            </Button>
          </motion.form>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
