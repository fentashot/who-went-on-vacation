"use client";

import { type ThemeConfig } from "@/contexts/theme-context";

interface ThemeBackgroundProps {
  mounted: boolean;
  themeConfig: ThemeConfig;
  gridSize?: number;
}

export function ThemeBackground({
  mounted,
  themeConfig,
  gridSize,
}: ThemeBackgroundProps) {
  return (
    <div
      className="fixed inset-0 bg-black pointer-events-none"
      style={
        {
          "--theme-gradient-from": themeConfig.gradient.from,
          "--theme-gradient-via": themeConfig.gradient.via,
          "--theme-gradient-to": themeConfig.gradient.to,
          "--theme-grid-color": themeConfig.gridColor,
        } as React.CSSProperties
      }
    >
      <div
        className={`absolute inset-0 hidden md:block background-grid-large transition-opacity duration-800 ${mounted ? "opacity-100" : "opacity-0"
          }`}
        style={
          gridSize
            ? { backgroundSize: `${gridSize}px ${gridSize}px` }
            : undefined
        }
        suppressHydrationWarning
      />
      <div
        className={`absolute inset-0 background-grid transition-opacity duration-800 ${mounted ? "opacity-100" : "opacity-0"
          }`}
        style={
          gridSize
            ? { backgroundSize: `${gridSize}px ${gridSize}px` }
            : undefined
        }
        suppressHydrationWarning
      />
      <div
        className={`absolute inset-0  background-gradient-large hidden md:block transition-opacity duration-800 ${mounted ? "opacity-100" : "opacity-0"
          }`}
        suppressHydrationWarning
      />
      <div
        className={`absolute inset-0 md:hidden background-gradient transition-opacity duration-800 ${mounted ? "opacity-100" : "opacity-0"
          }`}
        suppressHydrationWarning
      />
    </div>
  );
}
