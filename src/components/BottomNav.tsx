"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, BarChart3, PlusCircle } from "lucide-react";

const navItems = [
  { href: "/", label: "Today", icon: Home },
  { href: "/add", label: "Add", icon: PlusCircle },
  { href: "/stats", label: "Stats", icon: BarChart3 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-20 md:hidden" />

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-earth-100 pb-safe md:hidden">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors ${
                  isActive ? "text-forest-500" : "text-earth-400"
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 lg:w-56 bg-white border-r border-earth-100 flex-col items-center lg:items-start py-6 px-3 lg:px-5 z-50">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="text-2xl">🔥</span>
          <span className="hidden lg:block text-lg font-bold text-earth-800">
            HabitFlame
          </span>
        </Link>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl mb-1 transition-colors ${
                isActive
                  ? "bg-forest-50 text-forest-600 font-medium"
                  : "text-earth-400 hover:text-earth-600 hover:bg-earth-50"
              }`}
            >
              <Icon size={20} />
              <span className="hidden lg:block text-sm">{item.label}</span>
            </Link>
          );
        })}
      </aside>
    </>
  );
}
