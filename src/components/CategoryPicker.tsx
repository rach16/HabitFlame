"use client";

import { motion } from "framer-motion";
import { HabitCategory } from "@/lib/types";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

interface CategoryPickerProps {
  selected: HabitCategory | null;
  onSelect: (category: HabitCategory) => void;
}

export default function CategoryPicker({
  selected,
  onSelect,
}: CategoryPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {DEFAULT_CATEGORIES.map((cat) => {
        const isSelected = selected?.id === cat.id;
        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(cat)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm border transition-all ${
              isSelected
                ? "border-forest-500 bg-forest-50 text-forest-700 font-medium"
                : "border-earth-200 bg-white text-earth-600 hover:border-earth-300"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
