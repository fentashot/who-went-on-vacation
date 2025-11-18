"use client";

import { Button } from "@/components/ui/button";
import { type ThemeConfig } from "@/contexts/theme-context";

interface SortButtonProps {
  order: "newest" | "oldest";
  icon: React.ComponentType<{ className?: string }>;
  label?: string;
  currentSortOrder: "newest" | "oldest";
  onSort: (order: "newest" | "oldest") => void;
  themeConfig: ThemeConfig;
}

export function SortButton({
  order,
  icon: Icon,
  label,
  currentSortOrder,
  onSort,
  themeConfig,
}: SortButtonProps) {
  const isActive = currentSortOrder === order;

  return (
    <Button
      onClick={() => onSort(order)}
      variant="outline"
      className={`h-full cursor-pointer rounded-lg transition-all duration-500 ${
        isActive
          ? "text-white hover:text-gray-200 border-2"
          : "bg-zinc-900/30 border-zinc-700/50 text-white hover:text-gray-200 hover:bg-zinc-800/40 border-2"
      }`}
      style={
        isActive
          ? {
              backgroundColor: themeConfig.accent,
              borderColor: themeConfig.border,
            }
          : undefined
      }
      onMouseEnter={(e) =>
        isActive &&
        (e.currentTarget.style.backgroundColor = themeConfig.accentHover)
      }
      onMouseLeave={(e) =>
        isActive && (e.currentTarget.style.backgroundColor = themeConfig.accent)
      }
    >
      <Icon className="min-w-5 min-h-5" />
      {label}
    </Button>
  );
}
