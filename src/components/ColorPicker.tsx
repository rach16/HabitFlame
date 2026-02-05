"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PRESET_COLORS } from "@/lib/constants";

interface ColorPickerProps {
  selected: string;
  onSelect: (color: string) => void;
}

export default function ColorPicker({ selected, onSelect }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {PRESET_COLORS.map((color) => {
        const isSelected = selected === color;
        return (
          <motion.button
            key={color}
            whileTap={{ scale: 0.85 }}
            onClick={() => onSelect(color)}
            className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
            style={{
              backgroundColor: color,
              borderColor: isSelected ? "#1e4a1e" : "transparent",
            }}
          >
            {isSelected && <Check size={16} className="text-white" strokeWidth={3} />}
          </motion.button>
        );
      })}
    </div>
  );
}
