"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Animated illustration */}
      <div className="relative mb-6">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-7xl"
        >
          🌱
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-forest-300/20 rounded-full blur-sm"
        />
      </div>

      <h2 className="text-2xl font-bold text-earth-800 mb-2">
        Start your first habit
      </h2>
      <p className="text-earth-400 mb-8 max-w-xs leading-relaxed">
        Build better routines one day at a time. Watch your streak flame grow
        as you stay consistent.
      </p>

      <Button
        asChild
        size="lg"
        className="gradient-forest text-white rounded-full px-8 h-12 shadow-lg shadow-forest-600/30 hover:shadow-xl hover:shadow-forest-600/40 transition-shadow text-base"
      >
        <Link href="/add">
          <Plus size={20} className="mr-2" />
          Create Your First Habit
        </Link>
      </Button>

      {/* Decorative hint */}
      <div className="mt-10 flex items-center gap-2 text-earth-300">
        <Flame size={14} />
        <span className="text-xs">
          Stay consistent to grow your flame streak
        </span>
        <Flame size={14} />
      </div>
    </motion.div>
  );
}
