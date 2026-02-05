"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="text-6xl mb-4">🌱</div>
      <h2 className="text-xl font-semibold text-earth-800 mb-2">
        Start your first habit
      </h2>
      <p className="text-earth-400 mb-6 max-w-xs">
        Build better routines one day at a time. Tap the button below to create
        your first habit.
      </p>
      <Button
        asChild
        className="bg-forest-500 hover:bg-forest-600 text-white rounded-full px-6"
      >
        <Link href="/add">
          <Plus size={18} className="mr-1" />
          Create Habit
        </Link>
      </Button>
    </motion.div>
  );
}
