"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

export function ViewToggle() {
  const { compactView, setCompactView } = useTheme();

  return (
    <Button
      onClick={() => setCompactView(!compactView)}
      className="flex items-center gap-2 bg-black backdrop-blur-md border border-zinc-700/50 rounded-lg px-3 py-2 focus:bg-black hover:bg-black"
    >
      {compactView ? (
        <>
          <LayoutGrid className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Grid</span>
        </>
      ) : (
        <>
          <List className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Compact</span>
        </>
      )}
    </Button>
  );
}
