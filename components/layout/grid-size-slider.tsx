"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";

export function GridSizeSlider() {
  const { gridSize, setGridSize } = useTheme();
  const [localGridSize, setLocalGridSize] = useState(gridSize);

  // Update local state when context changes
  useEffect(() => {
    setLocalGridSize(gridSize);
  }, [gridSize]);

  // Debounce the actual update to context
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localGridSize !== gridSize) {
        setGridSize(localGridSize);
      }
    }, 5);

    return () => clearTimeout(timer);
  }, [localGridSize, gridSize, setGridSize]);

  return (
    <Button className="flex items-center gap-2 bg-black backdrop-blur-md border border-zinc-700/50 rounded-lg px-3 py-2 focus:bg-black hover:bg-black">
      <span className="text-sm">Size</span>
      <input
        type="range"
        min="15"
        max="30"
        value={localGridSize}
        onChange={(e) => setLocalGridSize(Number(e.target.value))}
        className="w-16 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
      />
    </Button>
  );
}
